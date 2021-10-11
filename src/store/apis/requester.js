import axios from 'axios'
// import { useStore } from 'vuex'

// const store = useStore()
// console.log('store: ', store);

const requester = axios.create({
  // baseURL: 'https://xxxxx/api'
  // baseURL: 'http://127.0.0.1:7001/api',
  timeout: 6000, // 设置超时时间
  withCredentials: true, // 允许携带cookie
  headers: { // 解决ie浏览器会自动缓存
    'cache-control': 'no-cache',
    'Authorization': localStorage.token || ''
  }
})

requester.interceptors.request.use(config => {
  const token = localStorage.token || ''
  if (token) {
    config.headers.Authorization = token
  }
  // 在发送请求之前做些什么
  return config;
}, error => {
  return Promise.reject(error);
})



requester.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(error)
})

export default requester

