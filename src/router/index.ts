import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const canTurnTo = (name : any, access : any, routes : any) => {
  return true
}

const homeName = 'mainPage'
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to : any, access : any, next : any) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}
const token = ""

// router.beforeEach((to, from, next) => {
//   const token = store.state.user.token
//   if (!token && to.name !== LOGIN_PAGE_NAME) {
//     // 未登录且要跳转的页面不是登录页
//     next({
//       name: LOGIN_PAGE_NAME // 跳转到登录页
//     })
//   } else if (!token && to.name === LOGIN_PAGE_NAME) {
//     // 未登陆且要跳转的页面是登录页
//     next() // 跳转
//   } else if (token && to.name === LOGIN_PAGE_NAME) {
//     // 已登录且要跳转的页面是登录页
//     next({
//       name: homeName // 跳转到homeName页
//     })
//   } else {
//     if (store.state.user.hasGetInfo) {
//       turnTo(to, store.state.user.access, next)
//     } else {
//       store.dispatch('getUserInfo').then(user => {
//         // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
//         turnTo(to, user.access, next)
//       }).catch(() => {
//         // setToken('')
//         next({
//           name: 'login'
//         })
//       })
//     }
//   }
// })

router.afterEach(to => {
  // setTitle(to, router.app)
  // iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

