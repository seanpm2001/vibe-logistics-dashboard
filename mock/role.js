import { asyncRoutes, constantRoutes } from './routes';

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}


const routes = deepClone([...constantRoutes, ...asyncRoutes]);

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
];

export default [
  // mock get all routes form server
  {
    url: '/api/mock/routes',
    method: 'get',
    response: () => {
      return {
        code: 20000,
        data: routes
      };
    }
  },

  // mock get all roles form server
  {
    url: '/api/mock/roles',
    method: 'get',
    response: () => {
      return {
        code: 20000,
        data: roles
      };
    }
  },

  // add role
  {
    url: '/api/mock/role',
    method: 'post',
    response: {
      code: 20000,
      data: {
        key: 400
      }
    }
  },

  // update role
  {
    url: RegExp('/api/mock/role/[A-Za-z0-9]'),
    method: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: RegExp('/api/mock/role/[A-Za-z0-9]'),
    method: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
];
