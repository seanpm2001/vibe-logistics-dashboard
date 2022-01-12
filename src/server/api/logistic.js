/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

import { ElMessage } from 'element-plus';
import "element-plus/theme-chalk/src/message.scss";
import requester from '../axios-requester';
import { jsonToUnderline } from '/@/assets/utils/format';

const handleReqElMsg = async (fn, action, name, id) => {
  let item = null;
  const isCreation = action === 'create';
  await fn
    .then(data => {
      item = data?.item;
      ElMessage.success(`${action} ${name} (ID: ${isCreation ? data.id : id}) successfully.`, 3);
    })
    .catch(() => ElMessage.error(`${action} ${name} ${isCreation ? '' : '(ID: ' + id +') '} failed.`, 3));
  
  return item;
};

// const handleReqListElMsg = async (fn, name) => {
//   let res = null;
//   await fn
//     .then(data => {
//       res = data;
//       ElMessage.success(`Query ${name} successfully.`, 3);
//     })
//     .catch(() => ElMessage.error(`Query ${name} failed.`, 3));
  
//   return res;
// };

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
export async function findFreightAPI (id) {
  const item = handleReqElMsg(
    requester.get(`freight/${id}`), 'Find', 'Freight', id
  );
  return item;
}
export async function updateFreightAPI (id, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`freight/${id}`, updates), 'Update', 'Freight', id
  );
  return item;
}
export async function deleteFreightAPI (id) {
  handleReqElMsg(
    requester.delete(`freight/${id}`), 'Delete', 'Freight', id
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
// export async function findBatchAPI (id) {
//   const { item } = await requester.get(`batch/${id}`);
//   return item;
// }
export async function updateBatchAPI (id, updates) {
  jsonToUnderline(updates);
  const item = handleReqElMsg(
    requester.put(`batch/${id}`, updates), 'Update', 'Sub-Batch', id
  );
  return item;
}
export async function deleteBatchAPI (id) {
  handleReqElMsg(requester.delete(`batch/${id}`), 'Delete', 'Sub-Batch', id);
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
export async function assignOrdersAPI (targetId, orderArr) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  handleReqElMsg(
    requester.post('orders/assign', {
      assigned_to: targetId,
      raw_orders: orderArr,
    }), 'Assign', 'Order', orderArr
  );
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
  const res = await requester.get('tasks', {
    params,
  });
  return res.data;
}

/* 物流 Shipment API */
export async function queryShipmentsAPI (params) {
  requester.defaults.baseURL = '/api';
  jsonToUnderline(params);
  const res = await requester.get('shipments', {
    params,
  });
  return res.data;
}

export async function deleteShipmentAPI (id) {
  handleReqElMsg(
    requester.delete(`shipment/${id}`), 'Delete', 'Shipment', id
  );
}

/* 批次 Shipment Package API */
export async function listShipPackagesAPI (shipmentId) {
  const res = await requester.get(`shipment/${shipmentId}/packages`);
  return res.data.items;
}

/* 单个商品 Unit API */
export async function findUnitAPI (id) {
  // const item = handleReqElMsg(
  //   requester.get(`unit/${id}`), 'Find', 'Unit', id
  // );
  requester.defaults.baseURL = '/api';
  let item = null;
  await requester.get(`unit/${id}`)
    .then(data => {
      console.log('data: ', data);
      item = data.data.item;
      ElMessage.success(`Find Unit (ID: ${id}) successfully.`, 3);
    })
    .catch(() => ElMessage.error(`Find Order (ID: ${id}) failed.`, 3));
  return item;
}


/* 库存 Inventory API */
requester.defaults.baseURL = '/api';
export async function listInventoriesAPI (params) {
  const { data } = await requester.get('inventories', {
    params,
  });
  return data;
}

/* 用户配置 profile API 登录注册登出 */
export async function loginAPI(formInfo) {
  requester.defaults.baseURL = 'https://logistics.vibe.dev/api';
  let res = null;
  await requester.post('/login', formInfo)
    .then(data => {
      res = data;
      ElMessage.success(`Welcome to Vibe Logisitc System.`, 3);
    })
    .catch(() => ElMessage.error(`Wrong username or password.`, 3));
  return res;
}

export async function getInfoAPI(token) {
  requester.defaults.baseURL = '/api';
  const res = await requester.get('/user/info', token);
  return res;
}

export async function logoutAPI() {
  requester.defaults.baseURL = '/api';
  await requester.post('/user/logout')
    .then(() => ElMessage.success(`Log out successfully.`, 3))
    .catch(() => ElMessage.error(`Log out failed, please contact developer.`, 3));
}
