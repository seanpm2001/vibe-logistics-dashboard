import { defineStore } from 'pinia';
import { asyncRoutes, constantRoutes } from '@/router';

/**
 * Use meta.role to determine if the current user has permission
 * @param role
 * @param route
 */
function hasPermission(role, route) {
  const roles = route.meta?.roles;
  if (roles) {
    return roles?.includes(role);
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param role
 */
export function filterAsyncRoutes(routes, role) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role);
      }
      res.push(tmp);
    }
  });

  return res;
}

export const usePermissionStore = defineStore('permission', {
  /***
   *类似于组件的 data数据的 ,用来存储全局状态的
   * 1、必须是箭头函数
   */
  state: () => {
    return {
      isGetUserInfo: false, // get userInfo
      routes: [], //将过滤后的异步路由和静态路由集合
      addRoutes: [] //过滤后的异步路由
    };
  },

  /***
   *封装处理数据的函数（业务逻辑)：修改数据
   */
  actions: {
    M_routes(routes) {
      this.$patch((state) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes);
      });
    },
    M_isGetUserInfo(data) {
      this.$patch((state) => state.isGetUserInfo = data);
    },
    generateRoutes(role) {
      return new Promise((resolve) => {
        let accessedRoutes;
        //filter by role
        if (role === 'ADMIN') {
          accessedRoutes = asyncRoutes || [];
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, role);
        }
        resolve(accessedRoutes);
      });
    }
  }
});
