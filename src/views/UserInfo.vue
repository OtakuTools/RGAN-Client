<template>
  <div class="home">
    <el-container>
      <el-header style="position: fixed; width: 100vw; padding: 0; z-index: 100;">
        <MenuHeader class="menu-style" />
      </el-header>
      <el-main style="padding: 0; margin: 65px auto 0 auto; width: 85%;">
        <el-tabs v-model="activateTab" type="border-card" tab-position="left" style="height: calc(100vh - 80px)">
          <el-tab-pane label="用户管理" name="first">
            <UserInfoEditor />
          </el-tab-pane>
          <el-tab-pane label="博客管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="博客设置" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.menu-style {
  padding: 10px 10%;
  width: 100%;
  position: fixed;
  top: 0px;
  border-bottom: 1px solid #ccc;
  background-color: white;
}
</style>

<script>
// @ is an alias to /src
import { getBlogList } from '@/api/data'
import { getUserInfo } from '@/api/user'
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
