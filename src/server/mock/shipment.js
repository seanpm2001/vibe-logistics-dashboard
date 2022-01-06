import Mock from 'mockjs';

const dataList = [];
const dataItemList = [];
const count = 20;

for (let i = 0; i < count; i++) {
  dataList.push(Mock.mock({
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
  dataItemList.push(Mock.mock({
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

export default [
  // mock get all routes form server
  {
    url: '/api/shipments',
    type: 'get',
    response: config => {
      const { type, warehouse_name, page = 1, limit = 20, sort } = config.query;

      let mockList = dataList.filter(item => {
        if (warehouse_name && item?.warehouse_name.indexOf(warehouse_name) < 0) return false;
        return true;
      });

      if (sort === '-id') {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
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
          items: dataItemList
        }
      };
    }
  }
];
