<template>
  <div class="login-page">
    <div class="dialog-wrapper">
      <div class="left-section">
        <!-- <div class="promo-text">
          新用户注册即可获得<br />
          <span class="highlight">试用下载权益</span>
        </div>
        <div class="promo-count">30<span class="small-text">张</span></div> -->
      </div>

      <div class="right-section">
        <div class="platform-title">IoT后台管理系统</div>
        <div class="tabs">
          <span
            :class="{ 'active-tab': activeTab === 'login', tab: activeTab !== 'login' }"
            @click="activeTab = 'login'"
          >登录</span>
          <span
            :class="{ 'active-tab': activeTab === 'register', tab: activeTab !== 'register' }"
            @click="activeTab = 'register'"
          >注册</span>
        </div>

        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" class="login-form" @submit.prevent="handleLogin">
          <input class="input-field" type="text" placeholder="用户名" v-model="username" required />
          <input class="input-field" type="password" placeholder="密码" v-model="password" required />
          <div class="forgot-password">忘记密码？</div>
          <button class="login-btn" type="submit">登录</button>
        </form>

        <!-- 注册表单 -->
        <form v-else class="register-form" @submit.prevent="handleRegister">
          <input class="input-field" type="text" placeholder="用户名" v-model="registerUsername" required />
          <input class="input-field" type="password" placeholder="密码" v-model="registerPassword" required />
          <!-- <div class="verification-container">
            <input class="input-field verification-field" type="text" placeholder="验证码" required />
            <button type="button" class="get-code-btn">获取验证码</button>
          </div> -->
          <div class="agreement">
            <input type="checkbox" id="agreement" v-model="agreementChecked"/>
            <label for="agreement">
              &nbsp;&nbsp;我已阅读并同意
              <span class="link">隐私政策</span> 与
              <span class="link">用户协议</span>
              的全部内容，<br>&nbsp;&nbsp;同意接受上述协议的全部内容。
            </label>
          </div>
          <button class="register-btn" type="submit" :class="{ 'active-register': agreementChecked }">注册</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      registerUsername: '',
      registerPassword: '',
      agreementChecked: false,
      activeTab: 'login'
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await login({ username: this.username, password: this.password })

        console.log('登录返回：', res)

        // 正确判断：token 在 res.data 中
        if (res.code === 200 && res.data && res.data.token) {
          const { token, uid, role, avatar, nickname } = res.data

          // 存储信息
          localStorage.setItem('token', token)
          localStorage.setItem('uid', uid)
          localStorage.setItem('role', role)
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('username', this.username)
          localStorage.setItem('avatarUrl', avatar || '') // ⭐⭐ 正确存进去
          localStorage.setItem('nickname', nickname || '') // 顺便把昵称也存一下

          ElMessage.success('登录成功！')

          if (role === 'admin') {
            this.$router.push('/dashboard')
          } else {
            this.$router.push('/dashboard') // 普通用户也是首页
          }
        } else {
          ElMessage.error(res.message || '登录失败，请检查账号密码')
        }
      } catch (error) {
        console.error('登录异常：', error)
        ElMessage.error('登录异常，请稍后再试')
      }
    },
    async handleRegister() {
      if (!this.agreementChecked) {
        ElMessage.warning('请先阅读并同意相关协议')
        return
      }

      if (!this.registerUsername || !this.registerPassword) {
        ElMessage.error('用户名和密码不能为空')
        return
      }

      try {
        const res = await register({
          username: this.registerUsername,
          password: this.registerPassword
        })

        if (res.code === 200) {
          ElMessage.success('注册成功，请登录')
          this.activeTab = 'login'
          this.username = this.registerUsername
          this.password = this.registerPassword
        } else {
          ElMessage.error(res.message || '注册失败')
        }
      } catch (err) {
        console.error('注册异常：', err)
        ElMessage.error('注册异常，请稍后再试')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-wrapper {
  width: 860px;
  height: 500px;
  background: #fff;
  display: flex;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.left-section {
  width: 45%;
  background: url('@/assets/images/login-bg.png') no-repeat center center;
  background-size: cover;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.right-section {
  width: 55%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
}

.platform-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

.tabs {
  margin-bottom: 25px;
  font-size: 18px;
  text-align: center;
}

.tab,
.active-tab {
  cursor: pointer;
  margin: 0 20px;
  padding-bottom: 8px;
}

.active-tab {
  border-bottom: 3px solid #f05b50;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
}

.input-field:focus {
  border-color: #f05b50;
  box-shadow: 0 0 6px rgba(240, 91, 80, 0.3);
}

.forgot-password {
  font-size: 13px;
  color: #999;
  cursor: pointer;
  text-align: right;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #f05b50;
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #c02430;
}

.verification-container {
  display: flex;
  align-items: center;
}

.verification-field {
  flex: 1;
}

.get-code-btn {
  margin-left: 10px;
  margin-top: -10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  background-color: #f5f5f5;
  font-size: 14px;
}

.agreement {
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: #666;
  margin: 10px 0;
}

.agreement .link {
  color: #f05b50;
  cursor: pointer;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #aaa; /* 默认灰色 */
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: not-allowed;
  transition: background-color 0.3s;
}

/* 勾选协议后变为登录按钮风格 */
.register-btn.active-register {
  background-color: #f05b50;
  cursor: pointer;
}

.register-btn.active-register:hover {
  background-color: #c02430;
}
</style>
