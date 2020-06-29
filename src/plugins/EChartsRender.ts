export class EChartsRender {
  echarts : any = null
  sandboxProxies : any = null
  constructor (echarts : any) {
    this.echarts = echarts
    this.sandboxProxies = new WeakMap()
  }

  init (className : string = '') {
    let echartList : any = document.querySelectorAll(className)
    if (echartList.length === 0) {
      return
    }
    for (let item of echartList) {
      try {
        let renderCode : string = item.textContent
        let chart : any = this.echarts.init(item)
        let option : any = {}
        let sandbox : any = {
          widow: {},
          Object,
          JSON,
          Math,
          console,
          document,
          option
        }
        option = this.compileCode(renderCode)(sandbox)
        chart.setOption(option)
        chart.resize(option.size || { width: 'auto', height: 300})
      } catch (err) {
        // do nothing
        console.log(err)
      }
    }
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