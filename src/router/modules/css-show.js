import Layout from '/@/layout/Layout.vue';
import BackBtn from '/@/components/BackBtn.vue';

export const cssShowRouter = [
  {
    path: '/parallax-scroll',
    components: {
      default: () => import('/@/views/cssShow/Parallax-scroll.vue'),
      backBtn: BackBtn
    },
    name: 'ParallaxScroll',
    meta: { title: 'Css Parallax Scroll' },
    hidden: true
  },
  {
    path: '/starry-sky',
    components: {
      default: () => import('/@/views/cssShow/Starry-sky.vue'),
      backBtn: BackBtn
    },
    name: 'StarrySky',
    meta: { title: 'Starry Sky' }
  },
  {
    path: '/iphone2',
    components: {
      default: () => import('/@/views/cssShow/Iphone2.vue'),
      backBtn: BackBtn
    },
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
        path: 'glxy',
        component: () => import('/@/views/cssShow/Glxy.vue'),
        name: 'Glxy',
        meta: { title: 'Css Glxy' }
      },
      {
        path: 'parallax',
        component: () => import('/@/views/cssShow/Parallax.vue'),
        name: 'Parallax',
        meta: { title: 'Css Parallax' }
      },
      {
        path: 'streamer',
        component: () => import('/@/views/cssShow/Streamer.vue'),
        name: 'Streamer',
        meta: { title: 'Css Streamer' }
      },
      {
        path: 'iphone1',
        component: () => import('/@/views/cssShow/Iphone1.vue'),
        name: 'Iphone1',
        meta: { title: 'Css Iphone1' }
      },
    ]
  }
];
