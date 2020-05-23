import { axios } from './request'

export const login = (data : Object) : Promise<any> => {
  return axios.request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export const regist = (data: Object) : Promise<any> => {
  return axios.request({
    url: '/api/register',
    method: 'post',
    data
  })
}

export const logout = (token: string) : Promise<any> => {
  return axios.request({
    url: '/api/logout',
    method: 'post',
    data: {
      token
    }
  })
}

export const getUserInfo = (id: string) : Promise<any> => {
  return axios.request({
    url: `/api/users`,
    method: 'get',
    params: {
      id
    }
  })
}

export const getUserInfoByName = (name: string) : Promise<any> => {
  return axios.request({
    url: `/api/users`,
    method: 'get',
    params: {
      name
    }
  })
}
