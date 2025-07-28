// src/utils/request.js

import router from '@/router'
import axios from 'axios'

const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? '/api'                         
    : 'http://localhost:8081/api',     
  timeout: 10000
})
// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 判断响应的内容类型
    const contentType = response.headers['content-type']

    if (contentType && (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || contentType.includes('application/zip'))) {
      return response;  
    }

    // 处理其他响应类型，返回数据部分
    return response.data;
  },
  error => {
    const { response } = error;
    if (response) {
      const status = response.status;
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          router.push('/login');
          break;
        case 403:
          console.error('拒绝访问！-403');
          break;
        case 404:
          console.error('资源未找到！-404');
          break;
        case 500:
          console.error('服务器异常！-500');
          break;
        default:
          console.error(response.data?.msg || '请求出错');
      }
    }
    return Promise.reject(error);
  }
);

export default request

export const getAction = (url, params) => request({ url, method: 'get', params })
export const postAction = (url, data) => request({ url, method: 'post', data })
export const putAction = (url, data) => request({ url, method: 'put', data })
export const deleteAction = (url, params) => request({ url, method: 'delete', params })
export const upload = (url, fileForm) => request({ url, method: 'post', data: fileForm })
