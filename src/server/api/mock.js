/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

// import requester from '../axios-requester';


/* 用户配置 profile API 登录注册登出 */
const Mock = require("mockjs");
// const Random = Mock.Random;

Mock.mock(RegExp('/api/users' + ".*"), 'get', options => {
  const {
    token,
  } = JSON.parse(options);
  if (token === 'test') {
    return {
      code: 200,
      username: 'test'
    };
  } else {
    return {
      code: 400
    };
  }
});
