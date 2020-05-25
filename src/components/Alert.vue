<template>
  <v-alert
    max-width="600"
    :type="type"
    elevation="2"
    :value="showAlert"
    transition="slide-y-transition"
    class="alertBox">
    {{ message }}
  </v-alert>
</template>

<style lang="less" scoped>
.alertBox {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100000;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

@Component
export default class Alert extends Vue {
  @Prop({ default: '', type: String }) type!: string;
  @Prop({ default: '', type: String }) message!: string;
  @Prop({ default: 3000, type: Number }) delay!: number;
  @Prop({ default: 0, type: Number }) msgId!: number;

  showAlert : boolean = false

  show () {
    this.showAlert = true
    setTimeout(() => {
      this.showAlert = false
    }, this.delay)
  }

  @Watch('msgId')
  handleMsgIdChange (newVal : string) {
    this.show()
  }
}
</script>
