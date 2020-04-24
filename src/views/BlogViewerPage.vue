<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader v-bind="$attrs" v-on="$listeners"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div style="padding-top: 20px;">
          <h1>{{blogInfo.title}}</h1>
          <v-list three-line flat>
            <v-list-item style="padding: 0">
              <v-list-item-content>
                <v-list-item-subtitle>
                  <v-chip color="orange" x-small label outlined style="margin-right: 10px">原创</v-chip>
                  <a style="margin-right: 10px">{{blogInfo.authorName}}</a>
                  <span>最后发表于 {{blogInfo.modifiedTime ? blogInfo.modifiedTime.replace("T", " ") : ""}}</span>
                  <a style="float: right" @click="$router.push({ path: 'editor', query: { blog: blogId}})">编辑</a>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-chip-group
                    column
                    active-class="primary--text"
                    readonly
                  >
                    <div style="line-height: 24px; margin-right: 5px">标签</div>
                    <v-chip v-for="tag in blogInfo.tags" :key="tag.id" x-small>
                      {{ tag.title }}
                    </v-chip>
                  </v-chip-group>
                  <v-divider></v-divider>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <MarkdownViewer :inputText="blogInfo.content" v-bind="$attrs" v-on="$listeners" />
          <v-btn outlined color="orange" style="margin-right: 10px">
            <v-icon left>mdi-star-outline</v-icon>
            {{blogInfo.upvoteCount}}
          </v-btn>
          <v-btn :outlined="voteStatus != UP_VOTE" @click="voteBlog(1)" color="red" style="margin-right: 10px">
            <v-icon left>mdi-thumb-up-outline</v-icon>
            赞
          </v-btn>
          <v-btn :outlined="voteStatus != DOWN_VOTE" @click="voteBlog(-1)" color="blue">
            <v-icon left>mdi-thumb-down-outline</v-icon>
            踩
          </v-btn>
          <v-divider style="margin: 20px 0"/>
          <BlogComment :blogId ="blogId" v-bind="$attrs" v-on="$listeners"/>
        </div>
      </v-col>
    </v-row>
    <KanBan />
  </v-container>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import { getBlogById } from '@/api/data'
import { voteBlog, getBlogStatus} from '@/api/vote'
const MarkdownViewer = () => import('@/components/MarkdownViewer')
const BlogComment = () => import('@/components/BlogComment')
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer,
    MenuHeader,
    BlogComment,
    KanBan
  },
  data () {
    return {
      blogId: 0,
      blogInfo: {},
      voteStatus: 0,
      UP_VOTE: 1,
      CANCEL_VOTE: 0,
      DOWN_VOTE: -1
    }
  },
  mounted () {
    this.blogId = parseInt(this.$route.query.id)
    getBlogById(this.$route.query.id).then(res => {
      this.blogInfo = res.data
    }).catch(err => {
      this.$emit('alertMsg', {
        message: err.response.data.message,
        type: 'error'
      })
    })
    this.getVoteStatus()
  },
  methods: {
    getVoteStatus () {
      if (!this.$route.query.hasOwnProperty('id')) return
      getBlogStatus([this.$route.query.id]).then(res => {
        this.voteStatus = res.data.length? res.data[0].status : 0
      }).catch(err => {
        this.$emit('alertMsg', {
          message: err.response.data.message,
          type: 'error'
        })
      })
    },
    upVote () {
      voteBlog(this.blogId, this.UP_VOTE).then(res => {
        // this.getVoteStatus()
        this.blogInfo.upvoteCount -= this.voteStatus
        this.blogInfo.upvoteCount += this.UP_VOTE
        this.voteStatus = this.UP_VOTE
      }).catch(err => {
        console.error(err)
      })
    },
    downVote () {
      voteBlog(this.blogId, this.DOWN_VOTE).then(res => {
        // this.getVoteStatus()
        this.blogInfo.upvoteCount -= this.voteStatus
        this.blogInfo.upvoteCount += this.DOWN_VOTE
        this.voteStatus = this.DOWN_VOTE
      }).catch(err => {
        console.error(err)
      })
    },
    cancelVote () {
      voteBlog(this.blogId, this.CANCEL_VOTE).then(res => {
        // this.getVoteStatus()
        this.blogInfo.upvoteCount -= this.voteStatus
        this.voteStatus = this.CANCEL_VOTE
      }).catch(err => {
        console.error(err)
      })
    },
    voteBlog(mode) {
      if (this.voteStatus === mode) {
        this.cancelVote()
      } else if (mode === this.UP_VOTE) {
        this.upVote()
      } else {
        this.downVote()
      }
    }
  }
}
</script>
