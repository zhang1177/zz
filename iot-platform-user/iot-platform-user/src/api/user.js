import request from '@/utils/request'; // 引入统一的 axios 请求实例

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
 * 退出登录
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'POST'
  });
}

export function getProfile() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}
