<template>
  <div>
    <MenuHeader @search="handleSearch" v-bind="$attrs" v-on="$listeners"/>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="3" style="text-align: center;">
            <v-card>
              <v-card-text>
                <v-avatar
                  class="profile"
                  size="100"
                >
                  <v-img :src="userInfo.profilePicturePath || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></v-img>
                </v-avatar>
                <v-list-item
                  color="rgba(0, 0, 0, .4)"
                  style="padding: 0"
                >
                  <v-list-item-content>
                    <v-list-item-title class="title">{{userInfo.username}}</v-list-item-title>
                    <v-list-item-subtitle style="margin-top: 10px">
                      <v-btn block :color="isFollowing ? 'error' : 'primary'" @click="handleFollow()">
                        <v-icon left v-if="isFollowing">mdi-minus</v-icon>
                        <v-icon left v-else>mdi-plus</v-icon>
                        {{isFollowing ? "取 关": "关 注"}}
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="9">
            <v-card>
              <v-card-text style="padding-top: 0">
                <BlogListForUser :userInfo="userInfo" :getData="getData" v-bind="$attrs" v-on="$listeners"/>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <KanBan v-if="false" />
  </div>
</template>

<style scoped>

</style>

<script>
// @ is an alias to /src
import { getBlogByAuthor } from '@/api/data'
import { getUserInfoByName } from '@/api/user'
import { followUser, unfollowUser, checkIsFollowing } from '@/api/follow'
const MenuHeader = () => import('@/components/MenuHeader')
const KanBan = () => import('@/components/KanBan')
const BlogListForUser = () => import('@/components/BlogListForUser')

export default {
  name: 'BlogViewerPage',
  components: {
    MenuHeader,
    KanBan,
    BlogListForUser
  },
  data () {
    return {
      userInfo: {},
      selected: null,

      isFollowing: false,
      needLogIn: false
    }
  },
  mounted () {
    getUserInfoByName(this.$route.query.name).then(res => {
      this.userInfo = res.data
      if (this.$store.state.user.token) {
        checkIsFollowing(this.userInfo.id).then(res => {
          this.isFollowing = res.data
        }).catch(err => {

        })
      }
    })
  },
  methods: {
    getData(page, size) {
      return getBlogByAuthor(this.userInfo.username, page, size)
    },

    handleFollow () {
      if (!this.$store.state.user.token) {
        this.$router.push({ name: 'login' })
      } else {
        let msg = {}
        if (this.isFollowing) {
          unfollowUser(this.userInfo.id).then(res => {
            this.isFollowing = false
            msg = {
              message: '取关用户成功',
              type: 'success'
            }
          }).catch(err => {
            msg = {
              message: '取关用户失败',
              type: 'error'
            }
          }).finally(() => {
            this.$emit('alertMsg', msg)
          })
        } else {
          followUser(this.userInfo.id).then(res => {
            this.isFollowing = true
            msg = {
              message: '关注用户成功',
              type: 'success'
            }
          }).catch(err => {
            msg = {
              message: '关注用户失败',
              type: 'error'
            }
          }).finally(() => {
            this.$emit('alertMsg', msg)
          })
        }
      }
    }
  }
}
</script>
