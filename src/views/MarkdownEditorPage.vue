<template>
  <div class="home">
    <MDEditor msg="This is a markdown editor"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MDEditor from '@/components/MarkdownEditor.vue'

export default {
  name: 'MDEditorPage',
  components: {
    MDEditor
  }
}
</script>
