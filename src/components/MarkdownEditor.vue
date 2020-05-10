<template>
  <v-container style="height: 100vh; max-width: 100vw; padding: 0 5px; overflow-x: hidden;">
    <v-row>
      <v-col cols="12">
        <v-app-bar
          flat
          color="white"
          dense
        >
          <v-btn depressed icon @click="$router.push('/')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
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
            <v-btn depressed tile icon @click="handleShortcut('underline')">
              <v-icon>mdi-format-underline</v-icon>
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
            <v-menu
              :close-on-content-click="true"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn depressed tile icon v-on="on">
                  <v-icon>mdi-image-search-outline</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="handleShortcut('image')">
                  <v-list-item-title>插入图片</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>上传图片</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleShortcut('image_from_clipboard')">
                  <v-list-item-title>上传截图</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn depressed tile icon @click="handleShortcut('save')">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="handleShortcut('derive')">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="() => { fullScreen = !fullScreen; if (viewMode) { viewMode = false }}">
              <v-icon v-if="fullScreen">mdi-fullscreen</v-icon>
              <v-icon v-else>mdi-fullscreen-exit</v-icon>
            </v-btn>
            <v-btn depressed tile icon @click="() => { viewMode = !viewMode; if (fullScreen) { fullScreen = false }}">
              <v-icon v-if="viewMode">mdi-eye-off-outline</v-icon>
              <v-icon v-else>mdi-eye-outline</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row style="padding: 0; height: calc(100vh - 120px); overflow: hidden;">
      <v-col v-if="!viewMode" :cols="fullScreen? 12 : 6" style="padding: 0;">
        <v-card outlined style="height: calc(100vh - 120px);">
          <MonacoEditor
            ref="monacoEditor"
            style="height: 100%"
            :codeInput="blogInfo.content"
            @on-content-change="handleCodeChange"
            @on-content-scroll="handleCodeScroll"
          />
        </v-card>
      </v-col>
      <v-col v-if="!fullScreen" :cols="viewMode? 12 : 6" style="padding: 0">
        <v-card outlined style="height: calc(100vh - 120px); padding-left: 10px">
          <MarkdownViewer 
            ref="markdownViewer"
            :inputText="blogInfo.content"
            style="height: 100%; max-height: calc(100vh - 120px); overflow-y: scroll;"
          ></MarkdownViewer>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="submitFormVisible"
      max-width="500"
      persistent
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
              <v-textarea
                v-model="blogInfo.summary"
                outlined
                dense
                rows="5"
                label="博客摘要"
                auto-grow
                hide-details
              >
              </v-textarea>
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

    <v-dialog
      v-model="submitSuccVisible"
      max-width="500"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>
          博客提交成功
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="$router.push('/userinfo')"
          >
            前去个人页面
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$router.push('/')"
          >
            返回首页
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="imageEditorVisible"
    >
      <v-card>
        <v-card-text>
          <ImageEditor @getImage="getImageFromImageEditor" @cancel="closeImageEditor" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { addBlog, modifyBlog, getBlogById } from '@/api/data'
import { BLOG_TYPE } from '@/libs/constant'

const MonacoEditor = () => import('./MonacoEditor.vue')
const MarkdownViewer = () => import('@/components/MarkdownViewer.vue')
const ImageEditor = () => import('./ImageEditor.vue')

@Component({
  components: {
    MonacoEditor,
    MarkdownViewer,
    ImageEditor
  }
})
export default class MDEditor extends Vue {
  blogInfo : any = {
    title: '',
    content: '',
    tags: [],
    type: '原创',
    summary: ''
  }
  submitFormVisible : boolean = false
  submitSuccVisible : boolean = false
  imageEditorVisible : boolean = false
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

  viewMode : boolean = false
  fullScreen : boolean = false

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

  valid () {
    let errMsg : Array<string> = []
    if (this.blogInfo.title === '') {
      errMsg.push('博客标题不能为空')
    }
    if(this.blogInfo.content === '') {
      errMsg.push('博客内容不能为空')
    }

    return errMsg.join('；')
  }

  onSubmit () {
    let errMsg = this.valid()
    if (errMsg !== '') {
      this.$emit('alertMsg', {
        message: errMsg,
        type: 'error'
      })
      return
    }
    let blog = {}
    Object.assign(blog, this.blogInfo, { type: BLOG_TYPE[this.blogInfo.type] })
    if (this.blogInfo.hasOwnProperty('id')) {
      modifyBlog(this.blogInfo.id, blog).then(res => {
        this.submitFormVisible = false
        // this.$emit('alertMsg', {
        //   message: '修改博客成功',
        //   type: 'success'
        // })
        this.submitSuccVisible = true
      }).catch(error => {
        this.$emit('alertMsg', {
          message: '修改博客失败',
          type: 'error'
        })
      })
    } else {
      addBlog(blog).then(res => {
        this.submitFormVisible = false
        // this.$emit('alertMsg', {
        //   message: '提交博客成功',
        //   type: 'success'
        // })
        this.submitSuccVisible = true
      }).catch(error => {
        this.$emit('alertMsg', {
          message: '提交博客失败',
          type: 'error'
        })
      })
    }
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

  getImageFromImageEditor(image) {
    this.insertContentWithoutSelection(`![图片](${image.image.src})\n`, '')
    this.imageEditorVisible = false
  }

  closeImageEditor() {
    this.imageEditorVisible = false
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
      case 'underline':
        this.insertContentWithSelection('__')
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
      case 'image_from_clipboard':
        this.imageEditorVisible = true
      case 'save':
      case 'derive':
      default:
        //
    }
  }

  created () {

  }

  mounted () {
    if (this.$route.query.hasOwnProperty("blog")) {
      let blogId : any = this.$route.query.blog
      getBlogById (parseInt(blogId)).then(res => {
        let data = res.data
        data.tags = data.tags.map(item => item.title)
        data.type = BLOG_TYPE[data.type]
        this.blogInfo = data
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
