<template>
  <div class="page">
    <el-row align="middle">
      <svg-icon class="vibe-icon" icon-name="vibe"></svg-icon>
      <span class="page-name">supply</span>
    </el-row>
    <el-divider />

    <el-form>
      <Step1 />
      <el-divider />

      <Step2
        @onStep2Change="onStep2Change"
      />
      <el-divider />

      <Step3
        :timeOptions="timeOptions"
        @deleteRow="deleteRow"
      >
        <template #btn>
          <el-button @click="onAddItem">Add Item</el-button>
        </template>
      </Step3>
      <el-divider />
      
      <PlanTable
        :timeOptions="timeOptions"
        :planTableEnum="planTableEnum"
        :monthAbbrEnum="monthAbbrEnum"
      >
        <template #btn>
          <el-button @click="calPlanTable" class="mgt-5" type="primary">Calculate</el-button>
        </template>
      </PlanTable>

      <el-divider />
      <Step4
        :timeOptions="timeOptions"
        @deleteRow="deleteRow"
      >
      
      </Step4>

      <RealTable
        :timeOptions="timeOptions"
        :planTableEnum="planTableEnum"
        :monthAbbrEnum="monthAbbrEnum"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from'element-plus';
import { monthDaysEnum, monthAbbrEnum, yearEnum } from '/@/enums/supply';
import Step1 from './Step1.vue';
import Step2 from './Step2.vue';
import Step3 from './Step3.vue';
import PlanTable from './PlanTable.vue';
import Step4 from './Step4.vue';
import RealTable from './RealTable.vue';

/* Start Data */
const planFrom = ref(null);
const planTo = ref(null);

const realFrom = ref(null);
const realTo = ref(null);

const planTableEnum = ref(null);

const timeOptions = ['day', 'week', 'month'];

const step1 = ref({ // Step 1 - Basic Info
  vendor: null,
  warehouse: null,
  sku: null,
  initialInventory: null,
  minInventory: null,
});

const step2Item = {
  dateRange: null,
  amount: null,
  rule: 'day Average',
};
const step2 = ref([step2Item]); // Step 2 - Sales Forecast

const step3Item = {
  eta: '2022-03-15',
  amount: '100',
  leadTime1: { num: null, timeOption: null },
  leadTime2: { num: null, timeOption: null },
  leadTime3: { num: null, timeOption: null },
};
const step3 = ref([step3Item]); // Step 3 - Suggested ETA Plan

const step4Item = {
  etd: null,
  amount: null,
  leadTime1: { num: null, timeOption: null },
  leadTime2: { num: null, timeOption: null },
  leadTime3: { num: null, timeOption: null },
};
const step4 = ref([step4Item]); // Step 4 - Real Production Plan

provide('step1', step1);
provide('step2', step2);
provide('step3', step3);
provide('step4', step4);
provide('planFrom', planFrom);
provide('planTo', planTo);
provide('realFrom', realFrom);
/* End Data */

function calStartEndTime(idx) {
  const date = step2.value[idx].dateRange;
  const start = date[0].split('-'); // [YY, MM, DD]
  const end = date[1].split('-');
  return {
    'start': { month: Number(start[1]), day: Number(start[2])}, 
    'end': { month: Number(end[1]), day: Number(end[2])}, 
  };
}
function calTableEnum(startMonth, endMonth, endDay) {
  const temp = {};
  for (let month = startMonth - 1; month <= endMonth; month++)
    temp[month] = yearEnum[month];
  for (let day = endDay + 1; day <= monthDaysEnum[endMonth]; day++)
    delete temp[endMonth][day];
  planTableEnum.value = Object.assign({}, temp);
}
function calSales(saleItem, startMonth, startDay, endMonth, endDay) {
  const diffDay = (new Date(saleItem.dateRange[1]) - new Date(saleItem.dateRange[0])) / 86400000;
  const averSaleInventory = Math.ceil(saleItem.amount / diffDay);
  for (let month = startMonth; month <= endMonth; month++) {
    let start = startDay, end = endDay;
    if (endMonth > month) // 不是最后一个月
      end = monthDaysEnum[month];
    if (month > startMonth) // 不是第一个月
      start = 1;
    for (let day = start; day <= end; day++) {
      planTableEnum.value[month][day]['sales'] = averSaleInventory;
    }
  }
}

const calPlanTable = () => { // 计算 planTable 入口
  const saleItem = step2.value[0]; // TODO: 遍历所有step2
  if (!checkRequiredData(saleItem))
    return;
  const time = calStartEndTime(0);
  const start = time.start;
  const end = time.end;
  calTableEnum(start.month, end.month, end.day);
  calSales(saleItem, start.month, start.day, end.month, end.day);

};

function checkRequiredData (step2Item) {
  let isValid = true;
  if (!step2Item.dateRange?.length || !step2Item.amount) {
    isValid = false;
    ElMessage.error('Please fill out step2\'s data!', 3);
  }
  console.log('isValid: ', isValid);
  return isValid;
}

const onStep2Change = (_idx, _type) => {
  _type === 'add'
    ? step2.value.push(JSON.parse(JSON.stringify(step2Item)))
    : step2.value.splice(_idx--, 1);
};

const deleteRow = (index) => {
  step3.value.splice(index, 1);
  step4.value.splice(index, 1);
};

const onAddItem = () => {
  step3.value.push(JSON.parse(JSON.stringify(step3Item)));
  step4.value.push(JSON.parse(JSON.stringify(step4Item)));
};
</script>

<style lang="sass">
.page
  position: relative
  padding: 40px 54px
.svg-icon.vibe-icon
  width: 132px
  height: 32px
.page-name
  font-size: 33px
  font-weight: 500
  color: #000000

.step-title
  font-family: 'Salsa'
  font-weight: 400
  font-size: 23px
  line-height: 1.6
  color: #6666CC

.el-table
  max-width: 1200px

.el-form .el-form-item
  margin-right: 16px

.table
  overflow: scroll
  flex-wrap: unset
  margin-right: 64px
  .no-warp
    flex-wrap: nowrap
  p
    height: 36px
    line-height: 36px
    padding: 0 5px
    border: 1px solid #ebeef5
</style>
