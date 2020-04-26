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
              <v-icon left>mdi-account-outline</v-icon>
              用户管理
            </v-tab>
            <v-tab>
              <v-icon left>mdi-account-group-outline</v-icon>
              关注/粉丝
            </v-tab>
            <v-tab>
              <v-icon left>mdi-text</v-icon>
              博客管理
            </v-tab>
            <v-tab>
              <v-icon left>mdi-comment-outline</v-icon>
              评论管理
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

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader,
    Following,
    KanBan
  },
  data () {
    return {
      activateTab: 'first'
    }
  },
  mounted () {

  }
}
</script>
