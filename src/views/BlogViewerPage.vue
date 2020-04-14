<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <MenuHeader />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div style="padding-top: 20px;">
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
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>
/* .menu-style {
  padding: 10px 10%;
  width: 100%;
  position: fixed;
  top: 0px;
  border-bottom: 1px solid #ccc;
  background-color: white;
} */
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
