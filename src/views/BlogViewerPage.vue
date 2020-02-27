<template>
  <el-container style="margin: 60px auto; width: 85%;">
    <el-main style="padding: 0">
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

<script>
// @ is an alias to /src
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getBlogById } from '@/api/data'

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer
  },
  data() {
    return {
      blogInfo: ""
    }
  },
  mounted () {
    getBlogById(this.$route.query.id).then(res => {
      this.blogInfo = res.data
    }).catch(err => {
      this.$message.error("获取博客信息失败")
    })
  }
}
</script>
