const pinia = createPinia();

export default pinia;

export { useAppStore } from './app';
export { useLogisticStore } from './logistic';
export { usePermissionStore } from './permission';
export { useSettingStore } from './setting';
export { useTagsViewStore } from './tagsView';
export { useUserStore } from './user';
