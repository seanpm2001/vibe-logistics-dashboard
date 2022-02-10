import Mock from 'mockjs';

const shipmentList = [];
const packageList = [];
const unitList = [];
const taskList = [];
const count = 50;

for (let i = 0; i < count; i++) {
  shipmentList.push(Mock.mock({
    id: '@increment',
    orderId: 1,
    'shippingCarrier|1': ['UPS', 'GLS', 'Daylight'],
    'warehouseTaskType|1': ['FULFILLMENT', 'REPLACE', 'RETURN'],
    'lastModified': '2020-05-22 by vibe',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    content: {
      '55V1B': 270,
      '55V1WS': 60
    }
  }));
}

for (let i = 0; i < 50; i++) {
  packageList.push(Mock.mock({
    id: '@increment',
    'trackingNumber|1': ['52358899', '55658899', '54554465'],
    'shippingCarrier|1': ['UPS', 'GLS', 'Daylight'],
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    'lastModified': '2020-05-22 by vibe',
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
  'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033', 'QTXM8AB001011', 'QTXM8AB001022', 'QTXM8AB001045'],
  'usedAge|1': ['WITHIN_3_MONTHS', 'BETWEEN_3_TO_12_MONTHS', 'OVER_12_MONTHS'],
  'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
  'producedDate': '2021-07-15',
  'condition|1': ['SCRAP', 'DAM_P_ONLY', 'DAM_U_ONLY', 'DAM_P_AND_U', 'DAM_U_NOT_SHIP'],
  'ownerId': 'COI-4564',
  'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
});

for (let i = 0; i < 20; i++) {
  unitList.push(Mock.mock({
    'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033', 'QTXM8AB001011', 'QTXM8AB001022', 'QTXM8AB001045'],
    'usedAge|1': ['WITHIN_3_MONTHS', 'BETWEEN_3_TO_12_MONTHS', 'OVER_12_MONTHS'],
    'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
    'producedDate': '2021-07-15',
    'condition|1': ['SCRAP', 'DAM_P_ONLY', 'DAM_U_ONLY', 'DAM_P_AND_U', 'DAM_U_NOT_SHIP'],
    'ownerId': 'COI-4564',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
  }));
}
for (let i = 0; i < count; i++) {
  taskList.push(Mock.mock({
    id: '@integer(1, 23)',
    orderId: 1,
    'sourceId': '@integer(1, 18)',
    'targetId': '@integer(1, 18)',
    'warehouseTaskType|1': ['FULFILLMENT', 'REPLACE', 'RETURN'],
    'lastModified': '2020-05-22 by vibe',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
    content: {
      '55V1B': 270,
      '55V1WS': 60
    }
  }));
}

const inventoryList = [];
for (let i = 0; i < count; i++) {
  inventoryList.push(Mock.mock({
    warehouse_name: '@title(1, 2)',
    in_stock: {
      'board55_v1':'@integer(0, 80)',
      'stand_red55_v1':'@integer(0, 80)',
      'stand_white55_v1':'@integer(0, 80)',
      'stylus55_x2': '@integer(0, 80)',
      'stylus55_active': '@integer(0, 80)',
      'board75_pro':'@integer(0, 80)',
      'stand75_pro':'@integer(0, 80)', 
      'ops75_pro':'@integer(0, 80)',
    },
    available: {
      'board55_v1':'@integer(0, 80)',
      'stand_red55_v1':'@integer(0, 80)',
      'stand_white55_v1':'@integer(0, 80)',
      'stylus55_x2': '@integer(0, 80)',
      'stylus55_active': '@integer(0, 80)',
      'board75_pro':'@integer(0, 80)',
      'stand75_pro':'@integer(0, 80)', 
      'ops75_pro':'@integer(0, 80)',
    },
    pending_in: {
      'board55_v1':'@integer(0, 80)',
      'stand_red55_v1':'@integer(0, 80)',
      'stand_white55_v1':'@integer(0, 80)',
      'stylus55_x2': '@integer(0, 80)',
      'stylus55_active': '@integer(0, 80)',
      'board75_pro':'@integer(0, 80)',
      'stand75_pro':'@integer(0, 80)', 
      'ops75_pro':'@integer(0, 80)',
    },
    pending_out: {
      'board55_v1':'@integer(0, 80)',
      'stand_red55_v1':'@integer(0, 80)',
      'stand_white55_v1':'@integer(0, 80)',
      'stylus55_x2': '@integer(0, 80)',
      'stylus55_active': '@integer(0, 80)',
      'board75_pro':'@integer(0, 80)',
      'stand75_pro':'@integer(0, 80)', 
      'ops75_pro':'@integer(0, 80)',
    },
  }));
}

export default [
  // mock get all routes form server
  {
    url: '/mock/api/shipments',
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
    url: RegExp('/units'),
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: {
          items: unitList,
          total: unitList.length
        }
      };
    }
  },
  {
    url: RegExp('/mock/api/unit/[0-9]+'),
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
    url: '/mock/api/tasks',
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
  {
    url: '/mock/api/inventories',
    type: 'get',
    response: config => {
      const { type, warehouse_name, page = 1, limit = 20, sort } = config.query;

      let mockList = inventoryList.filter(item => {
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
  }
];
