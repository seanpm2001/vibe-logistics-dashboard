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
              v-model="item.from"
              type="datetime"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="To:">
            <el-date-picker
              v-model="item.to"
              type="datetime"
              format="YYYY/MM/DD"
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

      <span class="step-title">
        Product Plan Table
      </span>
      <el-row>
        <el-form-item label="From:">
          <el-date-picker
            v-model="planFrom"
            type="datetime"
            format="YYYY/MM/DD"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="To:">
          <el-date-picker
            v-model="planTo"
            type="datetime"
            format="YYYY/MM/DD"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="Time Dimension:">
          
        </el-form-item>
      </el-row>
      
      <el-row class="table">
        <template v-for="(monthItem, month) in planTableEnum" :key="month">
          <el-row>
            <div class="f-col">
              <p class="header">{{monthAbbrEnum[month]}}</p>
              <p>Sales</p>
              <p>Inventory</p>
              <p>Min. Reserved Inventory</p>
              <p>ETA US</p>
              <p>ETD CN</p>
              <p>Production</p>
              <p>Material</p>
            </div>
            <template v-for="(item, day) in monthItem" :key="item">
              <div class="f-col" >
                <p class="header">{{day}}</p>
                <p>{{item}}</p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            </template>
          </el-row>
        </template>
      </el-row>
      <el-button @click="calPlanTable" class="mgt-5" type="primary">Calculate</el-button>

      <el-divider />
      <span class="step-title">
        Final Outcomes Table
      </span>
      <el-row>
        <el-form-item label="From - To:">
          <el-date-picker
            v-model="realFrom"
            type="datetimerange"
            format="YYYY/MM/DD"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="Time Dimension:">
          
        </el-form-item>
      </el-row>

      <el-row class="table">
        <el-col class="table">
          <p class="header">Apr.</p>
          <p>Inventory</p>
          <p>Min. Reserved Inventory</p>
          <p>ETA US</p>
          <p>ETD CN</p>
          <p>Production</p>
          <p>Material</p>
        </el-col>
        <template>
        
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { skuProdcutEnum, fixedWarehouseEnum } from '/@/enums/logistic';
import { monthDaysEnum, monthAbbrEnum, yearEnum } from '/@/enums/supply';

const planFrom = ref(null);
const planTo = ref(null);

const realFrom = ref(null);
const realTo = ref(null);

const planTableEnum = shallowRef(null);

function getStartEndTime(itemIdx) {
  const from = step2.value[itemIdx].from.split('-'); // [YY, MM, DD]
  const to = step2.value[itemIdx].to.split('-');
  return {
    'start': { month: from[1], day: from[2]}, 
    'end': { month: from[1], day: from[2]}, 
  };
}
function calTableEnum(startMonth, endMonth) {
  const temp = {};
  for (let i = startMonth - 1; i <= endMonth; i++)
    temp[i] = yearEnum[i];
  planTableEnum.value = temp;
}
function calSales(startMonth, startDay, endMonth, endDay) {
  const diffDay = (new Date(step2.value.to) - new Date(step2.value.from)) / 86400000;
  console.log('diffDay: ', diffDay);
  const averSaleInventory = step2.value.amount / diffDay;
  console.log('averSaleInventory: ', averSaleInventory);
  for (let month = startMonth; month <= endMonth; month++) {
    for (let day = startDay; day <= monthDaysEnum[month]; day++) {
      console.log('day: ', day);
      planTableEnum.value[month][day] = averSaleInventory;
    }
  }
}

const calPlanTable = () => {
  const time = getStartEndTime(0);
  calTableEnum(time.start.month, time.end.month);
  calSales(time.start.month, time.start.day, time.end.month, time.end.day);

};

// 表格
const sales = ref(null);
const inventory = ref(null);
const minInventory = ref(null);
const eta = ref(null);
const etd = ref(null);
const product = ref(null);

const timeOptions = ['day', 'week', 'month'];
const ruleOptions = ['day Average', 'day ASCE', 'day DESC'];

const step1 = ref({
  vendor: null,
  warehouse: null,
  sku: null,
  initialInventory: null,
  minInventory: null,
});

const step2Item = {
  from: null,
  to: null,
  amount: null,
  rule: null,
};
const step2 = ref([step2Item]);

const step3Item = {
  eta: '2022-03-15',
  amount: '100',
  leadTime1: { num: null, timeOption: null },
  leadTime2: { num: null, timeOption: null },
  leadTime3: { num: null, timeOption: null },
};
const step3 = ref([step3Item]);

const step4Item = {
  etd: null,
  amount: null,
  leadTime1: { num: null, timeOption: null },
  leadTime2: { num: null, timeOption: null },
  leadTime3: { num: null, timeOption: null },
};
const step4 = ref([step4Item]);

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

<style lang="sass" scoped>
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


.el-form .el-form-item
  margin-right: 16px

.table
  flex-wrap: unset
  .f-col
    flex-wrap: nowrap
  p
    height: 25px
    padding: 3px
    border: 1px solid #000
</style>
