import Layout from '/@/layout/Layout.vue';

export const logisticRouter = [
  {
    path: '/logistic',
    component: Layout,
    redirect: '/logistic/order',
    meta: { title: 'Logistics', icon: 'sidebar-logistics', noCache: true },
    children: [
      {
        path: 'order',
        component: () => import('/@/views/logistic/Order.vue'),
        name: 'Order',
        meta: { title: 'Order', icon: 'sidebar-order' }
      },
      {
        path: 'task',
        component: () => import('/@/views/logistic/WarehouseTask.vue'),
        name: 'task',
        meta: { title: 'WH Task', icon: 'sidebar-task' }
      },
      {
        path: 'package',
        component: () => import('/@/views/logistic/ShipmentPackage.vue'),
        name: 'ShipmentPackage',
        meta: { title: 'Package', icon: 'sidebar-package' }
      },
      {
        path: 'freight',
        component: () => import('/@/views/logistic/Freight.vue'),
        name: 'Freight',
        meta: { title: 'Freight', icon: 'sidebar-freight' }
      },
      {
        path: 'inventory',
        component: () => import('/@/views/logistic/Inventory.vue'),
        name: 'Inventory',
        meta: { title: 'Inventory', icon: 'sidebar-warehouse' }
      },
    ]
  },
];
