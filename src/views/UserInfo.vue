<template>
  <div>
    <MenuHeader v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container>
        <v-card>
          <v-card-text style="padding: 0 16px 16px 0">
            <v-tabs vertical>
              <v-tab>
                <v-icon :left="!mobileMode">mdi-account-outline</v-icon>
                {{ mobileMode? '' : '用户管理' }}
              </v-tab>
              <v-tab>
                <v-icon :left="!mobileMode">mdi-account-group-outline</v-icon>
                {{ mobileMode? '' : '关注/粉丝'}}
              </v-tab>
              <v-tab>
                <v-icon :left="!mobileMode">mdi-bell-outline</v-icon>
                {{ mobileMode? '' : '关注动态'}}
              </v-tab>
              <v-tab>
                <v-icon :left="!mobileMode">mdi-text</v-icon>
                {{ mobileMode? '' : '博客管理' }}
              </v-tab>
              <v-tab>
                <v-icon :left="!mobileMode">mdi-comment-outline</v-icon>
                {{ mobileMode? '' : '评论管理'}}
              </v-tab>
              <v-tab-item>
                <v-card flat>
                  <UserInfoEditor v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <Following v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-tabs right>
                  <v-tab>
                    博客
                  </v-tab>
                  <v-tab>
                    评论
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <TimelineForBlog v-bind="$attrs" v-on="$listeners" />
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <TimelineForComment v-bind="$attrs" v-on="$listeners" />
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <BlogListForUser :userInfo="userInfo" :getData="getBlogData()" v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <CommentListForUser :userInfo="userInfo" :getData="getCommentData()" v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
    <KanBan />
  </div>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import { isMobile } from '@/libs/util'
import { getSelfBlogs, getSelfComments } from '@/api/data'

const UserInfoEditor = () => import('@/components/UserInfoEditor')
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')
const Following = () => import('@/components/FollingUsers')
const BlogListForUser = () => import('@/components/BlogListForUser')
const CommentListForUser = () => import('@/components/CommentListForUser')
const TimelineForBlog = () => import('@/components/TimelineForBlog')
const TimelineForComment = () => import('@/components/TimelineForComment')

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader,
    Following,
    KanBan,
    BlogListForUser,
    CommentListForUser,
    TimelineForBlog,
    TimelineForComment
  },
  data () {
    return {
      activateTab: 'first',
      mobileMode: false,
      userInfo: {},
      blogStatus: 0
    }
  },

  mounted () {
    this.mobileMode = isMobile()
    this.userInfo = {
      username: this.$store.state.user.name,
      id: this.$store.state.user.id
    }
  },

  methods: {
    getBlogData () {
      return (page, size) => {
        return getSelfBlogs(this.blogStatus, page, size)
      }
    },

    getCommentData () {
      return (page, size) => {
        return getSelfComments(page, size)
      }
    }
  }
}
</script>
