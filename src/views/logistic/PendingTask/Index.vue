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
          v-for="(item, key) in productsFulQty.qtyByCode"
          :key="key"
        >
          <div v-if="item.req">
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
          </div>
        </template>

        <template
          v-for="(item, key) in productsFulQty.qtyBySku"
          :key="key"
        >
          <div v-if="item.req">
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
          </div>
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
            {{ codeNameEnum[skuCodeEnum[specifiedUnits[serial]?.sku]] || skuCodeEnum[specifiedUnits[serial]?.sku] }}
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

    <template
      v-for="(task, taskIdx) in dataList"
      :key="task.id"
    >
      <TaskCard
        :task="task"
        :task-idx="taskIdx"
        :order-enum="orderEnum"
        :warehouse-enum="warehouseEnum"
        :role="role"
      />
    </template>
    

    <ExportTasks />

    <Pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[20, 50, 100, 200]"
      @fetch-list="fetchList"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import FilterHeader from './FilterHeader.vue';
import TaskCard from './TaskCard/Index.vue';
import ExportTasks from './ExportTasks.vue';
import { formatAssignedOrderItem, getTaskOrderIdArr } from '@/utils/logistic';
import { listUnitsAPI, queryTasksAPI, queryAssignedBatchOrdersAPI } from '@/api';
import { skuCodeEnum, codeNameEnum, noSerialArr, taskFulfilmentErrorEnum } from '@/enums/logistic';
import { useUserStore, useLogisticStore } from '@/store';

/* Start Data */
const { warehouseId, role } = storeToRefs(useUserStore());
const { warehouseEnum } = storeToRefs(useLogisticStore());

const listQuery = ref({
  page: 1,
  perPage: 200,
  onHold: false,
  start: null,
  end: null,
  search: '',
  carrier: '',
  transportMode: '',
  warehouseId: warehouseId,
  fulfilled: 'false',
});

const typeArr = ref(['FULFILLMENT', 'REPLACE']);

const total = ref(0);
const dataList = shallowRef(null);
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

const tasksProductFulQty = computed(() => {
  const qty = {};
  savedTasks.value?.forEach(task => {
    const error = [];
    if (!task.carrier) error[taskFulfilmentErrorEnum.MISSING_CARRIER] = true;
    if (task.products.length === 0) return;
    const productsQty = [];
    const totalUnfulSpecSerials = {};
    task.products?.forEach(product => {
      const unfulSpecSerials = {};
      product.serialNote?.forEach(serial => {
        unfulSpecSerials[serial] = true;
        totalUnfulSpecSerials[serial] = true;
      });
      productsQty.push({ productCode: product.productCode, sku: product?.sku, req: product.quantity, fulExclSpec: 0, fulSpec: 0, unfulSpecSerials: unfulSpecSerials, serialNote: product.serialNote });
    });
    task.packages?.forEach(packageItem => {
      if (!packageItem.trackingNumber) {
        error[taskFulfilmentErrorEnum.MISSING_TRACKING_NUMBER] = true;
      }
      packageItem.units.forEach(unit => {
        if (!unit.serial) return;
        const sku = unit?.item?.sku;
        if (!sku) return;
        let ful = false;
        if (totalUnfulSpecSerials[unit.serial]) {
          productsQty?.forEach(product => {
            if (!ful && product.unfulSpecSerials[unit.serial]) {
              delete product.unfulSpecSerials[unit.serial];
              product.fulSpec += 1;
              ful = true;
            }
          });
        } else {
          // Firstly search for sku match
          for (const product of productsQty) {
            if (!ful && product.sku && product.sku === unit.item.sku && product.fulExclSpec + product.fulSpec + Object.keys(product.unfulSpecSerials || {}).length < product.req) {
              product.fulExclSpec += 1;
              ful = true;
            }
          }
          // Secondly search for product code match
          if (!ful) {
            for (const product of productsQty) {
              if (!ful && product.productCode && product.productCode === skuCodeEnum[unit.item.sku] && product.fulExclSpec + product.fulSpec + Object.keys(product.unfulSpecSerials || {}).length < product.req) {
                product.fulExclSpec += 1;
                ful = true;
              }
            }
          }
        }
        if (!ful) {
          error[taskFulfilmentErrorEnum.EXTRA_PRODUCT] = true;
        }
      });

      packageItem.accessories.forEach(accessory => {
        if (!accessory.productCode || !accessory.quantity) return;
        for (const product of productsQty) {
          if (product.productCode && product.productCode === accessory.productCode) {
            product.fulExclSpec += accessory.quantity;
          }
        }
      });
    });
    productsQty?.forEach(product => {
      if (product.fulExclSpec + product.fulSpec < product.req) {
        error[taskFulfilmentErrorEnum.MISSING_PRODUCT] = true;
      }
      if (product.fulExclSpec + product.fulSpec > product.req) {
        error[taskFulfilmentErrorEnum.QUANTITY_MISMATCH] = true;
      }
      if (Object.keys(product.unfulSpecSerials || {}).length) {
        error[taskFulfilmentErrorEnum.SPECIFIED_SERIAL_UNFULFILLED] = true;
      }
    });
    qty[task.id] = {
      productsQty,
      error: Object.keys(error).map((e, idx) => `${idx + 1}. ${e}`).join('; ')
    };
  });
  return qty;
});

provide('tasksProductFulQty', tasksProductFulQty);

const productsFulQty = computed(() => {
  const qtyBySku = {};
  const qtyByCode = {};
  for (const taskId in tasksProductFulQty.value) {
    const productsQty = tasksProductFulQty.value[taskId]?.productsQty;
    productsQty?.forEach(product => {
      const sku = product.sku;
      const code = product.productCode;
      if (sku && !noSerialArr.includes(code)) {
        qtyBySku[sku] = qtyBySku[sku] || {};
        qtyBySku[sku]['req'] = (qtyBySku[sku]['req'] || 0) + product.req - (product.serialNote?.length || 0);
        qtyBySku[sku]['ful'] = (qtyBySku[sku]['ful'] || 0) + product.fulExclSpec;
      } else {
        qtyByCode[code] = qtyByCode[code] || {};
        qtyByCode[code]['req'] = (qtyByCode[code]['req'] || 0) + product.req - (product.serialNote?.length || 0);
        qtyByCode[code]['ful'] = (qtyByCode[code]['ful'] || 0) + product.fulExclSpec;
      }
    });
  }
  return {
    qtyBySku,
    qtyByCode
  };
});

const showExport = () => {
  dialogExportTasksVisible.value = true;
};

function preprocessTasks(originalTasks) {
  const tasks = JSON.parse(JSON.stringify(originalTasks));
  tasks.forEach(task => {
    task?.packages.forEach(packageItem => {
      if (!packageItem.units.length) {
        packageItem.units.push({serial: null, status: 'DELIVERING'});
      }
    });
  });
  return tasks;
}

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

      total.value = data.total;
      savedTasks.value = JSON.parse(JSON.stringify(data.items));
      dataList.value = preprocessTasks(data.items);
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
  setTimeout(() => queryTask(), 350);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'pending', fetchList);
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
