<script setup>
import { deleteDeviceApi, list } from '@/api/device'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const queryForm = reactive({ pageNum: 1, pageSize: 10 })
const deviceList = ref([])  
const total = ref(0)
const selectedDevices = ref([]) 
const isBatchDelete = ref(false) 

async function fetchData() {
  try {
    const res = await list(queryForm) 
    if (res.code === 200 && res.data?.list) {
      deviceList.value = res.data.list; 
      total.value = res.data.total 
    } else {
      console.error('获取设备列表失败:', res.message)
    }
  } catch (err) {
    console.error('请求失败:', err)
  }
}

function handlePageChange(page) {
  queryForm.pageNum = page
  fetchData()
}

function deleteSingle(row) {
  ElMessageBox.confirm('确认删除吗?', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDeviceApi([row.id])
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
  if (selectedDevices.value.length === 0) {
    ElMessage.error('请先选择数据');
    isBatchDelete.value = false; 
    return;
  }
  const DevieIds = selectedDevices.value.map(device => device.id); 
  ElMessageBox.confirm('确认删除选中吗?', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDeviceApi(DevieIds)  
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
    selectedDevices.value = [];
  }
}

function handleSelectionChange(selection) {
  selectedDevices.value = selection; 
}

onMounted(fetchData) 
</script>

<template>
  <el-card class="knife-card">
    <el-form :model="queryForm" label-width="80px" inline>
      <el-form-item label="设备">
        <el-input v-model="queryForm.readingType" placeholder="请输入设备名称" clearable />
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
    <el-table :data="deviceList" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column v-if="isBatchDelete" type="selection" width="55"></el-table-column>  
      <el-table-column label="ID" width="80">
        <template #default="scope">
            {{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="设备名" />
      <el-table-column prop="macAddress" label="MAC地址" />
      <el-table-column prop="mqttUsername" label="MQTT用户名" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <span>{{ row.status === 1 ? '在线' : '离线' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link size="small" @click="deleteSingle(row)">删除</el-button>
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
