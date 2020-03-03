<template>
  <div class="home">
    <el-container style="margin: 65px auto 0 auto; width: 85%;">
      <el-main style="padding: 0">
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

</style>

<script>
// @ is an alias to /src
import { getBlogList } from '@/api/data'
import { getUserInfo } from '@/api/user'
import UserInfoEditor from '@/components/UserInfoEditor'

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor
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
