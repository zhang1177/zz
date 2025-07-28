import request from '@/utils/request'

export function list(queryForm) {
  return request({
    url: '/device/list',
    method: 'GET',
    params: queryForm 
  });
}

export function deleteDeviceApi(ids) {
  return request({
    url: '/device/delete', 
    method: 'POST',
    data: ids
  });
}