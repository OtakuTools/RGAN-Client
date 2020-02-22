<template>
  <el-container style="padding: 10px 10px 0 10px;">
    <el-header style="padding: 0">
      <!-- 标题 -->
      <div>
        <span style="width: 100px; text-align: left">博客标题</span>
        <el-input placeholder="请输入标题" v-model="blogInfo.title" style="margin: 0 10px; width: calc(100% - 180px)"></el-input>
        <el-button type="primary" @click="submitFormVisible = true" style="width: 100px">发布博客</el-button>
      </div>
    </el-header>
    <el-container style="padding-bottom: 0px;">
      <el-main style="border: 1px solid #ccc; overflow: hidden; padding: 0;">
        <el-row>
          <el-col :span="12">
            <MonacoEditor
              ref="monacoEditor"
              style="height: calc(100vh - 73px);"
              @on-content-change="handleCodeChange"
              @on-content-scroll="handleCodeScroll"
            />
          </el-col>
          <el-col :span="12">
            <MarkdownViewer ref="markdownViewer" :inputText="blogInfo.content" style="height: calc(100vh - 73px); max-height: calc(100vh - 73px); overflow-y: scroll; border-left: 1px solid #ccc; padding: 0 10px;"></MarkdownViewer>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="发布文章" :visible.sync="submitFormVisible">
      <el-form v-model="blogInfo" label-width="100">
        <el-form-item label="文章标签">
          <el-select
            v-model="blogInfo.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签"
            style="width: calc(100% - 100px)">
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="blogInfo.type" placeholder="请选择文章类型" style="width: calc(100% - 100px)">
            <el-option label="原创" value="original"></el-option>
            <el-option label="转载" value="reprint"></el-option>
            <el-option label="翻译" value="translation"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="submitFormVisible = false">取 消</el-button>
        <el-button @click="submitFormVisible = false">保存为草稿</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </div>
    </el-dialog>
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
    tags: []
  }

  submitFormVisible = false
  tagOptions = [
    {
      value: 'FE',
      label: '前端'
    },
    {
      value: 'BE',
      label: '后端'
    },
    {
      value: 'Java',
      label: 'Java'
    },
    {
      value: 'C++',
      label: 'C++'
    },
    {
      value: 'Python',
      label: 'Python'
    },
    {
      value: 'Other',
      label: '其他'
    }
  ]

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
      this.$message.success("提交博客成功")
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
