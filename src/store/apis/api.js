/**
 * API 统一放在该文件，按数据库表名的首字母排序，及同级modules文件下对应的文件顺序
 */

 import requester from './requester'

/* 订单 Order API */
export async function listOrdersAPI () {
  const { data } = await requester.get('Orders')
  return data
}
export async function findOrderAPI (id) {
  const { data } = await requester.get(`Orders/${id}`)
  return data
}
export async function createOrderAPI (Order) {
  const { data } = await requester.post('Orders', Order)
  return data
}
export async function updateOrderAPI (id, updates) {
  const { data } = await requester.put(`Orders/${id}`, updates)
  return data
}
export async function deleteOrderAPI (id) {
  await requester.delete(`Orders/${id}`)
}

/* 产品 Product API */
export async function listProductsAPI () {
  const { data } = await requester.get('Products')
  return data
}
export async function findProductAPI (id) {
  const { data } = await requester.get(`Products/${id}`)
  return data
}
export async function createProductAPI (Product) {
  const { data } = await requester.post('Products', Product)
  return data
}
export async function updateProductAPI (id, updates) {
  const { data } = await requester.put(`Products/${id}`, updates)
  return data
}
export async function deleteProductAPI (id) {
  await requester.delete(`Products/${id}`)
}
