import { loginAPI, logoutAPI, getInfoAPI } from '/@/api/logistic';
import { getToken, setToken, removeToken } from '/@/utils/auth';
import router, { resetRouter } from '/@/router';
import { useTagStore } from './tag';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: getToken(),
    username: null,
    avatar: '/@img/common/avatar.gif',
    email: null,
    role: null,
  }),
  actions: {
    // user login
    login(userInfo) {
      return new Promise((resolve, reject) => {
        loginAPI(userInfo).then(data => {
          this.token = data.accessToken;
          setToken(data.accessToken);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // get user info
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfoAPI().then(data => {
          if (!data)
            reject('Verification failed, please Login again.');

          const { role, username, email } = data;

          this.role = role;
          this.username = username;
          this.email = email;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        // logoutAPI(this.token).then(() => {
        this.token = null;
        this.role = null;
        removeToken();
        resetRouter();
        // reset visited views and cached views
        useTagStore().delAllViews(null, { root: true });

        resolve();
        router.go(0);
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // remove token
    resetToken() {
      return new Promise(resolve => {
        this.token = null;
        this.role = null;
        removeToken();
        resolve();
      });
    },
  }
});
