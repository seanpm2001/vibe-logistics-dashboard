import axios from 'axios';
import { useUserStore } from '../store';
import { ElMessage, ElLoading } from 'element-plus';
import 'element-plus/theme-chalk/src/loading.scss';
import { getToken } from '@/utils/auth';
import { jsonToHump, jsonToUnderline } from '@/utils/format';


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
    jsonToUnderLineParamsAndData(config);
    const { token } = useUserStore();
    if (token)
      config.headers['Authorization'] = 'Bearer ' + getToken();
    if (method === 'get' && !url.includes('/'))
      return config; // query API 不触发全屏loading
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
    if (response.status === 401) {
      ElMessage.error('The token has expired. Please log in again', 5);
      useUserStore().resetToken().then(() => {
        location.reload();
      });
      // return Promise.reject(new Error('The token has expired. Please log in again'));
    }
    jsonToHump(res);
    return res;
  },
  error => {
    // eslint-disable-next-line no-undef
    tryHideFullScreenLoading();
    console.log('http err' + error); // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default requester;

function jsonToUnderLineParamsAndData(config) {
  const params = config.params;
  const data = config.data;
  jsonToUnderline(params);
  jsonToUnderline(data);
  config.params = params;
  config.data = data;
}
