<template>
    <el-card>
      <h2>欢迎使用 IoT 后台管理系统</h2>
      <p>当前用户：{{ username }}({{ role }})</p>
    </el-card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const username = ref(localStorage.getItem('username') || '未知用户')
  const role = ref(localStorage.getItem('role') || '未知角色')
  </script>
  
  <style scoped>
  h2 {
    margin-bottom: 10px;
  }
  </style>
  