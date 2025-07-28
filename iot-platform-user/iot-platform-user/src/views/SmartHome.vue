<template>
  <div class="content">
    <div class="clock">{{ clock }}</div>

    <div class="devices-container">
      <el-card
        v-for="device in devices"
        :key="device.name"
        shadow="hover"
        class="device-card"
      >
        <div class="device-row">
          <div class="device-info">
            <i class="fas fa-plug device-icon"></i>
            <span class="device-name">{{ device.label }}</span>
          </div>
          <el-switch
            v-model="device.status"
            @change="() => onDeviceToggle(device)"
            active-text="开启"
            inactive-text="关闭"
            inline-prompt
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { list as listAcl } from '@/api/mqttAcl'
import { mqttPublish } from '@/api/mqttController'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const clock = ref('--:--:--')
let clockTimer = null

const devices = ref([
  { name: 'living_room_light', label: '客厅灯', status: false },
  { name: 'air_conditioner', label: '空调', status: false },
  { name: 'smart_lock', label: '智能门锁', status: true }
])

const mqttUsername = ref('')

const fetchMqttUsername = async () => {
  const res = await listAcl({
    pageNum: 1,
    pageSize: 100,
    action: 'publish'
  })
  if (res.code === 200 && res.data?.list?.length) {
    const uniqueUsernames = [...new Set(res.data.list.map(item => item.username))]
    mqttUsername.value = uniqueUsernames[0] || ''
  } else {
    ElMessage.error('未找到可用的 MQTT 发布用户')
  }
}

const updateClock = () => {
  clockTimer = setInterval(() => {
    const now = new Date()
    clock.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  }, 1000)
}

const onDeviceToggle = async (device) => {
  if (!mqttUsername.value) {
    ElMessage.error('未获取到 MQTT 用户名，无法发布')
    return
  }

  const payload = {
    device: device.name,
    status: device.status ? 'on' : 'off',
    timestamp: Date.now()
  }

  const topic = `iot/${mqttUsername.value}/smartHome` // 动态拼接 topic

  try {
    await mqttPublish({
      mqttUsername: mqttUsername.value,
      topic,
      qos: 0,
      payload: JSON.stringify(payload)
    })
    ElMessage.success(`${device.label} 已${device.status ? '开启' : '关闭'}`)
  } catch (err) {
    console.error(err)
    ElMessage.error(`控制 ${device.label} 失败`)
  }
}

onMounted(() => {
  updateClock()
  fetchMqttUsername()
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
.clock {
  font-size: 4vw;
  color: #333;
  margin-bottom: 2vh;
}
.devices-container {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
.device-card {
  border-radius: 12px;
  overflow: hidden;
  background: #f9f9f9;
}
.device-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
.device-info {
  display: flex;
  align-items: center;
}
.device-icon {
  font-size: 28px;
  color: #29B6F6;
  margin-right: 12px;
}
.device-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
