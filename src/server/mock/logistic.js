import Mock from 'mockjs';

const shipmentList = [];
const packageList = [];
const orderList = [];
const taskList = [];
const count = 20;

for (let i = 0; i < count; i++) {
  shipmentList.push(Mock.mock({
    id: '@increment',
    orderId: 1,
    'shippingCarrier|1': ['UPS', 'GLS', 'Daylight'],
    'warehouseTaskType|1': ['FULFILLMENT', 'REPLACE', 'RETURN'],
    'lastModified': '2020-05-22T00:00:00',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    content: {
      '55V1B': 270,
      '55V1WS': 60
    }
  }));
}

for (let i = 0; i < 20; i++) {
  packageList.push(Mock.mock({
    id: '@increment',
    'trackingNumber|1': ['52358899', '55658899', '54554465'],
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    'lastModified': '2020-05-22T00:00:00',
    content: {
      '55V1B': 90,
      '55V1WS': 20
    },
    'serials|2-4': [{
      id: '@increment',
      'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033']
    }]
  }));
}

const unitObj = Mock.mock({
  'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033'],
  'usedAge|1': ['WITHIN_3_MONTHS', 'BETWEEN_3_TO_12_MONTHS', 'OVER_12_MONTHS'],
  'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
  'producedDate': '2021-07-15',
  'condition|1': ['SCRAP', 'DAM_P_ONLY', 'DAM_U_ONLY'],
  'ownerId': 'COI-4564',
  'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
});

for (let i = 0; i < count; i++) {
  orderList.push(Mock.mock({
    orderId: '@increment',
    'lastModified|1': ['2020-05-22 by Vibe', '2020-05-22 by Warehouse'],
    'email|1': ['admin@vibe.us', 'test@vibe.us', 'guest@vibe.us'],
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    'serials|2-4': [{
      id: '@increment',
      'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033']
    }]
  }));
}

for (let i = 0; i < count; i++) {
  taskList.push(Mock.mock({
    id: '@increment',
    orderId: 1,
    'sourceId': '@integer(1, 18)',
    'targetId': '@integer(1, 18)',
    'warehouseTaskType|1': ['FULFILLMENT', 'REPLACE', 'RETURN'],
    'lastModified': '2020-05-22T00:00:00',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    content: {
      '55V1B': 270,
      '55V1WS': 60
    }
  }));
}

export default [
  // mock get all routes form server
  {
    url: '/api/shipments',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: shipmentList.length,
          items: shipmentList
        }
      };
    }
  },
  {
    url: RegExp('/packages'),
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: {
          items: packageList,
          total: packageList.length
        }
      };
    }
  },
  {
    url: RegExp('/api/unit/[0-9]+'),
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: {
          item: unitObj
        }
      };
    }
  },
  // {
  //   url: '/api/orders',
  //   type: 'get',
  //   response: config => {

  //     return {
  //       code: 20000,
  //       data: {
  //         items: orderList,
  //         total: orderList.length
  //       }
  //     };
  //   }
  // },
  // {
  //   url: '/api/orders/assign',
  //   type: 'post',
  //   response: config => {

  //     return {
  //       code: 20000,
  //       data: {
  //         items: [],
  //         msg: 'success'
  //       }
  //     };
  //   }
  // },
  {
    url: '/api/tasks',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: taskList.length,
          items: taskList
        }
      };
    }
  },
];
