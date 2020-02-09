import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'mainPage',
    component: () => import('../views/MainPage.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/MarkdownEditorPage.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogViewerPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

