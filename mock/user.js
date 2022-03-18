
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
};

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'manager-token': {
    roles: ['manager'],
    introduction: 'I am an manager',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  'visitor-token': {
    roles: ['visitor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
};

export default [
  // user login
  // {
  //   url: '/api/mock/user/login',
  //   method: 'post',
  //   response: config => {
  //     // const { username } = config.body;
  //     // const token = tokens[username];

  //     // mock error
  //     // if (!token) {
  //     //   return {
  //     //     code: 60204,
  //     //     message: 'Account and password are incorrect.'
  //     //   };
  //     // }

  //     return {
  //       code: 20000,
  //       data: {
  //         token: 'admin-token'
  //       }
  //     };
  //   }
  // },

  // get user info
  {
    url: '/api/mock/user/info',
    method: 'get',
    response: config => {
      // const token = "admin-token"; // test
      const info = users['admin-token'];
      console.log('info: ', info);

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        };
      }

      return {
        code: 20000,
        data: info
      };
    }
  },

  // user logout
  {
    url: '/api/mock/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 20000,
        data: 'success'
      };
    }
  }
];
