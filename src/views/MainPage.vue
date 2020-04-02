<template>
  <div class="home">
    <el-container>
      <el-header style="position: fixed; width: 100vw; padding: 0; z-index: 100;">
        <MenuHeader class="menu-style" />
      </el-header>
      <el-main style="padding: 0; margin: 60px auto 0 auto; width: 85%;">
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
                  <span style="color: #ccc; font-size: 10pt;">{{ blog.content.substr(0, 50) }}</span>
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
      <el-footer style="text-align: center">
        <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="blogList.length">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
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
import { getBlogList } from '@/api/data'
import MenuHeader from '@/components/MenuHeader'

export default {
  name: 'BlogViewerPage',
  components: {
    MenuHeader
  },
  data () {
    return {
      blogList: [],
      currentPage: 1,
      currentPageSize: 10
    }
  },
  mounted () {
    getBlogList().then(res => {
      this.blogList = res.data.content.map(item => {
        let dataFormat = {
          id: 0,
          title: '',
          content: '',
          tags: [],
          date: '2020-02-02 02:02',
          author: 'admin',
          upvoteCount: 0,
          visitorCount: 0
        }
        Object.assign(dataFormat, item)
        return dataFormat
      })
    }).catch(err => {
      this.$message.error('获取博客列表失败')
    })
  },
  methods: {
    handlePageSizeChange (val) {
      this.currentPageSize = val
    },
    handlePageChange (val) {
      this.currentPage = val
    }
  }
}
</script>
