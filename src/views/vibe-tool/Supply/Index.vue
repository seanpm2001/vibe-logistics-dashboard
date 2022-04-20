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
        :timeUnitEnum="timeUnitEnum"
      >
        <template #btn>
          <el-button @click="calPlanTable" class="mgt-5" type="primary">Calculate Plan Table</el-button>
        </template>
      </Step3>
      <el-divider />
      <PlanTable
        :timeUnitEnum="timeUnitEnum"
        :planTableData="planTableData"
        :monthAbbrEnum="monthAbbrEnum"
      />

      <el-divider />
      <Step4
        :timeUnitEnum="timeUnitEnum"
        @onStep4Change="onStep4Change"
      >
        <template #btn>
          <el-button @click="onStep4Change(0, 'add')" class="mgt-5" type="primary">Add</el-button>
          <el-button @click="calRealTable" class="mgt-5" type="primary">Calculate Real Table</el-button>
        </template>
      </Step4>

      <RealTable
        :timeUnitEnum="timeUnitEnum"
        :realTableData="realTableData"
        :monthAbbrEnum="monthAbbrEnum"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from'element-plus';
import { timeUnitEnum, monthDaysEnum, monthAbbrEnum } from '@/enums/supply';
import { checkRequiredData, calTableEnum } from './util';
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

const planTableData = ref(null);
const realTableData = ref(null);

const step1 = ref({ // Step 1 - Basic Info
  vendor: null,
  warehouse: null,
  sku: null,
  initialInventory: 200,
  minInventoryPercent: null,
});

const step2Item = {
  dateRange: ['2022-03-05', '2022-04-15'],
  amount: 400,
  rule: 'day Average',
};
const step2 = ref([step2Item]); // Step 2 - Sales Forecast

const tableItem = {
  eta: 'Null',
  amount: 'Null',
  leadTime1: { num: 7, timeUnit: 1 },
  leadTime2: { num: 8, timeUnit: 1 },
  leadTime3: { num: null, timeUnit: 1 },
};
const step3 = ref([tableItem]); // Step 3 - Suggested ETA Plan

const step4Item = {
  production: '2022-03-08',
  amount: 10,
  leadTime1: { num: 7, timeUnit: 1 },
  leadTime2: { num: 8, timeUnit: 1 },
  leadTime3: { num: null, timeUnit: 1 },
};
const step4 = ref([ // Step 4 - Real Production Plan
  step4Item,
  {
    production: '2022-03-09',
    amount: 15,
    leadTime1: { num: 7, timeUnit: 1 },
    leadTime2: { num: 8, timeUnit: 1 },
    leadTime3: { num: null, timeUnit: 1 },
  }
]);

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

const onStep4Change = (_idx, _type) => {
  _type === 'add'
    ? step4.value.push(JSON.parse(JSON.stringify(tableItem)))
    : step4.value.splice(_idx--, 1);
};

const onStep2Change = (_idx, _type) => {
  if (_type === 'add') {
    step2.value.push(JSON.parse(JSON.stringify(step2Item)));
    step3.value.push(JSON.parse(JSON.stringify(tableItem)));
  } else {
    step2.value.splice(_idx--, 1);
    step3.value.splice(_idx--, 1);
  }
};

