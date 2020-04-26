<template>
  <v-card class="card-box" style="width: 400px;">
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col></v-col>
          <v-col cols="10">
            <v-text-field
              label="用户名"
              hide-details
              v-model="userInfo.username"
              :rules="usrRules"
              prepend-icon="mdi-account-circle-outline"
              clearable
            ></v-text-field>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col></v-col>
          <v-col cols="10">
            <v-text-field
              label="密码"
              hide-details
              v-model="userInfo.password"
              clearable
              prepend-icon="mdi-lock-outline"
              :rules="pswRules"
              :append-icon="showPsw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPsw ? 'text' : 'password'"
              @click:append="showPsw = !showPsw"
            ></v-text-field>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col></v-col>
          <v-col cols="10">
            <v-btn :loading="loading" block rounded color="primary" @click="onSubmit()">
              注册
            </v-btn>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<style lang="less" scoped>
@media (max-width: 400px) {
  .card-box {
    position: absolute;
    left:0%;
    top: 50%;
    -webkit-transform: translate(0%, -50%);
    -moz-transform: translate(0%, -50%);
    -ms-transform: translate(0%, -50%);
    -o-transform: translate(0%, -50%);
    transform: translate(0%, -50%);
  }
}

@media (min-width: 401px) {
  .card-box {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
</style>

<script>
import { mapActions } from 'vuex'
import { regist } from '@/api/user'
import { formatErrorMsg } from '@/libs/util'
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
      loading: false,
      showPsw: false,
      valid: false,
      usrRules: [
        v => !!v || 'Name is required',
      ],
      pswRules: [
        v => !!v || 'Password is required',
      ],
    }
  },
  methods: {
    onSubmit () {
      if (!this.$refs.form.validate()) return
      this.loading = true
      regist(this.userInfo).then(res => {
        this.loading = false
        this.$router.push({ name: 'login' })
      }).catch(err => {
        this.loading = false
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    }
  }
}
</script>
