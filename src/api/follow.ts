import { axios } from './request'
import { getToken } from '@/libs/util'

export const checkIsFollowing = (userid : number) : Promise<any> => {
  return axios.request({
    url: `/api/follow/user`,
    method: 'get',
    params: {
      targetUserId: userid
    }
  })
}

export const followUser = (userid : number) : Promise<any> => {
  if (!(!!getToken())) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: '/api/follow/user',
    method: 'post',
    data: {
      targetUserId: userid
    }
  })
}

export const unfollowUser = (userid : number) : Promise<any> => {
  if (!(!!getToken())) {
    return Promise.reject('请先登录')
  }
  return axios.request({
    url: '/api/follow/user',
    method: 'delete',
    data: {
      targetUserId: userid
    }
  })
}

export const getFollowers = (userid: number, page: number = 0, size : number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/users/${userid}/followers`,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

export const getFollowings = (userid: number, page: number = 0, size : number = 10) : Promise<any> => {
  return axios.request({
    url: `/api/users/${userid}/following`,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

