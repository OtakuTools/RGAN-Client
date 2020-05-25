<template>
  <MDEditor v-bind="$attrs" v-on="$listeners" style="background-color:white"/>
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
