import NotFound from '@/views/404.vue'
import DeviceManage from '@/views/DeviceManage.vue'
import Main from '@/views/Main.vue'
import MqttAcl from '@/views/MqttAcl.vue'
import MqttUser from '@/views/MqttUser.vue'
import SensorManage from '@/views/SensorManage.vue'
import UserManage from '@/views/UserManage.vue'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import SensorData from '@/views/SensorData.vue'

const routes = [
  {
    path: '/',
    component: Main,
    meta: { title: '首页' }, 
    children: [
      {
        path: '', 
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'user-manage',
        name: 'UserManage',
        component: UserManage,
        meta: {
          title: '用户管理',
          roles: ['admin','manager']
        }
      },
      {
        path: 'mqtt-user',
        name: 'MqttUser',
        component: MqttUser,
        meta: {
          title: 'MQTT 用户管理',
          // roles: ['admin','manager'] // 只有 admin 可以访问
        }
      },
      {
        path: 'mqtt-acl',
        name: 'MqttAcl',
        component: MqttAcl,
        meta: {
          title: 'MQTT 访问控制',
          // roles: ['admin','manager'] // 只有 admin 可以访问
        }
      },
      {
        path: 'device-manage',
        name: 'DeviceManage',
        component: DeviceManage,
        meta: { title: '设备管理' }
      },
      {
        path: 'sensor-manage',
        name: 'SensorManage',
        component: SensorManage,
        meta: { title: '传感器管理' },
      },
      {
        path: 'sensor-data',
        name: 'SensorData',
        component: SensorData,
        meta: { title: '传感器数据' }
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        component: () => import('@/views/UserCenter.vue'),
        meta: { title: '个人中心' }
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
  const userRole = localStorage.getItem('role') // admin / user

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