<template>
  <div>
    <MenuHeader :refeshUnreadMsg="refeshUnreadMsg" v-bind="$attrs" v-on="$listeners"/>
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
              <v-tab>
                <v-icon :left="!mobileMode">mdi-heart-outline</v-icon>
                {{ mobileMode? '' : '收藏管理'}}
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
                  <v-tab>
                    点赞
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <TimelineForBlog @updateUnreadMsg="updateUnreadMsg" v-bind="$attrs" v-on="$listeners" />
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <TimelineForComment @updateUnreadMsg="updateUnreadMsg" v-bind="$attrs" v-on="$listeners" />
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <TimelineForVote @updateUnreadMsg="updateUnreadMsg" v-bind="$attrs" v-on="$listeners" />
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <BlogListForCurrentUser :userInfo="userInfo" :blogStatus="blogStatus.PUBLISHED" v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <CommentListForUser :userInfo="userInfo" :getData="getCommentData" v-bind="$attrs" v-on="$listeners" />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <FavouriteListForUser :userInfo="userInfo" v-bind="$attrs" v-on="$listeners" />
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
import { BLOG_STATUS } from '@/libs/constant'
import { getSelfComments } from '@/api/data'

const UserInfoEditor = () => import('@/components/UserInfoEditor')
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')
const Following = () => import('@/components/FollingUsers')
const BlogListForCurrentUser = () => import('@/components/BlogListForCurrentUser')
const FavouriteListForUser = () => import('@/components/FavouriteListForUser')
const CommentListForUser = () => import('@/components/CommentListForUser')
const TimelineForBlog = () => import('@/components/TimelineForBlog')
const TimelineForComment = () => import('@/components/TimelineForComment')
const TimelineForVote = () => import('@/components/TimelineForVote')

export default {
  name: 'UserInfoPage',
  components: {
    UserInfoEditor,
    MenuHeader,
    Following,
    KanBan,
    BlogListForCurrentUser,
    FavouriteListForUser,
    CommentListForUser,
    TimelineForBlog,
    TimelineForComment,
    TimelineForVote
  },
  data () {
    return {
      activateTab: 'first',
      mobileMode: false,
      userInfo: {},
      blogStatus: 0,
      refeshUnreadMsg: 0,
      blogStatus: BLOG_STATUS
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

    getCommentData (page, size) {
      return getSelfComments(page, size)
    },

    updateUnreadMsg () {
      this.refeshUnreadMsg = Math.random()
    }
  }
}
</script>
