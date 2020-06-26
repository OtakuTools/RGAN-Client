<template>
  <div id="editorContainer" ref="container"></div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import * as monaco from 'monaco-editor'
import elementResizeDetectorMaker from 'element-resize-detector'

@Component
export default class MonacoEditor extends Vue {
  @Prop({ default: 'markdown', type: String }) language: string;
  @Prop({ default: '', type: String }) codeInput: string;

  monacoEditor : any = null
  code : string = this.codeInput
  monaco : any = null
  // 主要配置
  // 其他属性请查看 https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html
  editorOptions : any = {
    selectOnLineNumbers: true,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly: false, // 只读
    cursorStyle: 'line', // 光标样式
    automaticLayout: true, // 自动布局
    glyphMargin: false, // 字形边缘
    useTabStops: false,
    fontSize: 15, // 字体大小
    minimap: {
      enabled: false
    },
    cursorSmoothCaretAnimation: true,
    detectIndentation: true,
    tabSize: 2,
    wordWrap: 'on',
    dragAndDrop: true
  }

  erd : any = null

  mounted () {
    this.init()
  }

  init () {
    let container : any = this.$refs.container
    let opt : any = {
      value: this.code,
      language: this.language,
      // theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
      ...this.editorOptions // 同codes
    }

    this.monaco = window.monaco || null

    if (this.monaco) {
      this.monacoEditor = this.monaco.editor.create(container, opt)

      this.monacoEditor.onDidChangeModelContent((event : any) => {
        const value = this.monacoEditor.getValue()
        this.code = value
        // const count = this.monacoEditor.getModel().getLineCount() || 0
        // this.monacoEditor.revealLine(count, 0)
        this.$emit('on-content-change', this.code)
      })

      this.monacoEditor.onDidScrollChange((event :any) => {
        let container : any = this.$refs.container
        let originHeight : number = container.clientHeight
        this.$emit('on-content-scroll', event.scrollTop / (event.scrollHeight - originHeight))
      })

      this.erd = elementResizeDetectorMaker()
      if (this.erd) {
        this.erd.listenTo(document.getElementById('editorContainer'), () => {
          this.monacoEditor.layout()
        })
      }
    }
  }

  beforeDestroy () {
    this.monacoEditor && this.monacoEditor.dispose()
  }

  @Watch('codeInput')
  handleTextChange (newVal: string) {
    if (newVal !== this.code) {
      this.monacoEditor.setValue(newVal)
    }
  }
}
</script>
