import Layout from '/@/layout/Layout.vue';
import BackBtn from '/@/components/BackBtn.vue';

export const cssShowRouter = [
  {
    path: '/starry-sky',
    components: {
      default: () => import('/@/views/cssShow/Starry-sky.vue'),
      backBtn: BackBtn
    },
    name: 'StarrySky',
    meta: { title: 'Css Starry Sky', icon: 'css-show' }
  },
  {
    path: '/iphone2',
    components: {
      default: () => import('/@/views/cssShow/Iphone2.vue'),
      backBtn: BackBtn
    },
    name: 'Iphone2',
    meta: { title: 'Css Iphone2', icon: 'css-show' }
  },
  {
    path: '/css',
    component: Layout,
    redirect: '/css/eye-ball',
    name: 'CssShow',
    meta: {
      title: 'Css Show',
      icon: 'css-show'
    },
    children: [
      {
        path: 'eye-ball',
        component: () => import('/@/views/cssShow/Eye.vue'),
        name: 'EyeBall',
        meta: { title: 'Eye Ball', icon: 'css-style' }
      },
      {
        path: 'hover-card',
        component: () => import('/@/views/cssShow/Hover-card.vue'),
        name: 'HoverCard',
        meta: { title: 'Hover Card', icon: 'css-style' }
      },
      {
        path: 'glxy',
        component: () => import('/@/views/cssShow/Glxy.vue'),
        name: 'Glxy',
        meta: { title: 'Glxy', icon: 'css-style' }
      },
      {
        path: 'parallax-scroll',
        component: () => import('/@/views/cssShow/Parallax-scroll.vue'),
        name: 'ParallaxScroll',
        meta: { title: 'Parallax Scroll', icon: 'css-style' },
      },
      {
        path: 'parallax',
        component: () => import('/@/views/cssShow/Parallax.vue'),
        name: 'Parallax',
        meta: { title: 'Parallax', icon: 'css-style' }
      },
      {
        path: 'streamer',
        component: () => import('/@/views/cssShow/Streamer.vue'),
        name: 'Streamer',
        meta: { title: 'Streamer', icon: 'css-style' }
      },
      {
        path: 'iphone1',
        component: () => import('/@/views/cssShow/Iphone1.vue'),
        name: 'Iphone1',
        meta: { title: 'Iphone1', icon: 'css-style' }
      },
    ]
  }
];
