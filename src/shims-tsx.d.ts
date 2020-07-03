import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface Window {
    monaco: any,
    Vuetify: any,
    L2Dwidget: any,
    jQuery : any,
    qiniu: any,
    showdown: any,
    Cropper: any,
    mermaid: any,
    // MathJax: any,
    flowchart: any,
    CryptoJS: any,
    katex: any
  }
}
