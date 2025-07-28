<!-- BottomTabBar.vue -->
<template>
  <el-footer class="bottom-bar">
    <div class="tabbar-wrapper">
      <div
        v-for="item in tabs"
        :key="item.index"
        :class="['tabbar-item', { active: item.index === activeIndex }]"
        @click="handleSelect(item.index)"
      >
        <el-icon :size="24">
          <component :is="item.icon"></component>
        </el-icon>
        <div class="tabbar-label">{{ item.label }}</div>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: String,
    default: '1'
  }
})

const router = useRouter()

const handleSelect = (index) => {
  const tab = props.tabs.find(item => item.index === index)
  if (tab && tab.route) {
    router.push(tab.route)
  }
}
</script>

<style scoped>
.bottom-bar {
  background: #fff;
  border-top: 1px solid #eee;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.tabbar-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.tabbar-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tabbar-item .el-icon {
  margin-bottom: 4px;
}

.tabbar-label {
  margin-top: 2px;
}

.tabbar-item.active {
  color: #409EFF;
}
</style>
