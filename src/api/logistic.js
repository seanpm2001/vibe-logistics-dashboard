/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

import { ElMessage } from 'element-plus';
import requester from './http';

const handleReqElMsg = (fn, action, name, identifier) => {
  return new Promise((resolve, reject) => {
    let item = null;
    const isCreation = action === 'Create';
    fn
      .then(_data => {
        item = _data?.item;
        resolve(item);
        ElMessage.success(`${action} ${name} (ID: ${isCreation ? item.id : identifier}) successfully.`, 5);
      })
      .catch(err => {
        ElMessage.error(`${action} ${name} ${isCreation ? '' : identifier } failed.`, 5);
        reject(err);
      });
  });
};

/* 海运 Freight API */
export async function queryFreightsAPI (params) {
  const res = await requester.get('freights', {
    params,
  });
  return res;
}
export async function createFreightAPI (data) {
  const item = handleReqElMsg(
    requester.post('freights', data), 'Create', 'Freight'
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
  const item = handleReqElMsg(
    requester.post(`freight/${freightId}/batches`, data), 'Create', 'Sub-Batch'
  );
  return item;
}
export async function updateBatchAPI (batchId, updates) {
  const item = handleReqElMsg(
    requester.put(`batch/${batchId}`, updates), 'Update', 'Sub-Batch', batchId
  );
  return item;
}
export async function deleteBatchAPI (batchId) {
  handleReqElMsg(
    requester.delete(`batch/${batchId}`), 'Delete', 'Sub-Batch', batchId
  );
}

/* 订单 Order API */
export async function queryOrdersAPI (params) {
  const res = await requester.get('orders/raw', {
    params,
  });
  return res;
}
export async function queryAssignedOrdersAPI (params) {
  const res = await requester.get('orders/assigned', {
    params,
  });
  return res;
}
export async function queryAssignedBatchOrdersAPI (orderIdArr) {
  const orderIdStr = orderIdArr.join(',');
  const res = await requester.get('/orders/assigned/batch/' + orderIdStr);
  return res.items;
}
export async function findAssignedOrderAPI (orderId) {
  const item = handleReqElMsg(
    requester.get(`orders/assigned/${orderId}`), 'Find', 'Assigned Order', orderId
  );
  return item;
}
export async function assignOrdersAPI (sourceId, orderArr) {
  const item = handleReqElMsg(
    requester.post('orders/assign', {
      assigned_to: sourceId,
      raw_orders: orderArr,
    }), 'Assign', 'Order', orderArr
  );
  return item;
}
export async function unassignOrdersAPI (orderId) {
  handleReqElMsg(
    requester.delete(`orders/assigned/${orderId}`), 'Unassign', 'Order', orderId
  );
}


/* 仓库 Warehouse API */
export async function listWarehousesAPI (params) {
  const { items } = await requester.get('warehouses', {
    params,
  });
  return items;
}

/* 仓库 Warehouse Tasks API */
export async function queryTasksAPI (params) {
  const res = await requester.get('/warehouse/tasks', {
    params,
  });
  return res;
}
export async function createTaskAPI (data) {
  const item = handleReqElMsg(
    requester.post('/warehouse/tasks', data), 'Create', 'Warehouse task'
  );
  return item;
}
export async function findTaskAPI (taskId) {
  const item = handleReqElMsg(
    requester.get(`/warehouse/task/${taskId}`), 'Find', 'Warehouse Task', taskId
  );
  return item;
}
export async function updateTaskAPI (taskId, updates) {
  delete updates['packages'];
  const item = handleReqElMsg(
    requester.put(`/warehouse/task/${taskId}`, updates), 'Update', 'Warehouse Task', taskId
  );
  return item;
}
export async function deleteTaskAPI (taskId) {
  handleReqElMsg(
    requester.delete(`/warehouse/task/${taskId}`), 'Delete', 'Warehouse Task', taskId
  );
}
export async function createShipmentUnitsAPI (taskId, data) {
  const item = handleReqElMsg(
    requester.post(`/warehouse/task/${taskId}/units`, data), 'Create', 'Package'
  );
  return item;
}


/* 批次 Shipment Package API */
export async function queryPackagesAPI (params) {
  const res = await requester.get('/warehouse/packages', {
    params,
  });
  return res;
}
export async function createPackageAPI (taskId, data) {
  const item = handleReqElMsg(
    requester.post(`/warehouse/task/${taskId}/packages`, data), 'Create', 'Package'
  );
  return item;
}
export async function getTaskPackagesAPI (taskId) {

  const res = await requester.get(`/warehouse/task/${taskId}/packages`);
  return res.items;
}
export async function updatePackageAPI (packageId, updates) {
  const item = handleReqElMsg(
    requester.put(`/warehouse/package/${packageId}`, updates), 'Update', 'Package', packageId
  );
  return item;
}
export async function deletePackageAPI (packageId) {
  handleReqElMsg(
    requester.delete(`/warehouse/package/${packageId}`), 'Delete', 'Package', packageId
  );
}

/* Warehousing API */
export async function updatePackageUnitAPI(packageId, unitId, updates) {
  const item = handleReqElMsg(
    requester.put(`/warehouse/package/${packageId}/unit/${unitId}`, updates), 'Update', 'Package Unit', unitId
  );
  return item;
}

/* 单个商品 Unit API */
export async function queryUnitsAPI (params) {
  const res = await requester.get('/units/search', { params });
  return res.items;
}
export async function updateUnitAPI (unitSerial, updates) {
  const item = handleReqElMsg(
    requester.put(`unit/${unitSerial}`, updates), 'Update', 'Unit', unitSerial
  );
  return item;
}


/* 库存 Inventory API */
export async function listInventoriesAPI (params) {
  const { data } = await requester.get('/mock/inventories', {
    params,
  });
  return data;
}

/* 用户配置 profile API 登录注册登出 */
export async function loginAPI(formInfo) {
  let res = null;
  await requester.post('/login', formInfo)
    .then(_data => {
      res = _data;
      ElMessage.success('Welcome to Vibe Logisitc System.', 5);
    })
    .catch(() => ElMessage.error('Wrong username or password.', 3));
  return res;
}

export async function getInfoAPI() {
  const res = await requester.get('/me');
  return res;
}

// export async function logoutAPI() {
//   await mockRequester.post('/user/logout')
//     .then(() => ElMessage.success('Log out successfully.', 3))
//     .catch(() => ElMessage.error('Log out failed, please contact developer.', 3));
// }
