import Mock from 'mockjs';

const inventoryList = [];
const count = 20;

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

console.log('inventoryList: ', inventoryList);
export default [
  // mock get all routes form server
  {
    url: '/api/warehouses',
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
