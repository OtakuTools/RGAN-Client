import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
const { cookieExpires } = config

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token && token !== '') return token
  else return false
}

export const formatErrorMsg = (err) => {
  return {
    message: err.response ? err.response.data.message : err,
    type: 'error'
  }
}