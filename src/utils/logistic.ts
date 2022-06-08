import { BSUnitSystemWarehouseArr } from '../enums/logistic';

// 合并products array为一个{productCode: totalQuantity}的对象
const combineSameProductQuantity = (arr => {
  const result = {};
  arr.forEach(item => {
    const code = item.productCode;
    result[code] = (result[code] + item.quantity) || item.quantity;
  });
  return result;
});

const obj2Arr = obj => {
  return Object.keys(obj).map(key => {
    return {
      productCode: key,
      quantity: obj[key]
    };
  });
};

export const formatAssignedOrderItem = orderItem => {
  const raws = orderItem.rawOrders;
  const originId = orderItem.id;
  const createdAt = orderItem.createdAt;
  let productsArr = [];
  raws.forEach(order => {
    productsArr = productsArr.concat(order.items); // products array [{product_code: 'ABC', quantity: 1}]
  });
  const combinedProducts = combineSameProductQuantity(productsArr);
  const combinedProductsArr = obj2Arr(combinedProducts);

  orderItem = Object.assign(orderItem, raws[0]);
  orderItem.id = originId;
  orderItem.createdAt = createdAt;
  orderItem.items = combinedProductsArr;
  orderItem.productsQty = combinedProducts; // {productCode: totalQuantity}

  return orderItem;
};

export const formatVBDate = (date: string) => date.replace('T', ' ').replace(/\.\d+/, '').replace(/\+.*/, '');

export const getTaskOrderIdArr = (taskList: any) :Array<number> => {
  const temp = [];
  taskList.forEach(task => temp.push(task.orderId));
  return temp;
};

export const formatTimeString = utcTimeString => {
  const utcTime = new Date(utcTimeString);
  const diff = (new Date()).getTimezoneOffset() * 60 * 1000;
  const localTime = new Date(utcTime - diff);
  const iso = localTime.toISOString();
  const ret = iso.slice(0, 19).replace('T', ' ');
  return ret;
};

export const addNullOptionInEnumObject = (obj) => {
  return Object.assign({ '(NULL)': '(Null)' }, obj);
};

export const getWarehouseUnitSystem = (warehouseId) => {
  if (BSUnitSystemWarehouseArr.includes(warehouseId))
    return 'BS';
  else
    return 'SI';
};
