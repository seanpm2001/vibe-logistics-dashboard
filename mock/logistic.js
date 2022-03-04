import Mock from 'mockjs';

const unitList = [];
const count = 50;


const unitObj = Mock.mock({
  'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033', 'QTXM8AB001011', 'QTXM8AB001022', 'QTXM8AB001045'],
  'usedAge|1': ['BRAND_NEW', 'WITHIN_3_MONTHS', 'BETWEEN_3_TO_12_MONTHS', 'OVER_12_MONTHS'],
  'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
  'producedDate': '2021-07-15',
  'condition|1': ['SCRAP', 'GOOD', 'DAMAGED'],
  'ownerId': 'COI-4564',
  'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
});

for (let i = 0; i < 20; i++) {
  unitList.push(Mock.mock({
    'serial|1': ['QCXM8JA001420', 'QCXM8JA001011', 'QTXM8AB001033', 'QTXM8AB001011', 'QTXM8AB001022', 'QTXM8AB001045'],
    'usedAge|1': ['BRAND_NEW', 'WITHIN_3_MONTHS', 'BETWEEN_3_TO_12_MONTHS', 'OVER_12_MONTHS'],
    'sku|1': ['V55N201W/WOS', 'V55N203W', 'V55N205W', 'V55N203WR', 'V55N205WR'],
    'producedDate': '2021-07-15',
    'condition|1': ['SCRAP', 'GOOD', 'DAMAGED'],
    'ownerId': 'COI-4564',
    'status|1': ['LOST', 'DELIVERED', 'RETURNED'],
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
