<template>
  <el-row :gutter="20" style="height: 60px; margin: 0px; ">
    <el-col :span="4">
      <p>RGAN</p>
    </el-col>
    <el-col :span="14">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <el-col :span="2">
      <el-button @click="() => { this.$router.push('/editor'); }">写博客</el-button>
    </el-col>
    <el-col :span="4">
      <div v-if="$store.state.currentUser.name !== ''">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <div class="user-box">
          <span>{{$store.state.currentUser.name}}</span>
        </div>
      </div>
      <div v-else>
        <el-button @click="Login">登录/注册</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.el-row {
  margin: 0;
}
.user-box {
  display: inline-block;
  width: calc(100% - 40px);
  height: 40px;
  text-align: center;
  position: relative;
}
.user-box span{
  position: absolute;
  left: 0%;
  top: 50%;
  -webkit-transform: translate(0%, -50%);
  -moz-transform: translate(0%, -50%);
  -ms-transform: translate(0%, -50%);
  -o-transform: translate(0%, -50%);
  transform: translate(0%, -50%);
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

@Component
export default class MenuHeader extends Vue {
  data() {
    return {
      searchValue: ""
    }
  }

  Login() {
    this.$router.push('/login')
  }
}
</script>