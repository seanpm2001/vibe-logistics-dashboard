import { loginAPI, getInfoAPI } from '@/api';
import { setToken, removeToken } from '@/utils/auth';
import router, { asyncRoutes } from '@/router';
import { useTagsViewStore, usePermissionStore } from './index';

const resetRouter = () => {
  const asyncRouterNameArr = asyncRoutes.map((mItem) => mItem.name);
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
};

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: null,
    avatar: '@img/common/avatar.gif',
    email: null,
    role: null,
    warehouseId: null,
  }),
  actions: {
    M_username(username) {
      this.$patch((state) => state.username = username);
    },
    M_role(role) {
      this.$patch((state) => state.role = role);
    },
    M_email(email) {
      this.$patch((state) => state.email = email);
    },
    M_warehouseId(warehouseId) {
      this.$patch((state) => state.warehouseId = warehouseId);
    },
    // user login
    login(userInfo) {
      return new Promise((resolve, reject) => {
        loginAPI(userInfo).then(data => {
          setToken(data.accessToken);
          resolve(null);
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

          const { role, username, email, warehouseId } = data;

          this.M_username(username);
          this.M_role(role);
          this.M_email(email);
          warehouseId && this.M_warehouseId(warehouseId);
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        this.resetState();
      });
    },

    resetState() {
      return new Promise((resolve) => {
        this.M_username(null);
        this.M_role(null);
        removeToken(); // must remove  token  first
        resetRouter(); // reset the router
        const permissionStore = usePermissionStore();
        permissionStore.M_isGetUserInfo(false);
        const tagsViewStore = useTagsViewStore();
        tagsViewStore.delAllViews();
        router.go(0);
        resolve(null);
      });
    }
  }
});
