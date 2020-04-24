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
      <v-list>
        <v-list-item v-for="following in followings" :key="following.id">
          <v-list-item-content>
            <v-list-item-avatar>

            </v-list-item-avatar>
            <v-list-item-title v-text="following.id"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-tab-item>
    <v-tab-item>
      <v-list>
        <v-list-item v-for="follower in followers" :key="follower.id">
          <v-list-item-content>
            <v-list-item-avatar>

            </v-list-item-avatar>
            <v-list-item-title v-text="follower.id"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn @click="followU">关注</v-btn>
      <v-btn @click="unfollowU">取关</v-btn>
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
  
  mounted () {
    getFollowers(this.$store.state.user.id).then(res => {
      console.log(res.data)
      this.followers = res.data.content
    }).catch(err => {
      console.error(err)
    })

    getFollowings(this.$store.state.user.id).then(res => {
      console.log(res.data)
      this.followings = res.data.content
    }).catch(err => {
      console.error(err)
    })
  }

  unfollow (id : number) {
    unfollowUser(id).then(res => {
      
    }).catch(err => {
      console.error(err)
    })
  }

  followU() {
    followUser(1).then(res => {console.log(res.data)}).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }

  unfollowU() {
    unfollowUser(1).then(res => {console.log(res.data)}).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }
}
</script>