<template>
  <el-container>
    <el-header>
      <!-- 标题 -->
      <el-row>
        <el-col :span="24">
          <el-form ref="blogInfo" :model="blogInfo" label-width="80px">
            <el-form-item label="博客标题">
              <el-input v-model="blogInfo.blogTitle" placeholder="请输入标题..."></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="50%" style="border: 1px solid #ccc; overflow: hidden;">
        <MonacoEditor @on-content-change="handleCodeChange" style="height: calc(100vh - 85px)" />
      </el-aside>
      <el-main width="50%" style="border: 1px solid #ccc; overflow: hidden; padding: 5px 10px;">
        <div v-html="blogMdText" style="height: calc(100vh - 85px)"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import * as MD from 'markdown-it'
import * as monaco from 'monaco-editor'
import MonacoEditor from './MonacoEditor.vue'

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

  MdTranslationFunc () {
    this.blogMdText = this.MdEditor.render(this.blogInfo.blogContent)
  }
  
  handleCodeChange(val) {
    this.blogInfo.blogContent = val
    this.MdTranslationFunc()
  }

  mounted () {
    this.MdEditor = new MD()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
