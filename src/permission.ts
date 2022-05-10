import router from './router/index';
import { useUserStore, usePermissionStore } from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import { getPageTitle, tryHideFullScreenLoading, showFullScreenLoading } from '@/utils';


NProgress.configure({ showSpinner: false }); // NProgress Configuration
// no redirect whitelist
const whiteList = ['/login', '/auth-redirect', '/easy-quote', '/supply', '/test-png'];

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  if (hasToken && hasToken !== 'undefined') {
    if (to.path === '/login') { // if is logged in, redirect to the home page
      next({ path: '/' }); 
    } else {
      const isGetUserInfo = permissionStore.isGetUserInfo;
      if (isGetUserInfo) {
        showFullScreenLoading();
        next();
      } else {
        try {
          let accessRoutes = [];
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { role } = await userStore.getInfo();
          accessRoutes = await permissionStore.generateRoutes(role);
       
          // setting constRouters and accessRoutes to vuex , in order to sideBar for using
          permissionStore.M_routes(accessRoutes);
          // dynamically add accessible routes
          //router4 addRoutes destroyed
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });
          //already get userInfo
          permissionStore.M_isGetUserInfo(true);
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (error) {
          console.log('error: ', error);
          await userStore.resetState();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      if (settings.isNeedNprogress) NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  tryHideFullScreenLoading();
  NProgress.done();
});
