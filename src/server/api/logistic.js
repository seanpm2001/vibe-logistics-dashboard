/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

import requester from '../axios-requester';

/* 订单 Order API */
export async function listOrdersAPI () {
  const { data } = await requester.get('Orders');
  return data;
}
export async function findOrderAPI (id) {
  const { data } = await requester.get(`Orders/${id}`);
  return data;
}
export async function createOrderAPI (Order) {
  const { data } = await requester.post('Orders', Order);
  return data;
}
export async function updateOrderAPI (id, updates) {
  const { data } = await requester.put(`Orders/${id}`, updates);
  return data;
}
export async function deleteOrderAPI (id) {
  await requester.delete(`Orders/${id}`);
}

/* 产品 Freight API */
export async function listFreightsAPI (params) {
  const { data } = await requester.get('freights', {
    params,
  });
  return data;
}
export async function createFreightAPI (Freight) {
  const { data } = await requester.post('freights', Freight);
  return data;
}
export async function findFreightAPI (id) {
  const { data } = await requester.get(`freights/${id}`);
  return data;
}
export async function updateFreightAPI (id, updates) {
  const { data } = await requester.put(`freights/${id}`, updates);
  return data;
}
export async function deleteFreightAPI (id) {
  await requester.delete(`freights/${id}`);
}

/* 仓库 Warehouse API */
export async function listWarehousesAPI (params) {
  const { items } = await requester.get('warehouses', {
    params,
  });
  return items;
}

/* 库存 Inventory API */
export async function listInventoriesAPI (params) {
  const { data } = await requester.get('inventories', {
    params,
  });
  return data;
}

/* 用户配置 profile API 登录注册登出 */
export async function loginAPI (payload) {
  const { data } = await requester.post('login', payload);
  return data;
}
export async function logoutAPI () {
  const { data } = await requester.get('logout');
  return data;
}

export async function getUserByTokenAPI (token) {
  const { data } = await requester.get('users', {
    params: {
      token
    }
  });
  return data;
}

export async function registerAPI () {
  const { data } = await requester.get('logout');
  return data;
}

export async function getUserAPI () {
  const res = await requester.get('getUser');
  return res;
}
