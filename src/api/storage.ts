import { axios } from './request'
import { getToken } from '@/libs/util'

export const getStorageToken = () => {
  if (!(!!getToken())) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: '/api/storage/token',
    method: 'get',
  })
}