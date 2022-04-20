const pinia = createPinia();

export default pinia;

export { useAppStore } from './app';
export { useLogisticStore } from './logistic';
export { usePermissionStore } from './permission';
export { useSettingStore } from './setting';
export { useTagStore } from './tag';
export { useUserStore } from './user';
