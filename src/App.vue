<template>
  <div id="app">
    <!-- <v-app class="bg-color"> -->
    <v-app>
      <Alert :type="alertType" :message="alertMsg" :msgId="alertId"/>
      <router-view @alertMsg="handleAlertMsg"></router-view>
      <v-footer
        class="font-weight-medium"
        color="#F7F8FA"
      >
        <v-col
          class="text-center"
          cols="12"
        >
          <span>©2020</span>
          &nbsp;&nbsp;&nbsp;
          <a style="color: black; text-decoration: none;" href="http://beian.miit.gov.cn/publish/query/indexFirst.action" rel="noreferrer" target="_blank">粤ICP备20048983号-1</a>
        </v-col>
      </v-footer>
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

  handleAlertMsg (data: any) {
    this.alertMsg = data.message
    this.alertType = data.type
    this.alertId++
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
