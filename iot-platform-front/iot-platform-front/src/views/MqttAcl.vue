<script setup>
import { create, deleteMqttAclApi, list } from '@/api/mqttAcl'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const queryForm = reactive({ username: '', pageNum: 1, pageSize: 10 })
const mqttAclList = ref([]) 
const total = ref(0) 
const addDialogVisible = ref(false) 
const newMqttAcl = reactive({ permission: '', action: '',topic: '',username:'' })
const selectedMqttAcls = ref([]) 
const isBatchDelete = ref(false)  

async function fetchData() {
  try {
    const res = await list(queryForm) 
    if (res.code === 200 && res.data?.list) {
        mqttAclList.value = res.data.list;
      total.value = res.data.total 
    } else {
      console.error('获取MQTT访问权限列表失败:', res.message)
    }
  } catch (err) {
    console.error('请求失败:', err)
  }
}

function handlePageChange(page) {
  queryForm.pageNum = page
  fetchData()
}

function createMqttAcl() {
  const mqttAclData = {
    permission: newMqttAcl.permission,
    action: newMqttAcl.action,
    topic: newMqttAcl.topic,
    username: newMqttAcl.username 
  }

  create(mqttAclData).then(response => {
    if (response.code === 200) {
      ElMessage.success('MQTT权限添加成功！');
      fetchData(); 
    } else {
      ElMessage.error('MQTT权限添加失败：' + response.message);
    }
  }).catch(error => {
    ElMessage.error('添加失败，请重试！');
  });

  addDialogVisible.value = false;
  newMqttAcl.permission = '';
  newMqttAcl.action = ''; 
  newMqttAcl.topic = ''; 
  newMqttAcl.username = ''; 
}

// 删除单个用户
function deleteMqttAcl(row) {
  ElMessageBox.confirm('确认删除该用户吗?', '删除用户', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {

    deleteMqttAclApi([row.id])
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
  if (selectedMqttAcls.value.length === 0) {
    ElMessage.error('请先选择用户');
    isBatchDelete.value = false; 
    return;
  }

  const mqttAclIds = selectedMqttAcls.value.map(mqttAcl => mqttAcl.id); 

  ElMessageBox.confirm('确认删除选中的MQTT权限吗?', '删除权限', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMqttAclApi(mqttAclIds)  
      .then(response => {
        if (response.code === 200) {
          ElMessage.success('MQTT权限删除成功');
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
    selectedMqttAcls.value = [];  
  }
}

function handleSelectionChange(selection) {
    selectedMqttAcls.value = selection; 
}

onMounted(fetchData)
</script>

<template>
  <el-card class="knife-card">
    <el-form :model="queryForm" label-width="80px" inline>
      <el-form-item label="用户名">
        <el-input v-model="queryForm.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-row gutter="5">
          <el-col :span="8">
            <el-button type="primary" @click="fetchData" style="width: 100%;">查询</el-button>
          </el-col>

          <el-col :span="8">
            <el-button type="success" @click="addDialogVisible = true" style="width: 100%;">添加权限</el-button>
          </el-col>

          <el-col :span="8">
            <el-button type="danger" @click="activateBatchDelete" style="width: 100%;">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="knife-card">
    <el-table :data="mqttAclList" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column v-if="isBatchDelete" type="selection" width="55"></el-table-column>  
      <el-table-column label="ID" width="80">
        <template #default="scope">
            {{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="permission" label="permission" />
      <el-table-column prop="action" label="action" />
      <el-table-column prop="topic" label="topic" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link size="small" @click="deleteMqttAcl(row)">删除</el-button>
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

  <el-dialog title="添加MQTT权限" v-model="addDialogVisible">
    <el-form :model="newMqttAcl" label-width="80px">
        <el-form-item label="用户名">
        <el-input v-model="newMqttAcl.username" />
        </el-form-item>

        <el-form-item label="Permission">
        <el-select v-model="newMqttAcl.permission" placeholder="请选择权限">
            <el-option label="允许 (allow)" value="allow" />
            <el-option label="拒绝 (deny)" value="deny" />
        </el-select>
        </el-form-item>

        <el-form-item label="Action">
        <el-select v-model="newMqttAcl.action" placeholder="请选择操作类型">
            <el-option label="发布 (publish)" value="publish" />
            <el-option label="订阅 (subscribe)" value="subscribe" />
            <el-option label="全部 (all)" value="all" />
        </el-select>
        </el-form-item>

        <el-form-item label="Topic">
        <el-input v-model="newMqttAcl.topic" />
        </el-form-item>
    </el-form>

    <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createMqttAcl">确认</el-button>
    </template>
    </el-dialog>

  
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
