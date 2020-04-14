<template>
  <div ref="display" v-html="blogMdText" v-highlight></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import * as MarkdownIt from 'markdown-it'
/ tslint:disable /

@Component
export default class MarkdownViewer extends Vue {
  @Prop({ default: '', type: String }) inputText!: string;

  blogMdText : string = ''

  MdEditor : any = null

  // MarkdownIt = window.markdownit()

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.inputText)
  }

  mounted () {
    // this.MdEditor = new MarkdownIt.default()
    this.MdEditor = require('markdown-it')()
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
p > code {
  color: #bd4147 !important;
}
</style>
<style src="./../assets/editor-styles/highlight/styles/atom-one-light.css"></style>
<!-- <style src="@/assets/editor-styles/style-vue/vue.css" scoped></style> -->
