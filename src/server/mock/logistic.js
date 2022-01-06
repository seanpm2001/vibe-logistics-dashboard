import Mock from 'mockjs';

const shipmentList = [];
const shipPackageList = [];
const orderList = [];
const count = 20;

for (let i = 0; i < count; i++) {
  shipmentList.push(Mock.mock({
    id: '@increment',
    order_id: 1,
    'shipping_carrier|1': ['UPS', 'GLS', 'Daylight'],
    'warehouse_task_type|1': ['FULFILLMENT', 'REPLACE', 'RETURN'],
    'last_modified': '2020-05-22T00:00:00',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    content: {
      '55V1B': 270,
      '55V1WS': 60
    }
  }));
}

for (let i = 0; i < 3; i++) {
  shipPackageList.push(Mock.mock({
    'tracking_number|1': ['52358899', '55658899', '54554465'],
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    'last_modified': '2020-05-22T00:00:00',
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
  'used_age|1': ['', 'within_3_months', '3_to_12_months'],
  'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
  'produced_date': '2021-07-15',
  'condition|1': ['Dam P only', 'Dam I only', 'Dam P & I'],
  'owner_id': 'COI-4564',
  'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
});

for (let i = 0; i < count; i++) {
  orderList.push(Mock.mock({
    order_id: '@increment',
    'last_modified|1': ['2020-05-22 by Vibe', '2020-05-22 by Warehouse'],
    'email|1': ['admin@vibe.us', 'test@vibe.us', 'guest@vibe.us'],
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    'serials|2-4': [{
      id: '@increment',
      'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033']
    }]
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
    url: RegExp('/api/shipment/[0-9]+/packages'),
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: {
          items: shipPackageList
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
  {
    url: '/api/orders',
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: {
          items: orderList,
          total: orderList.length
        }
      };
    }
  }
];
