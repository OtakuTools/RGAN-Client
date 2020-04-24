<template>
  <v-card class="card-box">
    <v-container>
      <v-row>
        <v-col :span="24">目前验证的内容: {{mode}}</v-col>
      </v-row>
      <v-row>
        <v-col :span="24">收到的验证信息: {{uuid}}</v-col>
      </v-row>
      <v-row>
        <v-col :span="24">
          验证状态: <v-btn :color="status === 'success' ? 'success' : (status === 'loading' ? 'primary' : 'error')" :loading="loading">{{status === 'success' ? '验证成功' : (status === 'loading' ? '验证中' : '验证失败')}}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
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
      this.$emit('alertMsg', {
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
