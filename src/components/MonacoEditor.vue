<template>
  <div class="monaco-container">
    <div ref="container" class="monaco-editor"></div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.monaco {
  &-container {
    position: relative;
    height: 100%;
    width: 100%;
  }
  &-editor {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import * as monaco from 'monaco-editor'

@Component
export default class MonacoEditor extends Vue {
  @Prop({ default: 'markdown', type: String }) language!: String;
  @Prop({ default: '', type: String }) codeInput!: String;

  data() {
    return {
      code: this.codeInput,
      // 主要配置
      editorOptions: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false, // 只读
        cursorStyle: 'line', // 光标样式
        automaticLayout: true, // 自动布局
        glyphMargin: true, // 字形边缘
        useTabStops: false,
        fontSize: 28, // 字体大小
        autoIndent: true // 自动布局
      },
      monacoEditor: null
    }
  }

  mounted () {
    this.monacoEditor = monaco.editor.create(this.$refs.container, {
      value: this.code,
      language: this.language,
      // theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
      editorOptions: this.editorOptions // 同codes
    });

    this.monacoEditor.onDidChangeModelContent(event => {
        const value = this.monacoEditor.getValue()
        if (this.codeInput !== value) {
          this.code = value
          this.$emit('on-content-change', this.code)
        }
      })
  }
}
</script>