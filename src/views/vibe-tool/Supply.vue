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
            <el-select v-model="item.from" placeholder="From">
              
            </el-select>
          </el-form-item>
          <el-form-item label="To:">
            <el-select v-model="item.to" placeholder="From"></el-select>
          </el-form-item>
          <el-form-item label="With amount of ">
            <el-select v-model="item.amount" placeholder="Amount">
            
            </el-select>
          </el-form-item>
          <el-form-item label="Ruled by">
            <el-select v-model="item.rule" placeholder="Rule">
            
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
            <el-button type="danger" size="small" @click.prevent="deleteRow('step3', $index)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddItem('step3')">Add Item</el-button>
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
            <el-button type="danger" size="small" @click.prevent="deleteRow('step4', $index)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddItem('step4')">Add Item</el-button>
      <el-divider />

      <span class="step-title">
        Final Outcomes Table
      </span>

    </el-form>
  </div>
</template>

<script setup>
import { skuProdcutEnum, fixedWarehouseEnum } from '/@/enums/logistic';

const timeOptions = ['day', 'week', 'month'];

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

const deleteRow = (table, index) => {
  table === 'step3' ? step3.value.splice(index, 1) : step4.value.splice(index, 1);
};

const onAddItem = (table) => {
  table === 'step3'
    ? step3.value.push(JSON.parse(JSON.stringify(step3Item)))
    : step4.value.push(JSON.parse(JSON.stringify(step4Item)));
};
</script>

<style lang="sass" scoped>
.page
  position: relative
  width: calc(100% - 120px)
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
</style>
