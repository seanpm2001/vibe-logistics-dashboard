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
      @edit-warehousing-task="editWarehousingTask"
      @view-unit-description="viewUnitDescription"
      @receive-units="receiveUnits"
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
        @fetchList="fetchList"
      />
    </el-drawer>

    <el-drawer
      v-model="drawerReceiveUnitsVisible"
      title="Receive Units for Package"
      size="100%"
      direction="ltr"
    >
      <ReceiveUnits
        @fetchList="fetchList"
      />
    </el-drawer>

    <WarehousingDialog
      ref="warehousingDialog"
      :warehouse-enum="warehouseEnum"
      @findUnit="findUnit"
      @fetch-list="fetchList"
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
import { UnitDescription, WarehousingDialog, FilterHeader, PackageTable, ReceiveUnits } from './components';
import { OrderDescription } from '../components';
import { jsonToHump, showFullScreenLoading, tryHideFullScreenLoading } from '@/utils';
import { queryPackagesAPI, queryUnitsAPI, queryAssignedBatchOrdersAPI } from '@/api';
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

const drawerReceiveUnitsVisible = ref(false);
const packageReceived = ref({});
const taskSerialsAndSkus = ref([]);
const taskAccessoriesCode = ref([]);

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
provide('packageReceived', packageReceived);
provide('listQuery', listQuery);
provide('dataList', dataList);
provide('taskSerialsAndSkus', taskSerialsAndSkus);
provide('taskAccessoriesCode', taskAccessoriesCode);

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
      data.forEach(async order => {
        orderEnum.value[order.id] = await formatAssignedOrderItem(order);
      });
    });
  });
}

const fetchList = () => {
  setTimeout(() => queryPackage(), 350);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'package', fetchList);

const orderItem = shallowRef(null);
const drawerOrderVisible = ref(false);
const showOrderDrawer = async order => {
  showFullScreenLoading();
  orderItem.value = await formatAssignedOrderItem(order);
  drawerOrderVisible.value = true;
  tryHideFullScreenLoading();
};

const findUnit = (unitSerial) => {
  return queryUnitsAPI({ serial: unitSerial }).then((data) => {
    unitItem.value = data[0] || unitItem.value;
  });
};

const editWarehousingTask = (_unit, _task) => {
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

const getTaskSerialsAndSkus = (task) => {
  const serials = [];
  const serialsSku = {};
  const orderId = task.orderId;
  orderEnum.value[orderId].tasks?.forEach(task => {
    task.packages.forEach(item => {
      item.units?.forEach(unit => {
        if (unit.serial) {
          serials.push(unit.serial);
          serialsSku[unit.serial] = unit.item.sku;
        }
      });
    });
  });
  const serialsAndSkus = [];
  unique(serials).forEach((serial) => {
    serialsAndSkus.push({
      serial: serial,
      sku: serialsSku[serial]
    });
  });
  return serialsAndSkus;
};

const getTaskAccessoriesCode = (task) => {
  const accessories = [];
  const orderId = task.orderId;
  orderEnum.value[orderId].tasks?.forEach(task => {
    task.packages.forEach(item => {
      item.accessories?.forEach(accessory => {
        if (accessory.productCode) {
          accessories.push(accessory.productCode);
        }
      });
    });
  });
  return unique(accessories);
};

const viewUnitDescription = (unit, task) => {
  taskSerialsAndSkus.value = getTaskSerialsAndSkus(task);
  unitItem.value = unit;
  drawerUnitVisible.value = true;
};

const receiveUnits = (packageItem) => {
  taskSerialsAndSkus.value = getTaskSerialsAndSkus(packageItem.task);
  taskAccessoriesCode.value = getTaskAccessoriesCode(packageItem.task);
  packageReceived.value = JSON.parse(JSON.stringify(packageItem));
  drawerReceiveUnitsVisible.value = true;
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
