/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

import { ElMessage } from 'element-plus';
import requester from '/@/utils/http';
import { jsonToUnderline } from '/@/utils/format';

const handleReqElMsg = async (fn, action, name, id) => {
  let item = null;
  const isCreation = action === 'create';
  await fn
    .then(_data => {
      item = _data?.item;
      ElMessage.success(`${action} ${name} (ID: ${isCreation ? _data.id : id}) successfully.`, 3);
    })
    .catch(() => ElMessage.error(`${action} ${name} ${isCreation ? '' : '(ID: ' + id +') '} failed.`, 3));
  
  return item;
};

/* 海运 Freight API */
export async function queryFreightsAPI (params) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  jsonToUnderline(params);
  const res = await requester.get('freights', {
    params,
  });
  return res;
}
export async function createFreightAPI (data) {
  jsonToUnderline(data);
  const item = handleReqElMsg(
    requester.post('freights', data), 'create', 'Freight'
  );
  return item;
}
export async function findFreightAPI (freightId) {
  const item = handleReqElMsg(
    requester.get(`freight/${freightId}`), 'Find', 'Freight', freightId
  );
  return item;
}
export async function updateFreightAPI (freightId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`freight/${freightId}`, updates), 'Update', 'Freight', freightId
  );
  return item;
}
export async function deleteFreightAPI (freightId) {
  handleReqElMsg(
    requester.delete(`freight/${freightId}`), 'Delete', 'Freight', freightId
  );
}

/* 批次 Batch API */
export async function listBatchesAPI (freightId) {
  const { items } = await requester.get(`freight/${freightId}/batches`);
  return items;
}
export async function createBatchAPI (freightId, data) {
  jsonToUnderline(data);
  const item = handleReqElMsg(
    requester.post(`freight/${freightId}/batches`, data), 'Create', 'Sub-Batch'
  );
  return item;
}
export async function updateBatchAPI (batchId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`batch/${batchId}`, updates), 'Update', 'Sub-Batch', batchId
  );
  return item;
}
export async function deleteBatchAPI (batchId) {
  handleReqElMsg(requester.delete(`batch/${batchId}`), 'Delete', 'Sub-Batch', batchId);
}

/* 订单 Order API */
export async function queryOrdersAPI (params) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  jsonToUnderline(params);

  const res = await requester.get('orders/raw', {
    params,
  });
  return res;
}
export async function queryAssignedOrdersAPI (params) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  jsonToUnderline(params);
  const res = await requester.get('orders/assigned', {
    params,
  });
  return res;
}
export async function findAssignedOrderAPI (orderId) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  const item = handleReqElMsg(
    requester.get(`orders/assigned/${orderId}`), 'Find', 'Assigned Order', orderId
  );
  return item;
}
export async function assignOrdersAPI (targetId, orderArr) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  const item = handleReqElMsg(
    requester.post('orders/assign', {
      assigned_to: targetId,
      raw_orders: orderArr,
    }), 'Assign', 'Order', orderArr
  );
  return item;
}
export async function unassignOrdersAPI (orderId) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  handleReqElMsg(
    requester.delete(`orders/assign/${orderId}`), 'Unassign', 'Order', orderId
  );
}


/* 仓库 Warehouse API */
export async function listWarehousesAPI (params) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  const { items } = await requester.get('warehouses', {
    params,
  });
  return items;
}

/* 仓库 Warehouse Tasks API */
export async function queryTasksAPI (params) {
  requester.defaults.baseURL = '/api';
  jsonToUnderline(params);
  const res = await requester.get('/mock/tasks', {
    params,
  });
  return res.data;
}

export async function findTaskAPI (taskId) {
  const item = handleReqElMsg(
    requester.get(`/tasks/${taskId}`), 'Find', 'Warehouse Task', taskId
  );
  return item;
}
export async function updateTaskAPI (taskId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`tasks/${taskId}`, updates), 'Update', 'Warehouse Task', taskId
  );
  return item;
}
export async function deleteTaskAPI (taskId) {
  handleReqElMsg(
    requester.delete(`tasks/${taskId}`), 'Delete', 'Warehouse Task', taskId
  );
}

/* 物流 Shipment API */
export async function listShipmentsAPI (orderId) {
  requester.defaults.baseURL = '/api';
  const res = await requester.get(`/mock/order/${orderId}/shipments`);
  return res.data;
}
export async function createShipmentAPI (taskId, data) {
  jsonToUnderline(data);
  const item = handleReqElMsg(
    requester.post(`task/${taskId}/shipments`, data), 'Create', 'Shipment'
  );
  return item;
}
export async function updateShipmentAPI (shipmentId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`shipment/${shipmentId}`, updates), 'Update', 'Shipment', shipmentId
  );
  return item;
}
export async function deleteShipmentAPI (shipmentId) {
  handleReqElMsg(
    requester.delete(`shipment/${shipmentId}`), 'Delete', 'Shipment', shipmentId
  );
}

/* 批次 Shipment Package API */
export async function queryPackagesAPI (shipmentId) {
  const res = await requester.get(`/packages`);
  return res.data;
}
export async function createPackageAPI (shipmentId, data) {
  jsonToUnderline(data);
  const item = handleReqElMsg(
    requester.post(`shipment/${shipmentId}/packages`, data), 'Create', 'Package'
  );
  return item;
}
export async function updatePackageAPI (packageId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`package/${packageId}`, updates), 'Update', 'Package', packageId
  );
  return item;
}
export async function deletePackageAPI (packageId) {
  handleReqElMsg(
    requester.delete(`package/${packageId}`), 'Delete', 'Package', packageId
  );
}

/* 单个商品 Unit API */
export async function listUnitsAPI () {
  const res = await requester.get(`/units`);
  return res.data.items;
}
export async function findUnitAPI (unitId) {
  // const item = handleReqElMsg(
  //   requester.get(`unit/${unitId}`), 'Find', 'Unit', unitId
  // );
  requester.defaults.baseURL = '/api';
  let item = null;
  await requester.get(`/mock/unit/${unitId}`)
    .then(_data => {
      item = _data.data.item;
      ElMessage.success(`Find Unit (ID: ${unitId}) successfully.`, 3);
    })
    .catch(() => ElMessage.error(`Find Order (ID: ${unitId}) failed.`, 3));
  return item;
}
export async function updateUnitAPI (unitId, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`unit/${unitId}`, updates), 'Update', 'Unit', unitId
  );
  return item;
}


/* 库存 Inventory API */
requester.defaults.baseURL = '/api';
export async function listInventoriesAPI (params) {
  const { data } = await requester.get('/mock/inventories', {
    params,
  });
  return data;
}

/* 用户配置 profile API 登录注册登出 */
export async function loginAPI(formInfo) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  let res = null;
  await requester.post('/login', formInfo)
    .then(_data => {
      res = _data;
      ElMessage.success(`Welcome to Vibe Logisitc System.`, 3);
    })
    .catch(() => ElMessage.error(`Wrong username or password.`, 3));
  return res;
}

export async function getInfoAPI(token) {
  requester.defaults.baseURL = '/api';
  const res = await requester.get('/mock/user/info', token);
  return res;
}

export async function logoutAPI() {
  requester.defaults.baseURL = '/api';
  await requester.post('/mock/user/logout')
    .then(() => ElMessage.success(`Log out successfully.`, 3))
    .catch(() => ElMessage.error(`Log out failed, please contact developer.`, 3));
}
