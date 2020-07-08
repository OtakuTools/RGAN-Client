<template>
  <div>
    <v-list two-line flat>
      <template v-if="!blogList.length">
        <v-list-item>
          <v-list-item-content>收藏列表为空</v-list-item-content>
        </v-list-item>
      </template>
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
              <v-card-actions>
                <v-row align="center" justify="start" class="ml-2">
                  <div>{{blog.createdTime.replace("T", " ")}}</div>
                </v-row>
                <v-row align="center" justify="end" class="mr-2">
                  <v-btn icon @click="removeFavourite(blog.id)">
                    <v-icon color="red lighten-1">mdi-trash-can-outline</v-icon>
                  </v-btn>
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
import { getSelfFavourites, deleteFavourite } from '@/api/favourite'
import { formatErrorMsg } from '@/libs/util'

class UserInfo {
  username: string
  id?: number
  createdTime?: string
}

@Component
export default class BlogListForUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo : UserInfo;
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
    getSelfFavourites(page, pageSize).then(res => {
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
          visitorCount: 0,
          enlistTime: ''
        }
        Object.assign(dataFormat, item.blogSummary, { enlistTime: item.enlistTime }, { tags: item.blogSummary.tags.map(tag => {
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

  removeFavourite(id: number) {
    deleteFavourite(id).then(res => {
      this.$emit('alertMsg', {
        message: '移除收藏成功',
        type: 'success'
      })
      this.refreshBlogs()
    }).then(err => {
      this.$emit('alertMsg', {
        message: formatErrorMsg(err),
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
