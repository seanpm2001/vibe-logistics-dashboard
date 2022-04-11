import { asyncRoutes, constantRoutes } from '/@/router';
/**
 * Use meta.role to determine if the current user has permission
 * @param role
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role);
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

  routes.forEach(route => {
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

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    generateRoutes(role) {
      let accessedRoutes;
      if (role === 'ADMIN') {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, role);
      }
      this.addRoutes = accessedRoutes;
      this.routes = constantRoutes.concat(accessedRoutes);
      return accessedRoutes;
    }
  }
});
