<template>
  <div class="home">
    <MarkdownViewer :inputText="test" style="height: 100vh; width: 100vw"/>
  </div>
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
      test: ""
    }
  },
  mounted () {
    getBlogById(1).then(res => {
      this.test = res.data.content
    })
  }
}
</script>
