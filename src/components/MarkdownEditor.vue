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
      <el-header style="border: 1px solid #ccc; overflow: hidden; padding: 0; height: 40px">
        <el-button-group>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('bold')">加粗</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('italic')">斜体</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('title')">标题</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('delete')">删除线</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('quote')">引用</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('codeblock')">代码块</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('table')">表格</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('link')">超链接</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('image')">图片</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('save')">保存</el-button>
          <el-button type="plain" icon="el-icon-edit" @click="handleShortcut('derive')">导出</el-button>
          <el-button type="plain" icon="el-icon-full-screen">全屏</el-button>
          <el-button type="plain" icon="el-icon-view">预览</el-button>
        </el-button-group>
      </el-header>
      <el-main style="border: 1px solid #ccc; overflow: hidden; padding: 0;">
        <el-row>
          <el-col :span="12">
            <MonacoEditor
              ref="monacoEditor"
              style="height: calc(100vh - 113px);"
              @on-content-change="handleCodeChange"
              @on-content-scroll="handleCodeScroll"
            />
          </el-col>
          <el-col :span="12">
            <MarkdownViewer ref="markdownViewer" :inputText="blogInfo.content" style="height: calc(100vh - 113px); max-height: calc(100vh - 113px); overflow-y: scroll; border-left: 1px solid #ccc; padding: 0 10px;"></MarkdownViewer>
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
import { addBlog } from '@/api/data'
// import * as monaco from 'monaco-editor'

const MonacoEditor = () => import('./MonacoEditor.vue')
const MarkdownViewer = () => import('@/components/MarkdownViewer.vue')

@Component({
  components: {
    MonacoEditor,
    MarkdownViewer
  }
})
export default class MDEditor extends Vue {
  blogInfo : any = {
    title: '',
    content: '',
    tags: [],
    type: 'original'
  }

  submitFormVisible : boolean = false
  tagOptions : any = [
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

  erd : any = null
  loading: any = null

  handleCodeChange (val: string) {
    this.blogInfo.content = val
  }

  handleCodeScroll (percentage: number) {
    let mdViewer : any = this.$refs.markdownViewer
    if (mdViewer) {
      let viewer : any = mdViewer.$refs.display
      viewer.scrollTop = percentage * (viewer.scrollHeight - viewer.clientHeight)
    }
  }

  onSubmit () {
    addBlog(this.blogInfo).then(res => {
      this.$message.success('提交博客成功')
    }).catch(error => {
      this.$message.error('提交博客失败')
    })
  }

  insertContentWithoutSelection (text: string, selectionPart? : string) {
    let editor : any = this.$refs.monacoEditor
    if (!editor) {
      return
    }
    let moEd : any = editor.monacoEditor
    if (!moEd) {
      return
    }
    let selection : any = moEd.getSelection()
    let startCol : number = selection.startColumn
    let startLine : number = selection.startLineNumber
    let endCol : number = selection.endColumn
    let endLine : number = selection.endLineNumber
    // 全部插入
    let range : any = new window.monaco.Range(startLine, startCol, endLine, endCol)
    let id : any = { major: 1, minor: 1 }
    let op : any = { identifier: id, range: range, text: text, forceMoveMarkers: true }
    // 调整选中部分
    let idx = text.indexOf(selectionPart || text[0])
    let len = selectionPart ? selectionPart.length : text.length
    selection = selection.setEndPosition(startLine, startCol + idx + len)
    selection = selection.setStartPosition(startLine, startCol + idx)
    moEd.executeEdits('', [op], [selection])
    moEd.focus()
  }

  insertContentWithSelection (textFront: string, textBack?: string) {
    let editor : any = this.$refs.monacoEditor
    let moEd : any = editor.monacoEditor
    if (!moEd) {
      return
    }
    let selection : any = moEd.getSelection()
    let startCol : number = selection.startColumn
    let startLine : number = selection.startLineNumber
    let endCol : number = selection.endColumn
    let endLine : number = selection.endLineNumber
    // 尾部插入
    let range : any = new window.monaco.Range(endLine, endCol + 1, endLine, endCol + 1)
    let id : any = { major: 1, minor: 1 }
    let op1 : any = { identifier: id, range: range, text: textFront, forceMoveMarkers: false }
    // 头部插入
    range = new window.monaco.Range(startLine, startCol === 0 ? 0 : startCol - 1, startLine, startCol - 1)
    id = { major: 1, minor: 1 }
    let op2 = { identifier: id, range: range, text: textBack || textFront, forceMoveMarkers: false }
    // 调整选中部分
    selection = selection.setEndPosition(endLine, endCol + (startLine === endLine ? textFront.length : 0))
    selection = selection.setStartPosition(startLine, startCol + textFront.length)
    moEd.executeEdits('', [op1, op2], [selection])
    moEd.focus()
  }

  handleShortcut (mode: string) {
    switch (mode) {
      case 'bold':
        this.insertContentWithSelection('**')
        break
      case 'italic':
        this.insertContentWithSelection('*')
        break
      case 'title':
        this.insertContentWithoutSelection('# 请插入标题', '请插入标题')
        break
      case 'delete':
        this.insertContentWithSelection('~~')
        break
      case 'quote':
        this.insertContentWithoutSelection('`输入引用内容`', '输入引用内容')
        break
      case 'codeblock':
        this.insertContentWithoutSelection('```code\n\n```', 'code')
        break
      case 'table':
        this.insertContentWithoutSelection(`|  |  |\n|--|--|\n|  |  |`, '  ')
        break
      case 'link':
        this.insertContentWithoutSelection(`[链接内容](  )`, '链接内容')
        break
      case 'image':
        this.insertContentWithoutSelection(`![图片](图片URL)`, '图片URL')
        break
      case 'save':
      case 'derive':
      default:
        //
    }
  }

  created () {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  mounted () {
    this.loading.close()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
