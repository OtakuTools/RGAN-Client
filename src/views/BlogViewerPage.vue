<template>
  <el-container>
    <el-header style="position: fixed; width: 100vw; padding: 0; z-index: 100;">
      <MenuHeader class="menu-style" />
    </el-header>
    <el-main style="padding: 0; margin: 60px auto 0 auto; width: 85%;">
      <div>
        <h1>{{blogInfo.title}}</h1>
        <el-tag
          v-for="tag in blogInfo.tags"
          :key="tag.id"
          type="normal"
          size="mini"
          style="margin-right: 3px;">
          {{ tag.title }}
        </el-tag>
        <el-divider />
        <MarkdownViewer :inputText="blogInfo.content"/>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.menu-style {
  padding: 10px 10%;
  width: 100%;
  position: fixed;
  top: 0px;
  border-bottom: 1px solid #ccc;
  background-color: white;
}
</style>

<script>
// @ is an alias to /src
import MarkdownViewer from '@/components/MarkdownViewer'
import MenuHeader from '@/components/MenuHeader'
import { getBlogById } from '@/api/data'

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer,
    MenuHeader
  },
  data () {
    return {
      blogInfo: ''
    }
  },
  mounted () {
    getBlogById(this.$route.query.id).then(res => {
      this.blogInfo = res.data
    }).catch(err => {
      this.$message({
        message: err.response.data.message,
        type: 'error'
      })
    })
  }
}
</script>
