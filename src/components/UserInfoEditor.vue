<template>
  <el-container>
    <el-main>
      <h1>用户信息绑定</h1>
      <el-form ref="userInfo" :model="userInfo" label-width="80px">
        <el-form-item label="用户邮箱">
          <el-input v-model="userInfo.email" style="width: 300px"></el-input>
          <el-button type="text" @click="verifyEmail" style="margin-left: 10px">验证邮箱</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <h1>用户基础信息</h1>
      <el-form ref="userInfo" :model="userInfo" label-width="80px">
        <el-form-item label="用户头像">
          <el-avatar :size="100" :src="userInfo.avatarUrl" fit="scale-down"></el-avatar>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="userInfo.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { emailVerificationSend } from '@/api/verification'
import { getUserInfo } from '@/api/user'
/ tslint:disable /

@Component
export default class UserInfoEditor extends Vue {
  userInfo = {
    username: '',
    password: '',
    avatarUrl: '',
    email: '',
    description: ''
  }

  mounted () {
    getUserInfo(this.$store.state.user.id).then(res => {
      console.log(res.data)
    }).catch(err => {
      this.$message.error(err)
    })
  }

  verifyEmail () {
    if (this.userInfo.email !== '') {
      emailVerificationSend({
        email: this.userInfo.email
      }).then(res => {
        this.$message({
          message: '验证邮件发送成功，请到邮箱中查收',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
      })
    }
  }

  onSubmit () {
    console.log(this.userInfo)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
