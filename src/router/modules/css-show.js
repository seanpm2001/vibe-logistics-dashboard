import Layout from '/@/layout/index.vue';

export const cssShowRouter = [
  {
    path: '/glxy',
    component: () => import('/@/views/cssShow/Glxy.vue'),
    name: 'Glxy',
    meta: { title: 'Css Glxy' }
  },
  {
    path: '/parallax',
    component: () => import('/@/views/cssShow/Parallax.vue'),
    name: 'Parallax',
    meta: { title: 'Css Parallax' }
  },
  {
    path: '/parallax-scroll',
    component: () => import('/@/views/cssShow/Parallax-scroll.vue'),
    name: 'ParallaxScroll',
    meta: { title: 'Css Parallax Scroll' }
  },
  {
    path: '/streamer',
    component: () => import('/@/views/cssShow/Streamer.vue'),
    name: 'Streamer',
    meta: { title: 'Css Streamer' }
  },
  {
    path: '/iphone1',
    component: () => import('/@/views/cssShow/Iphone1.vue'),
    name: 'Iphone1',
    meta: { title: 'Css Iphone1' }
  },
  {
    path: '/iphone2',
    component: () => import('/@/views/cssShow/Iphone2.vue'),
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
        component: () => import('/@/views/cssShow/Eye.vue'),
        name: 'EyeBall',
        meta: { title: 'Eye Ball' }
      },
      {
        path: 'hover-card',
        component: () => import('/@/views/cssShow/Hover-card.vue'),
        name: 'HoverCard',
        meta: { title: 'Hover Card' }
      },
      {
        path: 'starry-sky',
        component: () => import('/@/views/cssShow/Starry-sky.vue'),
        name: 'StarrySky',
        meta: { title: 'Starry Sky' }
      },
    ]
  }
];
