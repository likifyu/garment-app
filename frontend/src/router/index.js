/**
 * Vue Router 配置
 */

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/designs',
    name: 'DesignManage',
    component: () => import('../views/DesignManage.vue')
  },
  {
    path: '/designs/:id',
    name: 'DesignDetail',
    component: () => import('../views/DesignDetail.vue')
  },
  {
    path: '/patterns',
    name: 'PatternManage',
    component: () => import('../views/PatternManage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
