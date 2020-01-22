<template>
  <el-container>
    <el-header>
      <!-- 标题 -->
      <el-form :inline="true" ref="blogInfo" :model="blogInfo" label-width="80px">
        <el-form-item label="博客标题">
          <el-input v-model="blogInfo.blogTitle" placeholder="请输入标题..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <!-- <el-main>
        <mavon-editor style="height: 100%" v-model="blogInfo.blogContent"/>
      </el-main> -->
      <el-aside id="test" width="50%" style="border: 1px solid #ccc; overflow: hidden;">
        <MonacoEditor @on-content-change="handleCodeChange" :resize="onResize" style="height: calc(100vh - 85px)" />
      </el-aside>
      <el-main width="50%" style="border: 1px solid #ccc; overflow: hidden;">
        <div v-html="blogMdText" style="height: calc(100vh - 85px)" v-highlight></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import * as MD from 'markdown-it'
import * as monaco from 'monaco-editor'
import MonacoEditor from './MonacoEditor.vue'
import mavonEditor from 'mavon-editor'
import { test } from '@/api/data'

@Component({
  components: {
    MonacoEditor
  }
})
export default class MDEditor extends Vue {
  blogInfo = {
    blogTitle: '',
    blogContent: ''
  }

  blogMdText = ''

  MdEditor = null
  erd = null

  onResize = false

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.blogInfo.blogContent)
  }
  
  handleCodeChange(val) {
    this.blogInfo.blogContent = val
    this.MdTranslationFunc()
  }

  onSubmit() {
    test().then(res => {
      console.log(res)
    }).catch(error => {
      console.error(error)
    })
  }

  mounted () {
    // this.MdEditor = new MD()
    this.MdEditor = mavonEditor.markdownIt
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('./../editor-styles/style-vue/vue.css');
</style>
