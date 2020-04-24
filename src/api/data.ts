import { axios } from './request'

export const getBlogList = (pages: number = 0, pageSize : number = 10) => {
  return axios.request({
    url: `/api/blogs?page=${pages}&size=${pageSize}`,
    method: 'get'
  })
}

export const addBlog = (data: Object) => {
  return axios.request({
    url: '/api/blogs',
    method: 'post',
    data
  })
}

export const modifyBlog = (id : number, data : Object) => {
  return axios.request({
    url: `/api/blogs/${id}`,
    method: 'put',
    data
  })
}

export const getBlogById = (id: number) => {
  return axios.request({
    url: `/api/blogs/${id}`,
    method: 'get'
  })
}

export const searchBlog = (keywords: string) => {
  return axios.request({
    url: `/api/blogs/search`,
    method: 'get',
    params: {
      keyword: keywords
    }
  })
}

export const getBlogComments = (blogId: number) => {
  return axios.request({
    url: `/api/blogs/${blogId}/comments`,
    method: 'get'
  })
}

export const addBlogComment = (blogId: number, data: Object) => {
  return axios.request({
    url: `/api/blogs/${blogId}/comments`,
    method: 'post',
    data
  })
}

export const editBlogComment = (commentId: number, data: Object) => {
  return axios.request({
    url: `/api/blogs/comments/${commentId}`,
    method: 'put',
    data
  })
}

export const deleteBlogComment = (commentId: number) => {
  return axios.request({
    url: `/api/blogs/comments/${commentId}`,
    method: 'delete'
  })
}