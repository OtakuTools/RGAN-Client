<template>
  <v-container style="height:100%">
    <v-row style="height: 100%" align="center">
      <v-col cols="12">
        <v-row
          justify="center"
          class="#F7F8FA5"
        >
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
                    <v-switch
                      dense
                      hide-details
                      v-model="userInfo.rememberMe"
                      label="记住我"
                    ></v-switch>
                  </v-col>
                  <v-col></v-col>
                </v-row>
                <v-row>
                  <v-col></v-col>
                  <v-col cols="10">
                    <v-btn block rounded color="primary" @click="onSubmit()">
                      登录
                    </v-btn>
                  </v-col>
                  <v-col></v-col>
                </v-row>
                <v-row>
                  <v-col></v-col>
                  <v-col cols="10">
                    <v-btn x-small text @click="$router.push('/regist')" style="float: right;">没有账号？去注册</v-btn>
                  </v-col>
                  <v-col></v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="less" scoped>
// @media (max-width: 400px) {
//   .card-box {
//     position: absolute;
//     left:0%;
//     top: 50%;
//     -webkit-transform: translate(0%, -50%);
//     -moz-transform: translate(0%, -50%);
//     -ms-transform: translate(0%, -50%);
//     -o-transform: translate(0%, -50%);
//     transform: translate(0%, -50%);
//   }
// }

// @media (min-width: 401px) {
//   .card-box {
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     -webkit-transform: translate(-50%, -50%);
//     -moz-transform: translate(-50%, -50%);
//     -ms-transform: translate(-50%, -50%);
//     -o-transform: translate(-50%, -50%);
//     transform: translate(-50%, -50%);
//   }
// }
</style>

<script>
import { mapActions } from 'vuex'
import { formatErrorMsg } from '@/libs/util'
export default {
  name: 'LoginPage',
  components: {

  },
  data () {
    return {
      userInfo: {
        username: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      showPsw: false,
      valid: false,
      usrRules: [
        v => !!v || 'Name is required'
      ],
      pswRules: [
        v => !!v || 'Password is required'
      ]
    }
  },
  methods: {
    onSubmit () {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.$store.dispatch('handleLogin', this.userInfo).then(res => {
        this.loading = false
        this.$router.push('/')
      }).catch(err => {
        this.loading = false
        this.$emit('alertMsg', formatErrorMsg(err))
      })
    }
  }
}
</script>
