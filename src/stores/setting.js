import defaultSettings from '@/settings';

const { showSettings, tagsView, theme, fixedHeader, sidebarLogo } = defaultSettings;

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    theme: theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  }),
  actions: {
    changeSetting({key, value}) {
      if (Object.prototype.hasOwnProperty.call(this, key))
        this[key] = value;
    }
  }
});
