<template>
  <div class="page">
    <FilterHeader
      @fetch-list="fetchList"
    />
    <PackageTable
      :data-list="dataList"
      :order-enum="orderEnum"
      @fetch-list="fetchList"
      @show-order-drawer="showOrderDrawer"
      @edit-housing-task="editHousingTask"
      @view-unit-description="viewUnitDescription"
    />

    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />

    <el-drawer
      v-model="drawerUnitVisible"
      title="Unit Info"
      size="60%"
      direction="ltr"
    >
      <UnitDescription 
        :serial-scope-arr="serialScopeArr"
        @fetchList="fetchList"
      />
    </el-drawer>

    <HousingDialog
      ref="housingDialog"
      :warehouse-enum="warehouseEnum"
      @findUnit="findUnit"
    />

    <el-drawer
      v-model="drawerOrderVisible"
      title="Order Info"
      size="60%"
      direction="ltr"
    >
      <OrderDescription :order-item="orderItem" />
      <template
        v-for="order in orderItem.rawOrders"
        :key="order.id"
      >
        <OrderDescription :order-item="order" />
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { UnitDescription, HousingDialog, FilterHeader, PackageTable } from './components';
import { OrderDescription } from '../components';
import { jsonToHump } from '@/utils';
import { queryPackagesAPI, queryUnitsAPI, queryAssignedBatchOrdersAPI } from '@/api/logistic';
import { useLogisticStore } from '@/store';
import { formatAssignedOrderItem } from '@/utils/logistic';

/* Start data */
const { warehouseEnum } = storeToRefs(useLogisticStore());

const warehousingItem = ref({});

const drawerUnitVisible = ref(false);

const warehousingTaskInfo = ref({
  targetId: null,
  packageId: null,
  taskId: null,
  taskType: null,
});

const dialogHousingVisible = ref(false);
const dialogCheckUnitVisible = ref(false);

const listQuery = ref({
  page: 1,
  perPage: 10,
  search: '',
});
const dataList = shallowRef(null);
const total = ref(0);

// Warehousing Dialog
provide('warehousingTaskInfo', warehousingTaskInfo);
provide('dialogHousingVisible', dialogHousingVisible);
provide('dialogCheckUnitVisible', dialogCheckUnitVisible);
provide('warehousingItem', warehousingItem);
provide('listQuery', listQuery);
provide('dataList', dataList);

// Unit Description
const unitItem = ref({});
provide('unitItem', unitItem);
/* End data */

const orderEnum = ref({}); // [{ orderId : {...orderItem} }]
function queryPackage() {
  queryPackagesAPI(listQuery.value).then((data) => {
    dataList.value = data.items;
    total.value = data.total;

    const orderIdArr = dataList.value.map(item => item.task.orderId);
    queryAssignedBatchOrdersAPI(orderIdArr).then(data => { // 获取所有task相关的order list
      data.forEach(order => {
        orderEnum.value[order.id] = formatAssignedOrderItem(order);
      });
    });
  });
}

const fetchList = () => {
  setTimeout(() => queryPackage(), 200);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'package', fetchList);

const orderItem = shallowRef(null);
const drawerOrderVisible = ref(false);
const showOrderDrawer = (order) => {
  orderItem.value = formatAssignedOrderItem(order);
  drawerOrderVisible.value = true;
};

const findUnit = (unitSerial) => {
  return queryUnitsAPI({ serial: unitSerial }).then((data) => {
    unitItem.value = data[0] || unitItem.value;
  });
};

const editHousingTask = (_unit, _task) => {
  // 更新unitItem
  findUnit(_unit.serial).then(() => {
    // 更新task info related
    warehousingTaskInfo.value = Object.assign({}, {
      taskId: _task.id,
      targetId: _task.targetId,
      taskType: _task.taskType,
      packageId: _unit.packageId,
    });
    jsonToHump(_unit); // TODO: bug, jsonToHump failed in query API
    // 初始化 accessories for v-model="warehousingItem.accessories[0].quantity/productCode"
    _unit.accessories[0] = Object.assign({ productCode: null, quantity: null }, _unit.accessories[0]);
    warehousingItem.value = _unit;
    dialogHousingVisible.value = true;
  });
};

const multipleSelection = ref([]);
provide('multipleSelection', multipleSelection);

const unique = arr => Array.from(new Set(arr));

const serialScopeArr = ref([]);
const viewUnitDescription = (unit, task) => {
  serialScopeArr.value = [];

  const { products, orderId } = task;
  products.forEach(product => {
    serialScopeArr.value = [].concat(product.serialNote);
  });
  orderEnum.value[orderId].tasks?.forEach(task => {
    task.packages.forEach(item => {
      item.units?.forEach(unit => {
        serialScopeArr.value.push(unit.serial);
      });
    });
  });
  serialScopeArr.value = unique(serialScopeArr.value);

  unitItem.value = unit;
  drawerUnitVisible.value = true;
};
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

.dialog-header
  margin-left: 1rem
  margin-bottom: 1rem
  font-size: 18px
  font-weight: 500

:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 20px
  .el-checkbox
    height: 14px
    vertical-align: middle

:deep(.el-dialog)
  width: 80%
</style>
