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
      >
        <template #btn>
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
import { timeUnitEnum, monthDaysEnum, monthAbbrEnum } from '/@/enums/supply';
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
  initialInventory: 30,
  minInventoryPercent: null,
});

const step2Item = {
  dateRange: ['2022-03-05', '2022-04-15'],
  amount: 300,
  rule: 'day Average',
};
const step2 = ref([step2Item]); // Step 2 - Sales Forecast

const step3Item = {
  eta: 'Null',
  amount: 'Null',
  leadTime1: { num: 7, timeUnit: 1 },
  leadTime2: { num: 8, timeUnit: 1 },
  leadTime3: { num: null, timeUnit: 1 },
};
const step3 = ref([step3Item]); // Step 3 - Suggested ETA Plan

const step4Item = {
  etd: null,
  amount: null,
  leadTime1: { num: null, timeUnit: 1 },
  leadTime2: { num: null, timeUnit: 1 },
  leadTime3: { num: null, timeUnit: 1 },
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

const onStep2Change = (_idx, _type) => {
  if (_type === 'add') {
    step2.value.push(JSON.parse(JSON.stringify(step2Item)));
    step3.value.push(JSON.parse(JSON.stringify(step3Item)));
    step4.value.push(JSON.parse(JSON.stringify(step4Item)));
  } else {
    step2.value.splice(_idx--, 1);
    step3.value.splice(_idx--, 1);
    step4.value.splice(_idx--, 1);
  }
};

function calPlanTableData(saleItem, planItem, startMonth, startDay, endMonth, endDay) {
  // calculate Sales related
  const diffDay = (new Date(saleItem.dateRange[1]) - new Date(saleItem.dateRange[0])) / 86400000;
  const averSaleInventory = Math.ceil(saleItem.amount / diffDay);
  // calculate (Min)Inventory, ETA related
  const biggerZeroArr = [];
  const initialInventory = step1.value.initialInventory;
  const minInventoryPercent = step1.value.minInventoryPercent;
  // step3 leading time
  const etdStep = planItem.leadTime1.num * planItem.leadTime1.timeUnit * 86400000;
  const productStep = planItem.leadTime2.num * planItem.leadTime2.timeUnit * 86400000;

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
      minInventory += saleAmount;
      for(let i=1; i <= 14; i++) { // 计算 Min. Inventory = minInventoryPercent/100 * 时间点前后两周的总Sales Forecast，若时间点前后不足两周按已有的时间计算
        const preSale = planTableData.value[month][day-i]?.sales || 0;
        const nextSale = planTableData.value[month][day+i]?.sales || 0;
        minInventory = minInventory + preSale + nextSale;
      }
      // set sales
      const salesAmount = planTableData.value[month][day];
      salesAmount['sales'] = averSaleInventory;
      // set minInventory
      minInventory *= (minInventoryPercent || 50)/100;
      planTableData.value[month][day]['minInventory'] = Math.ceil(minInventory);

      const moment = Date.parse(new Date(`2022-${month}-${day}`)); // 当前日期的timestamp
      // set inventory
      const inventoryTime = new Date(moment - 86400000);
      const inventoryAmount = planTableData.value[inventoryTime.getMonth() + 1][inventoryTime.getDate()];
      inventoryAmount['inventory'] = nextInventory;

      nextInventory = inventoryAmount['inventory'] - salesAmount['sales'];
      nextInventory < 0 && (nextInventory = 0);


      // set eta/etd/product Amount
      let etaAmount = minInventory - initialInventory + saleAmount;
      etaAmount < 0 && (etaAmount = 0);
      planTableData.value[month][day]['eta'] = etaAmount;
      
      const etdTime = new Date(moment - etdStep);
      const productTime = new Date(moment - etdStep - productStep);
      planTableData.value[etdTime.getMonth() + 1][etdTime.getDate()]['etd'] = etaAmount;
      planTableData.value[productTime.getMonth() + 1][productTime.getDate()]['product'] = etaAmount;

      if (etaAmount > 0) { // 寻找第一个ETA Amount大于 0 的 eta
        biggerZeroArr.push({ month, day, etaAmount});
      }
    }
  }
  const etaItem = biggerZeroArr[0];
  if (etaItem) {
    step3.value[0].eta = `2020-${etaItem.month}-${etaItem.day}`;
    step3.value[0].amount = etaItem.etaAmount;
  }
}

const calPlanTable = () => {
  const saleItem = step2.value[0]; // TODO: 遍历所有step2, step3
  const planItem = step3.value[0];
  if (!checkRequiredData(saleItem))
    return;
  const time = calStartEndTime(0);
  const start = time.start, end = time.end;
  planTableData.value = Object.assign({}, calTableEnum(start.month, end.month, end.day));
  calPlanTableData(saleItem, planItem, start.month, start.day, end.month, end.day);
};

const calRealTable = () => {
  const saleItem = step2.value[0]; // TODO: 遍历所有step2, step3
  const realItem = step4.value[0];
  if (!checkRequiredData(saleItem))
    return;
  const time = calStartEndTime(0);
  const start = time.start, end = time.end;
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
</style>
