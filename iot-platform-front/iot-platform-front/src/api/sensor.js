import request from '@/utils/request'

export function list(queryForm) {
  return request({
    url: '/sensor/list',
    method: 'GET',
    params: queryForm 
  });
}

export function deleteSensorApi(ids) {
  return request({
    url: '/sensor/delete', 
    method: 'POST',
    data: ids
  });
}