<template>
  <v-tabs right v-model="currentTab">
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
</template>

<script>
const TimelineForBlog = () => import('@/components/TimelineForBlog')
const TimelineForComment = () => import('@/components/TimelineForComment')
const TimelineForVote = () => import('@/components/TimelineForVote')

export default {
  name: 'Timeline',

  data: () => ({
    currentTab: 0
  }),

  props: {
    activatePostTab: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },

  components: {
    TimelineForBlog,
    TimelineForComment,
    TimelineForVote
  },

  methods: {
    updateUnreadMsg () {
      this.$emit('update-unread-msg')
    }
  },

  mounted () {
    this.currentTab = this.activatePostTab
  },

  watch: {
    'activatePostTab' (n, o) {
      this.currentTab = n
    }
  }
}
</script>