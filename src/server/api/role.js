import requester from '../axios-requester';

export async function getRoutesAPI() {
  const res = await requester.get('/vue-element-admin/routes');
  return res;
}

export async function getRolesAPI() {
  const res = await requester.get('/vue-element-admin/roles');
  return res;
}

export async function addRoleAPI(data) {
  const res = await requester.post('/vue-element-admin/role', data);
  return res;
}

export async function updateRoleAPI(id, data) {
  const res = await requester.post(`/vue-element-admin/role/${id}`, data);
  return res;
}

export async function deleteRoleAPI(id) {
  const res = await requester.delete(`/vue-element-admin/role/${id}`);
  return res;
}
