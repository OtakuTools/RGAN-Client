<template>
  <div id="display" ref="display"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import { EChartsRender } from '@/plugins/EChartsRender'
// import { FlowChartRender } from '@/plugins/FlowChartRender'
import { MarkdownRender } from '@/plugins/MarkdownRender'
// import * as MarkdownIt from 'markdown-it'

@Component
export default class MarkdownViewer extends Vue {
  @Prop({ default: '', type: String }) inputText: string;

  blogMdText : string = ''

  MdEditor : any = null

  echarts : any = null
  // echartRender : EChartsRender = null
  // flowchartRender : FlowChartRender = null

  mdRender : MarkdownRender = null

  MdTranslationFunc () {
    let t = this.inputText
    try {
      this.mdRender.render(t, 'display')
    } catch(err) {
      console.log(err)
    }
    // this.blogMdText = this.MdEditor.makeHtml(this.inputText)
  }

  initPlugIn () {
    let mermaidConfig = {
      theme: 'default',
      logLevel: 'fatal',
      securityLevel: 'loose',
      startOnLoad: true,
      arrowMarkerAbsolute: false,

      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear'
      },

      // sequence: {
      //   diagramMarginX: 50,
      //   diagramMarginY: 10,
      //   actorMargin: 50,
      //   width: 150,
      //   height: 65,
      //   boxMargin: 10,
      //   boxTextMargin: 5,
      //   noteMargin: 10,
      //   messageMargin: 35,
      //   messageAlign: 'center',
      //   mirrorActors: true,
      //   bottomMarginAdj: 1,
      //   useMaxWidth: true,
      //   rightAngles: false,
      //   showSequenceNumbers: false,
      // },

      // gantt: {
      //   titleTopMargin: 25,
      //   barHeight: 20,
      //   barGap: 4,
      //   topPadding: 50,
      //   leftPadding: 75,
      //   gridLineStartPadding: 35,
      //   fontSize: 11,
      //   fontFamily: '"Open-Sans", "sans-serif"',
      //   numberSectionStyles: 4,
      //   axisFormat: '%Y-%m-%d',
      // } 
    }

    this.MdEditor = require('markdown-it')({
      html: false,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true
    })
    this.echarts = require('echarts')
    // this.echartRender = new EChartsRender(this.echarts)
    // this.flowchartRender = new FlowChartRender(window.flowchart)
    window.mermaid.initialize(mermaidConfig)
    this.mdRender = new MarkdownRender(
      this.MdEditor, 
      this.echarts,
      window.mermaid,
      window.flowchart,
      window.katex
    )
    // this.MdEditor = new window.showdown.Converter(this.edirotConfig)
  }

  mounted () {
    this.initPlugIn()
    this.MdTranslationFunc()
  }

  @Watch('inputText')
  handleTextChange (newVal: string) {
    this.MdTranslationFunc()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.v-application code:after, .v-application code:before {
  content: "" !important;
}
.v-application code {
  box-shadow: none !important;
  color: unset;
}

.preview_block > code {
  width: 100%;
}

.language-mermaid {
  background-color: unset !important;
  overflow-x: auto;
  text-align: center;
}

.language-mermaid::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.language-mermaid::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}

.language-mermaid::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10;
  background: rgba(0,0,0,0.1);
}

.language-echarts {
  background-color: unset !important;
}

.language-flowchart {
  background-color: unset !important;
  font-weight: unset !important;
  text-align: center !important;
}

ul > li.checkbox-list {
  list-style: none;
  margin-left: -20px;
}

code[class*="language"] {
  font-family: 'Consolas', 'Courier New', Courier, monospace !important;
}

p > code,
h1 > code,
h2 > code,
h3 > code,
h4 > code,
h6 > code {
  color: #bd4147 !important;
  margin: 0 2px;
  padding: 0 3px;
}

table {
  border-collapse: collapse;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
}

td, th {
  border: 1px solid #dfe2e5;
  padding: .6em 1em;
}

th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  text-align: -internal-center;
}

#display {
  text-size-adjust: none;
  font-size: 15px;
  color: #333;
}

#display p,
#display h1,
#display h2,
#display h3,
#display h4,
#display h5 {
  line-height: 2;
}

.katex { 
  font-size: 1.5em; 
}
</style>
<style src="./../assets/editor-styles/highlight/styles/atom-one-light.css"></style>

