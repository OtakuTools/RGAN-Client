import { axios } from './request'
import { getToken } from '@/libs/util'

export const getBlogList = (pages: number = 0, pageSize : number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/blogs`,
    method: 'get',
    params: {
      page: pages,
      size: pageSize
    }
  })
}

export const addBlog = (data: Object) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: '/api/blogs',
    method: 'post',
    data
  })
}

export const modifyBlog = (id : number, data : Object) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${id}`,
    method: 'put',
    data
  })
}

export const getBlogById = (id: number) : Promise<any> => {
  return axios.request({
    url: `/api/blogs/${id}`,
    method: 'get'
  })
}

export const searchBlog = (keywords: string, pages: number = 0, pageSize : number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/blogs/search`,
    method: 'get',
    params: {
      keyword: keywords,
      page: pages,
      size: pageSize
    }
  })
}

export const getBlogByAuthor = (name: string, pages: number = 0, pageSize : number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/blogs/user`,
    method: 'get',
    params: {
      name: name,
      page: pages,
      size: pageSize
    }
  })
}

export const getBlogComments = (blogId: number) : Promise<any> => {
  return axios.request({
    url: `/api/blogs/${blogId}/comments`,
    method: 'get'
  })
}

export const addBlogComment = (blogId: number, data: Object) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/${blogId}/comments`,
    method: 'post',
    data
  })
}

export const editBlogComment = (commentId: number, data: Object) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/comments/${commentId}`,
    method: 'put',
    data
  })
}

export const deleteBlogComment = (commentId: number) : Promise<any> => {
  if (!getToken()) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: `/api/blogs/comments/${commentId}`,
    method: 'delete'
  })
}
