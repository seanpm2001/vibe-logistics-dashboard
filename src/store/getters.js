const getters = {
  avatar: state => state.user.avatar,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
};

export default getters;
