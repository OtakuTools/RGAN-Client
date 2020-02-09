<template>
  <el-container>
    <el-header>
      <!-- 标题 -->
      <el-form :inline="true" ref="blogInfo" :model="blogInfo" label-width="80px">
        <el-form-item label="博客标题">
          <el-input v-model="blogInfo.title" placeholder="请输入标题..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <!-- <el-main>
        <mavon-editor style="height: 100%" v-model="blogInfo.content"/>
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
            <!-- <div ref="display" v-html="blogMdText" style="height: calc(100vh - 63px); max-height: calc(100vh - 63px); overflow-y: scroll; border-left: 1px solid #ccc; padding: 0 10px;" v-highlight></div> -->
            <MarkdownViewer ref="markdownViewer" :inputText="blogInfo.content" style="height: calc(100vh - 63px); max-height: calc(100vh - 63px); overflow-y: scroll; border-left: 1px solid #ccc; padding: 0 10px;"></MarkdownViewer>
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
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { addBlog } from '@/api/data'

@Component({
  components: {
    MonacoEditor,
    MarkdownViewer
  }
})
export default class MDEditor extends Vue {
  blogInfo = {
    title: '',
    content: '',
    tags: ["a", "b"]
  }

  MdEditor = null
  erd = null
  
  handleCodeChange(val: string) {
    this.blogInfo.content = val
  }

  handleCodeScroll(percentage: number) {
    let viewer = this.$refs.markdownViewer.$refs.display
    viewer.scrollTop = percentage * (viewer.scrollHeight - viewer.clientHeight)
  }

  onSubmit() {
    addBlog(this.blogInfo).then(res => {
      console.log(res)
    }).catch(error => {
      this.$message.error('提交博客失败')
    })
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

</style>
