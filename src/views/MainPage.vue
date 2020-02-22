<template>
  <div class="home">
    <el-container style="margin: 0 auto; width: 85%;">
      <el-main>
        <el-row v-for="blog in blogList" v-bind:key="blog.id">
          <el-container>
            <el-aside style="width: 50px; text-align: center; border-right: 1px solid #ccc; margin-right: 10px;">
              <el-row style="height: calc(50% - 1px)">
                <el-col :span="24" style="height:100%;">
                  <div style="height: 40px;" class="view-vote-style">
                    <span>{{blog.upvoteCount}}</span>
                    <br/>
                    <span>Votes</span>
                  </div>
                </el-col>
              </el-row>
              <div style="width: 100%; height: 1px; background-color:#ccc; margin: 0"></div>
              <el-row style="height: calc(50% - 1px);">
                <el-col :span="24" style="height:100%;">
                  <div style="height: 40px;" class="view-vote-style">
                    <span>{{blog.visitorCount}}</span>
                    <br/>
                    <span>Views</span>
                  </div>
                </el-col>
              </el-row>
            </el-aside>
            <el-main style="padding: 15px 0px;">
              <el-row>
                <el-col :span="24">
                  <span style="font-weight: bold; font-size: 14pt;" class="blog-title" @click="$router.push({ name: 'blog', query: { id: blog.id }})">{{blog.title}}</span>
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
          <div style="width: 100%; height: 1px; background-color:#ccc; margin: 0"></div>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.view-vote-style {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.blog-title:hover {
  color: #F56C6C;
  cursor: pointer;
}
</style>

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
      this.blogList = res.data.map(item => {
        let dataFormat = {
          id: 0,
          title: "",
          content: "",
          tags: [],
          date: "2020-02-02 02:02",
          author: "admin",
          upvoteCount: 0,
          visitorCount: 0
        }
        Object.assign(dataFormat, item)
        return dataFormat
      })
    }).catch(err => {
      this.$message.error('获取博客列表失败')
    })
  }
}
</script>
