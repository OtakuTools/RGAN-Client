import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import hljs from 'highlight.js'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.directive('highlight', {
  // 被绑定元素插入父节点时调用
  inserted: function (el) {
    let blocks = el.querySelectorAll('pre code')
    for (let i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i])
    }
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated: function (el) {
    let blocks = el.querySelectorAll('pre code')
    for (let i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i])
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
