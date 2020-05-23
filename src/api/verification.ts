import { axios } from './request'

export const emailVerificationSend = (data : Object) : Promise<any> => {
  return axios.request({
    url: '/api/verification/email/send',
    method: 'post',
    data
  })
}

export const emailVerificationReceive = (data: Object) : Promise<any> => {
  return axios.request({
    url: '/api/verification/email/receive',
    method: 'post',
    data
  })
}
