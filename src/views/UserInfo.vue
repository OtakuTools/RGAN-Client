<template>
  <div>
    <MenuHeader :refeshUnreadMsg="refeshUnreadMsg" :showNavDrawer="true" @handle-nav-drawer="handleNavDrawer" v-bind="$attrs" v-on="$listeners"/>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense nav>
        <v-list-item
          v-for="(item, idx) in items"
          :key="item.text"
          link
          @click="handleModuleChange(idx)"
        >
          <v-list-item-action>
            <v-icon v-bind:class="{'primary--text': idx === currentModule}">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-bind:class="{'primary--text': idx === currentModule}">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-card flat class="ma-2">
        <component
          :is="cptList[currentModule]"
          :userInfo="userInfo" v-bind="$attrs"
          v-on="$listeners"
          @update-unread-msg="updateUnreadMsg"
          :activatePostTab="activatePostTab"
        />
      </v-card>
    </v-content>
    <KanBan />
  </div>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import { isMobile } from '@/libs/util'

const UserInfoEditor = () => import('@/components/UserInfoEditor')
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')
const Following = () => import('@/components/FollingUsers')
const FavouriteListForUser = () => import('@/components/FavouriteListForUser')
const CommentListForUser = () => import('@/components/CommentListForUser')
const Timeline = () => import('@/views/Timeline')
const PersonalBlogs = () => import('@/views/PersonalBlogs')

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader,
    KanBan,
    Following,
    FavouriteListForUser,
    CommentListForUser,
    Timeline,
    PersonalBlogs
  },
  data () {
    return {
      activateModuleTab: 0,
      activatePostTab: 0,
      mobileMode: false,
      userInfo: {},
      refeshUnreadMsg: 0,

      cptList : [
        'UserInfoEditor',
        'Following',
        'Timeline',
        'PersonalBlogs',
        'CommentListForUser',
        'FavouriteListForUser',
      ],

      drawer: null,
      currentModule: 0,
      items: [
        { icon: 'mdi-account-outline', text: '用户管理' },
        { icon: 'mdi-account-group-outline', text: '关注/粉丝' },
        { icon: 'mdi-bell-outline', text: '关注动态' },
        { icon: 'mdi-text', text: '博客管理' },
        { icon: 'mdi-comment-outline', text: '评论管理' },
        { icon: 'mdi-heart-outline', text: '收藏管理' },
      ]
    }
  },

  mounted () {
    let params = this.$route.params
    this.mobileMode = isMobile()
    this.userInfo = {
      username: this.$store.state.user.name,
      id: this.$store.state.user.id
    }
    if (params.hasOwnProperty('module')) {
      this.currentModule = params.module
      this.activatePostTab = params.submodule
    }
  },

  methods: {

    handleNavDrawer() {
      this.drawer = !this.drawer
    },

    handleModuleChange(idx) {
      this.currentModule = idx
    },

    updateUnreadMsg() {
      this.refeshUnreadMsg = Math.random()
    }
  }
}
</script>
