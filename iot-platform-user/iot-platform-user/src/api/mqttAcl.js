import request from '@/utils/request'; // 引入统一的 axios 请求实例

/**
 * 分页查询mqtt用户访问权限
 */
export function list(queryForm) {
  return request({
    url: '/mqtt-acl/list',
    method: 'GET',
    params: queryForm 
  });
}
