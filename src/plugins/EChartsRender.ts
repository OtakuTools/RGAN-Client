export class EChartsRender {
  echarts : any = null
  constructor (echarts : any) {
    this.echarts = echarts
  }

  init (className : string = '') {
    let echartList : any = document.querySelectorAll(className)
    for (let item of echartList) {
      try {
        let option : any = item.textContent
        let chart : any = this.echarts.init(item)
        eval(`option = ${option}`)
        chart.setOption(option)
        chart.resize(option.size || { width: 400, height: 300})
      } catch (err) {
        // do nothing
      }
    }
  }
}