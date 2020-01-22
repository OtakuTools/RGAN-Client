import axios from 'axios'
import axiosRetry from 'axios-retry';

//配置axios
axiosRetry(axios, {
  // 设置自动发送请求次数
  retries: 3,
  // 自动发送请求
  retryCondition: (error) => {
    return true;
  },
  // 重传间隔
  retryDelay: (retryCount) => {
    console.log(retryCount)
    return 1000;
  }
});

export { axios }
