<template>
  <v-tabs>
    <v-tab>
      已发布
    </v-tab>
    <v-tab>
      草稿箱
    </v-tab>
    <v-tab>
      已删除
    </v-tab>
    <v-tab-item>
      <v-card flat>
        <BlogListForCurrentUser :userInfo="userInfo" :blogStatus="blogStatus.PUBLISHED" v-bind="$attrs" v-on="$listeners" />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <BlogListForCurrentUser :userInfo="userInfo" :blogStatus="blogStatus.DRAFT" v-bind="$attrs" v-on="$listeners" />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <BlogListForCurrentUser :userInfo="userInfo" :blogStatus="blogStatus.DELETED" v-bind="$attrs" v-on="$listeners" />
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { BLOG_STATUS } from '@/libs/constant'
const BlogListForCurrentUser = () => import('@/components/BlogListForCurrentUser')
export default {
  name: 'PersonalBlogs',
  components: {
    BlogListForCurrentUser
  },
  data: () => ({
    blogStatus: BLOG_STATUS
  }),

  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          username: '',
          id: 0
        }
      }
    }
  },

  mounted () {
    
  }
}
</script>