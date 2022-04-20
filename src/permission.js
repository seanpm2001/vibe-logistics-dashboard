import router from './router/index';
import { useUserStore, usePermissionStore } from './store';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

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

  if (hasToken && hasToken !== 'undefined') {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      const userStore = useUserStore();
      const hasRole = !!userStore.role;
      // determine whether the user has obtained his permission role through getInfo
      if (hasRole) {
        next();
      } else {
        try {
          // get user info
          // note: role has GUEST, VIBE_OPERATOR, VIBE_MANAGER, WAREHOUSE, ADMIN
          const { role } = await userStore.getInfo();
          // generate accessible routes map based on role

          const accessRoutes = await usePermissionStore().generateRoutes(role);

          // dynamically add accessible routes
          accessRoutes.forEach(item => router.addRoute(item));
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (error) {
          console.log('error: ', error);
          // remove token and go to login page to re-login
          await userStore.resetToken();
          ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
          });
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    console.log('no user token');
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
