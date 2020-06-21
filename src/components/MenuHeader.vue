<template>
  <v-app-bar
    color="white"
    hide-on-scroll
    elevation="1"
    app
  >
    <v-toolbar-title style="cursor: pointer;" @click="$router.push('/')">RGAN</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-text-field
      label="搜索..."
      clearable
      single-line
      v-model="searchValue"
      hide-details
      append-icon="mdi-magnify"
      @click:append="search"
    ></v-text-field>

    <v-btn icon @click="openEditor">
      <v-icon>mdi-feather</v-icon>
    </v-btn>

    <v-menu
      open-on-hover
      offset-y
      transition="slide-y-transition"
      close-delay="100"
    >
      <template v-slot:activator="{ on }">
        <v-badge
          color="error"
          dot
          :value="hasUnreadMsg"
          offset-x="20"
          offset-y="15"
          overlap
        >
          <v-btn icon v-on="on">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list>
        <v-list-item
          @click="$router.push({name: 'userinfo', params: { module: 2, submodule: 1}})"
        >
          <v-list-item-title>
            评论数
            <v-chip v-if="notifications.comment" color="error" x-small>
              {{notifications.comment}}
            </v-chip>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="$router.push({name: 'userinfo', params: { module: 2, submodule: 2}})"
        >
          <v-list-item-title>
            点赞数
            <v-chip v-if="notifications.vote" color="error" x-small>
              {{notifications.vote}}
            </v-chip>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      open-on-hover
      offset-y
      transition="slide-y-transition"
      close-delay="100"
      v-if="userInfo.hasGetInfo && userInfo.token && userInfo.token !== ''">
      <template v-slot:activator="{ on }">
        <v-btn icon>
          <v-avatar size="38" v-on="on">
            <img
              :src="userInfo.avatarImgPath || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              alt="user"
            >
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuOptions"
          :key="index"
          @click="item.handler"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn icon v-else @click="login">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { mapActions } from 'vuex'
import { formatErrorMsg } from '@/libs/util'
import { getTimelineNews } from '@/api/timeline'

@Component
export default class MenuHeader extends Vue {
  @Prop({ default: 0, type: Number }) refeshUnreadMsg: number;

  searchValue : string = ''
  menuOptions : Array<any> = []
  notifications : any = {
    vote: 0,
    comment: 0
  }
  hasUnreadMsg: boolean = false
  evtSrc: any = null
  sseRtryTimes: number = 3
  userInfo : any = this.$store.state.user

  mapActions

  mounted () {
    this.menuOptions = [
      {
        title: '个人信息',
        handler: () => {
          this.$router.push('/userinfo')
        }
      },
      {
        title: '退出登录',
        handler: () => {
          this.$store.dispatch('handleLogOut').then(res => {
            this.$router.push('/')
          }).catch(err => {
            this.$emit('alertMsg', formatErrorMsg(err))
          })
        }
      }
    ]
    this.notifications = {
      comment: 0,
      vote: 0
    }

    this.getTimelineInfo()
    this.initSSE()
  }

  getTimelineInfo () {
    if (this.userInfo.hasGetInfo && this.userInfo.token) {
      getTimelineNews().then(res => {
        let data : any = res.data
        this.hasUnreadMsg = data.upVoteNum || data.commentNum
        this.notifications = {
          comment: data.commentNum,
          vote: data.upVoteNum
        }
      }).catch(err => {
        if (err.response.status === 401) {
          this.$store.dispatch('handleLogOut').then(res => {
            this.$router.push('/')
          }).catch(err => {
            this.$emit('alertMsg', formatErrorMsg(err))
          })
        }
      })
    }
  }

  initSSE() {
    let toString : any = Object.prototype.toString
    if (!!window.EventSource && this.userInfo.hasGetInfo && this.userInfo.token) {
      this.evtSrc = new EventSource('/api/notification/connect')
      this.evtSrc.onopen = (event) => {
        this.sseRtryTimes = 3
      }

      this.evtSrc.addEventListener('blog_vote', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        this.notifications.vote += 1
        this.hasUnreadMsg = true
      }, false)

      this.evtSrc.addEventListener('blog_vote_withdraw', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        if (this.notifications.vote > 0) {
          this.notifications.vote -= 1
          this.hasUnreadMsg = this.notifications.vote || this.notifications.comment
        }
      }, false)

      this.evtSrc.addEventListener('comment_vote', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        this.notifications.vote += 1
        this.hasUnreadMsg = true
      }, false)

      this.evtSrc.addEventListener('comment_vote_withdraw', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        if (this.notifications.vote > 0) {
          this.notifications.vote -= 1
          this.hasUnreadMsg = this.notifications.vote || this.notifications.comment
        }
      }, false)

      this.evtSrc.addEventListener('comment_new', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        this.notifications.comment += 1
        this.hasUnreadMsg = true
      }, false)

      this.evtSrc.addEventListener('comment_withdraw', (event) => {
        let data = event.data
        if (toString.call(event.data) === '[object String]') {
          data = JSON.parse(data)
        }
        if (this.notifications.comment > 0) {
          this.notifications.comment -= 1
          this.hasUnreadMsg = this.notifications.vote || this.notifications.comment
        }
      }, false)

      this.evtSrc.addEventListener('heart_beat', (event) => {
        console.log('keep sse alive')
      }, false)

      this.evtSrc.onerror = (event) => {
        this.evtSrc.close()
        if (this.sseRtryTimes > 0) {
          setTimeout(() => {
            this.sseRtryTimes--;
            this.initSSE();
          }, 1000)
        }
      }
    }
  }

  beforeDestroy () {
    this.evtSrc && this.evtSrc.close()
  }

  notification () {
    this.$router.push('/userinfo')
  }

  login () {
    this.$router.push('/login')
  }

  openEditor () {
    this.$router.push('/editor')
  }

  search () {
    this.$emit('search', this.searchValue)
  }

  @Watch('refeshUnreadMsg')
  handleUnreadMsg(newVal: boolean) {
    this.getTimelineInfo()
  }
}
</script>
