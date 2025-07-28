<template>
    <el-header class="top-bar">
      <div class="top-bar-inner">
        <span class="top-bar-title">{{ title }}</span>
        <!-- 右侧不放退出了，留空或者后续放别的 -->
        <div class="top-bar-right"></div>
      </div>
    </el-header>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .top-bar {
    height: 64px;
    background: linear-gradient(90deg, #409EFF 0%, #66b1ff 100%);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .top-bar-inner {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .top-bar-title {
    font-size: 20px;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  .top-bar-right {
    width: 40px; /* 保持左右对称布局 */
  }
  </style>
  