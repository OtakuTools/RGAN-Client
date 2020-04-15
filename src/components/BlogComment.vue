<template>
  <div>
    <div>
      <v-textarea
        outlined
        dense
        auto-grow
        counter
        no-resize
        hide-details
        rows="2"
        label="请输入评论内容"
        v-model="commentContent">
      </v-textarea>
      <div style="margin-top: 10px;">
        <v-btn depressed @click="replyTo = -1" v-if="replyTo !== -1" style="margin-right:10px">取消回复</v-btn>
        <v-btn depressed @click="addComment(replyTo)" color="info">回复</v-btn>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <!-- <v-list flat>
        <v-list-group
          v-for="comment in commentTree"
          :key="comment.id"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-avatar>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="comment.authorName" style="margin-bottom: 5px;"></v-list-item-title>
              <v-list-item-subtitle class="text--primary" v-text="comment.content"></v-list-item-subtitle>
              <v-list-item-subtitle>
                {{comment.modifiedTime.replace("T", " ")}}
                <v-btn
                  x-small
                  text
                  :color="commentVote.hasOwnProperty(comment.id) && commentVote[comment.id]? 'red' : 'rgba(0,0,0,.6)'"
                  @click="voteComment(comment.id)"
                >
                  <v-icon small left>mdi-thumb-up</v-icon>
                  {{comment.voteCount}}
                </v-btn>
                <v-btn x-small text color="rgba(0,0,0,.6)" @click="replyTo = comment.id">
                  回复
                </v-btn>
                <v-btn x-small text color="rgba(0,0,0,.6)" v-if="comment.authorName === $store.state.user.name" @click="deleteComment(comment.id)">
                  删除
                </v-btn>
                <v-btn x-small text color="rgba(0,0,0,.6)">
                  查看更多
                </v-btn>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-text="comment.expand"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="subComment in comment.comments"
            :key="subComment.id"
          >
            <v-list-item-avatar>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="`${subComment.authorName} 回复 ${commentLevelTree[subComment.replyTo].authorName}`"></v-list-item-title>
              <v-list-item-subtitle class="text--primary" v-text="subComment.content"></v-list-item-subtitle>
              <v-list-item-subtitle>
                {{subComment.modifiedTime.replace("T", " ")}}
                <v-btn
                  x-small
                  text
                  :color="commentVote.hasOwnProperty(subComment.id) && commentVote[subComment.id]? 'red' : 'rgba(0,0,0,.6)'"
                  @click="voteComment(subComment.id)"
                >
                  <v-icon small left>mdi-thumb-up</v-icon>
                  {{subComment.voteCount}}
                </v-btn>
                <v-btn x-small text color="rgba(0,0,0,.6)" @click="replyTo = subComment.id">
                  回复
                </v-btn>
                <v-btn x-small text color="rgba(0,0,0,.6)" v-if="subComment.authorName === $store.state.user.name" @click="deleteComment(subComment.id)">
                  删除
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
        </v-list-group>
      </v-list> -->
      <v-list flat>
        <v-list-item
          v-for="comment in commentTree"
          :key="comment.id"
          no-action
        >
          <v-list-item-icon>
            <!-- <v-icon>mdi-account-circle</v-icon> -->
            <v-avatar size="38" v-on="on">
              <img
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                alt="user"
              >
            </v-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="comment.authorName" style="margin-bottom: 5px;"></v-list-item-title>
            <v-list-item-subtitle class="text--primary" v-text="comment.content"></v-list-item-subtitle>
            <v-list-item-subtitle>
              {{comment.createdTime.replace("T", " ")}}
              <v-btn
                x-small
                text
                :color="commentVote.hasOwnProperty(comment.id) && commentVote[comment.id]? 'red' : 'rgba(0,0,0,.6)'"
                @click="voteComment(comment.id)"
              >
                <v-icon small left>mdi-thumb-up</v-icon>
                {{comment.voteCount}}
              </v-btn>
              <v-btn x-small text color="rgba(0,0,0,.6)" @click="replyTo = comment.id">
                回复
              </v-btn>
              <v-btn x-small text color="rgba(0,0,0,.6)" v-if="comment.authorName === $store.state.user.name" @click="deleteComment(comment.id)">
                删除
              </v-btn>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-list>
                <v-list-item
                  v-for="subComment in comment.comments"
                  :key="subComment.id"
                >
                  <v-list-item-icon>
                    <!-- <v-icon>mdi-account-circle</v-icon> -->
                    <v-avatar size="32" v-on="on">
                      <img
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        alt="user"
                      >
                    </v-avatar>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="`${subComment.authorName} 回复 ${commentLevelTree[subComment.replyTo].authorName}`"></v-list-item-title>
                    <v-list-item-subtitle class="text--primary" v-text="subComment.content"></v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{subComment.createdTime.replace("T", " ")}}
                      <v-btn
                        x-small
                        text
                        :color="commentVote.hasOwnProperty(subComment.id) && commentVote[subComment.id]? 'red' : 'rgba(0,0,0,.6)'"
                        @click="voteComment(subComment.id)"
                      >
                        <v-icon small left>mdi-thumb-up</v-icon>
                        {{subComment.voteCount}}
                      </v-btn>
                      <v-btn x-small text color="rgba(0,0,0,.6)" @click="replyTo = subComment.id">
                        回复
                      </v-btn>
                      <v-btn x-small text color="rgba(0,0,0,.6)" v-if="subComment.authorName === $store.state.user.name" @click="deleteComment(subComment.id)">
                        删除
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-divider></v-divider>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
import { getCommentStatus, voteComment } from '@/api/vote'
/ tslint:disable /

class Comment {
  id : number
  content : string
  authorName : string
  replyTo : number
  createdTime : string
  modifiedTime: string
  voteCount : number
}

@Component
export default class BlogComment extends Vue {
  @Prop({ default: '', type: Number }) blogId!: number;

  commentLevelTree : any = {}

  commentTree : Array<any> = []

  commentContent: string = ""

  commentVote: any = {}

  replyTo : number = -1

  UP_VOTE : number = 1
  CANCEL_VOTE : number = 0

  mounted () {
    this.getComments()
  }

  getComments () {
    getBlogComments(this.blogId).then(res => {
      let data = res.data.content
      let commentIds = []
      this.commentVote = {}
      data.forEach(item => {
        commentIds.push(item.id)
      })
      getCommentStatus(commentIds).then(res => {
        res.data.forEach(item => {
          this.commentVote[item.entityId] = item.status
        })
        this.commentTree = this.buildCommentTree(data)
      }).catch(err => [
        console.error(err)
      ])
    }).catch(err => {
      this.$message({
        message: err,
        type: 'error'
      })
    })
  }

  voteComment (commentId : number) {
    if (this.commentVote[commentId] === this.UP_VOTE) {
      voteComment(commentId, this.CANCEL_VOTE).then(res => {
        this.getComments()
      }).catch(err => {
        console.error(err)
      })
    } else {
      voteComment(commentId, this.UP_VOTE).then(res => {
        this.getComments()
      }).catch(err => {
        console.error(err)
      })
    }
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
  handleBlogIdChange (newVal: number) {
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
