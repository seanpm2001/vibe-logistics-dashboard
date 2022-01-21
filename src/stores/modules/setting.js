import defaultSettings from '/@/settings';

const { showSettings, tagsView, theme, fixedHeader, sidebarLogo } = defaultSettings;

export const setting = {
  id: 'setting',
  namespaced: true,
  state: {
    theme: theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data);
    }
  }
};
