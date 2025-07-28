<template>
  <div class="login-page">
    <div class="dialog-wrapper">
      <div class="right-section">
        <div class="platform-title">IoT监控系统</div>
        
        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" class="login-form" @submit.prevent="handleLogin">
          <input class="input-field" type="text" placeholder="用户名" v-model="username" required />
          <input class="input-field" type="password" placeholder="密码" v-model="password" required />
          <div class="forgot-password">忘记密码？</div>
          <button class="login-btn" type="submit">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      activeTab: 'login'
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await login({ username: this.username, password: this.password })

        console.log('登录返回：', res)

        if (res.code === 200 && res.data && res.data.token) {
          const { token, uid, role, avatar, nickname } = res.data

          // 存储信息
          localStorage.setItem('token', token)
          localStorage.setItem('uid', uid)
          localStorage.setItem('role', role)
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('username', this.username)
          localStorage.setItem('avatarUrl', avatar || '') 
          localStorage.setItem('nickname', nickname) 

          ElMessage.success('登录成功！')
          this.$router.push('/') 
        } else {
          ElMessage.error(res.message || '登录失败，请检查账号密码')
        }
      } catch (error) {
        console.error('登录异常：', error)
        ElMessage.error('登录异常，请稍后再试')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.dialog-wrapper {
  width: 100%;
  height: 100%;
  max-width: 500px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.platform-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 6px rgba(74, 144, 226, 0.3);
}

.forgot-password {
  font-size: 13px;
  color: #999;
  text-align: right;
  margin-bottom: 20px;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #3578e5;
}

@media (max-width: 600px) {
  .dialog-wrapper {
    padding: 20px;
  }

  .platform-title {
    font-size: 24px;
  }

  .input-field {
    font-size: 14px;
  }

  .login-btn {
    font-size: 14px;
  }

  .forgot-password {
    font-size: 12px;
  }
}
</style>
