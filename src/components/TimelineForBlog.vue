<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-timeline align-top dense>
          <v-timeline-item
            v-for="(info, index) in infoList"
            :key="index"
            :icon="info.read? 'mdi-alert-circle-check-outline': 'mdi-alert-circle-outline'"
            :color="info.read? 'green lighten-1': 'red lighten-1'"
            fill-dot
          >
            <v-card class="elevation-2">
              <v-card-title class="headline">
                <a @click="$router.push({ name: 'userspace', query: { name: info.authorName }})">{{info.authorName}}</a>
                <v-spacer></v-spacer>
                <span class="text--secondary" style="margin-right: 10px; font-size: 11pt;">{{info.modifiedTime.replace('T', ' ')}}</span>
                <v-btn icon>
                  <v-icon color="red lighten-1">mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                更新：<a class="black--text" style="font-size: 13pt" @click="$router.push({ name: 'blog', query: { id: info.id }})"><strong>{{info.title}}</strong></a>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
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

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getTimelineForBlog, updateReadStatus } from '@/api/timeline'

@Component
export default class TimelineForBlog extends Vue {
  infoList : Array<any> = []
  currentPage : number = 1
  currentPageSize : number = 10
  totalPages : number = 1
  totalElements : number = 0

  mounted () {
    this.refreshInfo()
  }

  refreshInfo (page: number = 0, size: number = 0) {
    getTimelineForBlog(page, size).then(res => {
      let data : any = res.data.content
      // let ids : Array<number> = data.map(item => item.id)
      this.infoList = data
      this.totalPages = res.data.totalPages
      // updateReadStatus(ids).then(res => {}).catch(err => {})
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
