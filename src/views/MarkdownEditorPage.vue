<template>
  <div class="home">
    <MDEditor />
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