function calTableData(_type, saleItem, tableItem, startMonth, startDay, endMonth, endDay) {
  const _tableData = _type === 'plan' ? planTableData.value : realTableData.value;
  // calculate Sales related
  const diffDay = (new Date(saleItem.dateRange[1]) - new Date(saleItem.dateRange[0])) / 86400000;
  const averSaleInventory = Math.ceil(saleItem.amount / diffDay);
  // calculate (Min)Inventory, ETA related
  const biggerZeroArr = [];
  const initialInventory = step1.value.initialInventory;
  const minInventoryPercent = step1.value.minInventoryPercent;
  // step3 leading time
  const etdStep = tableItem.leadTime1.num * tableItem.leadTime1.timeUnit * 86400000;
  const productStep = tableItem.leadTime2.num * tableItem.leadTime2.timeUnit * 86400000;

  if (_type === 'real') {
    step4.value.forEach(item => {
      const itemTimestamp = Date.parse(item.production);
      const time = item.production.split('-');
      const month = Number(time[1]), day = Number(time[2]);
      _tableData[month][day]['production'] = item.amount;

      const etdStep = 86400000 * item.leadTime1.num * item.leadTime1.timeUnit;
      const etdTime = new Date(itemTimestamp + etdStep);
      _tableData[etdTime.getMonth() + 1][etdTime.getDate()]['etd'] = item.amount;

      const etaStep = 86400000 * item.leadTime2.num * item.leadTime2.timeUnit;
      const etaTime = new Date(itemTimestamp + etdStep + etaStep);
      _tableData[etaTime.getMonth() + 1][etaTime.getDate()]['eta'] = item.amount;
    });
  }

  let nextInventory = initialInventory;
  for (let month = startMonth; month <= endMonth; month++) {
    let start = startDay, end = endDay;
    if (endMonth > month) // 不是最后一个月
      end = monthDaysEnum[month];
    if (month > startMonth) // 不是第一个月
      start = 1;
    for (let day = start; day <= end; day++) {
      let minInventory = 0;
      const saleAmount = averSaleInventory;
      // set sales
      _tableData[month][day]['sales'] = averSaleInventory;

      // set minInventory
      minInventory += saleAmount;
      let thatDay = day;
      let thatMonth = month;
      const windowLength = 28;
      for(let i=0; i < windowLength; i++) { // 计算 Min. Inventory = minInventoryPercent/100 * 时间点后4周的总Sales Forecast
        thatDay += 1;
        if (thatDay > monthDaysEnum[thatMonth]) {
          thatDay = 1;
          thatMonth = month % 12 + 1;
        }
        const thatDaySale = _tableData[thatMonth][thatDay]?.sales || 0;
        minInventory = minInventory + thatDaySale;
        if (thatDaySale === 0) {
          minInventory *= windowLength / (i + 1);
          break;
        }
      }

      minInventory *= (minInventoryPercent || 50)/100;
      _tableData[month][day]['minInventory'] = Math.ceil(minInventory);

      const moment = Date.parse(new Date(`2022-${month}-${day}`)); // 当前日期的timestamp
    
      if (_type === 'plan') {
        // set 前一天的inventory
        const inventoryTime = new Date(moment - 86400000);
        const preInventoryAmount = _tableData[inventoryTime.getMonth() + 1][inventoryTime.getDate()];
        preInventoryAmount['inventory'] = nextInventory;

        // set eta/etd/production Amount
        let etaAmount = Math.ceil(minInventory - preInventoryAmount['inventory'] + saleAmount);
        etaAmount < 0 && (etaAmount = 0);
        _tableData[month][day]['eta'] = etaAmount;
        
        const etdTime = new Date(moment - etdStep);
        const productTime = new Date(moment - etdStep - productStep);
        _tableData[etdTime.getMonth() + 1][etdTime.getDate()]['etd'] = etaAmount;
        _tableData[productTime.getMonth() + 1][productTime.getDate()]['production'] = etaAmount;
        if (etaAmount > 0) { // 寻找第一个ETA Amount大于 0 的 eta
          biggerZeroArr.push({ month, day, etaAmount});
        }

        // 更新 nextInventory
        nextInventory = preInventoryAmount['inventory'] - averSaleInventory + etaAmount;
        nextInventory < 0 && (nextInventory = 0);
      } else if (_type === 'real') {
        // set 前一天的inventory
        const inventoryTime = new Date(moment - 86400000);
        const preInventoryAmount = _tableData[inventoryTime.getMonth() + 1][inventoryTime.getDate()];
        preInventoryAmount['inventory'] = nextInventory;

        const etaAmount = _tableData[month][day]['eta'] || 0;
        nextInventory = preInventoryAmount['inventory'] - averSaleInventory + etaAmount;
        nextInventory < 0 && (nextInventory = 0);
      }
    }
  }

  if (_type === 'plan') {
    const etaItem = biggerZeroArr[0];
    if (etaItem) {
      step3.value[0].eta = `2020-${etaItem.month}-${etaItem.day}`;
      step3.value[0].amount = etaItem.etaAmount;
    }
  }
}

const calPlanTable = () => {
  const saleItem = step2.value[0]; // TODO: 遍历所有step2, step3
  const planItem = step3.value[0];
  if (!checkRequiredData(saleItem))
    return;
  const time = calStartEndTime(0);
  const start = time.start, end = time.end;
  planTableData.value = Object.assign({}, calTableEnum('plan', start.month, end.month, end.day));
  calTableData('plan', saleItem, planItem, start.month, start.day, end.month, end.day);
};

const calRealTable = () => {
  const saleItem = step2.value[0]; // TODO: 遍历所有step2, step3
  const realItem = step4.value[0];
  if (!checkRequiredData(saleItem))
    return;
  const time = calStartEndTime(0);
  const start = time.start, end = time.end;
  realTableData.value = Object.assign({}, calTableEnum('real', start.month, end.month));
  calTableData('real', saleItem, realItem, start.month, start.day, end.month, end.day);
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
  max-width: 1300px

.el-form .el-form-item
  margin-right: 16px

.el-row.table
  overflow: scroll
  flex-wrap: nowrap
  margin-right: 64px
  .no-warp
    flex-wrap: nowrap
  p
    padding: 0 5px
    text-align: center
    height: 36px
    line-height: 36px
    border: 1px solid #ebeef5
  .header
    background-color: #66c
    color: #fff
  .grey
    background-color: #ddd
  .light-grey
    background-color: #f9f8f5
</style>
