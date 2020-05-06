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

export const isMobile = () => {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)))
    return true;
  else
    return false;
}