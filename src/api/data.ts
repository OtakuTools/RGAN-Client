import { axios } from './request'

export const test = () => {
  return axios.request({
    url: 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=axios%20network%20error&oq=axios&rsv_pq=859beba500188919&rsv_t=9568Bqdg6%2BekW%2BZbDSOTBtwOJjS5D9A3PUqJYTXb2z7pU3LVboA4GPgX10Y&rqlang=cn&rsv_enter=1&rsv_dl=tb&inputT=6722&rsv_sug3=209&rsv_sug1=135&rsv_sug7=100&rsv_sug2=0&rsv_sug4=6722',
    method: 'get'
  })
}

export const getBlogList = () => {
  return axios.request({
    url: 'api/blog',
    method: 'get'
  })
}

export const addBlog = (data: Object) => {
  return axios.request({
    url: 'api/blog',
    method: 'post',
    data
  })
}

export const getBlogById = (id: number) => {
  return axios.request({
    url: `api/blog/${id}`,
    method: 'get'
  })
}