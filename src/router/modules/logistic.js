import Layout from '/@/layout/Layout.vue';

export const logisticRouter = [
  {
    path: '/logistic',
    component: Layout,
    redirect: '/logistic/order',
    meta: { title: 'Logistics', icon: 'logistics', noCache: true },
    children: [
      {
        path: 'order',
        component: () => import('/@/views/logistic/Order.vue'),
        name: 'Order',
        meta: { title: 'Order', icon: 'order' }
      },
      {
        path: 'tasklist',
        component: () => import('/@/views/logistic/TaskList.vue'),
        name: 'TaskList',
        meta: { title: 'Task List', icon: 'task' }
      },
      {
        path: 'mytask',
        component: () => import('/@/views/logistic/MyTask.vue'),
        name: 'MyTask',
        meta: { title: 'My Task', icon: 'task' }
      },
      {
        path: 'shipment',
        component: () => import('/@/views/logistic/Shipment.vue'),
        name: 'Shipment',
        meta: { title: 'Shipment', icon: 'shipment' }
      },
      {
        path: 'freight',
        component: () => import('/@/views/logistic/Freight.vue'),
        name: 'Freight',
        meta: { title: 'Freight', icon: 'freight' }
      },
      {
        path: 'inventory',
        component: () => import('/@/views/logistic/Inventory.vue'),
        name: 'Inventory',
        meta: { title: 'Inventory', icon: 'warehouse' }
      },
    ]
  },
];