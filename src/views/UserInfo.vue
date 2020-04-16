<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-tabs vertical style="padding-top: 20px;">
            <v-tab>
              <v-icon left>mdi-account</v-icon>
              用户管理
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <UserInfoEditor />
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
const UserInfoEditor = () => import('@/components/UserInfoEditor')
const MenuHeader = () => import('@/components/MenuHeader')

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader
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
