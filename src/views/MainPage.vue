<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <MenuHeader @search="handleSearch"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list two-line flat style="padding-top: 20px;">
          <v-list-item-group
            multiple
          >
            <template v-for="(blog, index) in blogList">
              <v-list-item :key="blog.id" @click="handleSelected(blog.id)">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-text="blog.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="blog.summary"></v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip-group
                        column
                      >
                        <v-chip v-for="tag in blog.tags" :key="tag.id" x-small>
                          {{ tag.title }}
                        </v-chip>
                      </v-chip-group>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-chip-group
                        column
                        disabled
                      >
                        <v-chip tile outlined small label>
                          <v-icon left small>mdi-account</v-icon>
                          {{blog.authorName}}
                        </v-chip>
                        <v-chip outlined small label>
                          <v-icon left small>mdi-calendar</v-icon>
                          {{blog.createdTime.replace("T", " ")}}
                        </v-chip>

                        <v-chip outlined small label>
                          <v-icon left small>mdi-thumb-up</v-icon>
                          {{blog.voteCount}}
                        </v-chip>

                        <!-- <v-chip outlined small label>
                          <v-icon left small>mdi-eye</v-icon>
                          {{blog.visitorCount}}
                        </v-chip> -->
                      </v-chip-group>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-divider
                v-if="index + 1 < blogList.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-pagination
        v-model="currentPage"
        :length="blogList.length / currentPageSize"
        :total-visible="7"
        circle
      ></v-pagination>
    </v-row>
    <KanBan />
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
} */
</style>

<script>
// @ is an alias to /src
import { getBlogList, searchBlog } from '@/api/data'
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')

export default {
  name: 'BlogViewerPage',
  components: {
    MenuHeader,
    KanBan
  },
  data () {
    return {
      blogList: [],
      currentPage: 1,
      currentPageSize: 10,
      selected: null
    }
  },
  mounted () {
    getBlogList().then(res => {
      let data = res.data.content
      this.blogList = data.map(item => {
        let dataFormat = {
          id: 0,
          title: '',
          content: '',
          summary: '',
          tags: [],
          createdTime: '2020-02-02 02:02',
          authorName: 'admin',
          voteCount: 0,
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
    },
    handleSelected(id) {
      this.$router.push({ name: 'blog', query: { id }})
    },
    handleSearch(val) {
      searchBlog(val).then(res => {
        this.blogList = res.data.content.map(item => {
          let dataFormat = {
            id: 0,
            title: '',
            content: '',
            summary: '',
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
    }
  }
}
</script>
