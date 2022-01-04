import requester from '../axios-requester';

export async function loginAPI(formInfo) {
  requester.defaults.baseURL = '/api';
  const res = await requester.post('/user/login', formInfo);
  return res;
}

export async function getInfoAPI(token) {
  const res = await requester.get('/user/info', token);
  return res;
}

export async function logoutAPI() {
  const res = await requester.post('/user/logout');
  return res;
}
