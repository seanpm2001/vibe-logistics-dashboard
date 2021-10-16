import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import { profileRouter } from '../views/profile/routes';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requireAuth: true
    },
  },
  {
    path: '/mock-test',
    name: 'MockTest',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/page/MockTest.vue')
  },
  ...profileRouter
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

/* 路由跳转之前判断 */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // const token = localStorage.token;
    const token = 'test';
    const isLogined = store.getters['profiles/getIsLogined'];
    !isLogined && store.dispatch('profiles/getUserByToken', token);
    if (typeof token !== 'string' || !token) {
      return next('login');
    }
  }
  next();
});

export default router;
