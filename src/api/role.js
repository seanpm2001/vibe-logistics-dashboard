import requester from '/@/utils/http';

export async function getRoutesAPI() {
  const res = await requester.get('/routes');
  return res;
}

export async function getRolesAPI() {
  const res = await requester.get('/roles');
  return res;
}

export async function addRoleAPI(data) {
  const res = await requester.post('/role', data);
  return res;
}

export async function updateRoleAPI(id, data) {
  const res = await requester.post(`/role/${id}`, data);
  return res;
}

export async function deleteRoleAPI(id) {
  const res = await requester.delete(`/role/${id}`);
  return res;
}
