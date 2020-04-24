<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <div id="kanban" v-on="on"></div>
    </template>
    <v-list>
      <v-list-item-group
        v-model="currentPath"
        color="indigo"
        mandatory
      >
        <v-list-item
          v-for="(item, i) in paths"
          :key="i"
          :value="item.path"
          @click="gotoPage(item.path)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.label"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-dialog>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#live2dcanvas {
  pointer-events: all !important;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
@Component
export default class KanBan extends Vue {
  dialog : boolean = false
  paths : any = [
    {
      path: '/',
      label: '主页'
    },
    {
      path: '/blog',
      label: '博客详情'
    },
    {
      path: '/userinfo',
      label: '个人主页'
    },
    {
      path: 'back',
      label: '后退'
    }
  ]
  currentPath: string = '/'

  gotoPage (path : string) {
    if (path !== this.$route.path) {
      if (path === 'back') {
        this.$router.go(-1)
      } else {
        this.$router.push(path)
      }
    }
  }

  mounted() {
    // L2Dwidget.init({
    //   pluginRootPath: "live2dw/",//资源root路径
    //   pluginJsPath: "lib/",//js相对root的路径
    //   pluginModelPath: "assets/",//模型相对root的路径
    //   tagMode: !1,
    //   debug: !1,
    //   model: {
    //     scale: 2,
    //     jsonPath: "live2dw/assets/asuna_33.model.json"
    //   },
    //   display: {
    //     position: "left",//定位
    //     width: 130,//宽度
    //     height: 210,//高度
    //     hOffset: -40,//左右
    //     vOffset: 0//上下
    //   },
    //   mobile: {
    //     show: !1
    //   },
    //   log: !1
    // })
    let $ = window.jQuery
    window.L2Dwidget.init({
      "display": {
        "superSample": 2,
        "width": 100,
        "height": 150,
        "position": "right",
        "hOffset": 0,
        "vOffset": 0
      },
      "modile": {
        "show": false
      }
    });
    $(document).ready(() => {
      $('#live2d-widget').appendTo($('#kanban')); 
      $('#live2dcanvas').on('click', () => {})
      this.currentPath = this.$route.path
    })
    
  }
}
</script>
