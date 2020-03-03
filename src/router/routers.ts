/ tslint:disable /
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
    path: '/verification/:mode/:action',
    name: 'verification',
    component: () => import('../views/VerificationPage.vue')
  }
]
