import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import 'element-plus/theme-chalk/src/loading.scss';
import store from '/@/store';
import { getToken } from '/@/utils/auth';
import { jsonToHump } from '/@/utils/format';

/* start 将同一时刻的请求合并。*/
let loadingInstance = null;
let needLoadingRequestCount = 0;
const startLoading = () => loadingInstance = ElLoading.service({fullscreen: true});
const endLoading = () => loadingInstance.close();

const showFullScreenLoading = () => {
  needLoadingRequestCount++ === 0 && startLoading();
};

const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  --needLoadingRequestCount === 0 && endLoading();
};
/* end 将同一时刻的请求合并。*/

const requester = axios.create({
  baseURL: 'https://logistics.vibe.dev/api',
  // baseURL: '/api',
  timeout: 6000, // 设置超时时间
  withCredentials: true, // 允许携带cookie
  headers: { // 解决ie浏览器会自动缓存
    'cache-control': 'no-cache',
  }
});

// request interceptor
requester.interceptors.request.use(
  config => {
    const { method, url } = config;
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken();
    }
    if (method === 'get' && !url.includes('/')) return config; // query API 不触发全屏loading
    showFullScreenLoading();
    return config;
  },
  error => {
    // do something with request error
    tryHideFullScreenLoading();
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
requester.interceptors.response.use(
  /**
   * Determine the request status by custom code
   */
  response => {
    // eslint-disable-next-line no-undef
    tryHideFullScreenLoading();
    const res = response.data;
    
    jsonToHump(res);
    return res;
  },
  error => {
    console.log(error); // for debug
    tryHideFullScreenLoading();
    if (error === 'Error: Request failed with status code 401') {
      store.dispatch('user/resetToken').then(() => {
        location.reload();
      });
      return Promise.reject('The token has expired. Please log in again');
    }

    ElMessage.error(error.message, 5);
    return Promise.reject(error);
  }
);

export default requester;

export const mockRequester = axios.create({
  // baseURL: 'https://logistics.vibe.dev/api'
  baseURL: '/api/mock',
  timeout: 6000, // 设置超时时间
  withCredentials: true, // 允许携带cookie
  headers: { // 解决ie浏览器会自动缓存
    'cache-control': 'no-cache',
  }
});

// mockRequester.interceptors.request.use(
//   config => {
//     const { method, url } = config;
//     // do something before request is sent
//     if (store.getters.token) {
//       config.headers['Authorization'] = 'Bearer ' + getToken();
//     }
//     if (method === 'get' && !url.includes('/')) return config; // query API 不触发全屏loading
//     showFullScreenLoading();
//     return config;
//   },
//   error => {
//     // do something with request error
//     tryHideFullScreenLoading();
//     console.log(error); // for debug
//     return Promise.reject(error);
//   }
// );

// mockRequester.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    */
//   response => {
//     // eslint-disable-next-line no-undef
//     tryHideFullScreenLoading();
//     const res = response.data;


//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       ElMessage({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       });

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//         //   confirmButtonText: 'Re-Login',
//         //   cancelButtonText: 'Cancel',
//         //   type: 'warning'
//         // }).then(() => {
//         store.dispatch('user/resetToken').then(() => {
//           location.reload();
//         });
//         // });
//       }
//       return Promise.reject(new Error(res.message || 'Error'));
//     } else {
//       return res;
//     }
//   },
//   error => {
//     // eslint-disable-next-line no-undef
//     tryHideFullScreenLoading();
//     console.log('err' + error); // for debug
//     ElMessage({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     });
//     return Promise.reject(error);
//   }
// );
