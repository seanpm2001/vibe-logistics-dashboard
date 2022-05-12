import Layout from '@/layout/Index.vue';

export const logisticRouter = [
  {
    path: '/logistic',
    component: Layout,
    redirect: '/logistic/order',
    meta: { title: 'Logistics', icon: 'sidebar-logistics', noCache: true },
    children: [
      {
        path: 'order',
        component: () => import('@/views/logistic/OrderTable/Index.vue'),
        name: 'Order',
        meta: { title: 'Order', icon: 'sidebar-order' }
      },
      {
        path: 'task',
        component: () => import('@/views/logistic/TaskTable/Index.vue'),
        name: 'Task',
        meta: { title: 'WH Task', icon: 'sidebar-task' }
      },
      {
        path: 'pending-task',
        component: () => import('@/views/logistic/PendingTask/Index.vue'),
        name: 'PendingTask',
        meta: { title: 'Pending Task', icon: 'sidebar-task' },
        roles: ['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']
      },
      {
        path: 'package',
        component: () => import('@/views/logistic/PackageTable/Index.vue'),
        name: 'ShipmentPackage',
        meta: { title: 'Package', icon: 'sidebar-package' }
      },
      {
        path: 'freight',
        component: () => import('@/views/logistic/FreightTable/Index.vue'),
        name: 'Freight',
        meta: { title: 'Freight', icon: 'sidebar-freight' }
      },
      {
        path: 'inventory',
        component: () => import('@/views/logistic/InventoryTable.vue'),
        name: 'Inventory',
        meta: { title: 'Inventory', icon: 'sidebar-warehouse' }
      },
    ]
  },
];
