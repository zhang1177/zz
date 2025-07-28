<template>
    <div class="content">
      <div class="clock">{{ clock }}</div>
  
      <div class="info-container">
        <div class="info-item">
          <i class="fas fa-thermometer-half icon"></i>
          <div class="label">温度：</div>
          <div class="value">{{ temperature }} ℃</div>
        </div>
        <div class="info-item">
          <i class="fas fa-tint icon"></i>
          <div class="label">湿度：</div>
          <div class="value">{{ humidity }} %</div>
        </div>
      </div>
  
      <div class="chart-container">
        <canvas id="tempChart"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { list } from '@/api/sensorData'
import Chart from 'chart.js/auto'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref, toRaw } from 'vue'
  
  const clock = ref('--:--:--')
  const temperature = ref('--')
  const humidity = ref('--')

  let fetchTimer = null
let clockTimer = null
  
  const tempHistory = ref([])
  const humHistory = ref([])
  const timeLabels = ref([])
  let chart = null
  
  const updateClock = () => {
    setInterval(() => {
      const now = new Date()
      clock.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    }, 1000)
  }
  
  const MAX_DATA_LENGTH = 20

const fetchSensorData = async () => {
  try {
    const response = await list({ pageNum: 1, pageSize: 10 })
    if (response.code === 200 && response.data?.list) {
      const nowTime = new Date().toLocaleTimeString()
      const data = response.data.list

      data.forEach(item => {
        if (item.readingType === 'dht11_temperature') {
          temperature.value = item.readingValue
          tempHistory.value.push(parseFloat(item.readingValue))
        }
        if (item.readingType === 'dht11_humidity') {
          humidity.value = item.readingValue
          humHistory.value.push(parseFloat(item.readingValue))
        }
      })

      timeLabels.value.push(nowTime)

      // 限制长度
      if (tempHistory.value.length > MAX_DATA_LENGTH) tempHistory.value.shift()
      if (humHistory.value.length > MAX_DATA_LENGTH) humHistory.value.shift()
      if (timeLabels.value.length > MAX_DATA_LENGTH) timeLabels.value.shift()

      updateChart()
    } else {
      ElMessage.error('获取温湿度数据失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  }
}

const updateChart = () => {
  if (chart) {
    chart.data.labels = [...toRaw(timeLabels.value)]
    chart.data.datasets[0].data = [...toRaw(tempHistory.value)]
    chart.data.datasets[1].data = [...toRaw(humHistory.value)]
    chart.update()
  }
}
  
  const initChart = () => {
    const ctx = document.getElementById('tempChart').getContext('2d')
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '温度 (℃)',
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255,99,132,0.2)',
            data: [],
            tension: 0.4
          },
          {
            label: '湿度 (%)',
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54,162,235,0.2)',
            data: [],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
  
  onMounted(() => {
    updateClock()
    initChart()
    fetchSensorData()
    setInterval(fetchSensorData, 5000)
  })

  onUnmounted(() => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
  if (clockTimer) {
    clearInterval(clockTimer)
    clockTimer = null
  }
})
  </script>
  
  <style scoped>
    .chart-container {
    width: 90%;
    height: 300px;
    margin-top: 20px;
    }

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
  