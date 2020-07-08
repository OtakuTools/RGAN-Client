import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
const { cookieExpires } = config

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  if (token) {
    Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
  } else {
    Cookies.remove(TOKEN_KEY)
  }
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token && token !== '') return token
  else return false
}

export const formatErrorMsg = (err) => {
  return {
    message: err.response ? (err.response.data.message || err.response.data) : err,
    type: 'error'
  }
}

export const isMobile = () => {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) { return true } else { return false }
}

export const setTitle = (title) => {
  document.title = `${title} - 学习使我快乐`
}

export const throttle = (fn, delay) => {
  let valid = true
  return function() {
    if (!valid) {
      return false 
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false
    setTimeout(() => {
      fn()
      valid = true
    }, delay)
  }
}

export const debounce = (fn, delay) => {
  let timer = null //借助闭包
  return function() {
    if (timer) {
      clearTimeout(timer) 
    }
    timer = setTimeout(fn,delay) // 简化写法
  }
}
