<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader @search="handleSearch" v-bind="$attrs" v-on="$listeners"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" style="text-align: center; margin-top: 20px;">
        <v-avatar
          class="profile"
          size="100"
        >
          <v-img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></v-img>
        </v-avatar>
        <v-list-item
          color="rgba(0, 0, 0, .4)"
          style="padding: 0"
        >
          <v-list-item-content>
            <v-list-item-title class="title">{{userInfo.username}}</v-list-item-title>
            <v-list-item-subtitle>
              <v-btn block :color="isFollowing ? 'error' : 'primary'" @click="handleFollow()">
                <v-icon left v-if="isFollowing">mdi-minus</v-icon>
                <v-icon left v-else>mdi-plus</v-icon>
                {{isFollowing ? "取 关": "关 注"}}
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="9">
        <v-list two-line flat style="padding-top: 20px;">
          <v-list-item-group
            multiple
          >
            <template v-for="(blog, index) in blogList">
              <v-list-item :key="blog.id" @click="handleSelected(blog.id)">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-text="blog.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="blog.summary"></v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip-group
                        column
                      >
                        <v-chip v-for="tag in blog.tags" :key="tag.id" x-small>
                          {{ tag.title }}
                        </v-chip>
                      </v-chip-group>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip-group
                        column
                        disabled
                      >
                        <!-- <v-chip tile outlined small label>
                          <v-icon left small>mdi-account</v-icon>
                          {{blog.authorName}}
                        </v-chip> -->
                        <v-chip outlined small label>
                          <v-icon left small>mdi-calendar</v-icon>
                          {{blog.createdTime.replace("T", " ")}}
                        </v-chip>

                        <v-chip outlined small label>
                          <v-icon left small>mdi-thumb-up</v-icon>
                          {{blog.voteCount}}
                        </v-chip>

                        <!-- <v-chip outlined small label>
                          <v-icon left small>mdi-eye</v-icon>
                          {{blog.visitorCount}}
                        </v-chip> -->
                      </v-chip-group>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-divider
                v-if="index + 1 < blogList.length"
                :key="blog.id"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="handlePageChange"
        @next="handleNextPage"
        @previous="handlePrevPage"
      ></v-pagination>
    </v-row>
    <KanBan />
  </v-container>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import { getBlogByAuthor, searchBlog } from '@/api/data'
import { getUserInfoByName } from '@/api/user'
import { followUser, unfollowUser, checkIsFollowing} from '@/api/follow'
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')

export default {
  name: 'BlogViewerPage',
  components: {
    MenuHeader,
    KanBan
  },
  data () {
    return {
      userInfo: {},
      blogList: [],
      currentPage: 1,
      currentPageSize: 10,
      totalPages: 1,
      totalElements: 0,
      selected: null,

      isFollowing: false,
      needLogIn: false
    }
  },
  mounted () {
    getUserInfoByName(this.$route.query.name).then(res => {
      this.userInfo = res.data
      checkIsFollowing(this.userInfo.id).then(res => {
        this.isFollowing = res.data
      }).catch(err => {
        // this.$emit('alertMsg', {
        //   message: '获取关注状态失败',
        //   type: 'error'
        // })
      })
      this.refreshBlogs()
    })
  },
  methods: {
    refreshBlogs (page = 0, pageSize = 10) {
      getBlogByAuthor(this.userInfo.username, page, pageSize).then(res => {
        let data = res.data.content
        this.totalPages = res.data.totalPages
        this.blogList = data.map(item => {
          let dataFormat = {
            id: 0,
            title: '',
            content: '',
            summary: '',
            tags: [],
            createdTime: '2020-02-02 02:02',
            authorName: 'admin',
            voteCount: 0,
            visitorCount: 0
          }
          Object.assign(dataFormat, item, { tags: item.tags.map(tag => {
            if (Object.prototype.toString.call(tag) === '[object Array]') {
              return {
                id: tag[0],
                title: tag[1]
              }
            }
          })})
          return dataFormat
        })
      }).catch(err => {
        this.$emit('alertMsg', {
          message: '获取博客列表失败',
          type: 'error'
        })
      })
    },
    handlePageChange (val) {
      this.currentPage = val
      this.refreshBlogs(val - 1, this.currentPageSize)
    },
    handlePrevPage () {
      this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
    },
    handleNextPage () {
      this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
    },
    handleSelected (id) {
      this.$router.push({ name: 'blog', query: { id }})
    },
    handleFollow () {
      if (!this.$store.state.user.token) {
        this.$router.push({ name: 'login' })
      } else {
        let msg = {}
        if (this.isFollowing) {
          unfollowUser(this.userInfo.id).then(res => {
            this.isFollowing = false
            msg = {
              message: '取关用户成功',
              type: 'success'
            }
          }).catch(err => {
            msg = {
              message: '取关用户失败',
              type: 'error'
            }
          }).finally(() => {
            this.$emit('alertMsg', msg)
          })
        } else {
          followUser(this.userInfo.id).then(res => {
            this.isFollowing = true
            msg = {
              message: '关注用户成功',
              type: 'success'
            }
          }).catch(err => {
            msg = {
              message: '关注用户失败',
              type: 'error'
            }
          }).finally(() => {
            this.$emit('alertMsg', msg)
          })
        }
      }
    }
  }
}
</script>
