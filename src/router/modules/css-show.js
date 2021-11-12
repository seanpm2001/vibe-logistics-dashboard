import Layout from '/@/layout/index.vue';

export const cssShowRouter = [
  {
    path: '/glxy',
    component: () => import('/@/views/cssShow/glxy.vue'),
    name: 'Glxy',
    meta: { title: 'Css Show Glxy' }
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
        path: 'parallax-scroll',
        component: () => import('/@/views/cssShow/parallax-scroll.vue'),
        name: 'ParallaxScroll',
        meta: { title: 'Parallax Scroll' }
      },
      {
        path: 'starry-sky',
        component: () => import('/@/views/cssShow/starry-sky.vue'),
        name: 'StarrySky',
        meta: { title: 'Starry Sky' }
      },
      {
        path: 'streamer',
        component: () => import('/@/views/cssShow/streamer.vue'),
        name: 'Streamer',
        meta: { title: 'Streamer' }
      },
    ]
  }
];
