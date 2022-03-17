<template>
  <div class="page">
    <el-row align="middle">
      <svg-icon class="vibe-icon" icon-name="vibe"></svg-icon>
      <span class="page-name">supply</span>
    </el-row>
    <el-divider />

    <el-form>
      <span class="step-title">
        Step 1 - Basic Info
      </span>
      <el-row>
        <el-form-item label="Vendor:">
          <el-select v-model="step1.vendor" placeholder="Please select">
            <el-option v-for="(item, key) in fixedWarehouseEnum" :key="item" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="Warehouse:">
          <el-select v-model="step1.warehouse" placeholder="Please select">
            <el-option v-for="(item, key) in fixedWarehouseEnum" :key="item" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU:">
          <el-select v-model="step1.sku" placeholder="Please select">
            <el-option v-for="(item, key) in skuProdcutEnum" :key="key" :label="key" :value="key" />
          </el-select>
        </el-form-item>
      </el-row>  
      <el-row>
        <el-form-item label="Initial Inventory:">
          <el-input v-model="step1.initialInventory" placeholder="Initial Inventory:"></el-input>
        </el-form-item>
        <el-form-item label="Min. Inventory:">
          <el-input style="width: 145px" v-model="step1.minInventory" placeholder="Min. Inventory:" />
          % of +/- 2 weeks’ sales
        </el-form-item>
      </el-row>  
      <el-divider />

      <span class="step-title">
        Step 2 - Sales Forecast
      </span>
      <template v-for="(item, idx) in step2" :key="idx">
        <el-row class="add-minus-row" align="middle">
          <svg-icon class="icon" icon-name="add" @click="onStep2Change(index, 'add')" />
          <svg-icon class="icon" :style="step2.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="onStep2Change(index, 'minus')" />
          <el-form-item label="From:">
            <el-date-picker
              v-model="item.dateRange"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="With amount of ">
            <el-input v-model="item.amount" placeholder="Amount" />
          </el-form-item>
          <el-form-item label="Ruled by">
            <el-select v-model="item.rule" placeholder="Rule">
              <el-option v-for="item in ruleOptions" :key="item" :label="item" :value="item" /> 
            </el-select>
          </el-form-item>
        </el-row>
        
      </template>
      <el-divider />

      <span class="step-title">
        Step 3 - Suggested ETA Plan
      </span>
      <el-table :data="step3" max-height="250">
        <el-table-column prop="eta" label="ETA" width="200px" />
        <el-table-column prop="amount" label="Amount" width="100px" />
        <el-table-column label="Leading Time 1" width="300px" align="center">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime1.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime1.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Leading Time 2">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime2.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime2.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Leading Time 3">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime3.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime3.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120px">
          <template  v-slot="{ $index }">
            <el-button type="danger" size="small" @click.prevent="deleteRow($index)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddItem">Add Item</el-button>
      <el-divider />

      <span class="step-title">
        Step 4 - Real Production Plan
      </span>
      <el-table :data="step4" max-height="250">
        <el-table-column label="ETD" width="200px">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.etd" placeholder="Num"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Amount" width="100px">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.amount" placeholder="Num"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Leading Time 1" width="300px" align="center">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime1.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime1.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Leading Time 2">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime2.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime2.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Leading Time 3">
          <template v-slot="{ row }">
            <el-input style="width: 70px;" v-model="row.leadTime3.num" placeholder="Num"></el-input>
            <el-select style="width: 120px;" v-model="row.leadTime3.timeOption" placeholder="Time">
              <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120px">
          <template  v-slot="{ $index }">
            <el-button type="danger" size="small" @click.prevent="deleteRow($index)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider />
      
      <PlanTable
        :planTableEnum="planTableEnum"
        :monthAbbrEnum="monthAbbrEnum"
      >
        <template #footer>
          <el-button @click="calPlanTable" class="mgt-5" type="primary">Calculate</el-button>
        </template>
      </PlanTable>
      <RealTable />
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from'element-plus';
import { skuProdcutEnum, fixedWarehouseEnum } from '/@/enums/logistic';
import { monthDaysEnum, monthAbbrEnum, yearEnum } from '/@/enums/supply';
import PlanTable from './PlanTable.vue';
import RealTable from './RealTable.vue';

/* Start Data */
const planFrom = ref(null);
const planTo = ref(null);

const realFrom = ref(null);
const realTo = ref(null);

const planTableEnum = ref(null);
const planSales = ref(null); // plan table sales

// 表格
const sales = ref(null);
const inventory = ref(null);
const minInventory = ref(null);
const eta = ref(null);
const etd = ref(null);
const product = ref(null);

const timeOptions = ['day', 'week', 'month'];
const ruleOptions = ['day Average', 'day ASCE', 'day DESC'];

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
.vibe-icon
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
