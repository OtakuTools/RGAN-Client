import hljs from 'highlight.js'

class AstNode {
  attrs: any
  block: any
  children: any
  content: any
  hidden: any
  info: any
  level: any
  map: any
  markup: any
  meta: any
  nesting: any
  tag: any
  type: any
}

export class MarkdownRender {

  crypto: any = null

  mdRender: any = null
  echartRender: any = null
  mermaidRender: any = null
  flowchartRender: any = null
  mathjaxRender:any = null

  cacheHTML : any = null
  cacheLifeTime : any = null

  sandboxProxies : any = null
  sandbox: any = {}

  echartList : any = []
  flowchartList : any = []
  historySignArray : Array<string> = []

  constructor (crypto, mdRender, echartRender, mermaidRender, flowchartRender, mathjaxRender) {
    this.crypto = crypto
    this.mdRender = mdRender
    this.echartRender = echartRender
    this.mermaidRender = mermaidRender
    this.flowchartRender = flowchartRender
    this.mathjaxRender = mathjaxRender

    this.cacheHTML = new Map()
    this.cacheLifeTime = new Map()
    this.sandboxProxies = new WeakMap()
    this.sandbox = {
      window: {},
      Object,
      JSON,
      Math,
      console,
      document,
      option: {}
    }
  }

  render (code, DomId) : void {
    // console.time('renderStart')
    this.echartList = []
    this.flowchartList = []
    let ast : Array<AstNode> = this.parse(code)
    let astBlockArray : Array<any> = []

    let nesting : number = 0
    let blocks : Array<AstNode> = []

    // ast分块
    for (let i = 0; i < ast.length; i++) {
      let astNode : AstNode = ast[i]
      nesting += astNode.nesting
      if (nesting > 0) {
        blocks.push(astNode)
      } else {
        blocks.push(astNode)
        astBlockArray.push(blocks)
        blocks = []
      }
    }

    // ast分块生成签名
    let signArray : Array<string> = []
    let codeArray : Array<string> = []
    for (let i = 0; i < astBlockArray.length; i++) {
      let block = astBlockArray[i]
      let codeStr : string = ''
      for (let node of block) {
        if (/open/.test(node.type)) {
          codeStr += `<${node.tag}>`
        } else if (/close/.test(node.type)) {
          codeStr += `</${node.tag}>`
        } else if (/inline/.test(node.type)) {
          codeStr += this.mdRender.render(`${node.content}`).replace(/<\/?p>/g, '')
        } else if (/fence/.test(node.type)) {
          codeStr += `<${node.tag} class="language-${node.info}">${node.content}</${node.tag}>`
        }
      }
      signArray.push(this.crypto.MD5(codeStr).toString())
      codeArray.push(codeStr)
    }

    let oriChangeNodes : Array<number> = []
    let modifyNode : boolean = false
    let newChangeNodes : Array<number> = []
    let newLen = signArray.length
    let hisLen = this.historySignArray.length

    if (hisLen === 0) {
      oriChangeNodes = [0, -1]
      newChangeNodes = newLen === 0? [0, 0] : [0, newLen - 1]
    } else if (newLen === 0) {
      oriChangeNodes = hisLen === 0? [0, 0] : [0, hisLen - 1]
      newChangeNodes = [0, -1]
    } else if (newLen !== hisLen) {
      // 渲染块数量不一致，说明新建或移除了段落
      let newFrontPtr : number = 0
      let hisFrontPtr : number = 0

      while (newFrontPtr < newLen && hisFrontPtr < hisLen && signArray[newFrontPtr] === this.historySignArray[hisFrontPtr]) {
        newFrontPtr++
        hisFrontPtr++
      }

      let newArr = signArray.filter((item, index) => (index >= newFrontPtr))
      let hisArr = this.historySignArray.filter((item, index) => (index >= hisFrontPtr))

      let newBackPtr : number = newArr.length - 1
      let hisBackPtr : number = hisArr.length - 1

      while (newBackPtr > 0 && hisBackPtr > 0 && newArr[newBackPtr] === hisArr[hisBackPtr]) {
        newBackPtr--
        hisBackPtr--
      }

      // console.log(newBackPtr, hisBackPtr)
      
      newBackPtr += newFrontPtr
      hisBackPtr += hisFrontPtr

      oriChangeNodes = [hisFrontPtr, hisBackPtr]
      newChangeNodes = [newFrontPtr, newBackPtr]
    } else {
      // 渲染块数量一致，说明段落内容出现变化
      modifyNode = true
      for (let i = 0; i < newLen; i++) {
        if (signArray[i] !== this.historySignArray[i]) {
          oriChangeNodes = [i, i]
          newChangeNodes = [i, i]
          break
        }
      }
    }

    // console.log('====== render ======')
    // console.log(oriChangeNodes)
    // console.log(newChangeNodes)

    this.historySignArray = signArray

    if (!(oriChangeNodes.length > 0 && newChangeNodes.length > 0)) {
      return
    }

    let changePos = oriChangeNodes[0]
    let changeNum = newChangeNodes[1] - oriChangeNodes[1]

    let blockDom = document.querySelectorAll('.preview_block')
    let container = document.getElementById(DomId)
    let frag = document.createDocumentFragment()
    for (let idx = 0; idx <= changeNum && (idx + changePos) < codeArray.length; idx ++) {
      let b = document.createElement('div')
      b.className = 'preview_block'
      b.innerHTML = codeArray[idx + changePos]
      this._render(b)
      frag.appendChild(b)
    }
    if (blockDom.length === 0 || changePos >= blockDom.length) {
      container.appendChild(frag)
    } else {
      if (changeNum < 0) {
        for (let i = 0; i < -changeNum; i++) {
          container.removeChild(blockDom[changePos + i])
        }
        blockDom = document.querySelectorAll('.preview_block')
        container.insertBefore(frag, blockDom[newChangeNodes[1]])
      } else {
        container.replaceChild(frag, blockDom[changePos])
      }
    }

    this.updateCharts()
  }

