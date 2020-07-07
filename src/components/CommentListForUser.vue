<template>
  <div>
    <v-list two-line flat>
      <template v-for="(comment, index) in commentList">
        <v-list-item :key="comment.id" class="pa-0 comment-box">
          <template>
            <v-card
              class="grow"
              flat
            >
              <v-card-title class="comment-box-title">
                <v-icon class="mr-2">mdi-reply</v-icon>
                <span @click="handleSelected(comment.id)">{{comment.blogTitle}}</span>
              </v-card-title>
              <v-card-text class="headline pb-0">
                <v-icon>mdi-comment-quote-outline</v-icon>
                {{comment.content}}
              </v-card-text>
              <v-card-actions>
                <v-row align="center" justify="start" class="ml-2">
                  <div>{{comment.createdTime.replace("T", " ")}}</div>
                  <v-icon class="mr-1 ml-3">mdi-thumb-up-outline</v-icon>
                  <div>{{comment.voteCount}}</div>
                </v-row>
                <v-row align="center" justify="end" class="mr-2">
                  <v-btn icon @click="removeComment(comment.id)">
                    <v-icon color="red lighten-1">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </template>
        </v-list-item>

        <v-divider
          v-if="index + 1 < commentList.length"
          :key="comment.id"
        ></v-divider>
      </template>
    </v-list>
    <v-pagination
      v-if="commentList.length"
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
.comment-box:hover .comment-box-title {
  color: #00a4ff;
  cursor: pointer;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUserInfoByName } from '@/api/user'
import { getSelfComments, deleteBlogComment } from '@/api/data'

class UserInfo {
  username: string
  id?: number
  createdTime?: string
}

@Component
export default class CommentListForUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo : UserInfo;
  // @Prop({ default: ()=>{}, type: Function }) getData : Function;
  commentList : any = []
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0
  selected : any = null

  mounted () {
    if (this.userInfo.hasOwnProperty('username') && this.userInfo.username) {
      this.refreshComments()
    }
  }

  refreshComments (page : number = 0, pageSize : number = 10) : void {
    getSelfComments(page, pageSize).then(res => { 
      this.totalPages = res.data.totalPages
      this.commentList = res.data.content
    }).catch(err => {
      this.$emit('alertMsg', {
        message: '获取评论列表失败',
        type: 'error'
      })
    })
  }

  handlePageChange (val : any) : void {
    this.currentPage = val
    this.refreshComments(val - 1, this.currentPageSize)
  }

  handlePrevPage () : void {
    this.refreshComments(this.currentPage - 1, this.currentPageSize)
  }

  handleNextPage () : void {
    this.refreshComments(this.currentPage - 1, this.currentPageSize)
  }

  handleSelected (id : any) : void {
    this.$router.push({ name: 'blog', params: { id }})
  }

  removeComment (id: any) : void {
    deleteBlogComment(id).then(res => {
      this.refreshComments()
      this.$emit('alertMsg', {
        message: '删除评论成功',
        type: 'success'
      })
    }).catch(err => {
      this.$emit('alertMsg', {
        message: '删除评论失败',
        type: 'error'
      })
    })
  }

  @Watch('userInfo')
  handleInfoChange (newVal : any) : void {
    this.refreshComments()
  }
}
</script>
