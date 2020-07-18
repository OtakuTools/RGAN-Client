import { axios } from './request'
import { getToken } from '@/libs/util'

export const getTimelineForBlog = (page: number = 0, size: number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/timeline/blogs`,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

export const getTimelineForComment = (page: number = 0, size: number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/timeline/comments`,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

export const getTimelineForVote = (page: number = 0, size: number = 10) => {
  return axios.request({
    url: `/api/timeline/votes`,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

export const getTimelineNews = (page: number = 0, size: number = 10) => {
  return axios.request({
    url: `/api/timeline/news`,
    method: 'get'
  })
}

export const deleteTimelineMsg = (id: number) => {
  return axios.request({
    url: `/api/timeline/message/${id}`,
    method: 'delete'
  })
}

export const updateReadStatus = (messageItemIds: Array<number>) => {
  return axios.request({
    url: `/api/timeline/read`,
    method: 'post',
    data: {
      messageItemIds
    }
  })
}