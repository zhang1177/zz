import request from '@/utils/request'; // 引入统一的 axios 请求实例

export function mqttPublish(data) {
  return request({
    url: '/mqtt/publish',
    method: 'POST',
    data
  });
}
