export default [
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
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import('../views/Regist.vue')
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('../views/UserInfo.vue')
  },
  {
    path: '/userspace',
    name: 'userspace',
    component: () => import('../views/UserBlogList.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/verification/:mode',
    name: 'verification',
    component: () => import('../views/VerificationPage.vue')
  }
]
