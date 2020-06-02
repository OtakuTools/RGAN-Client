<template>
  <div>
    <v-list two-line flat>
      <v-list-item-group
        multiple
      >
        <template v-for="(comment, index) in commentList">
          <v-list-item :key="comment.id">
            <template>
              <v-list-item-content>
                <v-list-item-title style="-webkit-line-clamp: unset;">
                  {{comment.content}}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip-group
                    column
                    disabled
                  >
                    <v-chip style="border: none" outlined small label>
                      <v-icon left small>mdi-calendar</v-icon>
                      {{comment.createdTime.replace("T", " ")}}
                    </v-chip>

                    <v-chip style="border: none" outlined small label>
                      <v-icon left small>mdi-thumb-up-outline</v-icon>
                      {{comment.voteCount}}
                    </v-chip>
                  </v-chip-group>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index + 1 < commentList.length"
            :key="comment.id"
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

class UserInfo {
  username: string
  id?: number
  createdTime?: string
}

@Component
export default class CommentListForUser extends Vue {
  @Prop({ default: {}, type: UserInfo }) userInfo : UserInfo;
  @Prop({ default: ()=>{}, type: Function }) getData : Function;
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
    this.getData(page, pageSize).then(res => {
      let data = res.data.content
      this.totalPages = res.data.totalPages
      this.commentList = data
      // this.commentList = data.map(item => {
      //   let dataFormat = {
      //     id: 0,
      //     content: '',
      //     authorName: '',
      //     replyTo: 0,
      //     createdTime: '',
      //     modifiedTime: '',
      //     voteCount: 0
      //   }
      //   Object.assign(dataFormat, item)
      //   return dataFormat
      // })
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
    this.$router.push({ name: 'blog', query: { id } })
  }

  @Watch('userInfo')
  handleInfoChange (newVal : any) : void {
    this.refreshComments()
  }
}
</script>
