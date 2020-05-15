<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader v-bind="$attrs" v-on="$listeners"/>
      </v-col>
    </v-row>
    <v-row style="margin-top: 20px;">
      <v-col cols="12">
        <v-card>
          <v-tabs vertical>
            <v-tab>
              <v-icon :left="!mobileMode">mdi-account-outline</v-icon>
              {{ mobileMode? '' : '用户管理' }}
            </v-tab>
            <v-tab>
              <v-icon :left="!mobileMode">mdi-account-group-outline</v-icon>
              {{ mobileMode? '' : '关注/粉丝'}}
            </v-tab>
            <v-tab>
              <v-icon :left="!mobileMode">mdi-text</v-icon>
              {{ mobileMode? '' : '博客管理' }}
            </v-tab>
            <v-tab>
              <v-icon :left="!mobileMode">mdi-comment-outline</v-icon>
              {{ mobileMode? '' : '评论管理'}}
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <UserInfoEditor v-bind="$attrs" v-on="$listeners" />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <Following v-bind="$attrs" v-on="$listeners" />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <BlogListForUser :userInfo="{ username: $store.state.user.name, id: 0 }" v-bind="$attrs" v-on="$listeners" />
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <KanBan />
  </v-container>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
const UserInfoEditor = () => import('@/components/UserInfoEditor')
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')
const Following = () => import('@/components/FollingUsers')
const BlogListForUser = () => import('@/components/BlogListForUser')

import { isMobile } from '@/libs/util'

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader,
    Following,
    KanBan,
    BlogListForUser
  },
  data () {
    return {
      activateTab: 'first',
      mobileMode: false
    }
  },

  mounted () {
    this.mobileMode = isMobile()
  },

  methods: {
    
  }
}
</script>
