import {
  login,
  logout,
  getUserInfo,
} from '@/api/user'

export default {
  state: {
    id : '',
    name: '',
    token: '',
    avatarImgPath: '',
    access: '',
    hasGetInfo: false,
  },
  mutations: {
    setAvatar (state : any, avatarPath : string) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state : any, id : any) {
      state.userId = id
    },
    setUserName (state : any, name : any) {
      state.userName = name
    },
    setAccess (state : any, access : any) {
      state.access = access
    },
    setToken (state : any, token : any) {
      state.token = token
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
          commit('setToken', data.token)
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
          commit('setAccess', [])
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
            commit('setAvatar', data.avatar)
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
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