<template>
  <div class="page">
    <div class="statistics">
      <FilterHeader @fetch-list="fetchList" />
      <el-row justify="end">
        <el-button
          type="primary"
          @click="showExport"
        >
          Export
        </el-button>
      </el-row>
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

    <ExportTasks />

    <Pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[20, 50, 100, 200]"
      @fetchList="fetchList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import FilterHeader from './FilterHeader.vue';
import TaskCards from './TaskCards/Index.vue';
import ExportTasks from './ExportTasks.vue';
import { formatAssignedOrderItem, getTaskOrderIdArr } from '@/utils/logistic';
import { listUnitsAPI, queryTasksAPI, queryAssignedBatchOrdersAPI } from '@/api';
import { skuCodeEnum, codeNameEnum, noSerialArr, taskFulfilmentErrorEnum } from '@/enums/logistic';
// import { useUserStore } from '@/store';

/* Start Data */
// const { role } = storeToRefs(useUserStore());
const listQuery = ref({
  page: 1,
  perPage: 200,
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
const savedTasks = ref(null); // 对比数据是否修改
const dialogExportTasksVisible = ref(false);

provide('listQuery', listQuery);
provide('typeArr', typeArr);
provide('dataList', dataList);
provide('savedTasks', savedTasks);
provide('dialogExportTasksVisible', dialogExportTasksVisible);
provide('orderEnum', orderEnum);

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
      if (product.serialNote) {
        taskSpecifiedSerials = taskSpecifiedSerials.concat(product.serialNote);
      }
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

const tasksFulQty = computed(() => {
  const qty = {};
  savedTasks.value?.forEach(task => {
    const taskQtyBySku = {};
    const taskQtyByCode = {};
    const error = {};
    const unfulSpecifiedSerials = {};

    task.products?.forEach(product => {
      const code = product.productCode;
      const sku = product.sku;
      product.serialNote?.forEach(serial => {
        unfulSpecifiedSerials[serial] = true;
      });
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
      if (!packageItem.trackingNumber) {
        error[taskFulfilmentErrorEnum.MISSING_TRACKING_NUMBER] = true;
      }
      packageItem.units.forEach(unit => {
        unit.serial && (delete unfulSpecifiedSerials[unit.serial]);
        const sku = unit?.item?.sku;
        if (!sku) return;
        const code = skuCodeEnum[sku];
        if (taskQtyBySku[sku]) {
          taskQtyBySku[sku]['ful'] = (taskQtyBySku[sku]['ful'] || 0) + 1;
        } else if (taskQtyByCode[code]) { // 统计fulfillment的数量
          taskQtyByCode[code]['ful'] = (taskQtyByCode[code]['ful'] || 0) + 1;
        } else {
          error[taskFulfilmentErrorEnum.UNWANTTED_PRODUCT] = true;
        }
      });
      packageItem.accessories.forEach(accessory => {
        const code = accessory.productCode;
        if (code && taskQtyByCode[code]) { // 统计fulfillment的数量
          taskQtyByCode[code]['ful'] = (taskQtyByCode[code]['ful'] || 0) + accessory.quantity;
        } else if (code && !taskQtyByCode[code]) {
          error[taskFulfilmentErrorEnum.UNWANTTED_PRODUCT] = true;
        }
      });
    });

    for (const sku in taskQtyBySku) {
      if (taskQtyBySku[sku]?.req !== taskQtyBySku[sku]?.ful) {
        error[taskFulfilmentErrorEnum.QUANTITY_MISMATCH] = true;
        break;
      }
    }

    for (const code in taskQtyByCode) {
      if (taskQtyByCode[code]?.req !== taskQtyByCode[code]?.ful) {
        error[taskFulfilmentErrorEnum.QUANTITY_MISMATCH] = true;
        break;
      }
    }

    if (Object.keys(unfulSpecifiedSerials).length) {
      error[taskFulfilmentErrorEnum.SPECIFIED_SERIAL_UNFULFILLED] = true;
    }

    qty[task.id] = {
      taskQtyBySku,
      taskQtyByCode,
      error: Object.keys(error).map((e, idx) => `${idx + 1}. ${e}`).join('; ')
    };
  });
  return qty;
}) as Record<string, any>;

provide('tasksFulQty', tasksFulQty);

const fulQty = computed(() => {
  const qtyBySku = {};
  const qtyByCode = {};

  for (const taskId in tasksFulQty.value) {
    const { taskQtyBySku, taskQtyByCode } = tasksFulQty.value[taskId];
    for (const sku in taskQtyBySku) {
      // Below is neccessary otherwise if there is one less fulfilled in one task and one more fulfilled in another, the overral quantity would be correct.
      const validFulQty = Math.min(taskQtyBySku[sku]['ful'] || 0, taskQtyBySku[sku]['req']);
      qtyBySku[sku] = qtyBySku[sku] || {};
      qtyBySku[sku]['req'] = (qtyBySku[sku]['req'] || 0) + taskQtyBySku[sku]['req'];
      qtyBySku[sku]['ful'] = (qtyBySku[sku]['ful'] || 0) + validFulQty;
    }
    for (const code in taskQtyByCode) {
      // Same as what's mentioned in sku part.
      const validFulQty = Math.min(taskQtyByCode[code]['ful'] || 0, taskQtyByCode[code]['req']);
      qtyByCode[code] = qtyByCode[code] || {};
      qtyByCode[code]['req'] = (qtyByCode[code]['req'] || 0) + taskQtyByCode[code]['req'];
      qtyByCode[code]['ful'] = (qtyByCode[code]['ful'] || 0) + validFulQty;
    }
  }
  return {
    qtyBySku,
    qtyByCode
  };
}) as Record<string, any>;

const showExport = () => {
  dialogExportTasksVisible.value = true;
};

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
      savedTasks.value = JSON.parse(JSON.stringify(dataList.value));
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
          console.log(units);
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
