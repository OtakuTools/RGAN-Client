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