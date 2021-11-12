import Layout from '/@/layout/index.vue';

export const cssShowRouter = [
  {
    path: '/glxy',
    component: () => import('/@/views/cssShow/glxy.vue'),
    name: 'Glxy',
    meta: { title: 'Css Glxy' }
  },
  {
    path: '/streamer',
    component: () => import('/@/views/cssShow/streamer.vue'),
    name: 'Streamer',
    meta: { title: 'Css Streamer' }
  },
  // {
  //   path: '/parallax-scroll',
  //   component: () => import('/@/views/cssShow/parallax-scroll.vue'),
  //   name: 'ParallaxScroll',
  //   meta: { title: 'Css Parallax Scroll' }
  // },
  {
    path: '/iphone1',
    component: () => import('/@/views/cssShow/iphone1.vue'),
    name: 'Iphone1',
    meta: { title: 'Css Iphone1' }
  },
  {
    path: '/iphone2',
    component: () => import('/@/views/cssShow/iphone2.vue'),
    name: 'Iphone2',
    meta: { title: 'Css Iphone2' }
  },
  {
    path: '/css',
    component: Layout,
    redirect: '/css/eye-ball',
    name: 'CssShow',
    meta: {
      title: 'Css Show',
      icon: 'component'
    },
    children: [
      {
        path: 'eye-ball',
        component: () => import('/@/views/cssShow/eye.vue'),
        name: 'EyeBall',
        meta: { title: 'Eye Ball' }
      },
      {
        path: 'hover-card',
        component: () => import('/@/views/cssShow/hover-card.vue'),
        name: 'HoverCard',
        meta: { title: 'Hover Card' }
      },
      {
        path: 'starry-sky',
        component: () => import('/@/views/cssShow/starry-sky.vue'),
        name: 'StarrySky',
        meta: { title: 'Starry Sky' }
      },
    ]
  }
];
