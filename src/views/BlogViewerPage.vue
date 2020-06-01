<template>
  <div>
    <MenuHeader v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container style="max-width: 1400px;">
        <v-row>
          <v-col cols="10">
            <v-card>
              <v-card-title class="headline" v-text="blogInfo.title"></v-card-title>
              <v-card-subtitle style="padding: 0">
                <v-list three-line flat>
                  <v-list-item style="padding-top: 0; padding-bottom: 0;">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-chip :color="blogInfo.type === '0' ? 'green' : blogInfo.type === '1' ? 'orange' : 'red'" x-small label outlined style="margin-right: 10px">{{ blogType[blogInfo.type] }}</v-chip>
                        <a style="margin-right: 10px" @click="$router.push({ name: 'userspace', query: { name: blogInfo.authorName }})">{{blogInfo.authorName}}</a>
                        <span>最后发表于 {{blogInfo.modifiedTime ? blogInfo.modifiedTime.replace("T", " ") : ""}}</span>
                        <a v-if="blogInfo.authorName === $store.state.user.name" style="float: right" @click="$router.push({ path: 'editor', query: { blog: blogId}})">编辑</a>
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
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <v-divider />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-subtitle>
              <v-card-text style="padding-top: 0">
                <MarkdownViewer :inputText="blogInfo.content" v-bind="$attrs" v-on="$listeners" />
                <v-btn outlined color="orange" style="margin-right: 10px">
                  <v-icon left>mdi-star-outline</v-icon>
                  {{blogInfo.voteCount}}
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
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-card id="indexCard" v-bind:class="{'pin': fixedIndexCard}">
              <v-card-text>
                <v-list nav dense subheader flat>
                  <v-subheader>目录</v-subheader>
                  <v-list-item-group v-model="currentIndex" color="primary">
                    <v-list-item
                      v-for="(item, i) in indexInfo"
                      :key="i"
                      :href="`#${item.id}`"
                      @click="manualSelected = true"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <KanBan />
  </div>
</template>

<style scoped>
.pin {
  position: fixed;
  top: 20px;
}
</style>

<script>
// @ is an alias to /src
import { getBlogById } from '@/api/data'
import { voteBlog, getBlogStatus } from '@/api/vote'
import { formatErrorMsg } from '@/libs/util'
import { BLOG_TYPE } from '@/libs/constant'
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
      indexInfo: [],
      currentIndex: 0,
      manualSelected: false,
      fixedIndexCard: false,
      voteStatus: 0,
      UP_VOTE: 1,
      CANCEL_VOTE: 0,
      DOWN_VOTE: -1,

      blogType: BLOG_TYPE
    }
  },
  mounted () {
    this.blogId = parseInt(this.$route.query.id)
    getBlogById(this.$route.query.id).then(res => {
      this.blogInfo = res.data
      this.$nextTick(() => {
        this.generateIndex()
        this.currentIndex = 0
      })
    }).catch(err => {
      this.$emit('alertMsg', formatErrorMsg(err))
    })
    this.getVoteStatus()
    window.addEventListener('scroll', this.updateCurrentIndex, false)
    window.addEventListener('scroll', this.debounce(this.updateIndexPosition, 50), false)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.updateCurrentIndex)
    window.addEventListener('scroll', this.debounce(this.updateIndexPosition, 50))
  },
  methods: {
    getVoteStatus () {
      if (!this.$route.query.hasOwnProperty('id') || !this.$store.state.user.token) return
      getBlogStatus([this.$route.query.id]).then(res => {
        this.voteStatus = res.data.length ? res.data[0].status : 0
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },
    upVote () {
      voteBlog(this.blogId, this.UP_VOTE).then(res => {
        this.blogInfo.upvoteCount -= this.voteStatus
        this.blogInfo.upvoteCount += this.UP_VOTE
        this.voteStatus = this.UP_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },
    downVote () {
      voteBlog(this.blogId, this.DOWN_VOTE).then(res => {
        this.blogInfo.upvoteCount -= this.voteStatus
        this.blogInfo.upvoteCount += this.DOWN_VOTE
        this.voteStatus = this.DOWN_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },
    cancelVote () {
      voteBlog(this.blogId, this.CANCEL_VOTE).then(res => {
        this.blogInfo.upvoteCount -= this.voteStatus
        this.voteStatus = this.CANCEL_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },
    voteBlog (mode) {
      if (this.voteStatus === mode) {
        this.cancelVote()
      } else if (mode === this.UP_VOTE) {
        this.upVote()
      } else {
        this.downVote()
      }
    },
    generateIndex() {
      let idxs = document.querySelectorAll('#display > h1, #display > h2, #display > h3, #display > h4, #display > h5， #display > h6')
      let idxTree = []
      idxs.forEach((item, index) => {
        idxTree.push({
          id: item.id,
          text: item.textContent
        })
      })
      this.indexInfo = idxTree
    },
    updateCurrentIndex(e) {
      if (this.manualSelected) {
        this.manualSelected = false
      } else {
        let idxs = document.querySelectorAll('#display > h1, #display > h2, #display > h3, #display > h4, #display > h5， #display > h6')
        let len = idxs.length
        let i = 0
        for (; i < len; i++) {
          if ((this.checkIfOutsideWindowTop(idxs[i]) && i < len-1 && this.checkIfOutsideWindowBottom(idxs[i+1])) || !this.checkIfOutsideWindowTop(idxs[i])) {
            this.currentIndex = i
            break
          }
        }
        if (i >= len) {
          this.currentIndex = len - 1
        }
      }
    },
    updateIndexPosition (e) {
      let cp = document.getElementById('indexCard').getBoundingClientRect().top <= 20
      let top_distance = document.documentElement.scrollTop || document.body.scrollTop
      if (top_distance > 0 && cp !== this.fixedIndexCard) {
        this.fixedIndexCard = cp
      } else if (top_distance === 0) {
        this.fixedIndexCard = false
      }
    },
    debounce(fn, delay) {
      let timer = null //借助闭包
      return function() {
        if(timer){
          clearTimeout(timer) 
        }
        timer = setTimeout(fn, delay) // 简化写法
      }
    },
    checkIfOutsideWindowTop(item) {
      return item.getBoundingClientRect().top < 0
    },
    checkIfOutsideWindowBottom(item) {
      return item.getBoundingClientRect().top > (document.documentElement.clientHeight || document.body.clientHeight)
    }
  }
}
</script>
