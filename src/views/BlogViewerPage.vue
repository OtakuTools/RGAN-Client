<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div style="padding-top: 20px;">
          <h1>{{blogInfo.title}}</h1>
          <v-chip-group
            column
            active-class="primary--text"
            readonly
          >
            <v-chip v-for="tag in blogInfo.tags" :key="tag.id" small>
              {{ tag.title }}
            </v-chip>
          </v-chip-group>
          <v-divider style="margin: 20px 0"/>
          <MarkdownViewer :inputText="blogInfo.content" />
          <v-btn :outlined="voteStatus != UP_VOTE" @click="voteBlog(1)" color="red" style="margin-right: 10px">
            <v-icon left>mdi-thumb-up</v-icon>
            赞
          </v-btn>
          <v-btn :outlined="voteStatus != DOWN_VOTE" @click="voteBlog(-1)" color="blue">
            <v-icon left>mdi-thumb-down</v-icon>
            踩
          </v-btn>
          <v-divider style="margin: 20px 0"/>
          <BlogComment :blogId ="blogId" />
        </div>
      </v-col>
    </v-row>
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

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer,
    MenuHeader,
    BlogComment
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
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    })
    this.getVoteStatus()
  },
  methods: {
    getVoteStatus () {
      getBlogStatus([this.$route.query.id]).then(res => {
        this.voteStatus = res.data[0].status
      }).catch(err => {
        this.$message({
          message: err.response.data.message,
          type: 'error'
        })
      })
    },
    upVote () {
      voteBlog(this.blogId, this.UP_VOTE).then(res => {
        this.getVoteStatus()
      })
    },
    downVote () {
      voteBlog(this.blogId, this.DOWN_VOTE).then(res => {
        this.getVoteStatus()
      })
    },
    cancelVote () {
      voteBlog(this.blogId, this.CANCEL_VOTE).then(res => {
        this.getVoteStatus()
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
