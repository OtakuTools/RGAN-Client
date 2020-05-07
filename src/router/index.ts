// import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import store from '@/store'
import { getToken, setToken } from '@/libs/util'
/ tslint:disable /

// Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const canTurnTo = (name : any, access : any, routes : any) => {
  return true
}

const HOME_PAGE_NAME = 'mainPage'
const BLOG_VIEWER_PAGE_NAME = 'blog'
const LOGIN_PAGE_NAME = 'login'
const VERIFIATION_PAGE_NAME = 'verification'
const REGIST_PAGE_NAME = 'regist'
const USERSPACE_PAGE_NAME = 'userspace'

const turnTo = (to : any, access : any, next : any) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (!token && to.name === REGIST_PAGE_NAME) {
    // 未登录且要跳转的页面是注册页
    next()
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: HOME_PAGE_NAME // 跳转到HOME_PAGE_NAME页
    })
  } else {
    let obj : any = store.state
    let user : any = obj.user
    if (user.hasGetInfo && token) {
      setToken(user.token)
      turnTo(to, user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next)
      }).catch(() => {
        setToken('')
        if (to.name === VERIFIATION_PAGE_NAME) {
          next()
        } else if (to.name === HOME_PAGE_NAME) {
          next()
        } else if (to.name === BLOG_VIEWER_PAGE_NAME) {
          next()
        } else if (to.name === USERSPACE_PAGE_NAME) {
          next()
        } else {
          next({
            name: HOME_PAGE_NAME // 跳转到HOME_PAGE_NAME页
          })
        }
      })
    }
  }
})

// router.beforeEach((to, from, next) => {
//   const token = getToken()
//   if (to.name === VERIFIATION_PAGE_NAME) {
//     // 未登陆且要跳转的页面是验证码信息
//     if (token) {
//       store.dispatch('getUserInfo').then(user => {
//         // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
//         next()
//       }).catch(() => {
//         setToken('')
//         next()
//       })
//     } else {
//       setToken('')
//       next()
//     }
//   } else if (to.name === HOME_PAGE_NAME) {
//     // 未登陆且要跳转的页面是主页
//     next() // 跳转
//   } else if (to.name === BLOG_VIEWER_PAGE_NAME) {
//     // 未登陆且要跳转的页面是主页
//     next() // 跳转
//   } else if (!token && to.name === REGIST_PAGE_NAME) {
//     // 未登录且要跳转的页面是注册页
//     next()
//   } else if (!token && to.name !== LOGIN_PAGE_NAME) {
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
//       name: HOME_PAGE_NAME // 跳转到HOME_PAGE_NAME页
//     })
//   } else {
//     let obj : any = store.state
//     let user : any = obj.user
//     if (user.hasGetInfo) {
//       turnTo(to, user.access, next)
//     } else {
//       store.dispatch('getUserInfo').then(user => {
//         // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
//         turnTo(to, user.access, next)
//       }).catch(() => {
//         setToken('')
//         next({
//           name: LOGIN_PAGE_NAME
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


const originalPush = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default router
