<template>
  <div>
    <v-list two-line flat>
      <template v-for="(blog, index) in blogList">
        <v-list-item :key="blog.id" class="pa-0 blog-box" @click="handleSelected(blog.id)">
          <template>
            <v-card
              class="grow"
              flat
            >
              <v-card-title class="headline blog-box-title">
                {{blog.title}}
                <v-subheader>
                  <v-icon class="mr-1 ml-1" v-if="blog.tags.length">mdi-tag-outline</v-icon>
                  <span class="text-md-body-1">{{blog.tags.map(item => item.title).join(',')}}</span>
                </v-subheader>
              </v-card-title>

              <v-card-text class="title">
                {{blog.summary}}
              </v-card-text>

              <v-card-actions>
                <v-row align="center" justify="start" class="ml-2">
                  <div>{{blog.createdTime.replace("T", " ")}}</div>
                  <v-icon size="24" class="mr-1 ml-3">mdi-thumb-up-outline</v-icon>
                  <div>{{blog.voteCount}}</div>
                </v-row>

              </v-card-actions>
            </v-card>
          </template>
        </v-list-item>

        <v-divider
          v-if="index + 1 < blogList.length"
          :key="blog.id"
        ></v-divider>
      </template>
    </v-list>
    <v-pagination
      v-if="blogList.length"
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
.blog-box:hover .blog-box-title {
  color: #00a4ff;
  cursor: pointer;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUserInfoByName } from '@/api/user'

class UserInfo {
  username: string
  id?: number
  createdTime?: string
}

@Component
export default class BlogListForUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo : UserInfo;
  @Prop({ default: ()=>{}, type: Function }) getData : Function;
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
    this.getData(page, pageSize).then(res => {
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

  @Watch('userInfo')
  handleInfoChange (newVal : any) : void {
    this.refreshBlogs()
  }
}
</script>
