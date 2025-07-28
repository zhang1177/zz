<template>
    <div class="content">
      <div class="clock">{{ clock }}</div>
  
      <div class="info-container">
        <div class="info-item">
          <i class="fas fa-id-badge icon"></i>
          <div class="label">当前打卡人员UID：</div>
          <div class="value">{{ uid }}</div>
        </div>
        <div class="info-item">
          <i class="fas fa-calendar-check icon"></i>
          <div class="label">打卡时间：</div>
          <div class="value">{{ punchTime }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { list } from '@/api/sensorData'
import { useInterval } from '@/hooks/useInterval'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
  
  const clock = ref('--:--:--')
  const uid = ref('--')
  const punchTime = ref('--')

  const { startInterval } = useInterval()
  
  // 更新时间
  const updateClock = () => {
    setInterval(() => {
      const now = new Date()
      clock.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    }, 1000)
  }
  
// 记录上一次打卡时间
const lastPunchTime = ref('')

// 获取打卡数据
const fetchPunchData = async () => {
  try {
    const response = await list({ pageNum: 1, pageSize: 1 })
    if (response.code === 200 && response.data.list.length > 0) {
      const data = response.data.list[0]
      if (data.readingType === 'RFID') {
        const currentPunchTime = new Date(data.createdAt).toLocaleString()
        if (currentPunchTime !== lastPunchTime.value) {
          // 新打卡记录
          uid.value = data.readingValue
          punchTime.value = currentPunchTime
          lastPunchTime.value = currentPunchTime
          ElMessage.success('打卡成功！')
        }
      }
    } else {
      ElMessage.error('暂无打卡数据')
    }
  } catch (error) {
    console.error('获取打卡数据失败：', error)
    ElMessage.error('获取数据失败，请稍后重试')
  }
}

  
    onMounted(() => {
        updateClock()
        fetchPunchData()
        startInterval(fetchPunchData, 5000)
    })
  
  </script>
  
  <style scoped>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
  h1 {
    font-size: 6vw;
    color: #29B6F6;
    margin: 2vh 0;
    text-align: center;
  }
  .clock {
    font-size: 4vw;
    color: #333;
    margin-bottom: 2vh;
  }
  .info-container {
    width: 90%;
    background: rgba(41, 182, 246, 0.1);
    border-radius: 12px;
    padding: 3vw;
    box-shadow: 0px 4px 15px rgba(41, 182, 246, 0.4);
  }
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 3vh;
  }
  .label {
    font-size: 4vw;
    color: #29B6F6;
  }
  .value {
    font-size: 5vw;
    font-weight: bold;
    color: #333;
    margin-left: auto;
  }
  .icon {
    font-size: 8vw;
    color: #29B6F6;
    margin-right: 2vw;
  }
  </style>
  