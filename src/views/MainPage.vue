<template>
  <div>
    <MenuHeader @search="handleSearch" v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container>
        <v-card>
          <v-card-text style="padding-top: 0">
            <v-list two-line flat>
              <v-list-item-group
                multiple
              >
                <template v-for="(blog, index) in blogList">
                  <v-list-item :key="blog.id" @click="handleSelected(blog.id)">
                    <template>
                      <v-list-item-content style="padding-bottom: 0">
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
                            <v-chip style="border: none" outlined small label>
                              <v-icon left small>mdi-calendar</v-icon>
                              {{blog.createdTime.replace("T", " ")}}
                            </v-chip>
                            <v-chip style="border: none" outlined small label>
                              <v-icon left small>mdi-thumb-up-outline</v-icon>
                              {{blog.voteCount}}
                            </v-chip>
                            <v-chip style="border: none" outlined small label>
                              <v-icon left small>mdi-account</v-icon>
                              {{blog.authorName}}
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
                    style="margin-top: 0"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              @input="handlePageChange"
              @next="handleNextPage"
              @previous="handlePrevPage"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
    <KanBan />
  </div>
</template>

<style scoped>

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

      searchVal : ''
    }
  },
  mounted () {
    this.refreshBlogs()
  },
  methods: {
    refreshBlogs (page = 0, pageSize = 10) {
      if (this.searchVal === '') {
        getBlogList(page, pageSize).then(res => {
          this.updateData(res)
        }).catch(err => {
          this.$emit('alertMsg', {
            message: '获取博客列表失败',
            type: 'error'
          })
        })
      } else {
        searchBlog(this.searchVal, page, pageSize).then(res => {
          this.updateData(res)
        }).catch(err => {
          this.$emit('alertMsg', {
            message: '获取博客列表失败',
            type: 'error'
          })
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
        })})
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
      this.$router.push({ name: 'blog', query: { id }})
    },
    handleSearch (val) {
      this.searchVal = val
      this.refreshBlogs(0, this.currentPageSize)
    }
  }
}
</script>
