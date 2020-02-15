<template>
  <div id="app">
    <el-container>
      <el-header v-if="$route.name !== 'editor' && $route.name !== 'login'" style="padding: 0; z-index: 100;">
        <MenuHeader class="menu-style" />
      </el-header>
      <el-main style="padding: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MenuHeader from './components/MenuHeader.vue'

@Component({
  components: {
    MenuHeader
  }
})
export default class App extends Vue {}
</script>

<style lang="less">
.menu-style {
  padding: 10px 10%;
  width: 100%;
  position: fixed;
  top: 0px;
  border-bottom: 1px solid #ccc;
  background-color: white;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
