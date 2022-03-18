import { monthDaysEnum, yearEnum } from '/@/enums/supply';

export function checkRequiredData (step2Item) {
  let isValid = true;
  if (!step2Item.dateRange?.length || !step2Item.amount) {
    isValid = false;
    ElMessage.error('Please fill out step2\'s data!', 3);
  }
  return isValid;
}

export function calTableEnum(startMonth, endMonth, endDay) {
  const temp = {};
  for (let month = startMonth - 1; month <= endMonth; month++)
    temp[month] = yearEnum[month];
  for (let day = endDay + 1; day <= monthDaysEnum[endMonth]; day++)
    delete temp[endMonth][day];
  return temp;
}

