import { axios } from './request'

export const getBlogList = () => {
  return axios.request({
    url: '/api/blogs',
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
      name: keywords
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
  console.log({
    url: `/api/blogs/${blogId}/comments`,
    method: 'post',
    data
  })
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