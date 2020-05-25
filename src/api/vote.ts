import { axios } from './request'
import { getToken } from '@/libs/util'

export const voteBlog = (id : number, status: number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${id}/vote`,
    method: 'post',
    data: {
      status: status
    }
  })
}

export const voteComment = (id : number, status: number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/comments/${id}/vote`,
    method: 'post',
    data: {
      status: status
    }
  })
}

export const getBlogStatus = (idList : Array<number>) : Promise<any> => {
  return axios.request({
    url: `/api/blogs/vote/status?${idList.map(id => `id=${id}`).join('&')}`,
    method: 'get'
  })
}

export const getCommentStatus = (idList : Array<number>) : Promise<any> => {
  return axios.request({
    url: `/api/comments/vote/status?${idList.map(id => `id=${id}`).join('&')}`,
    method: 'get'
  })
}
