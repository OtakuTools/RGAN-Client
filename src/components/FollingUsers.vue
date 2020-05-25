<template>
  <v-tabs
    right
  >
    <v-tab>
      关注
    </v-tab>
    <v-tab>
      粉丝
    </v-tab>
    <v-tab-item>
      <v-list two-line>
        <v-list-item v-for="following in followings" :key="following.id">
          <v-list-item-avatar>
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt="user"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{following.username}}
              <!-- <v-icon size="20" color="green lighten-1" style="margin-left: 10px">mdi-account-convert-outline</v-icon> -->
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="unfollowUser(following.id)">
              <v-icon color="red lighten-1">mdi-account-minus-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-pagination
        v-model="f_ing_page"
        :length="f_ing_totalPages"
        :total-visible="7"
        @input="handlePageChange_ing"
        @next="handleNextPage_ing"
        @previous="handlePrevPage_ing"
      ></v-pagination>
    </v-tab-item>
    <v-tab-item>
      <v-list two-line>
        <v-list-item v-for="follower in followers" :key="follower.id">
          <v-list-item-avatar>
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt="user"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="follower.username"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="followUser(follower.id)">
              <v-icon color="primary lighten-1">mdi-account-plus-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-pagination
        v-model="f_er_page"
        :length="f_er_totalPages"
        :total-visible="7"
        @input="handlePageChange_er"
        @next="handleNextPage_er"
        @previous="handlePrevPage_er"
      ></v-pagination>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getFollowers, getFollowings, unfollowUser, followUser } from '@/api/follow'

@Component
export default class FollowingUser extends Vue {
  followings : any = []
  followers : any = []

  f_ing_page: number = 1
  f_ing_totalPages: number = 1
  f_er_page: number = 1
  f_er_totalPages: number = 1
  pageSize : number = 10

  mounted () {
    this.getFollowings()
    this.getFollowers()
  }

  getFollowers () : void {
    getFollowers(this.$store.state.user.id, this.f_er_page - 1, this.pageSize).then(res => {
      this.followers = res.data.content
      this.f_er_totalPages = res.data.totalPages
    }).catch(err => {
      console.error(err)
    })
  }

  getFollowings () : void {
    getFollowings(this.$store.state.user.id, this.f_ing_page - 1, this.pageSize).then(res => {
      this.followings = res.data.content
      this.f_ing_totalPages = res.data.totalPages
    }).catch(err => {
      console.error(err)
    })
  }

  followUser (id : number) : void {
    followUser(id).then(res => {
      this.getFollowings()
      this.$emit('alertMsg', {
        message: '关注用户成功',
        type: 'success'
      })
    }).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }

  unfollowUser (id : number) : void {
    unfollowUser(id).then(res => {
      this.getFollowings()
      this.$emit('alertMsg', {
        message: '取消关注成功',
        type: 'success'
      })
    }).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }

  handlePageChange_ing (val) : void {
    this.f_ing_page = val
    this.getFollowings()
  }

  handlePrevPage_ing () : void {
    this.getFollowings()
  }

  handleNextPage_ing () : void {
    this.getFollowings()
  }

  handlePageChange_er (val) : void {
    this.f_er_page = val
    this.getFollowers()
  }

  handlePrevPage_er () : void {
    this.getFollowers()
  }

  handleNextPage_er () : void {
    this.getFollowers()
  }
}
</script>
