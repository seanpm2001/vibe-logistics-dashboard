export const profileRouter = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('../index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: { title: '注册' },
    component: () => import('./Register.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    meta: { title: '忘记密码' },
    component: () => import('./Forget.vue')
  }
];
