<template>
  <div id="display" ref="display" v-html="blogMdText" v-highlight></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { EChartsRender } from '@/plugins/EChartsRender'
// import * as MarkdownIt from 'markdown-it'

@Component
export default class MarkdownViewer extends Vue {
  @Prop({ default: '', type: String }) inputText!: string;

  blogMdText : string = ''

  MdEditor : any = null

  echarts : any = null
  echartRender : EChartsRender = null

  // edirotConfig : any = {
  //   // Omit the trailing newline in a code block
  //   omitExtraWLInCodeBlocks: false,
  //   // Disable the automatic generation of header ids
  //   noHeaderId: false,
  //   // Use text in curly braces as header id
  //   customizedHeaderId: false,
  //   // Generate header ids compatible with github style
  //   ghCompatibleHeaderId: false,
  //   // Setting this option to true will prevent showdown from modifying the prefix
  //   rawPrefixHeaderId: false,
  //   // Remove only spaces
  //   rawHeaderId: false,
  //   // Set the header starting level
  //   headerLevelStart: 1,
  //   // Enable support for setting image dimensions from within markdown syntax
  //   parseImgDimensions: false,
  //   // enable automatic linking to urls
  //   simplifiedAutoLink: true,
  //   // stop showdown from interpreting underscores in the middle of words
  //   literalMidWordUnderscores: true,
  //   // Enable support for strikethrough syntax
  //   strikethrough: true,
  //   // Enable support for tables syntax
  //   tables: true,
  //   // enabled adds an id property to table headers tags
  //   tablesHeaderId: true,
  //   // Enable support for GFM tasklists
  //   tasklists: true,
  //   // Prevents weird effects in live previews due to incomplete input
  //   smoothLivePreview: false,
  //   // Tries to smartly fix indentation problems related to es6 template strings in the midst of indented code
  //   smartIndentationFix: false,
  //   // Parses line breaks as /n
  //   simpleLineBreaks: true,
  //   // Makes adding a space between # and the header text mandatory
  //   requireSpaceBeforeHeadingText: false,
  //   // Enable support for underline
  //   underline: true
  // }

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.inputText)
    // this.blogMdText = this.MdEditor.makeHtml(this.inputText)
    this.$nextTick(() => {
      window.mermaid.init({ noteMargin: 10 }, '.language-mermaid')
      this.echartRender.init('.language-echarts')
      try {
        window.renderMathInElement(this.$refs.display, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
  
          preProcess: (code : string) => {
            return code.replace(/\\(?=(\s|\r|\n))/g, '\\\\')
          },

          strict: false
        })
      } catch(err) {
        //
      }
    })
  }

  mounted () {
    this.MdEditor = require('markdown-it')()
    this.echarts = require('echarts')
    // this.MdEditor = new window.showdown.Converter(this.edirotConfig)
    this.echartRender = new EChartsRender(this.echarts)
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

pre > code {
  width: 100%;
}

.language-mermaid {
  background-color: unset !important;
}

.language-echarts {
  background-color: unset !important;
}

p > code {
  color: #bd4147 !important;
  margin: 0 4px;
  padding: 0 2px;
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

#display > p,
#display > h1,
#display > h2,
#display > h3,
#display > h4,
#display > h5 {
  line-height: 2;
}
</style>
<style src="./../assets/editor-styles/highlight/styles/atom-one-light.css"></style>
