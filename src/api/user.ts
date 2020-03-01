import { axios } from './request'

export const login = (data : Object) => {
  return axios.request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export const regist = (data: Object) => {
  return axios.request({
    url: '/api/register',
    method: 'post',
    data
  })
}

export const logout = (token: string) => {
  return axios.request({
    url: '/api/logout',
    method: 'post',
    data: {
      token
    }
  })
}

export const getUserInfo = (id: string) => {
  return axios.request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}