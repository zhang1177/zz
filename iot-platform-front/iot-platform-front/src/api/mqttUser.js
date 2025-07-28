import request from '@/utils/request';

/**
 * 注册MQTT用户
 */
export function register(data) {
  return request({
    url: '/mqtt-user/create',
    method: 'POST',
    data
  });
}

/**
 * 分页查询MQTT用户列表
 */
export function list(queryForm) {
  return request({
    url: '/mqtt-user/list',
    method: 'GET',
    params: queryForm
  });
}

/**
 * 批量删除MQTT用户
 * @param {Array<number>} ids - 待删除的用户ID列表
 * @returns {Promise} - 请求Promise对象
 */
export function deleteMqttUserApi(ids) {
  return request({
    url: '/mqtt-user/delete', 
    method: 'POST',
    data: ids  // 以JSON数组形式传递ID列表
  });
}