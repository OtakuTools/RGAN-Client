import { axios } from './request'
import { getToken } from '@/libs/util'

export const addFavourite = (id : number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${id}/favourite`,
    method: 'post'
  })
}

export const deleteFavourite = (id : number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${id}/favourite`,
    method: 'delete'
  })
}

export const getFavouriteStatus = (id : number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${id}/favourite/status`,
    method: 'get'
  })
}


export const getSelfFavourites = (page: number = 0, size: number = 10) : Promise<any> => {
  return axios.request({
    url: '/api/users/self/favourite',
    method: 'get',
    params: {
      page,
      size
    }
  })
}
