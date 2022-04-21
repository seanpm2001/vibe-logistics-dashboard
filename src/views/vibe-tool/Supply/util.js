import { monthDaysEnum, yearEnum } from '@/enums/supply';

export function checkRequiredData (step2Item) {
  let isValid = true;
  if (!step2Item.dateRange?.length || !step2Item.amount) {
    isValid = false;
    ElMessage.error('Please fill out step2\'s data!');
  }
  return isValid;
}

export function calTableEnum(type, startMonth, endMonth, endDay) {
  // const temp = {};
  // for (let month = startMonth - 1; month <= endMonth; month++) // 往前预留一个月
  //   temp[month] = yearEnum[month];
  // if (type === 'plan') // plan table 删除endDay后多余的day
  //   for (let day = endDay + 1; day <= monthDaysEnum[endMonth]; day++)
  //     delete temp[endMonth][day];
  // return JSON.parse(JSON.stringify(temp));

  return JSON.parse(JSON.stringify(yearEnum));
}