  _render(node) {
    let cnode = node.children[0]
    let renderCode = cnode.textContent
    try {
      if (cnode.className === 'language-mermaid') {
        var f = function(svgCode) {
          cnode.innerHTML = svgCode
        }
        this.mermaidRender.render(`mermaid_${new Date().getTime()}`, renderCode, f)
      } else if (cnode.className === 'language-echarts') {
        let chart : any = this.echartRender.init(cnode)
        let option : any = {}
        option = this.compileCode(renderCode)(this.sandbox)
        chart.setOption(option, true, true)
        this.echartList.push({ node: chart, size: option.size || { width: 500, height: 300 }})
      } else if (cnode.className === 'language-flowchart') {
        let chart : any = this.flowchartRender.parse(renderCode)
        cnode.textContent = ''
        this.flowchartList.push({node: cnode, chart})
      } else if (/^language-.*/.test(cnode.className)) {
        hljs.highlightBlock(cnode)
      } else {
        this.mathjaxRender.typeset([cnode])
      }
    } catch(err) {
      
    }
  }

  updateCharts() {
    this.echartList.forEach(item => {
      item.node.resize(item.size)
    });
    this.flowchartList.forEach(item => {
      item.chart.drawSVG(item.node)
    });
  }

  parse (code) : Array<AstNode> {
    return this.mdRender.parse(code)
  }

  compileCode (src : string) {
    src = 'with (sandbox) { ' + src + '}'
    const code = new Function('sandbox', src)
    
    function has (target, key) {  
      return true
    }
    
    function get (target, key) {  
      if (key === Symbol.unscopables) return undefined
      return target[key]
    }

    return (sandbox) => {
      if (!this.sandboxProxies.has(sandbox)) {
        const sandboxProxy = new Proxy(sandbox, { has, get })
        this.sandboxProxies.set(sandbox, sandboxProxy)
      }
      let sbp : any = this.sandboxProxies.get(sandbox)
      code(sbp)
      return sbp.option
    }
  }

}