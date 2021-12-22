import Mock from 'mockjs';

const freightsList = [];
let freightObj = {};
const count = 100;

const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i++) {
  freightsList.push(Mock.mock({
    id: '@increment',
    eta_wh: String(+Mock.Random.date('T')),
    ata_wh: String(+Mock.Random.date('T')),
    ata_dp: String(+Mock.Random.date('T')),
    eta_dp: String(+Mock.Random.date('T')),
    etd_op: String(+Mock.Random.date('T')),
    atd_op: String(+Mock.Random.date('T')),
    pickup: String(+Mock.Random.date('T')),
    freight_cost: '@float(0, 100, 2, 2)',
    'batch_number|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
    'source|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
    'target|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
    ocean_forwarder: '@float(0, 100, 2, 2)',
    content: {
      'board55_v1':'@integer(0, 40)',
      'stand55_v1':'@integer(0, 40)',
      'board75_pro':'@integer(0, 40)'
    },
    batch_subs: {
    },
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'mode|1': ['Air', 'Ocean', 'Truck'],
    'transit_time_type|1': ['day', 'week'],
    'status|1': ['In Transit', 'Delivered'],
  }));
}

freightObj = Mock.mock({
  id: '@increment',
  'destination|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
  'batch_number|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
  eta_wh: String(+Mock.Random.date('T')),
  ata_wh: String(+Mock.Random.date('T')),
  ata_dp: String(+Mock.Random.date('T')),
  eta_dp: String(+Mock.Random.date('T')),
  etd_op: String(+Mock.Random.date('T')),
  atd_op: String(+Mock.Random.date('T')),
  pickup: String(+Mock.Random.date('T')),
  'target_id|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
  'status|1': ['In Transit', 'Delivered'],
  'mode|1': ['Air', 'Ocean', 'Truck'],
  'ori_port|1': ['FBA-US', 'FBA-CA', 'FBA-DE', 'FBA-UK', 'FBA-JP', 'IWIN', 'RED STAG', 'VIBE BEL', 'FPL-CA', 'FPL-AU', 'TOYOND', 'TCL', 'SF (Fuqing)', 'Jiguang', 'HH', 'Zhongao', 'TPV', 'Customer'],
  'dest_port|1': ['FBA-US', 'FBA-CA', 'FBA-DE', 'FBA-UK', 'FBA-JP', 'IWIN', 'RED STAG', 'VIBE BEL', 'FPL-CA', 'FPL-AU', 'TOYOND', 'TCL', 'SF (Fuqing)', 'Jiguang', 'HH', 'Zhongao', 'TPV', 'Customer'],
  'container|1': ['20GP', '40GP', '40HQ', '45HQ', 'LCL'],
  freight_cost: '@float(0, 100, 2, 2)',
  'source|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
  'target|1': ['LOT-80', 'LOT-79', 'CA-16', 'EU-18', 'AGL-8'],
  ocean_forwarder: '@float(0, 100, 2, 2)',
  'transit_time_type|1': ['day', 'week'],
  content: {
    'board55_v1':'@integer(0, 40)',
    'stand55_v1':'@integer(0, 40)',
    'board75_pro':'@integer(0, 40)'
  },
  batch_subs: {
  },
});

export default [
  // mock get all routes form server
  {
    url: RegExp('/api/freights/[0-9]+'),
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: freightObj
      };
    }
  },
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
];
