import { axios } from './request'

export const followUser = (userid : number) => {
  return axios.request({
    url: '/api/follow/user',
    method: 'post',
    data: {
      targetUserId: userid
    }
  })
}

export const unfollowUser = (userid : number) => {
  return axios.request({
    url: '/api/follow/user',
    method: 'delete',
    params: {
      targetUserId: userid
    }
  })
}

export const getFollowers = (userid: number, pages: number = 0, pageSize : number = 10) => {
  return axios.request({
    url: `/api/users/${userid}/followers`,
    method: 'get',
    params: {
      page: pages,
      size: pageSize
    }
  })
}

export const getFollowings = (userid: number, pages: number = 0, pageSize : number = 10) => {
  return axios.request({
    url: `/api/users/${userid}/following`,
    method: 'get',
    params: {
      page: pages,
      size: pageSize
    }
  })
}

