<template>
  <div class="page">
    <div class="statistics">
      <div class="f-row col-center">
        <el-date-picker
          v-model="dateFilter" :shortcuts="shortcuts"
          type="daterange" value-format="YYYY-MM-DD" placeholder="Please pick a date"
        />
        <span class="mgl-5 mgr-5"> before 11.30 am</span>
        <el-input v-model="listQuery.search" style="width: 200px;"  placeholder="Search: (order info)" />
        <el-button class="mgl-5" type="primary" :icon="Search"  @click="fetchList">Search</el-button>
      </div>
      <el-descriptions :column="3" border>
        <template v-for="(item, key) in codeQTY" :key="key">
          <el-descriptions-item label="Product Name">{{ codeNameEnum[key] || '' }}</el-descriptions-item>
          <el-descriptions-item label="Req QTY">{{ item.req }}</el-descriptions-item>
          <el-descriptions-item
            label="Fulfilled QTY" :class-name="item.req === item.ful ? '' : 'error-border-tip'"
          >
            {{ item.ful || 0 }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
    <el-divider />
    <TaskCards @fetchList="fetchList" />
    
    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import TaskCards from './TaskCards.vue';
import { parseTime, formatAssignedOrderItem } from '@/utils';
import { queryTasksAPI, queryAssignedBatchOrdersAPI } from '@/api/logistic';
import { skuCodeEnum, codeNameEnum } from '@/enums/logistic';
// import { useUserStore } from '@/store';

/* Start Data */
// const { role } = storeToRefs(useUserStore());
const dateFilter = ref(null);
const listQuery = ref({
  page: 1,
  perPage: 10,
  start: null,
  end: null,
  search: '',
});

watchEffect(() => {
  if (dateFilter.value) {
    listQuery.value.start = dateFilter.value[0] + 'T11:30:00';
    listQuery.value.end = dateFilter.value[1] + 'T11:30:00';
    fetchList();
  }
});

const total = ref(0);
const dataList = ref(null);
const orderEnum = ref({}); // [{ orderId : {...orderItem} }]
const contrastTask = ref(null); // 对比数据是否修改

const shortcuts = [
  {
    text: 'Today',
    value: () => ['2022-04-01', new Date()],
  },
  {
    text: 'Tomorrow',
    value: () => ['2022-04-01', new Date().getTime() + 86400 * 1000],
  },
];

provide('listQuery', listQuery);
provide('dataList', dataList);
provide('orderEnum', orderEnum);
provide('contrastTask', contrastTask);
/* End Data */

const codeQTY = computed(() => { // SKU Quantity Statistics
  const temp = {};
  dataList.value?.forEach(task => {
    task.products.forEach(product => {
      const code = product.productCode;
      if (code.includes('EPP')) return; // 不需要追踪code为EPP相关的product
      temp[code] = temp[code] || {};
      temp[code]['req'] = (temp[code]['req'] || 0) + product.quantity;
    });
    task.packages.forEach(packageItem => {
      packageItem.units.forEach(unit => {
        const code = skuCodeEnum[unit.item?.sku];
        if (code) {
          temp[code] = temp[code] || {};
          temp[code]['ful'] = (temp[code]['ful'] || 0) + 1;
        }
      });
    });
  });
  return temp;
});

function getOrderIdArr (taskList) {
  const temp = [];
  taskList.forEach(task => temp.push(task.orderId));
  return temp;
}

function queryTask () {
  if (listQuery.value.end) {
    const params = new URLSearchParams(listQuery.value);
    params.append('task_type', 'FULFILLMENT');
    params.append('task_type', 'REPLACE');
    queryTasksAPI(params).then(data => {
      dataList.value = data.items;
      total.value = data.total;
      contrastTask.value = JSON.parse(JSON.stringify(dataList.value));
      const orderIdArr = getOrderIdArr(dataList.value);
      queryAssignedBatchOrdersAPI(orderIdArr).then(data => { // 获取所有task相关的order list
        data.forEach(order => {
          orderEnum.value[order.id] = formatAssignedOrderItem(order);
        });
      });
    });
  }
}

const fetchList = () => {
  setTimeout(() => queryTask(), 200);
};

function initDateFilter () {
  dateFilter.value = ['2022-04-01', parseTime(new Date(), '{y}-{m}-{d}')];
}

onMounted(() => {
  initDateFilter();
  fetchList();
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  min-height: calc(100vh - 91px - 32px)

.statistics
  .el-descriptions
    width: 540px
</style>

<style lang="sass">
.error-border-tip
  border: 2px solid red !important
</style>
