import hljs from 'highlight.js'
import { math_plugin } from '@/plugins/Plugin_Math'
import { mark_plugin } from '@/plugins/Plugin_Mark'
import { sub_plugin } from '@/plugins/Plugin_Sub'
import { sup_plugin } from '@/plugins/Plugin_Sup'
import { ins_plugin } from '@/plugins/Plugin_Ins'


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

  mdRender: any = null
  echartRender: any = null
  mermaidRender: any = null
  flowchartRender: any = null
  katexRender: any = null

  sandboxProxies : any = null
  sandbox: any = {}

  echartList : any = []
  flowchartList : any = []
  historySignArray : Array<string> = []

  CONTAINER_CLASS_NAME : string = 'preview_block'

  constructor (mdRender, echartRender, mermaidRender, flowchartRender, katexRender) {
    this.mdRender = mdRender
    this.echartRender = echartRender
    this.mermaidRender = mermaidRender
    this.flowchartRender = flowchartRender
    this.katexRender = katexRender

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

    this.mdRender.use(math_plugin, {
      inlineOpen: '$',
      inlineClose: '$',
      blockOpen: '$$',
      blockClose: '$$'
    }).use(
      mark_plugin
    ).use(
      sub_plugin
    ).use(
      sup_plugin
    ).use(
      ins_plugin
    )
  }

  render (code, DomId) : void {
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

    // console.log(astBlockArray)

    // ast分块生成签名
    let signArray : Array<string> = []
    let codeArray : Array<string> = []
    for (let i = 0; i < astBlockArray.length; i++) {
      let block = astBlockArray[i]
      let codeStrArr : Array<string> = []
      let codeStr : string = ''
      let parentTags : Array<Object> = []
      for (let node of block) {
        if (/open/.test(node.type)) {
          parentTags.unshift({ tag: node.tag, pos: codeStrArr.length })
          codeStrArr.push(`<${node.tag}>`)
        } else if (/close/.test(node.type)) {
          codeStrArr.push(`</${node.tag}>`)
          parentTags.shift()
        } else if (/inline/.test(node.type)) {
          if (node.children && node.children.length) {
            let c : any = this._renderInlineNode(node.children, parentTags)
            let uTag : any = c.updateTag
            if (uTag.hasOwnProperty('pos')) {
              codeStrArr[uTag.pos] = codeStrArr[uTag.pos].replace(/^\<(.*)\>$/, `\<$1 class="${uTag.cls}"\>`)
            }
            codeStrArr.push(c.text)
          } else {
            codeStrArr.push(node.content)
          }
        } else if (/fence/.test(node.type)) {
          codeStrArr.push(`<${node.tag} class="language-${node.info}">${node.content}</${node.tag}>`)
        } else if (/hr/.test(node.type)) {
          codeStrArr.push('<hr/>')
        } else if (/math_block/.test(node.type)) {
          codeStrArr.push(`${this.katexRender.renderToString(node.content, { displayMode: true })}`)
        }
      }
      codeStr = codeStrArr.join('')
      signArray.push(codeStr)
      codeArray.push(codeStr)
    }

    let oriChangeNodes : Array<number> = []
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

      newBackPtr += newFrontPtr
      hisBackPtr += hisFrontPtr

      oriChangeNodes = [hisFrontPtr, hisBackPtr]
      newChangeNodes = [newFrontPtr, newBackPtr]
    } else {
      // 渲染块数量一致，说明段落内容出现变化
      for (let i = 0; i < newLen; i++) {
        if (signArray[i] !== this.historySignArray[i]) {
          oriChangeNodes = [i, i]
          newChangeNodes = [i, i]
          break
        }
      }
    }

    if (!(oriChangeNodes.length > 0 && newChangeNodes.length > 0)) {
      return
    }

    let changePos = oriChangeNodes[0]
    let changeNum = newChangeNodes[1] - oriChangeNodes[1]

    let blockDom = document.querySelectorAll(`.${this.CONTAINER_CLASS_NAME}`)
    let container = document.getElementById(DomId)
    let frag = document.createDocumentFragment()

    for (let idx = 0; idx <= changeNum && (idx + changePos) < codeArray.length; idx ++) {
      let b = document.createElement('div')
      b.className = this.CONTAINER_CLASS_NAME
      b.innerHTML = codeArray[idx + changePos]
      this._renderNode(b)
      frag.appendChild(b)
    }
    if (blockDom.length === 0 || changePos >= blockDom.length) {
      container.appendChild(frag)
    } else {
      if (changeNum < 0) {
        for (let i = 0; i < -changeNum; i++) {
          container.removeChild(blockDom[changePos + i])
        }
        blockDom = document.querySelectorAll(`.${this.CONTAINER_CLASS_NAME}`)
        if (newChangeNodes[1] >= 0 && newChangeNodes[0] >= 0) {
          for (let i = newChangeNodes[0]; i <= newChangeNodes[1]; i++) {
            if (signArray[i] !== this.historySignArray[i]) {
              blockDom[i].innerHTML = codeArray[i]
              this._renderNode(blockDom[i])
            }
          }
        } else {
          container.insertBefore(frag, blockDom[newChangeNodes[1]])
        }
      } else {
        container.replaceChild(frag, blockDom[changePos])
      }
    }
    this.updateCharts()
    this.historySignArray = signArray
  }

  _renderInlineNode (nodes, parents) {
    let listTagPos : number = parents.findIndex((parent) => parent.tag === 'li')

    let renderArr : Array<string> = []

    let blocks : Array<any> = []
    let dfsArr : Array<any> = []

    for (let node of nodes) {
      dfsArr.push(node)
    }

    while(dfsArr.length) {
      let q = dfsArr.shift()
      if (q.children && q.children.length) {
        for (let node of q.children) {
          dfsArr.unshift(node)
        }
      }
      blocks.push(q)
    }

    let newTagInfo : any = {}
    for (let i = 0; i < blocks.length; ) {
      let block : any = blocks[i]
      if (block.type === 'image') {
        renderArr.push(`<${block.tag} src="${block.attrs[0][1]}" alt="${blocks[i+1].content}" />`)
        i += 2
        continue
      } else if (block.type === 'text') {
        if (i === 0) {
          let t : string = block.content.replace(
            listTagPos !== -1? /^\[(x|\s)\](?=\s)/ig : '', 
            ($1, $2) => {
              if (listTagPos !== -1) {
                newTagInfo = { ...parents[listTagPos], cls: 'md-checkbox-list' }
                return `<input type="checkbox" ${$2.indexOf('x') !== -1 || $2.indexOf('X') !== -1? 'checked' : ''}></input>`
              } else {
                return ''
              }
            })
          renderArr.push(t)
        } else {
          renderArr.push(block.content)
        }
      } else if (block.type === 'softbreak') {
        renderArr.push(`<${block.tag} />`)
      } else if (block.type === 'link_open') {
        renderArr.push(`<${block.tag} class="md-link" href="${block.attrs[0][1]}">`)
      } else if (/open/.test(block.type)) {
        renderArr.push(`<${block.tag}>`)
      } else if (/close/.test(block.type)) {
        renderArr.push(`</${block.tag}>`)
      } else if (/math/.test(block.type)) {
        renderArr.push(this.katexRender.renderToString(block.content, { displayMode: false }))
      } else if (/code/.test(block.type)) {
        renderArr.push(`<${block.tag}>${block.content}</${block.tag}>`)
      }
      i++
    }

    return {
      text: renderArr.join(''),
      updateTag: newTagInfo
    }
  }

  // _renderInlineContent (text, parents) {
  //   let listTagPos : number = parents.findIndex((parent) => parent.tag === 'li')
  //   let newTagInfo : Object = {}
  //   let buildText : string = text.replace(
  //     /\$\$([\s\S]+?)\$\$/g, ($1, $2) => this.katexRender.renderToString($2, { displayMode: true }) // 段落数学公式
  //   ).replace(
  //     /\$([^\$]+?)\$/g, ($1, $2) => this.katexRender.renderToString($2, { displayMode: false }) // 行内数学公式
  //   ).replace(
  //     /\!\[([^\]]*?)\]\(([^\)]*?)\)/g, ($1, $2, $3) => `<img src="${$3}" alt="${$2}"></img>` // 图片
  //   ).replace(
  //     listTagPos !== -1? /^\[(x|\s)\](?=\s)/ig : '', ($1, $2) => {
  //       if ( listTagPos !== -1) { 
  //         newTagInfo = { ...parents[listTagPos], cls: 'checkbox-list' }
  //         return `<input type="checkbox" ${$2.indexOf('x') !== -1 || $2.indexOf('X') !== -1? 'checked' : ''}></input>`
  //       } else { 
  //         return '' 
  //       } 
  //     } // checkbox
  //   ).replace(
  //     /\[([^\]]*?)\]\(([\s\S]*?)\)/g, ($1, $2, $3) => `<a href="${$3}" style="text-decoration:none">${$2}</a>` // 链接
  //   ).replace(
  //     /\*\*(.+?)\*\*/g, ($1, $2) => `<strong>${$2}</strong>` // 粗体
  //   ).replace(
  //     /\*([^\*]+?)\*/g, ($1, $2) => `<i>${$2}</i>` // 斜体
  //   ).replace(
  //     /\_\_(.+?)\_\_/g, ($1, $2) => `<u>${$2}</u>` // 下划线
  //   ).replace(
  //     /\~\~(.+?)\~\~/g, ($1, $2) => `<s>${$2}</s>` // 删除线
  //   ).replace(
  //     /\~([^\~]+?)\~/g, ($1, $2) => `<sub>${$2}</sub>` // 下标
  //   ).replace(
  //     /\^(.+?)\^/g, ($1, $2) => `<sup>${$2}</sup>` // 上标
  //   ).replace(
  //     /\`(.*?)\`/g, ($1, $2) => `<code>${$2}</code>` // 引用
  //   )
  //   return {
  //     text: buildText,
  //     updateTag: newTagInfo
  //   }
  // }

  _renderNode(node) {
    let cnode = node.children[0]
    let renderCode = cnode.textContent
    try {
      if (cnode.className === `language-mermaid`) {
        var f = function(svgCode) {
          cnode.innerHTML = svgCode
        }
        this.mermaidRender.render(`mermaid_${new Date().getTime()}`, renderCode, f)
      } else if (cnode.className === 'language-echarts') {
        let chart : any = this.echartRender.init(cnode)
        let option : any = {}
        option = this.compileCode(renderCode)(this.sandbox)
        chart.setOption(option)
        this.echartList.push({ node: chart, size: option.size || { width: 500, height: 300 }})
      } else if (cnode.className === 'language-flowchart') {
        let chart : any = this.flowchartRender.parse(renderCode)
        cnode.textContent = ''
        this.flowchartList.push({node: cnode, chart})
      } else if (/^language\-.*/.test(cnode.className)) {
        hljs.highlightBlock(cnode)
      }
    } catch(err) {
      
    }
  }

  updateCharts() {
    this.echartList.forEach(item => {
      item.node.resize(item.size)
    })
    this.flowchartList.forEach(item => {
      item.chart.drawSVG(item.node)
    })
  }

  parse (code) : Array<AstNode> {
    return this.mdRender.parse(code, {})
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