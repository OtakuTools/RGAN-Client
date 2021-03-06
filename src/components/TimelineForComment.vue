<template>
  <div class="mt-1">
    <v-timeline v-if="infoList.length" align-top dense>
      <v-timeline-item
        v-for="(info, index) in infoList"
        :key="index"
        :icon="info ? info.read? 'mdi-alert-circle-check-outline': 'mdi-alert-circle-outline' : 'mdi-cancel'"
        :color="info ? info.read? 'green lighten-1': 'red lighten-1' : 'grey'"
        fill-dot
      >
        <v-card v-if="!info">
          <v-card-title class="headline">
            该动态已过期
          </v-card-title>
        </v-card>
        <v-card v-else class="elevation-2">
          <v-card-title class="headline">
            <v-avatar size="32" style="margin-right: 10px">
              <img
                :src="info.author.profilePicturePath || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                alt="avatar"
              >
            </v-avatar>
            <a @click="$router.push({ name: 'userspace', query: { name: info.author.username }})">{{info.author.username}}</a>
            <span style="font-size: 12pt; margin-left: 5px;">发表了评论</span>
            <v-spacer></v-spacer>
            <span class="text--secondary" style="margin-right: 10px; font-size: 11pt;">{{info.modifiedTime.replace('T', ' ')}}</span>
            <v-btn @click="deleteInfo(info.id)" icon>
              <v-icon color="red lighten-1">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p style="font-size: 11pt">{{info.content}}</p>
            回复：<a class="black--text" style="font-size: 13pt" @click="$router.push({ name: 'blog', query: { id: info.blogId }})"><strong>{{info.blogTitle}}</strong></a>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-list v-else>
      <v-list-item>
        <v-list-item-content>暂无动态</v-list-item-content>
      </v-list-item>
    </v-list>
    <v-pagination
      v-if="infoList.length"
      v-model="currentPage"
      :length="totalPages"
      :total-visible="7"
      @input="handlePageChange"
      @next="handleNextPage"
      @previous="handlePrevPage"
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getTimelineForComment, updateReadStatus, deleteTimelineMsg } from '@/api/timeline'
import { formatErrorMsg } from '@/libs/util'

@Component
export default class TimelineForComment extends Vue {
  infoList : Array<any> = []
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0

  mounted () {
    this.refreshInfo()
  }

  deleteInfo (id: number) {
    deleteTimelineMsg(id).then(res => {
      this.$emit('alertMsg', {
        message: '删除动态成功',
        type: 'success'
      })
      this.refreshInfo()
    }).catch(err => {
      formatErrorMsg(err)
    })
  }

  refreshInfo (page: number = 0, size: number = 0) {
    getTimelineForComment(page, size).then(res => {
      let data : any = res.data.content
      this.infoList = data
      this.totalPages = res.data.totalPages
      this.$nextTick(() => {
        let ids : Array<number> = data.filter(item => item && !item.read).map(item => item.id)
        updateReadStatus(ids).then(res => {
          this.$emit('updateUnreadMsg')
        }).catch(err => {})
      })
    }).catch(err => {
      console.error(err)
    })
  }

  handlePageChange (val : any) : void {
    this.currentPage = val
    this.refreshInfo(val - 1, this.currentPageSize)
  }

  handlePrevPage () : void {
    this.refreshInfo(this.currentPage - 1, this.currentPageSize)
  }

  handleNextPage () : void {
    this.refreshInfo(this.currentPage - 1, this.currentPageSize)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
