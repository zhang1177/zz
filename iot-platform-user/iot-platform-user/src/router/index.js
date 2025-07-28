import NotFound from '@/views/404.vue'
import Attendance from '@/views/Attendance.vue'
import Main from '@/views/Main.vue'
import SmartHome from '@/views/SmartHome.vue'
import Temperature from '@/views/Temperature.vue'

import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/attendance',
    children: [
      { path: 'attendance', component: Attendance },
      { path: 'temperature', component: Temperature },
      { path: 'smarthome', component: SmartHome },
      {
        path: '/profile',
        component: () => import('@/views/Profile.vue')
      }
      
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404' }
  },
  {
    path: '/403',
    name: 'NoPermission',
    component: () => import('@/views/403.vue'),
    meta: { title: '403 无权限' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  }  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('role')

  if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else if (to.path !== '/login' && !isLoggedIn) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    ElMessage.error('无权限访问该页面')
    next('/') 
  } else {
    next()
  }
})
export default router
