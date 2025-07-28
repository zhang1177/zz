<template>
  <el-container class="iot-layout">
    <!-- 顶部导航栏 -->
    <el-header class="top-header">
      <div class="header-left">
        <!-- 折叠按钮 -->
        <el-button
          circle
          size="small"
          class="collapse-btn"
          @click="toggleCollapse"
        >
          <el-icon><Menu /></el-icon>
        </el-button>
        <!-- 系统 Logo/名称 -->
        <div class="logo">
          <span class="logo-text">IoT后台管理系统</span>
        </div>
      </div>

      <div class="header-right">
        <el-dropdown>
          <div class="user-info">
            <el-avatar :size="32" :src="avatarUrl || defaultAvatar" style="cursor: pointer;" />
            <span class="nickname">{{ nickname }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>


    </el-header>

    <el-container>
      <!-- 左侧菜单：可折叠 -->
      <el-aside width="200px" class="aside-menu" :class="{ collapsed: isCollapse }">
        <el-menu
          class="side-menu"
          :default-active="$route.path"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          background-color="#fff"
          text-color="#333"
          active-text-color="#409eff"
          unique-opened
        >
          <!-- 用户管理 -->
          <el-menu-item index="/user-manage" v-if="role === 'admin' || role === 'manager'">
            <el-icon><User /></el-icon>
            <template #title>
              用户管理
            </template>
          </el-menu-item>

          <!-- MQTT用户管理 -->
          <el-menu-item index="/mqtt-user">
            <el-icon><Connection /></el-icon>
            <template #title>
              MQTT用户管理
            </template>
          </el-menu-item>

          <!-- MQTT访问控制 -->
          <el-menu-item index="/mqtt-acl">
            <el-icon><Lock /></el-icon>
            <template #title>
              MQTT访问控制
            </template>
          </el-menu-item>

          <!-- 设备管理 -->
          <el-menu-item index="/device-manage">
            <el-icon><Cellphone /></el-icon>
            <template #title>
              设备管理
            </template>
          </el-menu-item>


          <el-menu-item index="/sensor-manage">
            <el-icon><Cellphone /></el-icon>
            <template #title>
              传感器管理
            </template>
          </el-menu-item>

          <!-- 传感器数据管理 -->
          <el-menu-item index="/sensor-data">
            <el-icon><Monitor /></el-icon>
            <template #title>
              传感器数据管理
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容：面包屑 + 主内容 -->
      <el-container>
        <!-- 面包屑 -->
        <el-header height="auto" class="breadcrumb-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>

        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import { logout as logoutApi } from '@/api/user'
import { Menu, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 头像、昵称管理
const avatarUrl = ref(localStorage.getItem('avatarUrl') || '')
const nickname = ref(localStorage.getItem('nickname') || '访客')
const defaultAvatar = '/assets/images/default-avatar.png'

// 折叠状态
const isCollapse = ref(false)

// 当前路由与面包屑
const route = useRoute()
const breadcrumbList = computed(() => route.matched)

// 当前登录用户角色
const role = localStorage.getItem('role') || 'user'

// Vue Router
const router = useRouter()

// --- 方法区 ---

// 同步本地存储到状态
function syncProfile() {
  avatarUrl.value = localStorage.getItem('avatarUrl') || ''
  nickname.value = localStorage.getItem('nickname') || '访客'
}

// 折叠菜单
function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}

// 退出登录
async function logout() {
  try {
    await logoutApi()

    // 标记手动退出
    localStorage.setItem('isLoggingOut', 'true')

    // 清除本地信息
    localStorage.removeItem('token')
    localStorage.removeItem('uid')
    localStorage.removeItem('role')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('avatarUrl')
    localStorage.removeItem('nickname')

    ElMessage.success('您已退出登录')
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败：', error)
    ElMessage.error('退出失败，请稍后重试')
  }
}

// 跳转到用户中心
function goToProfile() {
  router.push('/user-center')
}

// 根据角色展示中文
function getRoleLabel(role) {
  switch (role) {
    case 'admin':
      return '超级管理员'
    case 'manager':
      return '管理员'
    case 'user':
      return '普通用户'
    default:
      return '访客'
  }
}

// --- 生命周期钩子 ---

onMounted(() => {
  window.addEventListener('storage', syncProfile)
})

onUnmounted(() => {
  window.removeEventListener('storage', syncProfile)
})
</script>


<style scoped>
.iot-layout {
  height: 100vh;
}

.top-header {
  background-color: #409eff; /* 蓝色顶栏 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

/* 折叠按钮，放在左上角 */
.collapse-btn {
  margin-left: 10px;
  margin-right: 10px;
  /* color: #fff; */
  border: none;
}

/* 系统标题LOGO */
.logo {
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.logo-text {
  font-size: 18px;
  letter-spacing: 1px; /* 文字间距 */
}

/* 顶栏右侧 */
.header-right {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.welcome-text {
  color: #fff;
}

.divider {
  height: 20px;
  border-color: rgba(255, 255, 255, 0.3);
  margin: 0 8px;
}

.logout-btn {
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
}

.logout-btn:hover {
  color: #ffd04b; /* 鼠标悬停时换高亮色 */
}

.logout-text {
  margin-left: 4px;
}


/* 左侧菜单样式 */
.aside-menu {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
}

/* 折叠时加个标记，若需要额外样式可以覆盖 */
.aside-menu.collapsed {
  width: 64px !important; /* 强制宽度，确保折叠状态下正常显示 */
}

/* el-menu 的自定义样式 */
.side-menu :deep(.el-menu-item) ,
.side-menu :deep(.el-sub-menu__title) {
  margin: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.side-menu :deep(.el-menu-item:hover),
.side-menu :deep(.el-sub-menu__title:hover){
  background-color: #f2f2f2;
}

.side-menu :deep(.el-menu-item.is-active),
.side-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title){
  background-color: #e6f7ff;
  color: #409eff !important;
  border-left: 3px solid #409eff;
}

/* 面包屑行 */
.breadcrumb-header {
  background-color: #f5f5f5;
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
}

/* 右侧主内容 */
.main-content {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 60px - 48px); /* 顶栏60px + 面包屑48px */
  box-sizing: border-box;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nickname {
  margin-left: 8px;
  color: #fff;
  font-size: 14px;
}

</style>
