<template>
  <div ref="display" v-html="blogMdText" v-highlight></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import * as MarkdownIt from 'markdown-it'
/ tslint:disable /

@Component
export default class MarkdownViewer extends Vue {
  @Prop({ default: '', type: String }) inputText!: string;

  blogMdText : string = ''

  MdEditor : any = null

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.inputText)
  }

  mounted () {
    this.MdEditor = new MarkdownIt.default()
    this.MdTranslationFunc()
  }

  @Watch('inputText')
  handleTextChange (newVal: string) {
    this.MdTranslationFunc()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('./../editor-styles/style-vue/vue.css');
@import url('./../editor-styles/highlight/styles/github.css');
</style>
