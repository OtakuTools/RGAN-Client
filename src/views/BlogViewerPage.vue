<template>
  <div>
    <MenuHeader v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container style="max-width: 1400px;">
        <v-row>
          <v-col :cols="indexInfo.length ? 10 : 12">
            <v-card flat>
              <v-card-title class="headline" v-text="blogInfo.title"></v-card-title>
              <v-card-subtitle class="pa-0">
                <v-list three-line flat>
                  <v-list-item class="pt-0 pb-0">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-chip class="mr-2" :color="blogInfo.type === '0' ? 'green' : blogInfo.type === '1' ? 'orange' : 'red'" x-small label outlined>{{ blogType[blogInfo.type] }}</v-chip>
                        <a class="mr-2" @click="$router.push({ name: 'userspace', query: { name: blogInfo.author.username }})">{{blogInfo.author.username}}</a>
                        <span>最后发表于 {{blogInfo.modifiedTime ? blogInfo.modifiedTime.replace("T", " ") : ""}}</span>
                        <a v-if="blogInfo.author.username === $store.state.user.name" class="float-right" @click="$router.push({ path: 'editor', query: { blog: blogId}})">编辑</a>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <v-chip-group
                          column
                          active-class="primary--text"
                          readonly
                        >
                          <div class="mr-2" style="line-height: 24px;">标签</div>
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
              <v-card-text class="pt-0">
                <MarkdownViewer :inputText="blogInfo.content" v-bind="$attrs" v-on="$listeners" />
                <v-btn outlined color="orange" class="mr-2">
                  <v-icon left>mdi-star-outline</v-icon>
                  {{blogInfo.voteCount}}
                </v-btn>
                <v-btn :outlined="voteStatus != voteType.UP_VOTE" @click="voteBlog(1)" color="red" dark class="mr-2">
                  <v-icon left>mdi-thumb-up-outline</v-icon>
                  赞
                </v-btn>
                <v-btn :outlined="voteStatus != voteType.DOWN_VOTE" @click="voteBlog(-1)" dark color="blue" class="mr-2">
                  <v-icon left>mdi-thumb-down-outline</v-icon>
                  踩
                </v-btn>
                <v-btn :outlined="!favouriteStatus" @click="favouriteBlog" dark color="pink">
                  <v-icon left>mdi-heart-outline</v-icon>
                  收藏
                </v-btn>
                <v-divider class="my-5"/>
                <BlogComment :blogId ="blogId" v-bind="$attrs" v-on="$listeners"/>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="auto" v-if="indexInfo.length">
            <div class="v-navigation-drawer__content pin">
              <ul class="pt-8 mb-6 documentation-toc">
                <li class="mb-4">
                  <h3 class="caption font-weight-bold text-uppercase grey--text">
                    <div class="subtitle">
                      <p>目 录</p>
                    </div>
                  </h3>
                </li>
                <li
                  class="documentation-toc__link mb-2"
                  v-bind:class="{'primary--text': currentIndex === i, 'text--disabled': currentIndex !== i}"
                  style="border-color: currentcolor"
                  v-for="(item, i) in indexInfo"
                  :key="i"
                  @click="() => { currentIndex = i; manualSelected = true; $vuetify.goTo(`#${item.id}`)}"
                >
                  <a class="d-block font-weight-medium" v-bind:class="{'text--disabled': currentIndex !== i}">
                    {{item.text}}
                  </a>
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <KanBan v-if="false" />
  </div>
</template>

<style scoped>
.pin {
  position: fixed;
  max-width: 200px;
}

.index-on {
  color: #00a4ff;
}

.documentation-toc {
  list-style-type: none !important;
  margin: 0;
  padding: 32px 0 0;
  text-align: left;
  width: 100%;
}

.documentation-toc li {
  border-left: 2px solid transparent;
  padding: 0 24px 0 8px;
}
</style>

