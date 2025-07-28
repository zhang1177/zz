import request from '@/utils/request'

/**
 * 登录接口
 * @param {Object} data - 登录数据（手机号、密码等）
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  });
}

/**
 * 注册用户
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'POST',
    data
  });
}

/**
 * 创建管理员用户
 */
export function createAdmin(data) {
  return request({
    url: '/user/create-manager',
    method: 'POST',
    data
  });
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'POST'
  });
}

/**
 * 分页查询用户列表
 */
export function list(queryForm) {
  return request({
    url: '/user/list',
    method: 'GET',
    params: queryForm 
  });
}

export function deleteUserApi(ids) {
  return request({
    url: '/user/delete', 
    method: 'POST',
    data: ids  
  });
}

export function getProfile() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}

export function updateProfile(data) {
  return request({
    url: '/user/profile',
    method: 'POST',
    data
  })
}

export function uploadAvatar(formData) {
  return request({
    url: '/user/update-avatar',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 注册用户
 */
export function changePassword(data) {
  return request({
    url: '/user/change-password',
    method: 'POST',
    data
  });
}
