// import { store } from '/@/stores';
// import { defineStore } from 'pinia';
// import defaultSettings from '/@/settings';

// const { showSettings, tagsView, theme, fixedHeader, sidebarLogo } = defaultSettings;

// export const useSettingStore = defineStore({
//   id: 'setting',
//   state: () => ({
//     theme: theme,
//     showSettings: showSettings,
//     tagsView: tagsView,
//     fixedHeader: fixedHeader,
//     sidebarLogo: sidebarLogo
//   }),

//   actions: {
//     changeSetting(payload) {
//       const { key, value } = payload;
//       const state = this.$state;
//       if (Object.prototype.hasOwnProperty.call(state, key)) {
//         this[key] = value;
//       }
//     }
//   }
// });
