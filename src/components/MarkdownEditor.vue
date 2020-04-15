<template>
  <v-container style="height: 100vh; max-width: 100vw; padding: 0 5px; overflow-x: hidden;">
    <v-row>
      <!-- 标题 -->
      <v-col cols="12">
        <v-app-bar
          flat
          color="white"
          dense
        >
          <!-- <v-toolbar-title>博客标题</v-toolbar-title> -->
          <v-text-field
            label="博客标题"
            outlined
            hide-details
            v-model="blogInfo.title"
            style="margin-right: 20px;"
            clearable
            dense
          ></v-text-field>
          <v-btn color="info" @click="submitFormVisible = true">发布博客</v-btn>
        </v-app-bar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" style="padding: 0">
        <v-toolbar
          flat
          dense
          color="rgb(238, 238, 238)"
        >
          <v-toolbar-items>
            <v-btn depressed tile icon @click="handleShortcut('bold')">
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('italic')">
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('title')">
              <v-icon>mdi-format-header-1</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('delete')">
              <v-icon>mdi-format-strikethrough</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('quote')">
              <v-icon>mdi-format-quote-close</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('codeblock')">
              <v-icon>mdi-code-tags</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('table')">
              <v-icon>mdi-table</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('link')">
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('image')">
              <v-icon>mdi-image-search-outline</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('save')">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('derive')">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn depressed tile icon>
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
            <v-btn depressed tile icon>
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row style="padding: 0; height: calc(100vh - 120px); overflow: hidden;">
      <v-col cols="6" style="padding: 0;">
        <v-card outlined style="height: calc(100vh - 120px);">
          <MonacoEditor
            ref="monacoEditor"
            style="height: 100%"
            @on-content-change="handleCodeChange"
            @on-content-scroll="handleCodeScroll"
          />
        </v-card>
      </v-col>
      <v-col cols="6" style="padding: 0">
        <MarkdownViewer 
          ref="markdownViewer"
          :inputText="blogInfo.content"
          style="height: 100%; max-height: calc(100vh - 120px); overflow-y: scroll;"
        ></MarkdownViewer>
      </v-col>
    </v-row>

    <v-dialog
      v-model="submitFormVisible"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">发布文章</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-combobox
                v-model="blogInfo.tags"
                :items="tagOptions"
                outlined
                dense
                small-chips
                label="博客标签"
                multiple
                hide-details
              >
              </v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-combobox
                v-model="blogInfo.type"
                :items="blogTypeOptions"
                label="文章类型"
                outlined
                dense
                hide-details
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="submitFormVisible = false"
          >
            取消
          </v-btn>
          <v-btn
            text
            @click="submitFormVisible = false"
          >
            保存为草稿
          </v-btn>
          <v-btn
            color="info"
            text
            @click="onSubmit"
          >
            提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { addBlog } from '@/api/data'

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
    type: ''
  }
  submitFormVisible : boolean = false
  tagOptions : any = [
    '前端',
    '后端',
    'Java',
    'C++',
    'Python'
  ]
  blogTypeOptions : any = [
    '原创',
    '转载',
    '翻译'
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
      this.submitFormVisible = false
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
