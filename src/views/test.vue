<template>
  <div class="about">
    <imageEditor />
  </div>
</template>

<script>
const imageEditor = () => import('@/components/ImageEditor')
export default {
  components: {
    imageEditor
  }
}
</script>