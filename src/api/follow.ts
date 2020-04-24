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
    data: {
      targetUserId: userid
    }
  })
}

export const getFollowers = (userid: number) => {
  return axios.request({
    url: `/api/users/${userid}/followers`,
    method: 'get'
  })
}

export const getFollowings = (userid: number) => {
  return axios.request({
    url: `/api/users/${userid}/following`,
    method: 'get'
  })
}

