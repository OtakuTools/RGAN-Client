<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list two-line flat>
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
      <v-col cols="12">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @input="handlePageChange"
          @next="handleNextPage"
          @previous="handlePrevPage"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getBlogByAuthor, searchBlog } from '@/api/data'
import { getUserInfoByName } from '@/api/user'

class UserInfo {
  username: string
  id: number
}

@Component
export default class BlogListForUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo!: UserInfo;
  blogList : any = []
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0
  selected : any = null

  mounted() {
    this.refreshBlogs()
  }

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
  }

  handlePageChange (val) {
    this.currentPage = val
    this.refreshBlogs(val - 1, this.currentPageSize)
  }

  handlePrevPage () {
    this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
  }

  handleNextPage () {
    this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
  }

  handleSelected (id) {
    this.$router.push({ name: 'blog', query: { id }})
  }
}
</script>