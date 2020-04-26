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
      <v-list flat three-line>
        <v-list-item
          v-for="comment in commentTree"
          :key="comment.id"
        >
          <v-list-item-avatar size="36">
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt="user"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text--secondary" v-text="comment.authorName" style="font-size: 14px;"></v-list-item-title>
            <v-list-item-subtitle class="text--primary" v-text="comment.content" style="margin: 5px 0; font-size: 16px"></v-list-item-subtitle>
            <v-list-item-subtitle>
              <div style="font-size: 12px; vertical-align: baseline; display: inline; margin-right: 5px;">{{comment.createdTime.replace("T", " ")}}</div>
              <v-btn
                x-small
                text
                :key="forceRefresh"
                :color="commentVote.hasOwnProperty(comment.id) && commentVote[comment.id]? 'red' : 'rgba(0,0,0,.6)'"
                @click="voteComment(comment.id)"
              >
                <v-icon small left>mdi-thumb-up-outline</v-icon>
                <!-- {{comment.voteCount}} -->
                {{commentVoteCount[comment.id]}}
              </v-btn>
              <v-btn x-small text color="rgba(0,0,0,.6)" @click="replyTo = comment.id">
                回复
              </v-btn>
              <v-btn x-small text color="rgba(0,0,0,.6)" v-if="comment.authorName === $store.state.user.name" @click="deleteComment(comment.id)">
                删除
              </v-btn>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-list flat three-line>
                <v-list-item
                  v-for="subComment in comment.comments"
                  :key="subComment.id"
                >
                  <v-list-item-avatar size="26">
                    <img
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      alt="user"
                    >
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text--secondary" style="font-size: 14px;">
                      <span>{{subComment.authorName}}</span>
                      <span class="text--primary" v-if="commentLevelTree[subComment.replyTo].authorName !== comment.authorName">&nbsp;回复&nbsp;</span>
                      <span v-if="commentLevelTree[subComment.replyTo].authorName !== comment.authorName">{{commentLevelTree[subComment.replyTo].authorName}}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text--primary" v-text="subComment.content" style="margin: 5px 0; font-size: 16px"></v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <div style="font-size: 12px; vertical-align: baseline; display: inline; margin-right: 5px;">{{subComment.createdTime.replace("T", " ")}}</div>
                      <v-btn
                        x-small
                        text
                        :key="forceRefresh"
                        :color="commentVote.hasOwnProperty(subComment.id) && commentVote[subComment.id]? 'red' : 'rgba(0,0,0,.6)'"
                        @click="voteComment(subComment.id)"
                      >
                        <v-icon small left>mdi-thumb-up-outline</v-icon>
                        <!-- {{subComment.voteCount}} -->
                        {{commentVoteCount[subComment.id]}}
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
import { formatErrorMsg } from '@/libs/util'
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
  commentVoteCount: any = {}

  replyTo : number = -1

  UP_VOTE : number = 1
  CANCEL_VOTE : number = 0

  forceRefresh : number = 0

  mounted () {
    this.getComments()
  }

  getComments () {
    getBlogComments(this.blogId).then(res => {
      let data = res.data.content
      let commentIds = []
      this.commentVote = {}
      this.commentVoteCount = {}
      data.forEach(item => {
        commentIds.push(item.id)
        this.commentVoteCount[item.id] = item.voteCount
      })
      if (commentIds.length > 0) {
        this.commentTree = this.buildCommentTree(data)
        getCommentStatus(commentIds).then(res => {
          res.data.forEach(item => {
            this.commentVote[item.entityId] = item.status
          })
          this.forceRefresh = 1 * this.forceRefresh
        }).catch(err => [
          console.error(err)
        ])
      }
    }).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }

  voteComment (commentId : number) {
    if (this.commentVote[commentId] === this.UP_VOTE) {
      voteComment(commentId, this.CANCEL_VOTE).then(res => {
        // this.getComments()
        this.commentVote[commentId] -= this.UP_VOTE
        this.commentVoteCount[commentId] -= this.UP_VOTE
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.forceRefresh -= 1
      })
    } else {
      voteComment(commentId, this.UP_VOTE).then(res => {
        // this.getComments()
        this.commentVote[commentId] += this.UP_VOTE
        this.commentVoteCount[commentId] += this.UP_VOTE
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.forceRefresh += 1
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
      this.$emit('alertMsg', formatErrorMsg(err))
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
      this.$emit('alertMsg', formatErrorMsg(err))
    })
  }

  deleteComment (commentId: number) {
    deleteBlogComment(
      commentId
    ).then(res => {
      this.getComments()
    }).catch(err => {
      this.$emit('alertMsg', formatErrorMsg(err))
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
    this.forceRefresh = newVal
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

.v-list--three-line .v-list-item .v-list-item__subtitle, .v-list-item--three-line .v-list-item__subtitle {
  -webkit-line-clamp: unset;
}
</style>
