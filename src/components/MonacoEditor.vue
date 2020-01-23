<template>
  <div id="test" ref="container"></div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import * as monaco from 'monaco-editor'
import elementResizeDetectorMaker from 'element-resize-detector'

@Component
export default class MonacoEditor extends Vue {
  @Prop({ default: 'markdown', type: String }) language!: String;
  @Prop({ default: '', type: String }) codeInput!: String;
  
  monacoEditor = null
  code = this.codeInput
  // 主要配置
  editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    scrollBeyondLastLine: true,
    readOnly: false, // 只读
    cursorStyle: 'line', // 光标样式
    automaticLayout: true, // 自动布局
    glyphMargin: true, // 字形边缘
    useTabStops: false,
    fontSize: 28, // 字体大小
    autoIndent: true // 自动布局
  }

  erd = null

  mounted () {
    this.monacoEditor = monaco.editor.create(this.$refs.container, {
      value: this.code,
      language: this.language,
      // theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
      editorOptions: this.editorOptions // 同codes
    });

    if (this.monacoEditor) {
      this.monacoEditor.onDidChangeModelContent(event => {
        const value = this.monacoEditor.getValue()
        this.code = value
        const count = this.monacoEditor.getModel().getLineCount() || 0;
        this.monacoEditor.revealLine(count, 0);
        this.$emit('on-content-change', this.code)
      })

      this.monacoEditor.onDidScrollChange(event => {
        let originHeight = this.$refs.container.clientHeight
        this.$emit('on-content-scroll', event.scrollTop / ( event.scrollHeight - originHeight))
      })
    }

    this.erd = elementResizeDetectorMaker()
    if (this.erd) {
      this.erd.listenTo(document.getElementById("test"), () => {
        this.monacoEditor.layout()
      })
    }
  }

  destroy() {
    this.monacoEditor.dispose()
  }
}
</script>