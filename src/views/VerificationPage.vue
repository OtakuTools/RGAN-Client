<template>
  <el-card class="card-box">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">目前验证的内容: {{mode}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">收到的验证信息: {{uuid}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            验证状态: <el-button :type="status === 'success' ? 'success' : (status === 'loading' ? 'primary' : 'danger')" :loading="loading">{{status === 'success' ? '验证成功' : (status === 'loading' ? '验证中' : '验证失败')}}</el-button>
          </el-col>
        </el-row>
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
import { emailVerificationReceive } from '@/api/verification'
export default {
  name: 'VerificationPage',
  components: {

  },
  data () {
    return {
      mode: '',
      uuid: '',
      status: 'loading',
      loading: false
    }
  },
  mounted () {
    this.mode = this.$route.params.mode
    this.uuid = this.$route.query.token
    this.status = 'loading'
    this.loading = true
    emailVerificationReceive({
      token: this.uuid
    }).then(res => {
      this.status = 'success'
    }).catch(err => {
      this.status = 'error'
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {

  }
}
</script>
