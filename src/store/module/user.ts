import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
/ tslint:disable /

export default {
  state: {
    id: '',
    name: '',
    token: getToken(),
    avatarImgPath: '',
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvatar (state : any, avatarPath : string) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state : any, id : any) {
      state.id = id
    },
    setUserName (state : any, name : any) {
      state.name = name
    },
    setAccess (state : any, access : any) {
      state.access = access
    },
    setToken (state : any, token : any) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state : any, status : any) {
      state.hasGetInfo = status
    }
  },
  getters: {

  },
  actions: {
    // 登录
    handleLogin ({ commit } : any, { username, password, rememberMe } : any) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          rememberMe
        }).then(res => {
          const data = res.data
          commit('setUserId', data.id)
          commit('setUserName', data.username)
          commit('setToken', data.id)
          commit('setHasGetInfo', true)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit } : any) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setUserId', '')
          commit('setUserName', '')
          commit('setHasGetInfo', false)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit } : any) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setUserName', data.username)
            commit('setUserId', data.id)
            commit('setToken', data.id)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
