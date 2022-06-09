<template>
  <div class="page">
    <div class="statistics">
      <FilterHeader @fetch-list="fetchList" />
      <el-descriptions
        title="Fulfilling Products"
        class="unspecified-products"
        :column="4"
        border
      >
        <template
          v-for="(item, key) in fulQty.qtyByCode"
          :key="key"
        >
          <el-descriptions-item label="Product Name">
            {{ codeNameEnum[key] || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="SKU">
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

        <template
          v-for="(item, key) in fulQty.qtyBySku"
          :key="key"
        >
          <el-descriptions-item label="Product Name">
            {{ codeNameEnum[skuCodeEnum[key]] || '' }}
          </el-descriptions-item>
          <el-descriptions-item label="SKU">
            {{ key }}
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

      <el-descriptions
        title="Fulfilling Products with Specified Serial"
        class="specified-products"
        :column="4"
        border
      >
        <template
          v-for="serial in specifiedSerials"
          :key="serial"
        >
          <el-descriptions-item label="Product Name">
            {{ skuCodeEnum[specifiedUnits[serial]?.sku] }}
          </el-descriptions-item>
          <el-descriptions-item label="SKU">
            {{ specifiedUnits[serial]?.sku }}
          </el-descriptions-item>
          <el-descriptions-item label="Serial">
            {{ serial }}
          </el-descriptions-item>
          <el-descriptions-item
            label="Fulfilled QTY"
            :class-name="specifiedUnits[serial]?.ful ? '' : 'error-border-tip'"
          >
            {{ specifiedUnits[serial]?.ful ? 1 : 0 }}
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
import { listUnitsAPI, queryTasksAPI, queryAssignedBatchOrdersAPI } from '@/api';
import { skuCodeEnum, codeNameEnum, noSerialArr } from '@/enums/logistic';
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
const specifiedUnits = ref({});
const contrastTask = ref(null); // 对比数据是否修改

provide('listQuery', listQuery);
provide('typeArr', typeArr);
provide('dataList', dataList);
provide('contrastTask', contrastTask);

const fulSerials = computed(() => {
  const serials = {};
  dataList.value?.forEach(task => {
    task.packages?.forEach(packageItem => {
      packageItem.units.forEach(unit => {
        if (unit.serial) {
          serials[unit.serial] = (serials[unit.serial] || 0) + 1;
        }
      });
    });
  });
  return serials;
});

provide('fulSerials', fulSerials);

const specifiedSerials = computed(() => {
  let serials = [];
  dataList.value?.forEach(task => {
    let taskSpecifiedSerials = [];
    task.products?.forEach(product => {
      taskSpecifiedSerials = taskSpecifiedSerials.concat(product.serialNote);
    });
    serials = serials.concat(taskSpecifiedSerials);

    task.packages?.forEach(packageItem => {
      packageItem.units.forEach(unit => {
        if (unit.serial && specifiedUnits.value[unit.serial] && taskSpecifiedSerials.includes(unit.serial)) {
          specifiedUnits.value[unit.serial]['ful'] = 1;
        }
      });
    });
  });
  return serials;
});

provide('specifiedSerials', specifiedSerials);
/* End Data */

const fulQty = computed(() => { // SKU Quantity Statistics
  // Important: For a product in a task, either all skus are specified or none
  const qtyBySku = {};
  const qtyByCode = {};
  dataList.value?.forEach(task => {
    const taskQtyBySku = {};
    const taskQtyByCode = {};
    task.products?.forEach(product => {
      const code = product.productCode;
      const sku = product.sku;
      if (code?.includes('EPP')) return; // 不需要追踪code为EPP相关的product
      if (sku && !noSerialArr.includes(code)) {
        taskQtyBySku[sku] = taskQtyBySku[sku] || {};
        taskQtyBySku[sku]['req'] = (taskQtyBySku[sku]['req'] || 0) + product.quantity;
      } else { // accessories or products without specified sku
        taskQtyByCode[code] = taskQtyByCode[code] || {};
        taskQtyByCode[code]['req'] = (taskQtyByCode[code]['req'] || 0) + product.quantity;
      }
    });
    task.packages?.forEach(packageItem => {
      packageItem.units.forEach(unit => {
        const sku = unit?.item?.sku;
        if (!sku) return;
        const code = skuCodeEnum[sku];
        if (taskQtyBySku[sku]) {
          taskQtyBySku[sku]['ful'] = (taskQtyBySku[sku]['ful'] || 0) + 1;
        } else { // 统计fulfillment的数量
          taskQtyByCode[code]['ful'] = (taskQtyByCode[code]['ful'] || 0) + 1;
        }
      });
      packageItem.accessories.forEach(accessory => {
        const code = accessory.productCode;
        if (code) { // 统计fulfillment的数量
          taskQtyByCode[code] = taskQtyByCode[code] || {};
          taskQtyByCode[code]['ful'] = (taskQtyByCode[code]['ful'] || 0) + accessory.quantity;
        }
      });

      if (!packageItem.units.length) { // 空units默认填充一个unit数据双向绑定
        packageItem.units.push({ serial: null, status: 'DELIVERING' });
      }
    });

    for (const sku in taskQtyBySku) {
      // TODO: do we need to record 'over fulfilled task'?
      // Below is neccessary otherwise if there is one less fulfilled in one task and one more fulfilled in another, the overral quantity would be correct.
      taskQtyBySku[sku]['ful'] = Math.min(taskQtyBySku[sku]['ful'] || 0, taskQtyBySku[sku]['req']);
      qtyBySku[sku] = qtyBySku[sku] || {};
      qtyBySku[sku]['req'] = (qtyBySku[sku]['req'] || 0) + taskQtyBySku[sku]['req'];
      qtyBySku[sku]['ful'] = (qtyBySku[sku]['ful'] || 0) + taskQtyBySku[sku]['ful'];
    }
    for (const code in taskQtyByCode) {
      // Same as what's mentioned in sku part.
      taskQtyByCode[code]['ful'] = Math.min(taskQtyByCode[code]['ful'] || 0, taskQtyByCode[code]['req']);
      qtyByCode[code] = qtyByCode[code] || {};
      qtyByCode[code]['req'] = (qtyByCode[code]['req'] || 0) + taskQtyByCode[code]['req'];
      qtyByCode[code]['ful'] = (qtyByCode[code]['ful'] || 0) + taskQtyByCode[code]['ful'];
    }
  });
  return {
    qtyBySku,
    qtyByCode
  };
}) as Record<string, any>;

function queryTask () {
  if (listQuery.value.end) {
    const params = new URLSearchParams(listQuery.value);
    typeArr.value.forEach(type => {
      params.append('taskType', type);
    });
    queryTasksAPI(params).then(data => {
      if (!data.items.length) { // 找不到对应filter的task
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

      specifiedUnits.value = {};
      specifiedSerials.value.forEach(serial => {
        specifiedUnits.value[serial] = {};
      });
      if (specifiedSerials.value.length) { // computed value is triggered lazily but immediately when queried
        listUnitsAPI(specifiedSerials.value).then(units => {
          units.forEach(unit => {
            specifiedUnits.value[unit.serial] = unit;
          });
        });
      }
    });
  }
}

const fetchList = () => {
  setTimeout(() => queryTask(), 200);
};

/* Provide functions */
provide('fetchList', fetchList);
/* End of provide function */
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  min-height: calc(100vh - 91px - 32px)

.statistics
  .el-descriptions
    width: 100%
    max-width: 1024px
    margin-top: 20px
    &.specified-products
      width: 100%
      max-width: 1024px
      margin-top: 40px
</style>

<style lang="sass">
.error-border-tip
  border: 2px solid red !important
</style>
