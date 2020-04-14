<template>
  <v-app-bar
    absolute
    color="white"
    hide-on-scroll
  >
    <v-toolbar-title>RGAN</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-text-field
      label="搜索..."
      clearable
      single-line
      v-model="searchValue"
      hide-details="true"
      append-icon="mdi-magnify"
      @click:append="search"
    ></v-text-field>

    <v-btn icon @click="detail">
      <v-icon>mdi-feather</v-icon>
    </v-btn>

    <v-menu 
      open-on-hover
      offset-y
      transition="slide-y-transition"
      close-delay="100"
      v-if="$store.state.user.token && $store.state.user.token !== ''">
      <template v-slot:activator="{ on }">
        <v-btn icon>
          <v-avatar size="38" v-on="on">
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
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

@Component
export default class MenuHeader extends Vue {

  searchValue : string = ''
  menuOptions : Array<any> = []

  mounted() {
    this.menuOptions = [
      {
        title: "个人信息",
        handler: () => {
          this.$router.push('/userinfo')
        }
      },
      {
        title: "退出登录",
        handler: () => {
          this.$store.dispatch('handleLogOut').then(res => {
            this.$router.push('/')
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.response.data.message
            })
          })
        }
      }
    ]
  }

  login () {
    this.$router.push('/login')
  }

  detail () {
    this.$router.push('/editor');
  }

  search () {
    this.$emit('search', this.searchValue)
  }
}
</script>
