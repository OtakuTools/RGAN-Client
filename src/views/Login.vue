<template>
  <el-card class="card-box">
    <el-container>
      <el-main>
        <el-form ref="userInfo" :model="userInfo" label-width="60px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.user"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="userInfo.pswd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="onSubmit">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-card>
</template>

<style lang="less" scoped>
.card-box {
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginPage',
  components: {
    
  },
  data () {
    return {
      userInfo: {
        user: '',
        pswd: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setCurrentUser',
    ]),
    onSubmit () {
      this.setCurrentUser({
        name: "Login_user_" + Math.floor((Math.random()*10) + 1)
      })
      this.$router.push('/')
    }
  }
}
</script>