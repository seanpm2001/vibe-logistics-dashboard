import { ref, onMounted, onUnmounted } from 'vue';

/**
 * @description 用户网络是否可用
 * */
export function useOnline() {
  /**
   * Due to the bug https://bugs.chromium.org/p/chromium/issues/detail?id=678075,
   * it's not reliable to detect if the browser is currently online or offline
   * based on `navigator.onLine`.
   * As a workaround, we always assume it's online on the first load, and change
   * the status upon `online` or `offline` events.
   */
  const online = ref(true);

  const showStatus = (val) => {
    online.value = typeof val === 'boolean' ? val : val.target.online;
  };

  // 在页面加载后，设置正确的网络状态
  // navigator.onLine ? showStatus(true) : showStatus(false);

  onMounted(() => {
    // 开始监听网络状态的变化
    window.addEventListener('online', showStatus);

    window.addEventListener('offline', showStatus);
  });
  onUnmounted(() => {
    // 移除监听网络状态的变化
    window.removeEventListener('online', showStatus);

    window.removeEventListener('offline', showStatus);
  });

  return { online };
}
