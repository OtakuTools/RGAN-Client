export class FlowChartRender {
  flowchart: any = null
  constructor (flowchart : any) {
    this.flowchart = flowchart
  }

  init (className : string = '') {
    let flowchartList : any = document.querySelectorAll(className)
    if (flowchartList.length === 0) {
      return
    }
    for (let i = 0; i < flowchartList.length; i++) {
      try {
        let item : any = flowchartList[i]
        let renderCode : string = item.textContent
        if (renderCode === '') {
          return
        }
        let chart : any = this.flowchart.parse(renderCode)
        item.className = 'flowchart'
        item.id = `flowchart-${i}`
        item.innerHTML = ''
        chart.drawSVG(`flowchart-${i}`)
      } catch (err) {
        // do nothing
      }
    }
  }
}