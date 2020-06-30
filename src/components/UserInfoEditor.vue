<template>
  <v-list three-line flat>
    <v-list-item>
      <v-list-item-avatar size="120" class="avatarback">
        <v-img
          :src="userInfo.profilePicturePath || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          alt="user"
          class="avatar"
        >
        </v-img>
        <v-dialog
          v-model="avatarDialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <p class="avatartext" v-on="on">上传图片</p>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">图片上传</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-file-input :loading="uploadingFile" v-model="uploadAvartar" show-size accept="image/*" label="选择图片文件"></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="() => { avatarDialog = false; uploadAvartar = null} ">取消</v-btn>
              <v-btn color="blue darken-1" text @click="onSubmitAvatar()">提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-subtitle style="font-size: 16pt; margin: 20px 0;">ID: {{userInfo.id}}</v-list-item-subtitle>
        <v-list-item-subtitle style="margin: 15px 0;" v-text="`关注 0 粉丝 0`"></v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-divider style="margin: 15px 0" />
          <v-form>
            <v-text-field
              v-model="userInfo.username"
              :counter="10"
              label="昵称"
              outlined
              shaped
              :readonly="!modifyMode"
            ></v-text-field>
            <v-text-field
              v-if="modifyMode"
              v-model="userInfo.email"
              label="邮箱"
              outlined
              shaped
              :loading="emailVerifyLoading"
              append-outer-icon="mdi-email-check-outline"
              @click:append-outer="verifyEmail()"
            ></v-text-field>
            <v-text-field
              v-else
              v-model="userInfo.email"
              label="邮箱"
              outlined
              shaped
              :readonly="!modifyMode"
              @click:append-outer="verifyEmail()"
            ></v-text-field>
            <v-textarea
              v-model="userInfo.description"
              label="个人简介"
              outlined
              shaped
              no-resize
              auto-grow
              :readonly="!modifyMode"
            ></v-textarea>
            <v-btn
              v-if="!modifyMode"
              color="primary"
              @click="modifyMode = !modifyMode"
            >
              修改用户资料
            </v-btn>

            <v-btn
              v-if="modifyMode"
              color="warning"
              @click="modifyMode = !modifyMode"
              style="margin-right: 10px;"
            >
              取消修改
            </v-btn>

            <v-btn
              v-if="modifyMode"
              color="success"
              @click="onSubmit()"
            >
              保存修改
            </v-btn>
          </v-form>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { emailVerificationSend } from '@/api/verification'
import { getUserInfo, modifyUserInfo } from '@/api/user'
import { QiniuModule } from '@/plugins/QiniuModule'

@Component
export default class UserInfoEditor extends Vue {
  userInfo : any = {
    id: '',
    username: '',
    password: '',
    profilePicturePath: '',
    email: '',
    description: ''
  }

  uploadAvartar : any = null

  modifyMode : boolean = false
  avatarDialog : boolean = false
  emailVerifyLoading : boolean = false

  qiniu : QiniuModule = null
  uploadingFile : boolean = false

  mounted () {
    this.qiniu = new QiniuModule()
    getUserInfo(this.$store.state.user.id).then(res => {
      Object.assign(this.userInfo, res.data)
    }).catch(err => {
      this.$emit('alertMsg', {
        message: err,
        type: 'error'
      })
    })
  }

  verifyEmail () {
    if (this.userInfo.email !== '') {
      this.emailVerifyLoading = true
      emailVerificationSend({
        email: this.userInfo.email
      }).then(res => {
        this.$emit('alertMsg', {
          message: '验证邮件发送成功，请到邮箱中查收',
          type: 'success'
        })
      }).catch(err => {
        this.$emit('alertMsg', {
          message: err,
          type: 'error'
        })
      }).finally(() => {
        this.emailVerifyLoading = false
      })
    }
  }

  onSubmit () {

  }

  onSubmitAvatar () {
    let fileName = this.uploadAvartar.name
    let extName = fileName.substring(fileName.lastIndexOf('.') + 1);
    let observer = {
      next: (res) => {
        this.uploadingFile = true
      },
      error: (err) => {
        this.uploadingFile = false
      },
      complete: (profilePicturePath, res) => {
        modifyUserInfo(this.userInfo.id, { profilePicturePath }).then(res => {
          this.userInfo.profilePicturePath = profilePicturePath
          this.$store.state.user.avatarImgPath = profilePicturePath
          this.uploadAvartar = null
          this.uploadingFile = false
          this.avatarDialog = false
        }).catch(err => {
          console.error(err)
        })
      }
    }
    this.qiniu.uploadFile(
      this.uploadAvartar,
      `${this.userInfo.username}-${new Date().getTime()}.${extName}`,
      observer
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatartext {
  position: absolute;
  width: 80px;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: white;
  visibility: hidden;
  cursor: pointer;
}
.avatartext:hover .avatar {
  filter: Alpha(Opacity=60);
  opacity: 0.6;
}
.avatarback:hover {
  background-color:#000;
}
.avatarback:hover .avatar{
  filter: Alpha(Opacity=60);
  opacity: 0.6;
}
.avatarback:hover .avatartext {
  visibility: visible;
}
</style>
