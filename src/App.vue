<template>
  <!-- <div id="app">
    <router-view></router-view>
  </div> -->
  <div id="app">
    <v-app>
      <Alert :type="alertType" :message="alertMsg" :msgId="alertId"/>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件，比如 Home！ -->
          <router-view @alertMsg="handleAlertMsg"></router-view>
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
        <router-view @alertMsg="handleAlertMsg"></router-view>
      </router-view>
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

  handleAlertMsg ( data: any ) {
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
</style>
