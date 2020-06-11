<template>
  <div>
    <v-list two-line flat>
      <v-list-item-group
        multiple
      >
        <template v-for="(blog, index) in blogList">
          <v-list-item :key="blog.id">
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
                    <v-chip style="border: none" outlined small label>
                      <v-icon left small>mdi-calendar</v-icon>
                      {{blog.createdTime.replace("T", " ")}}
                    </v-chip>

                    <v-chip style="border: none" outlined small label>
                      <v-icon left small>mdi-thumb-up-outline</v-icon>
                      {{blog.voteCount}}
                    </v-chip>
                  </v-chip-group>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="handleSelected(blog.id)" v-if="blogStatus === 0">
                  <v-icon color="primary lighten-1">mdi-eye-outline</v-icon>
                </v-btn>
                <v-btn icon @click="editBlog(blog.id)">
                  <v-icon color="cyan lighten-1">mdi-square-edit-outline</v-icon>
                </v-btn>
                <v-btn icon @click="removeBlog(blog.id)">
                  <v-icon color="red lighten-1">mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index + 1 < blogList.length"
            :key="blog.id"
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
  </div>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUserInfoByName } from '@/api/user'
import { getSelfBlogs, deleteBlog } from '@/api/data'

class UserInfo {
  username: string
  id?: number
  createdTime?: string
}

@Component
export default class BlogListForCurrentUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo : UserInfo;
  @Prop({ default: 0, type: Number }) blogStatus : number;
  blogList : any = []
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0
  selected : any = null

  mounted () {
    if (this.userInfo.hasOwnProperty('username') && this.userInfo.username) {
      this.refreshBlogs()
    }
  }

  refreshBlogs (page : number = 0, pageSize : number = 10) : void {
    getSelfBlogs(this.blogStatus, page, pageSize).then(res => {
      let data = res.data.content
      this.totalPages = res.data.totalPages
      this.blogList = data.map(item => {
        let dataFormat = {
          id: 0,
          title: '',
          content: '',
          summary: '',
          tags: [],
          createdTime: '',
          author: {},
          voteCount: 0,
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
    }).catch(err => {
      this.$emit('alertMsg', {
        message: '获取博客列表失败',
        type: 'error'
      })
    })
  }

  handlePageChange (val : any) : void {
    this.currentPage = val
    this.refreshBlogs(val - 1, this.currentPageSize)
  }

  handlePrevPage () : void {
    this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
  }

  handleNextPage () : void {
    this.refreshBlogs(this.currentPage - 1, this.currentPageSize)
  }

  handleSelected (id : any) : void {
    this.$router.push({ name: 'blog', query: { id } })
  }

  editBlog (id : any) : void {
    this.$router.push({ name: 'editor', query: { blog: id } })
  }

  removeBlog (id: number) : void {
    deleteBlog(id).then(res => {
      this.$emit('alertMsg', {
        message: '删除博客成功',
        type: 'success'
      })
      this.blogList = this.blogList.filter(item => item.id !== id)
    }).catch(err => {
      this.$emit('alertMsg', {
        message: '删除博客失败',
        type: 'error'
      })
    })
  }

  @Watch('userInfo')
  handleInfoChange (newVal : any) : void {
    this.refreshBlogs()
  }
}
</script>
