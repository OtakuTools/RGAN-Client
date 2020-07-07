export default [
  {
    path: '/',
    name: 'mainPage',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/MainPage.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/MarkdownEditorPage.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/BlogViewerPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/regist',
    name: 'regist',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Regist.vue')
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/UserInfo.vue')
  },
  {
    path: '/userspace',
    name: 'userspace',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/UserBlogList.vue')
  },
  {
    path: '/verification/:mode',
    name: 'verification',
    component: () => import('../views/VerificationPage.vue')
  }
]
