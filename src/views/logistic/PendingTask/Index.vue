<template>
  <div class="page">
    <div class="statistics">
      <FilterHeader @fetch-list="fetchList" />
      <el-descriptions
        :column="3"
        border
      >
        <template
          v-for="(item, key) in codeQTY"
          :key="key"
        >
          <el-descriptions-item label="Product Name">
            {{ codeNameEnum[key] || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="Req QTY">
            {{ item.req }}
          </el-descriptions-item>
          <el-descriptions-item
            label="Fulfilled QTY"
            :class-name="item.req === item.ful ? '' : 'error-border-tip'"
          >
            {{ item.ful || 0 }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
    <el-divider />
    <TaskCards
      :order-enum="orderEnum"
      @fetchList="fetchList"
    />
    
    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import FilterHeader from './FilterHeader.vue';
import TaskCards from './TaskCards/Index.vue';
import { formatAssignedOrderItem, getTaskOrderIdArr } from '@/utils/logistic';
import { queryTasksAPI, queryAssignedBatchOrdersAPI } from '@/api/logistic';
import { skuCodeEnum, codeNameEnum } from '@/enums/logistic';
// import { useUserStore } from '@/store';

/* Start Data */
// const { role } = storeToRefs(useUserStore());
const listQuery = ref({
  page: 1,
  perPage: 20,
  onHold: false,
  start: null,
  end: null,
  search: '',
  carrier: '',
  transportMode: '',
});

const typeArr = ref(['FULFILLMENT', 'REPLACE']);

const total = ref(0);
const dataList = ref(null);
const orderEnum = ref({}); // [{ orderId : {...orderItem} }]
const contrastTask = ref(null); // 对比数据是否修改

provide('listQuery', listQuery);
provide('typeArr', typeArr);
provide('dataList', dataList);
provide('contrastTask', contrastTask);
/* End Data */

const codeQTY = computed(() => { // SKU Quantity Statistics
  const temp = {};
  dataList.value?.forEach(task => {
    task.products?.forEach(product => {
      const code = product.productCode;
      if (code?.includes('EPP')) return; // 不需要追踪code为EPP相关的product
      temp[code] = temp[code] || {};
      temp[code]['req'] = (temp[code]['req'] || 0) + product.quantity;
    });
    task.packages?.forEach(packageItem => {
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
}) as Record<string, any>;

function queryTask () {
  if (listQuery.value.end) {
    const params = new URLSearchParams(listQuery.value);
    typeArr.value.forEach(type => {
      params.append('tasktype', type);
    });
    queryTasksAPI(params).then(data => {
      if (!data.items.length) {
        listQuery.value.search = '';
        ElMessage.error('Can\'t find related.');
        return;
      }

      dataList.value = data.items;
      total.value = data.total;
      contrastTask.value = JSON.parse(JSON.stringify(dataList.value));
      const orderIdArr = getTaskOrderIdArr(dataList.value);
      queryAssignedBatchOrdersAPI(orderIdArr).then(data => { // 获取所有task相关的order list
        data.forEach(async order => {
          orderEnum.value[order.id] = await formatAssignedOrderItem(order);
        });
      });
    });
  }
}

const fetchList = () => {
  setTimeout(() => queryTask(), 200);
};
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  min-height: calc(100vh - 91px - 32px)

.statistics
  .el-descriptions
    width: 570px
</style>

<style lang="sass">
.error-border-tip
  border: 2px solid red !important
</style>
