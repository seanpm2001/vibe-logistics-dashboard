import { ElLoading } from 'element-plus';

/* start 将同一时刻的请求合并。*/
let loadingInstance = null ;
let needLoadingRequestCount = 0;
const startLoading = () => loadingInstance = ElLoading.service({fullscreen: true});
const endLoading = () => loadingInstance.close();

export const showFullScreenLoading = () => {
  needLoadingRequestCount++ === 0 && startLoading();
  console.log('needLoadingRequestCount: ', needLoadingRequestCount);
};

export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  --needLoadingRequestCount === 0 && endLoading();
};
/* end 将同一时刻的请求合并。*/
