import { loginAPI, logoutAPI, getInfoAPI } from '/@/api/logistic';
import { getToken, setToken, removeToken } from '/@/utils/auth';
import router, { resetRouter } from '/@/router';

export const user = {
  namespaced: true,
  state: {
    isLogined: false,
    token: getToken(),
    username: null,
    avatar: '/@/assets/img/common/avatar.gif',
    email: null,
    role: null,
  },
  mutations: {
    SET_LOGINED: (state, isLogined) => {
      state.isLogined = isLogined;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EMAIL: (state, email) => {
      state.email = email;
    },
    SET_NAME: (state, username) => {
      state.username = username;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLE: (state, role) => {
      state.role = role;
    }
  },
  actions: {
    // user login
    login({ commit }, userInfo) {
      const { email, password } = userInfo;
      return new Promise((resolve, reject) => {
        loginAPI({ email, password }).then(_data => {
          commit('SET_TOKEN', _data.access_token);
          setToken(_data.access_token);
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
        getInfoAPI(state.token).then(data => {

          if (!data) {
            reject('Verification failed, please Login again.');
          }

          const { role, username, avatar, email } = data;

          // role must be a non-empty array
          if (!role || role.length <= 0) {
            reject('getInfo: role must be a non-null array!');
          }

          commit('SET_ROLE', role);
          commit('SET_NAME', username);
          // commit('SET_AVATAR', avatar);
          commit('SET_EMAIL', email);
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
          commit('SET_ROLE', []);
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
        commit('SET_ROLE', []);
        removeToken();
        resolve();
      });
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }) {
      setToken(token);
      const { role } = await dispatch('getInfo');

      resetRouter();
      // generate accessible routes map based on role

      const accessRoutes = await dispatch('permission/generateRoutes', role, { root: true });
      // dynamically add accessible routes
      accessRoutes.forEach(item => {
        router.addRoute(item);
      });

      // reset visited views and cached views
      dispatch('tagsView/delOthersViews', router.currentRoute.value, { root: true});
    }
  }
};
