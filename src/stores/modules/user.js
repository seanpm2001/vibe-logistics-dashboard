import { loginAPI, logoutAPI, getInfoAPI } from '/@/server/api/logistic';
import { getToken, setToken, removeToken } from '/@/utils/auth';
import router, { resetRouter } from '/@/router';

export const user = {
  id: 'user',
  namespaced: true,
  state: {
    isLogined: false,
    token: getToken(),
    name: '',
    avatar: '/@/assets/img/common/avatar.gif',
    introduction: '',
    roles: []
  },
  mutations: {
    SET_LOGINED: (state, isLogined) => {
      state.isLogined = isLogined;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },
  actions: {
    // user login
    login({ commit }, userInfo) {
      const { email, password } = userInfo;
      return new Promise((resolve, reject) => {
        loginAPI({ email, password }).then(data => {
          commit('SET_TOKEN', data.access_token);
          setToken(data.access_token);
          commit('SET_LOGINED', true);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfoAPI(state.token).then(response => {
          const { data } = response;

          if (!data) {
            reject('Verification failed, please Login again.');
          }

          const { roles, name, avatar, introduction } = data;

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!');
          }

          commit('SET_ROLES', roles);
          commit('SET_NAME', name);
          commit('SET_AVATAR', avatar);
          commit('SET_INTRODUCTION', introduction);
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // user logout
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logoutAPI(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();
          commit('SET_LOGINED', false);
          // reset visited views and cached views
          dispatch('tagsView/delAllViews', null, { root: true });

          resolve();
          router.go(0);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      });
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
      const token = role + '-token';
      commit('SET_TOKEN', token);
      setToken(token);
      const { roles } = await dispatch('getInfo');

      resetRouter();
      // generate accessible routes map based on roles

      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true });
      // dynamically add accessible routes
      accessRoutes.forEach(item => {
        router.addRoute(item);
      });

      // reset visited views and cached views
      dispatch('tagsView/delOthersViews', router.currentRoute.value, { root: true});
    }
  }
};