<script>
// @ is an alias to /src
import { getBlogById } from '@/api/data'
import { getFavouriteStatus, addFavourite, deleteFavourite } from '@/api/favourite'
import { voteBlog, getBlogStatus } from '@/api/vote'
import { formatErrorMsg } from '@/libs/util'
import { BLOG_TYPE, BLOG_STATUS, VOTE_STATUS } from '@/libs/constant'
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
      blogInfo: {
        author: {}
      },
      indexInfo: [],
      currentIndex: 0,
      manualSelected: false,
      fixedIndexCard: false,
      voteStatus: 0,
      favouriteStatus: false,

      voteType: VOTE_STATUS,
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
    this.getFavouriteStatus()
    window.addEventListener('scroll', this.updateCurrentIndex, false)
    // window.addEventListener('scroll', this.debounce(this.updateIndexPosition, 50), false)
    window.addEventListener('mousewheel', this.handleMouseWheel, false)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.updateCurrentIndex)
    // window.removeEventListener('scroll', this.debounce(this.updateIndexPosition, 50))
    window.removeEventListener('mousewheel', this.handleMouseWheel)
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

    getFavouriteStatus () {
      if (!this.$route.query.hasOwnProperty('id') || !this.$store.state.user.token) return
      getFavouriteStatus(this.$route.query.id).then(res => {
        this.favouriteStatus = res.data
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },

    upVote () {
      voteBlog(this.blogId, VOTE_STATUS.UP_VOTE).then(res => {
        this.blogInfo.voteCount -= this.voteStatus
        this.blogInfo.voteCount += VOTE_STATUS.UP_VOTE
        this.voteStatus = VOTE_STATUS.UP_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },

    downVote () {
      voteBlog(this.blogId, VOTE_STATUS.DOWN_VOTE).then(res => {
        this.blogInfo.voteCount -= this.voteStatus
        this.blogInfo.voteCount += VOTE_STATUS.DOWN_VOTE
        this.voteStatus = VOTE_STATUS.DOWN_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },

    cancelVote () {
      voteBlog(this.blogId, VOTE_STATUS.CANCEL_VOTE).then(res => {
        this.blogInfo.voteCount -= this.voteStatus
        this.voteStatus = VOTE_STATUS.CANCEL_VOTE
      }).catch(err => {
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    },

    voteBlog (mode) {
      if (this.voteStatus === mode) {
        this.cancelVote()
      } else if (mode === VOTE_STATUS.UP_VOTE) {
        this.upVote()
      } else {
        this.downVote()
      }
    },

    favouriteBlog () {
      if (this.favouriteStatus) {
        deleteFavourite(this.blogId).then(res => {
          this.favouriteStatus = false
        }).catch(err => {
          this.$emit('alertMsg', formatErrorMsg(err))
        })
      } else {
        addFavourite(this.blogId).then(res => {
          this.favouriteStatus = true
        }).catch(err => {
          this.$emit('alertMsg', formatErrorMsg(err))
        })
      }
    },

    generateIndex() {
      let idxs = document.querySelectorAll('.preview_block > h1, .preview_block > h2, .preview_block > h3, .preview_block > h4, .preview_block > h5， .preview_block > h6') || []
      let idxTree = []
      idxs.forEach((item, index) => {
        item.id = `idx_${index}`
        idxTree.push({
          id: `idx_${index}`,
          text: item.textContent
        })
      })
      this.indexInfo = idxTree
    },

    handleMouseWheel (e) {
      this.manualSelected = false
    },

    updateCurrentIndex(e) {
      if (!this.manualSelected) {
        let idxs = document.querySelectorAll('.preview_block > h1, .preview_block > h2, .preview_block > h3, .preview_block > h4, .preview_block > h5， .preview_block > h6')
        let len = idxs.length
        let i = 0
        for (; i < len; i++) {
          if ((this.checkIfOutsideWindowTop(idxs[i]) && i < len - 1 && this.checkIfOutsideWindowBottom(idxs[i + 1])) || !this.checkIfOutsideWindowTop(idxs[i])) {
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
      let cp = document.getElementById('indexCard')
      cp = cp && cp.getBoundingClientRect().top <= 20
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
      return item && item.getBoundingClientRect().top < 0
    },
    checkIfOutsideWindowBottom(item) {
      return item && item.getBoundingClientRect().top > (document.documentElement.clientHeight || document.body.clientHeight)
    }
  }
}
</script>
