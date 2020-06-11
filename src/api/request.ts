import axios from 'axios'
import axiosRetry from 'axios-retry'

// axios.defaults.timeout = 10000
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true

// http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     config.headers = {
//       'Content-Type': 'application/json' //  注意：设置很关键 
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

// 配置axios
axiosRetry(axios, {
  // 设置自动发送请求次数
  retries: 3,
  // 自动发送请求
  retryCondition: (error) => {
    return error.response.status < 400
  },
  // 重传间隔
  retryDelay: (retryCount) => {
    return 1000
  }
})

export { axios }
