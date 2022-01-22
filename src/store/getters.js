const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  isLogined: state => state.user.isLogined,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissionRroutes: state => state.permission.routes,

  warehouseEnum: state => state.logistic.warehouseEnum,
  listQuery: (state, pageName) => state.logistic.listQuery,
};

export default getters;
