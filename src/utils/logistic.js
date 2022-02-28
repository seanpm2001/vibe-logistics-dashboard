// 合并products array为一个{sku: totalQuantity}的对象
const combineSameProductQuantity = (arr => {
  const result = {};
  const units = [];
  arr.forEach(item => {
    const code = item.sku;
    result[code] = (result[code] + item.quantity) || item.quantity;
  });
  return result;
});

export const formatAssignedOrderItem = orderItem => {
  const raws = orderItem.rawOrders;
  const originId = orderItem.id;
  let productsArr = [];
  raws.forEach(item => {
    productsArr = productsArr.concat(item.items); // products array [{product_code: 'ABC', quantity: 1}]
  });
  orderItem = Object.assign(orderItem, raws[0]);
  orderItem.id = originId;
  orderItem.products = combineSameProductQuantity(productsArr); // {sku: totalQuantity}
  return orderItem;
};
