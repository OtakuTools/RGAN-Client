import { axios } from './request'

export const voteBlog = (id : number, status: number) => {
  return axios.request({
    url: `/api/blogs/${id}/vote`,
    method: 'post',
    data: {
      status: status
    }
  })
}

export const voteComment = (id : number, status: number) => {
  return axios.request({
    url: `/api/comments/${id}/vote`,
    method: 'post',
    data: {
      status: status
    }
  })
}

export const getBlogStatus = (idList : any) => {
  return axios.request({
    // url: `/api/blogs/vote/status?${idList.map(id => `id=${id}`).join('&')}`,
    url: `/api/blogs/vote/status`,
    method: 'get',
    params: {
      id: idList
    }
  })
}

export const getCommentStatus = (idList : any) => {
  return axios.request({
    // url: `/api/comments/vote/status?${idList.map(id => `id=${id}`).join('&')}`,
    url: `/api/comments/vote/status`,
    method: 'get',
    params: {
      id: idList
    }
  })
}
