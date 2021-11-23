import Layout from '/@/layout/Layout.vue';

export const logisticRouter = [
  {
    path: '/logistic',
    component: Layout,
    redirect: '/logistic/order',
    meta: { title: 'Logisitc', icon: 'logistics', noCache: true },
    children: [
      {
        path: 'order',
        component: () => import('/@/views/logistic/Order.vue'),
        name: 'Order',
        meta: { title: 'Order', icon: 'order' }
      },
      {
        path: 'warehouse',
        component: () => import('/@/views/logistic/Warehouse.vue'),
        name: 'Warehouse',
        meta: { title: 'Warehouse', icon: 'warehouse' }
      }
    ]
  },
];