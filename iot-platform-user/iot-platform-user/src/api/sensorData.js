import request from '@/utils/request'; // 引入统一的 axios 请求实例

/**
 * 分页查询传感器数据列表
 */
export function list(queryForm) {
  return request({
    url: '/sensorData/list',
    method: 'GET',
    params: queryForm // 将分页参数传递给后端
  });
}

export function deleteSensorDataApi(ids) {
  return request({
    url: '/sensorData/delete',  // 删除接口路径
    method: 'POST',
    data: ids  // 传递用户 ID 列表
  });
}