<template>
  <el-container class="iot-layout">
    <TopBar :title="pageTitle" />
    
    <router-view />

    <BottomTabBar :tabs="tabItems" :activeIndex="activeIndex" />
  </el-container>
</template>

<script setup>
import BottomTabBar from '@/components/BottomTabBar.vue'
import TopBar from '@/components/TopBar.vue'
import { HomeFilled, Operation, Tools, UserFilled } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabItems = [
  { index: '1', label: '考勤监控', icon: HomeFilled, route: '/attendance' },
  { index: '2', label: '温湿度监控', icon: Operation, route: '/temperature' },
  { index: '3', label: '智能家居监控', icon: Tools, route: '/smarthome' },
  { index: '4', label: '我的', icon: UserFilled, route: '/profile' }
]

const pageTitle = computed(() => {
  if (route.path.includes('attendance')) return '考勤监控系统'
  if (route.path.includes('temperature')) return '温湿度监控系统'
  if (route.path.includes('smarthome')) return '智能家居监控系统'
  if (route.path.includes('profile')) return '我的'
  return '考勤监控系统'
})

const activeIndex = computed(() => {
  if (route.path.includes('attendance')) return '1'
  if (route.path.includes('temperature')) return '2'
  if (route.path.includes('smarthome')) return '3'
  if (route.path.includes('profile')) return '4'
  return '1'
})
</script>

<style scoped>
.iot-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
