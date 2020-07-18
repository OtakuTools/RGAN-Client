<template>
  <div>
    <MenuHeader v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container style="max-width: 1400px;">
        <v-row>
          <v-col cols="10">
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
                          <v-chip v-for="tag in blogInfo.tags" :key="tag.id" color="#757575" x-small label outlined>
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
                <div id="userActionPart"></div>
                <v-bottom-navigation class="userAction-normal" >
                  <v-btn icon fab color="rgba(0,0,0,.54)">
                    <v-badge color="red" overlap :content="`${blogInfo.voteCount}`" offset-x="5" offset-y="5">
                      <v-icon color="orange">mdi-star-outline</v-icon>
                    </v-badge>
                  </v-btn>
                  <v-btn icon fab @click="voteBlog(1)">
                    <v-icon :color="voteStatus === voteType.UP_VOTE? 'red' : 'rgba(0,0,0,.54)'">mdi-thumb-up-outline</v-icon>
                  </v-btn>
                  <v-btn icon fab @click="voteBlog(-1)">
                    <v-icon :color="voteStatus === voteType.DOWN_VOTE? 'blue' : 'rgba(0,0,0,.54)'">mdi-thumb-down-outline</v-icon>
                  </v-btn>
                  <v-btn icon fab @click="favouriteBlog">
                    <v-icon :color="favouriteStatus? 'pink' : 'rgba(0,0,0,.54)'">mdi-heart-outline</v-icon>
                  </v-btn>
                  <v-btn icon fab @click="scrollToComment" color="rgba(0,0,0,.54)">
                    <v-icon color="light-blue">mdi-comment-text-outline</v-icon>
                  </v-btn>
                </v-bottom-navigation>
                <v-divider class="my-5"/>
                <p class="title" id="commentPart">评论</p>
                <BlogComment :blogId ="blogId" v-bind="$attrs" v-on="$listeners"/>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="2">
            <div class="v-navigation-drawer__content pin">
              <ul class="pt-8 mb-6 documentation-toc">
                <li class="mb-4">
                  <h3 class="caption font-weight-bold text-uppercase grey--text">
                    <div class="subtitle">
                      <p>目 录</p>
                    </div>
                  </h3>
                </li>
                <li v-if="indexInfo.length === 0">
                  <a class="d-block font-weight-medium text--disabled" >
                    暂无目录信息
                  </a>
                </li>
                <div id="idx-list" class="pin-height">
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
                </div>
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

.pin-height {
  max-height: 400px;
  overflow: auto;
}

.pin-height::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.pin-height::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}

.pin-height::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10;
  background: rgba(0,0,0,0.1);
}

.action-list {
  list-style-type: none;
  padding: 0;
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

.d-block {
  font-size: 14px;
  line-height: 24px;
}

.userAction-normal {
  box-shadow: unset !important;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0px;
}
</style>

<script>
// @ is an alias to /src
import { getBlogById } from '@/api/data'
import { getFavouriteStatus, addFavourite, deleteFavourite } from '@/api/favourite'
import { voteBlog, getBlogStatus } from '@/api/vote'
import { formatErrorMsg, setTitle } from '@/libs/util'
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
        author: {},
        voteCount: 0
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
      setTitle(this.blogInfo.title)
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
    window.addEventListener('mousewheel', this.handleMouseWheel, false)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.updateCurrentIndex)
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

    scrollToComment() {
      document.getElementById('commentPart').scrollIntoView()
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
        this.$nextTick(() => {
          let a_idxs = document.querySelector('.pin-height > li.primary--text')
          a_idxs.scrollIntoView(false)
        })
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

    checkIfOutsideWindowTop(item) {
      return item && item.getBoundingClientRect().top < 0
    },

    checkIfOutsideWindowBottom(item) {
      return item && item.getBoundingClientRect().top > (document.documentElement.clientHeight || document.body.clientHeight)
    }
  }
}
</script>
