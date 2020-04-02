<template>
  <div>
    <div>
      <el-input
        type="textarea"
        :rows="2"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入评论内容"
        v-model="commentContent">
      </el-input>
      <div style="margin-top: 10px;">
        <el-button @click="replyTo = -1" type="default" v-if="replyTo !== -1">取消回复</el-button>
        <el-button @click="addComment(replyTo)" type="primary">回复</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <ul style="padding: 0">
        <li v-for="comment in commentTree" v-bind:key="comment.id">
          <div style="margin-left: 2.2rem">
            <span style="font-weight: bold; font-size: 18px;">{{comment.authorName}}</span>
            <span style="margin-left: 10px; font-size: 16px;">{{comment.modifiedTime}}</span>
            <span style="float: right">
              <el-button-group>
                <el-button type="text" style="margin-right: 10px;" @click="deleteComment(comment.id)">删除</el-button>
                <el-button type="text" @click="replyTo = comment.id">回复</el-button>
              </el-button-group>
            </span>
          </div>
          <div style="margin-left: 2.2rem">
            <p style="font-size: 15px;">{{comment.content}}</p>
          </div>
          <ul>
            <li v-for="subComment in comment.comments" v-bind:key="subComment.id">
              <div style="margin-left: 2.2rem">
                <span style="font-weight: bold; font-size: 18px;">{{subComment.authorName}}</span>
                <span style="font-size: 16px; margin: 0 10px;">回复</span>
                <span style="font-weight: bold; font-size: 18px;">{{commentLevelTree[subComment.replyTo].authorName}}</span>
                <span style="margin-left: 10px; font-size: 16px;">{{subComment.modifiedTime}}</span>
                <span style="float: right">
                  <el-button-group>
                    <el-button type="text" style="margin-right: 10px;" @click="deleteComment(subComment.id)">删除</el-button>
                    <el-button type="text" @click="replyTo = subComment.id">回复</el-button>
                  </el-button-group>
                </span>
              </div>
              <div style="margin-left: 2.2rem">
                <p style="font-size: 15px;">{{subComment.content}}</p>
              </div>
            </li>
          </ul>
          <el-divider />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  getBlogComments,
  addBlogComment,
  editBlogComment,
  deleteBlogComment
} from '@/api/data'
/ tslint:disable /

class Comment {
  id : number
  content : string
  authorName : string
  replyTo : number
  createdTime : string
  modifiedTime: string
}

@Component
export default class BlogComment extends Vue {
  @Prop({ default: '', type: Number }) blogId!: number;

  commentLevelTree : any = {}

  commentTree : Array<any> = []

  commentContent: string = ""

  replyTo : number = -1

  mounted () {
    this.getComments()
  }

  getComments () {
    getBlogComments(this.blogId).then(res => {
      this.commentTree = this.buildCommentTree(res.data.content)
    }).catch(err => {
      this.$message({
        message: err,
        type: 'error'
      })
    })
  }

  addComment (commentId: number = -1) {
    let data = {}
    data['content'] = this.commentContent
    if (commentId !== -1) {
      data['replyTo'] = commentId
    }
    addBlogComment(
      this.blogId,
      data
    ).then(res => {
      this.replyTo = -1
      this.commentContent = ""
      this.getComments()
    }).catch(err => {
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    })
  }

  editComment (commentId: number) {
    editBlogComment(
      commentId,
      {
        content: this.commentContent
      }
    ).then(res => {
      this.getComments()
    }).catch(err => {
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    })
  }

  deleteComment (commentId: number) {
    deleteBlogComment(
      commentId
    ).then(res => {
      this.getComments()
    }).catch(err => {
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    })
  }

  buildCommentTree (commentList: Array<Comment>) {
    let tree : Object = {}
    let commentTree : any = []
    this.commentLevelTree = {}
    for (let comment of commentList) {
      this.commentLevelTree[comment.id] = comment
    }
    for (let comment of commentList) {
      if (comment.replyTo === null) {
        if (!tree.hasOwnProperty(comment.id)) {
          tree[comment.id] = {
            comments: []
          }
        }
        Object.assign(tree[comment.id], comment)
      } else {
        let root = comment.replyTo
        while (this.commentLevelTree[root].replyTo) {
          root = this.commentLevelTree[root].replyTo
        }
        if (!tree.hasOwnProperty(root)) {
          tree[root] = {
            comments: []
          }
        }
        tree[root].comments.push(comment)
      }
    }
    for (let [key, value] of Object.entries(tree)) {
      value.comments.sort((comment1, comment2) => {
        return comment1.id - comment2.id
      })
      commentTree.push(value)
    }
    commentTree.sort((comment1, comment2) => {
      return comment1.id - comment2.id
    })
    return commentTree
  }

  @Watch('blogId')
  handleTextChange (newVal: number) {
    this.getComments()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style-type: none;
  background: url("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png") no-repeat 0rem -0.2rem;
  background-size: 2rem 2rem;
}
</style>
