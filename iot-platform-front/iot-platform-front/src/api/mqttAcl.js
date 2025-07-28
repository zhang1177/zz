import request from '@/utils/request';


/**
 * 新增权限
 */
export function create(data) {
  return request({
    url: '/mqtt-acl/create',
    method: 'POST',
    data
  });
}

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

export function deleteMqttAclApi(ids) {
  return request({
    url: '/mqtt-acl/delete-batch', 
    method: 'POST',
    data: ids  
  });
}