import request from '@/utils/request'
// 获取板卡标识符列表
export function CardListApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 根据板卡ch获取板卡详情
export function CardDetailApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 拖动输入卡至输出卡位置时的动作指令
export function SendInOutSeatApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 获取场景列表
export function SyncSceneApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 获取单个场景的数据
export function getScenceDataApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 保存场景
export function scene_saveApi(data) {
  return request({
    url: '/api/v1',
    method: 'post',
    data
  })
}
// 调用单个场景
export function scene_callApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 删除单个场景
export function scene_delApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 场景轮询开关
export function scene_rotateApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 轮巡参数设置
export function scene_rotate_argsApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 串口调试接口
export function TerminalApi(data) {
  return request({
    url: '/api/v1',
    method: 'post',
    data
  })
}
// 获取轮询参数设置
export function scene_pollingApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 分组和屏幕映射数据
export function ginfo_syncApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 切换输入格式
export function set_insubcardApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 选择EDID前五个
export function edidChooseApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
// 选择EDID后五个
export function edidLearnInApi(params) {
  return request({
    url: '/api/vg',
    method: 'get',
    params
  })
}
