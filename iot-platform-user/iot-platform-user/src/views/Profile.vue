<template>
    <div class="content">
      <div class="profile-container">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-item">
            <span class="item-label">用户名：</span>
            <span class="item-value">{{ username }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">昵称：</span>
            <span class="item-value">{{ nickname }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">班级：</span>
            <span class="item-value">{{ className }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">院系：</span>
            <span class="item-value">{{ department }}</span>
          </div>
          <el-divider />
          <div class="profile-actions">
            <el-button type="danger" plain @click="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { getProfile } from '@/api/user'; // 注意这里引入
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const username = ref('--')
  const nickname = ref('--')
  const className = ref('--')
  const department = ref('--')
  
  const logout = () => {
    localStorage.clear()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
  
  // 新增一个加载用户信息的方法
  const loadProfile = async () => {
    try {
      const res = await getProfile()
      if (res.code === 200) {
        const data = res.data
        username.value = data.username || '未设置'
        nickname.value = data.nickname || '访客'
        className.value = data.className || ' '
        department.value = data.department || ' '
      } else {
        ElMessage.error('获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息异常:', error)
      ElMessage.error('获取用户信息失败')
    }
  }
  
  onMounted(() => {
    loadProfile()
  })
  </script>
  
  
  <style scoped>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }
  h1 {
    font-size: 6vw;
    color: #29B6F6;
    margin: 2vh 0;
    text-align: center;
  }
  .profile-container {
    width: 90%;
    margin-top: 20px;
  }
  
  .profile-card {
    border-radius: 12px;
  }
  
  .profile-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 16px;
  }
  
  .item-label {
    color: #666;
  }
  
  .item-value {
    font-weight: bold;
    color: #333;
  }
  
  .profile-actions {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
  </style>
  