import Mock from 'mockjs';

const freightsList = [];
let freightObj = {};
const count = 100;

const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i++) {
  freightsList.push(Mock.mock({
    id: '@increment',
    eta_wh: +Mock.Random.date('T'),
    ata_wh: +Mock.Random.date('T'),
    eta_pod: +Mock.Random.date('T'),
    pickup: +Mock.Random.date('T'),
    reviewer: '@first',
    batch_number: '@title(3, 5)',
    content_short: 'mock data',
    forecast: '@float(0, 100, 2, 2)',
    content: {
      'board55_v1':'@integer(0, 40)',
      'stand55_v1':'@integer(0, 40)',
      'board75_pro':'@integer(0, 40)'
    },
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['In Transit', 'Delivered'],
    display_time: '@datetime',
    comment_disabled: true,
    image_uri,
    platforms: ['a-platform']
  }));
}

freightObj = Mock.mock({
  id: '@increment',
  eta_wh: +Mock.Random.date('T'),
  ata_wh: +Mock.Random.date('T'),
  eta_pod: +Mock.Random.date('T'),
  pickup: +Mock.Random.date('T'),
  reviewer: '@first',
  batch_number: '@title(3, 5)',
  content_short: 'mock data',
  forecast: '@float(0, 100, 2, 2)',
  content: {
    'board55_v1':'@integer(0, 40)',
    'stand55_v1':'@integer(0, 40)',
    'board75_pro':'@integer(0, 40)'
  },
  batch_subs: {

  },
  'type|1': ['CN', 'US', 'JP', 'EU'],
  'status|1': ['In Transit', 'Delivered'],
});

export default [
  // mock get all routes form server
  {
    url: '/api/freights',
    type: 'get',
    response: config => {
      const { content, type, title, page = 1, limit = 20, sort } = config.query;

      let mockList = freightsList.filter(item => {
        if (content && item?.content !== content) return false;
        if (type && item?.type !== type) return false;
        if (title && item?.title.indexOf(title) < 0) return false;
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
    url: RegExp('/api/freights/[\d+]'),
    type: 'get',
    response: config => {
      const { content, type, title, page = 1, limit = 20, sort } = config.query;

      let mockList = freightsList.filter(item => {
        if (content && item?.content !== content) return false;
        if (type && item?.type !== type) return false;
        if (title && item?.title.indexOf(title) < 0) return false;
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
];
