<template>
  <el-container>
    <el-header style="position: fixed; width: 100vw; padding: 0; z-index: 100;">
      <MenuHeader class="menu-style" />
    </el-header>
    <el-main style="padding: 0; margin: 60px auto 10px auto; width: 85%;">
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
        <MarkdownViewer :inputText="blogInfo.content" />
        <el-divider />
        <BlogComment :blogId ="blogId" />
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
import { getBlogById } from '@/api/data'
const MarkdownViewer = () => import('@/components/MarkdownViewer')
const BlogComment = () => import('@/components/BlogComment')
const MenuHeader = () => import('@/components/MenuHeader')

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer,
    MenuHeader,
    BlogComment
  },
  data () {
    return {
      blogId: 0,
      blogInfo: {}
    }
  },
  mounted () {
    this.blogId = parseInt(this.$route.query.id)
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
