import request from '@/utils/request'; 

/**
 * 分页查询传感器数据列表
 */
export function list(queryForm) {
  return request({
    url: '/sensorData/list',
    method: 'GET',
    params: queryForm
  });
}

export function deleteSensorDataApi(ids) {
  return request({
    url: '/sensorData/delete',
    method: 'POST',
    data: ids  // 传递用户 ID 列表
  });
}