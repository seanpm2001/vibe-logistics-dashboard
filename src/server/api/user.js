import requester from '../axios-requester';

export async function loginAPI(formInfo) {
  const res = await requester.post('/vue-element-admin/user/login', formInfo);
  return res;
}

export async function getInfoAPI(token) {
  const res = await requester.get('/vue-element-admin/user/info', token);
  return res;
}

export async function logoutAPI() {
  const res = await requester.post('/vue-element-admin/user/logout');
  return res;
}
