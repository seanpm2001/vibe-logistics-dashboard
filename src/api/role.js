import mockRequester from '/@/utils/http';

export async function getRoutesAPI() {
  const res = await mockRequester.get('/routes');
  return res;
}

export async function getRolesAPI() {
  const res = await mockRequester.get('/roles');
  return res;
}

export async function addRoleAPI(data) {
  const res = await mockRequester.post('/role', data);
  return res;
}

export async function updateRoleAPI(id, data) {
  const res = await mockRequester.post(`/role/${id}`, data);
  return res;
}

export async function deleteRoleAPI(id) {
  const res = await mockRequester.delete(`/role/${id}`);
  return res;
}
