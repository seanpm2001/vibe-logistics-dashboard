import { getCookie, setCookie } from '/@/utils/auth';

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    sidebar: {
      opened: getCookie('sidebarStatus') ? !!+getCookie('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: getCookie('size') || 'medium'
  }),
  getters: {
    getDevice: state => state.device,
  },
  actions: {
    toggleDevice(device) {
      this.device = device;
    },
    setSize(size) {
      this.size = size;
    }
  }
});
