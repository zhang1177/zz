<script setup>
import { changePassword, getProfile, updateProfile, uploadAvatar } from '@/api/user'
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const classOptions = [
  '2022级物联网工程1班',
  '2022级物联网工程2班',
]

const departmentOptions = [
  '软件学院',
  '电子与通信学院',
  '机械学院',
  '计算机科学与技术学院'
]

const router = useRouter()
const user = ref({
  avatar: '',
  nickname: '',
  email: '',
  phone: '',
  className: '',
  department: ''
})
const defaultAvatar = '/assets/images/default-avatar.png'
const fileInput = ref(null)
const userForm = ref()

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: false, message: '请输入电话', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '电话格式错误', trigger: ['blur', 'change'] }
  ]
}

const loadProfile = async () => {
  const res = await getProfile()
  if (res.code === 200) {
    user.value = res.data || {}
  }
}

const saveProfile = async () => {
  try {
    const res = await updateProfile(user.value)
    if (res.code === 200) {
      ElMessage.success('资料更新成功')
      localStorage.setItem('avatarUrl', user.value.avatar || '')
      localStorage.setItem('nickname', user.value.nickname || '')
      router.back()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新异常：', error)
    
    if (error?.response?.data) {
      const errors = error.response.data
      const firstField = Object.keys(errors)[0]
      const firstMessage = errors[firstField]?.[0]?.message || '提交失败'
      ElMessage.error(firstMessage)
    } else {
      ElMessage.error('服务器异常，请稍后再试')
    }
  }
}


const triggerUpload = () => {
  fileInput.value.click()
}

const handleAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const res = await uploadAvatar(formData)
  if (res.code === 200) {
    user.value.avatar = res.data
    ElMessage.success('头像更新成功')
    localStorage.setItem('avatarUrl', res.data)
  } else {
    ElMessage.error(res.message || '头像上传失败')
  }
}

const cancelEdit = () => {
  router.back()
}

onMounted(() => {
  loadProfile()
})

const passwordDialogVisible = ref(false)

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const passwordFormRef = ref()

const openPasswordDialog = () => {
  passwordDialogVisible.value = true
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}

const handleChangePassword = async () => {
  await passwordFormRef.value.validate()
  const res = await changePassword({
    oldPassword: passwordForm.value.oldPassword,
    newPassword: passwordForm.value.newPassword
  })
  if (res.code === 200) {
    ElMessage.success('密码修改成功，请重新登录')
    passwordDialogVisible.value = false

    localStorage.clear()
    router.push('/login')
  } else {
    ElMessage.error(res.message || '密码修改失败')
  }
}

</script>

<template>
  <div class="user-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="title">用户中心</div>
          <el-button link type="primary" @click="cancelEdit">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>

      <div class="avatar-section">
        <el-avatar :src="user.avatar || defaultAvatar" size="large" style="cursor:pointer" @click="triggerUpload" />
        <input ref="fileInput" type="file" style="display: none" @change="handleAvatarChange" accept="image/*" />
        <div class="avatar-tip">点击头像更换</div>
      </div>

      <el-form :model="user" :rules="rules" ref="userForm" label-width="100px" class="user-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="user.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="user.phone" placeholder="请输入电话" />
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="user.className" placeholder="请选择班级">
                <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="院系">
            <el-select v-model="user.department" placeholder="请选择院系">
              <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存修改</el-button>
          <el-button type="warning" @click="openPasswordDialog" style="margin-left: 12px;">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-center {
  padding: 20px;
}
.box-card {
  max-width: 900px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.avatar-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
.user-form {
  margin-top: 20px;
}
</style>
