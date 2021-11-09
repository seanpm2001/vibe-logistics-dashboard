import Layout from '/@/layout/index.vue';

export const cssShowRouter = [
  {
    path: '/eye-ball',
    component: () => import('/@/views/cssShow/eye.vue'),
    name: 'EyeBall',
    meta: { title: 'Eye Ball' }
  },
  {
    path: '/hover-card',
    component: () => import('/@/views/cssShow/hover-card.vue'),
    name: 'HoverCard',
    meta: { title: 'Hover Card' }
  },
  {
    path: '/starry-sky',
    component: () => import('/@/views/cssShow/starry-sky.vue'),
    target: true,
    name: 'StarrySky',
    meta: { title: 'Starry Sky' }
  },
  // {
  //   path: '/css',
  //   component: Layout,
  //   redirect: '/css/eye-ball',
  //   name: 'CssShow',
  //   meta: {
  //     title: 'CssShow',
  //     icon: 'component'
  //   },
  //   children: [
  //     {
  //       path: 'eye-ball',
  //       component: () => import('/@/views/cssShow/eye.vue'),
  //       name: 'EyeBall',
  //       meta: { title: 'Eye Ball' }
  //     },
  //     {
  //       path: 'hover-card',
  //       component: () => import('/@/views/cssShow/hover-card.vue'),
  //       name: 'HoverCard',
  //       meta: { title: 'Hover Card' }
  //     },
  //     {
  //       path: 'starry-sky',
  //       component: () => import('/@/views/cssShow/starry-sky.vue'),
  //       target: true,
  //       name: 'StarrySky',
  //       meta: { title: 'Starry Sky' }
  //     },
  //   ]
  // }
];
