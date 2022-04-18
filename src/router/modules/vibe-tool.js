export const vibeToolRouter = [
  {
    path: '/easy-quote',
    component: () => import('/@/views/vibe-tool/EasyQuote.vue'),
    hidden: true
  },
  {
    path: '/supply',
    component: () => import('/@/views/vibe-tool/Supply/Index.vue'),
    hidden: true
  },
  {
    path: '/test-png',
    component: () => import('/@/views/vibe-tool/TestPng.vue'),
    hidden: true
  },
];
