import Layout from '@/layout/Index.vue';
import BackBtn from '@/components/BackBtn.vue';

export const cssShowRouter = [
  {
    path: '/starry-sky',
    components: {
      default: () => import('@/views/css-show/Starry-sky.vue'),
      backBtn: BackBtn
    },
    name: 'StarrySky',
    meta: { title: 'Css Starry Sky', icon: 'sidebar-css-show' }
  },
  {
    path: '/iphone2',
    components: {
      default: () => import('@/views/css-show/Iphone2.vue'),
      backBtn: BackBtn
    },
    name: 'Iphone2',
    meta: { title: 'Css Iphone2', icon: 'sidebar-css-show' }
  },
  {
    path: '/css',
    component: Layout,
    redirect: '/css/eye-ball',
    name: 'CssShow',
    meta: {
      title: 'Css Show',
      icon: 'sidebar-css-show'
    },
    children: [
      {
        path: 'eye-ball',
        component: () => import('@/views/css-show/Eye.vue'),
        name: 'EyeBall',
        meta: { title: 'Eye Ball', icon: 'sidebar-css-style' }
      },
      {
        path: 'hover-card',
        component: () => import('@/views/css-show/Hover-card.vue'),
        name: 'HoverCard',
        meta: { title: 'Hover Card', icon: 'sidebar-css-style' }
      },
      {
        path: 'hover-style',
        component: () => import('@/views/css-show/Hover-style.vue'),
        name: 'HoverStyle',
        meta: { title: 'Hover Style', icon: 'sidebar-css-style' }
      },
      {
        path: 'glxy',
        component: () => import('@/views/css-show/Glxy.vue'),
        name: 'Glxy',
        meta: { title: 'Glxy', icon: 'sidebar-css-style' }
      },
      {
        path: 'parallax-scroll',
        component: () => import('@/views/css-show/Parallax-scroll.vue'),
        name: 'ParallaxScroll',
        meta: { title: 'Parallax Scroll', icon: 'sidebar-css-style' },
      },
      {
        path: 'parallax',
        component: () => import('@/views/css-show/Parallax.vue'),
        name: 'Parallax',
        meta: { title: 'Parallax', icon: 'sidebar-css-style' }
      },
      {
        path: 'streamer',
        component: () => import('@/views/css-show/Streamer.vue'),
        name: 'Streamer',
        meta: { title: 'Streamer', icon: 'sidebar-css-style' }
      },
      {
        path: 'iphone1',
        component: () => import('@/views/css-show/Iphone1.vue'),
        name: 'Iphone1',
        meta: { title: 'Iphone1', icon: 'sidebar-css-style' }
      },
      {
        path: 'countdown',
        component: () => import('@/views/css-show/Countdown.vue'),
        name: 'Countdown',
        meta: { title: 'Countdown', icon: 'sidebar-css-style' }
      },
    ]
  }
];
