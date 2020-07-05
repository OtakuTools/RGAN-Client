<template>
  <div id="app">
    <!-- <v-app class="bg-color"> -->
    <v-app>
      <Alert :type="alertType" :message="alertMsg" :msgId="alertId"/>
      <router-view @alertMsg="handleAlertMsg"></router-view>
      <v-speed-dial
        v-model="fab"

        direction="top"
        open-on-hover="true"
        transition="slide-y-reverse-transition"
        style="position: fixed; right: 20px; bottom: 50px;"
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
            small
          >
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              color="indigo"
              v-bind="attrs"
              v-on="on"
              @click.stop="showMessage"
            >
              <v-icon>mdi-bug</v-icon>
            </v-btn>
          </template>
          <span>反馈bug</span>
        </v-tooltip>

        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              color="red"
              v-bind="attrs"
              v-on="on"
              @click.stop="showMessage"
            >
              <v-icon>mdi-alert</v-icon>
            </v-btn>
          </template>
          <span>投诉</span>
        </v-tooltip>
      </v-speed-dial>

      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline lighten-2"
            primary-title
          >
            反馈渠道
          </v-card-title>

          <v-card-text>
            请发送邮件至 <strong>otakutools@163.com</strong> 进行反馈<br/>
            网站管理员将尽快给予答复
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
const Alert = () => import('@/components/Alert.vue')

@Component({
  components: {
    Alert
  }
})
export default class App extends Vue {
  alertType : string = 'success'
  alertMsg : string = ''
  alertId : number = 0
  fab : boolean = false
  dialog : boolean = false

  handleAlertMsg (data: any) {
    this.alertMsg = data.message
    this.alertType = data.type
    this.alertId++
  }

  showMessage () {
    this.dialog = true
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.bg-color {
  background-color: #F7F8FA !important;
}
</style>
