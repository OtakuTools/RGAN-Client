import axios from 'axios'
import axiosRetry from 'axios-retry'

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
