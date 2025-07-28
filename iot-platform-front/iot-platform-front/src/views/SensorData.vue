<script setup>
import { deleteSensorDataApi, list } from '@/api/sensorData'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const queryForm = reactive({ pageNum: 1, pageSize: 10 })
const sensorDataList = ref([])  
const total = ref(0)
const selectedSensorDatas = ref([]) 
const isBatchDelete = ref(false) 

async function fetchData() {
  try {
    const res = await list(queryForm) 
    if (res.code === 200 && res.data?.list) {
      sensorDataList.value = res.data.list;
      total.value = res.data.total 
    } else {
      console.error('获取传感器数据列表失败:', res.message)
    }
  } catch (err) {
    console.error('请求失败:', err)
  }
}

function handlePageChange(page) {
  queryForm.pageNum = page
  fetchData()
}

function deleteSensorData(row) {
  console.log('单个删除 ID:', [row.id]);  
  ElMessageBox.confirm('确认删除吗?', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用删除接口
    deleteSensorDataApi([row.id])
      .then(response => {
        if (response.code === 200) {
          ElMessage.success('用户删除成功');
          fetchData();
        } else {
          ElMessage.error('删除失败：' + response.message);
        }
      })
      .catch(() => {
        ElMessage.error('删除失败，请重试');
      });
  });
}

function batchDelete() {
  console.log('要删除的 ID 列表:', SensorDataIds); // 对于批量删除
  if (selectedSensorDatas.value.length === 0) {
    ElMessage.error('请先选择数据');
    isBatchDelete.value = false; 
    return;
  }

  const SensorDataIds = selectedSensorDatas.value.map(sensorData => sensorData.id); 

  ElMessageBox.confirm('确认删除选中吗?', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteSensorDataApi(SensorDataIds)  
      .then(response => {
        if (response.code === 200) {
          ElMessage.success('删除成功');
          fetchData(); 
          isBatchDelete.value = false; 
        } else {
          ElMessage.error('删除失败：' + response.message);
        }
      })
      .catch(() => {
        ElMessage.error('删除失败，请重试');
      });
  });
}

function activateBatchDelete() {
  if (isBatchDelete.value) {
    batchDelete();
  } else {
    isBatchDelete.value = !isBatchDelete.value;
    selectedSensorDatas.value = [];
  }
}

function handleSelectionChange(selection) {
  selectedSensorDatas.value = selection; 
}

onMounted(fetchData) 
</script>

<template>
  <el-card class="knife-card">
    <el-form :model="queryForm" label-width="80px" inline>
      <el-form-item label="传感器">
        <el-input v-model="queryForm.readingType" placeholder="请输入传感器名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-row gutter="5">
          <el-col :span="12">
            <el-button type="primary" @click="fetchData" style="width: 100%;">查询</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="danger" @click="activateBatchDelete" style="width: 100%;">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="knife-card">
    <el-table :data="sensorDataList" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column v-if="isBatchDelete" type="selection" width="55"></el-table-column>  
      <el-table-column label="ID" width="80">
        <template #default="scope">
            {{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="readingType" label="传感器类型" />
      <el-table-column prop="readingValue" label="数值" />
      <el-table-column prop="deviceName" label="设备名" />
      <el-table-column prop="mqttUsername" label="MQTT用户名" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link size="small" @click="deleteSensorData(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @current-change="handlePageChange"
      :current-page="queryForm.pageNum"
      :page-size="queryForm.pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      style="margin-top: 20px;"
    />
  </el-card>
</template>

<style scoped>
.knife-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px #f0f1f2;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>