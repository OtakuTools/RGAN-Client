import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import hljs from 'highlight.js'

import axios from 'axios'
import VueAxios from 'vue-axios'
// import vuetify from '@/plugins/vuetify'
// import Vuetify from 'vuetify'
// const Vuetify = require('vuetify')

// Vue.use(ELEMENT)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.directive('highlight', {
  // 被绑定元素插入父节点时调用
  inserted: function (el) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      hljs.highlightBlock(block)
    })
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated: function (el) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      hljs.highlightBlock(block)
    })
  }
})

new Vue({
  router,
  store,
  vuetify: window.Vuetify,
  components: {
    App
  },
  template: '<App/>'
  // render: h => h(App)
}).$mount('#app')
