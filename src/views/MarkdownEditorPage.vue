<template>
  <div class="home">
    <MDEditor />
  </div>
</template>

<script>
// @ is an alias to /src
const MDEditor = () => import('@/components/MarkdownEditor.vue')

export default {
  name: 'MDEditorPage',
  components: {
    MDEditor
  }
}
</script>
