<script setup>
import { createAdmin, deleteUserApi, list } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const queryForm = reactive({ username: '', pageNum: 1, pageSize: 10 })
const userList = ref([])  
const total = ref(0) 
const addDialogVisible = ref(false) 
const newUser = reactive({ username: '', role: '' }) 
const selectedUsers = ref([]) 
const isBatchDelete = ref(false) 
const role = localStorage.getItem('role') || 'user'

async function fetchData() {
  try {
    const res = await list(queryForm) 
    if (res.code === 200 && res.data?.list) {
      userList.value = res.data.list.filter(user => {
        if (role === 'admin') return user.role !== 'admin'; 
        if (role === 'manager') return user.role === 'user'; 
        return false; 
      });

      total.value = res.data.total 
    } else {
      console.error('获取用户列表失败:', res.message)
    }
  } catch (err) {
    console.error('请求失败:', err)
  }
}

function handlePageChange(page) {
  queryForm.pageNum = page
  fetchData()
}

function addUser() {
  const userData = {
    username: newUser.username,
    password: newUser.password,
  }

  createAdmin(userData).then(response => {
    if (response.code === 200) {
      ElMessage.success('管理员添加成功！');
      fetchData(); 
    } else {
      ElMessage.error('管理员添加失败：' + response.message);
    }
  }).catch(error => {
    ElMessage.error('添加失败，请重试！');
  });

  addDialogVisible.value = false;
  newUser.username = '';
  newUser.password = ''; 
}

function deleteUser(row) {
  ElMessageBox.confirm('确认删除该用户吗?', '删除用户', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteUserApi([row.id])
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

// 批量删除
function batchDelete() {
  if (selectedUsers.value.length === 0) {
    ElMessage.error('请先选择用户');
    isBatchDelete.value = false; 
    return;
  }

  const userIds = selectedUsers.value.map(user => user.id);

  ElMessageBox.confirm('确认删除选中的用户吗?', '删除用户', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteUserApi(userIds)  
      .then(response => {
        if (response.code === 200) {
          ElMessage.success('用户删除成功');
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
    selectedUsers.value = []; 
  }
}

function handleSelectionChange(selection) {
  selectedUsers.value = selection;  
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
        <el-row gutter="10">
          <el-col :span="8">
            <el-button type="primary" @click="fetchData" style="width: 100%;">查询</el-button>
          </el-col>

          <el-col :span="8">
            <el-button type="danger" @click="activateBatchDelete" style="width: 100%;">批量删除</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="success"  v-show="role === 'admin'" @click="addDialogVisible = true" style="width: 100%;">添加管理员</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="knife-card">
    <el-table :data="userList" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column v-if="isBatchDelete" type="selection" width="55"></el-table-column>  
      <el-table-column label="ID" width="80">
        <template #default="scope">
            {{ (queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link size="small" @click="deleteUser(row)">删除</el-button>
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

  <el-dialog title="添加管理员" v-model="addDialogVisible">
    <el-form :model="newUser" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="newUser.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="newUser.password" type="password"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addUser">确认</el-button>
    </template>
  </el-dialog>

  <input ref="upload" type="file" accept=".xls,.xlsx" style="display:none" @change="importAndDownloadFile" />
  
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
