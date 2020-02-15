<template>
  <div class="home">
    <el-container style="margin: 0 auto; width: 85%;">
      <el-main>
        <el-row v-for="blog in blogList" v-bind:key="blog.id">
          <el-container>
            <el-aside width="50" style="text-align: center; border-right: 1px solid #ccc; padding-right: 10px; margin-right: 10px;">
              <el-row>
                <el-col :span="24" style="border-bottom: 1px solid #ccc; margin-bottom: 6px; padding-bottom: 6px;">
                  <span>{{blog.vote}}</span>
                  <br/>
                  <span>Votes</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span>{{blog.views}}</span>
                  <br/>
                  <span>Views</span>
                </el-col>
              </el-row>
            </el-aside>
            <el-main style="padding: 0;">
              <el-row>
                <el-col :span="24">
                  <span style="font-weight: bold; font-size: 14pt;" @click="$router.push({ name: 'blog', params: { id: blog.id }})">{{blog.title}}</span>
                </el-col>
              </el-row>
              <el-row style="margin: 5px 0 10px 0;">
                <el-col :span="24">
                  <span style="color: #ccc; font-size: 10pt;">{{ blog.content }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-tag
                    v-for="tag in blog.tags"
                    :key="tag.id"
                    type="normal"
                    size="mini"
                    style="margin-right: 3px;">
                    {{ tag.title }}
                  </el-tag>
                </el-col>
                <el-col :span="5">
                  <span>{{blog.date}}</span>
                </el-col>
                <el-col :span="4">
                  <span>{{blog.author}}</span>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
          <el-divider></el-divider>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getBlogList } from '@/api/data'

export default {
  name: 'BlogViewerPage',
  components: {
    MarkdownViewer
  },
  data() {
    return {
      test: "",
      blogList: []
    }
  },
  mounted () {
    getBlogList().then(res => {
      this.blogList = res.data || [{
        id: 0,
        title: "测试",
        content: "这是测试博客",
        tags: ["javascript", "test", "JAVA", "测试"],
        date: "2020-02-02 02:02",
        author: "admin",
        views: 20,
        vote: 10
      },{
        id: 1,
        title: "测试1",
        content: "这是测试博客1",
        tags: ["javascript", "test", "JAVA", "测试"],
        date: "2020-02-02 02:02",
        author: "admin",
        views: 20,
        vote: 10
      }]
    }).catch(err => {
      this.$message.error('获取博客列表失败')
    })
  }
}
</script>
