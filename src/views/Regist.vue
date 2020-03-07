<template>
  <el-card class="card-box">
    <el-container>
      <el-main>
        <el-form ref="userInfo" :model="userInfo" label-width="60px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="userInfo.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="onSubmit" :loading="loading">注 册</el-button>
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
import { regist } from '@/api/user'
export default {
  name: 'RegistPage',
  components: {

  },
  data () {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      regist(this.userInfo).then(res => {
        this.loading = false
        this.$router.push({ name: 'login' })
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'error',
          message: err.response.data.message
        })
      })
    }
  }
}
</script>
