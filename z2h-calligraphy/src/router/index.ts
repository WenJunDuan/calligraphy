import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/chinese/character',
    name: 'ChineseCharacter',
    component: () => import('@/pages/CharacterSheet.vue')
  },
  {
    path: '/chinese/poem',
    name: 'ChinesePoem',
    component: () => import('@/pages/PoetrySheet.vue')
  },
  {
    path: '/practice',
    name: 'PenControl',
    component: () => import('@/pages/PenControl.vue')
  },
  // 捕获所有未匹配路由，重定向到首页
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router