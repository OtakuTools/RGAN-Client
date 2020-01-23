<template>
  <el-container>
    <el-header>
      <!-- 标题 -->
      <el-form :inline="true" ref="blogInfo" :model="blogInfo" label-width="80px">
        <el-form-item label="博客标题">
          <el-input v-model="blogInfo.blogTitle" placeholder="请输入标题..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <!-- <el-main>
        <mavon-editor style="height: 100%" v-model="blogInfo.blogContent"/>
      </el-main> -->
      <el-main style="border: 1px solid #ccc; overflow: hidden; padding: 0;">
        <el-row>
          <el-col :span="12">
            <MonacoEditor
              ref="monacoEditor"
              style="height: calc(100vh - 63px);"
              @on-content-change="handleCodeChange"
              @on-content-scroll="handleCodeScroll"
            />
          </el-col>
          <el-col :span="12">
            <div ref="display" v-html="blogMdText" style="height: calc(100vh - 63px); max-height: calc(100vh - 63px); overflow-y: scroll; border-left: 1px solid #ccc; padding: 0 10px;" v-highlight></div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import * as MD from 'markdown-it'
import * as monaco from 'monaco-editor'
import MonacoEditor from './MonacoEditor.vue'
import mavonEditor from 'mavon-editor'
import { test } from '@/api/data'

@Component({
  components: {
    MonacoEditor
  }
})
export default class MDEditor extends Vue {
  blogInfo = {
    blogTitle: '',
    blogContent: ''
  }

  blogMdText = ''

  MdEditor = null
  erd = null

  onResize = false

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.blogInfo.blogContent)
  }
  
  handleCodeChange(val: string) {
    this.blogInfo.blogContent = val
    this.MdTranslationFunc()
  }

  handleCodeScroll(percentage: number) {
    this.$refs.display.scrollTop = percentage * (this.$refs.display.scrollHeight - this.$refs.display.clientHeight)
  }

  onSubmit() {
    // test().then(res => {
    //   console.log(res)
    // }).catch(error => {
    //   console.error(error)
    // })
    this.insertContent("# hello world")
  }

  insertContent (text: string) {
    if (this.$refs.monacoEditor.monacoEditor) {
      let selection = this.$refs.monacoEditor.monacoEditor.getSelection()
      let range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn)
      let id = { major: 1, minor: 1 }
      let op = { identifier: id, range: range, text: text, forceMoveMarkers: true}
      this.$refs.monacoEditor.monacoEditor.executeEdits('', [op])
      this.$refs.monacoEditor.monacoEditor.focus()
    }
  }

  mounted () {
    this.MdEditor = new MD()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('./../editor-styles/style-vue/vue.css');
@import url('./../editor-styles/highlight/styles/github.css');
</style>
