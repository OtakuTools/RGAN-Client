<template>
  <div class="hello">
    {{msg}}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import * as MD from 'markdown-it'

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  @Emit()
  tryMd (text: string) {
    let temp = new MD()
    console.log(temp.render(text))
  }
  
  mounted () {
    this.tryMd('# hello world')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
