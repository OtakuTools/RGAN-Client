<template>
  <!-- <div id="app">
    <router-view></router-view>
  </div> -->
  <div id="app">
    <v-app>
      <Alert :type="alertType" :message="alertMsg" />
      <router-view @alertMsg="handleAlertMsg"></router-view>
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

  handleAlertMsg ( data: any ) {
    this.alertMsg = data.message
    this.alertType = data.type
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
