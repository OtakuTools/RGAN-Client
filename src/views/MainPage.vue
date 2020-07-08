<template>
  <div>
    <MenuHeader @search="handleSearch" v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container class="pb-0">
        <v-list two-line flat>
          <template v-if="loadingData">
            <v-list-item v-for="n in 5" :key="n">
              <template>
                <v-skeleton-loader
                  class="grow"
                  type="article, list-item-avatar"
                ></v-skeleton-loader>
              </template>
            </v-list-item>
            <v-divider
              v-if="n < 5"
              :key="n"
              class="mt-2"
            ></v-divider>
          </template>
          <template v-if="!loadingData && !blogList.length">
            <v-list-item>
              <v-list-item-content>博客列表为空</v-list-item-content>
            </v-list-item>
          </template>
          <template v-for="(blog, index) in blogList">
            <v-list-item :key="blog.id" @click="handleSelected(blog.id)" class="pa-0 blog-box">
              <template>
                <v-card
                  class="grow"
                  flat
                >
                  <v-card-title class="headline blog-box-title">
                    {{blog.title}}
                  </v-card-title>

                  <v-card-text class="title font-weight-light pb-0">
                    {{blog.summary}}
                  </v-card-text>

                  <v-card-actions>
                    <v-list-item class="grow">
                      <v-list-item-avatar>
                        <v-img
                          class="elevation-6"
                          :src="blog.author.profilePicturePath || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                        ></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{blog.author.username}}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{blog.createdTime.replace("T", " ")}}
                          <v-icon class="mr-1 ml-1" v-if="blog.tags.length">mdi-tag-outline</v-icon>
                          <span class="subheading">{{blog.tags.map(item => item.title).join(',')}}</span>
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-row
                        align="center"
                        justify="end"
                      >
                        <!-- <v-icon class="mr-1" v-if="blog.tags.length">mdi-tag-outline</v-icon>
                        <span class="subheading mr-2">{{blog.tags.map(item => item.title).join(',')}}</span>
                        <v-divider vertical v-if="blog.tags.length" style="margin-right: 10px"></v-divider> -->
                        <v-icon class="mr-2">mdi-thumb-up-outline</v-icon>
                        <span class="subheading">{{blog.voteCount}}</span>
                      </v-row>
                    </v-list-item>
                  </v-card-actions>
                </v-card>
              </template>
            </v-list-item>

            <v-divider
              v-if="index + 1 < blogList.length"
              :key="blog.id"
              class="mt-0"
            ></v-divider>
          </template>
        </v-list>

        <v-pagination
          v-if="blogList.length"
          color="#00a4ff"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @input="handlePageChange"
          @next="handleNextPage"
          @previous="handlePrevPage"
        ></v-pagination>

        <v-divider class="mt-4" />

        <div
          class="text-center font-weight-medium my-2"
        >
          <span>©2020&nbsp;&nbsp;-&nbsp;&nbsp;</span>
          <a style="color: black; text-decoration: none;" href="http://beian.miit.gov.cn/publish/query/indexFirst.action" rel="noreferrer" target="_blank">粤ICP备20048983号-1</a>
        </div>
      </v-container>
      <KanBan v-if="false" />
    </v-content>
  </div>
</template>

<style scoped>
.blog-box:hover .blog-box-title {
  color: #00a4ff;
  cursor: pointer;
}
</style>

<script>
// @ is an alias to /src
import { getBlogList, searchBlog } from '@/api/data'
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
      blogList: [],
      currentPage: 1,
      currentPageSize: 10,
      totalPages: 1,
      totalElements: 0,
      selected: null,

      searchVal: '',
      loadingData: false
    }
  },
  mounted () {
    this.refreshBlogs()
  },
  methods: {
    refreshBlogs (page = 0, pageSize = 10) {
      this.loadingData = true
      if (this.searchVal === '') {
        getBlogList(page, pageSize).then(res => {
          this.updateData(res)
        }).catch(err => {
          this.$emit('alertMsg', {
            message: '获取博客列表失败',
            type: 'error'
          })
        }).finally(() => {
          this.loadingData = false
        })
      } else {
        searchBlog(this.searchVal, page, pageSize).then(res => {
          this.updateData(res)
        }).catch(err => {
          this.$emit('alertMsg', {
            message: '获取博客列表失败',
            type: 'error'
          })
        }).finally(() => {
          this.loadingData = false
        })
      }
    },
    updateData (res) {
      this.totalPages = res.data.totalPages
      this.blogList = res.data.content.map(item => {
        let dataFormat = {
          id: 0,
          title: '',
          content: '',
          summary: '',
          tags: [],
          date: '2020-02-02 02:02',
          author: 'admin',
          upvoteCount: 0,
          visitorCount: 0
        }
        Object.assign(dataFormat, item, { tags: item.tags.map(tag => {
          if (Object.prototype.toString.call(tag) === '[object Array]') {
            return {
              id: tag[0],
              title: tag[1]
            }
          } else {
            return tag
          }
        }) })
        return dataFormat
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
      this.$router.push({ name: 'blog', query: { id } })
    },
    handleSearch (val) {
      this.searchVal = val
      this.refreshBlogs(0, this.currentPageSize)
    }
  }
}
</script>
