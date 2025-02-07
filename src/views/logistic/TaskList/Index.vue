<template>
  <div class="page">
    <FilterHeader
      @fetch-list="fetchList"
    />
    <TaskTable
      :data-list="dataList"
      :order-enum="orderEnum"
      :warehouse-enum="warehouseEnum"
      @fetch-list="fetchList"
      @show-order-drawer="showOrderDrawer"
      @handle-detail-row="handleDetailRow"
    />

    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />

    <TaskDialog
      :empty-task-item="emptyTaskItem"
      :warehouse-enum="warehouseEnum"
      :dialog-status="dialogStatus"
      @update-task-item="updateTaskItem"
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

    <UploadTaskFileDialog @update-task-item="updateTaskItem" />
  </div>
</template>

<script setup>
import TaskTable from './TaskTable.vue';
import FilterHeader from './FilterHeader.vue';
import { TaskDialog, OrderDescription, UploadTaskFileDialog } from '../components';
import {
  queryTasksAPI,
  findTaskAPI,
  deleteTaskAPI,
  findAssignedOrderAPI,
  queryAssignedBatchOrdersAPI
} from '@/api';
import { formatAssignedOrderItem, getTaskOrderIdArr } from '@/utils/logistic';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading';
import { useUserStore, useLogisticStore } from '@/store';

/* Start Data */
const { warehouseEnum } = storeToRefs(useLogisticStore());
const { warehouseId } = storeToRefs(useUserStore());
const taskOrderItem = shallowRef(null);

const dialogStatus = ref('view');
const dialogTaskVisible = ref(false);
const dialogUploadVisible = ref(false);

const multipleSelection = ref([]);
const taskItem = ref({
  id: null,
  orderId: null,
  sourceId: null,
  targetId: null,
  taskType: null,
  returnReason: null,
  returnDetails: null,
  newAddress: null,
  trackingNumberNote: null,
  note: null,
  onHold: false,
  products: [{
    id: null,
    productCode: null,
    sku: null,
    condition: null,
    quantity: null,
    serialNote: null,
  }],
  files: [],
  // shipment info
  carrier: null,
  deliveryCost: null,
  liftgateCost: null,
  limitedCost: null,
  residentialCost: null,
  insideCost: null,
  insureCostL: null,
});

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);


const listQuery = ref({
  page: 1,
  perPage: 10,
  warehouseId: warehouseId,
  transportMode: '',
  carrier: '',
});
const typeArr = ref(['FULFILLMENT', 'REPLACE', 'RETURN']);
const dataList = shallowRef(null);
const total = ref(0);

const contrastTask = ref(null);

const disableUnchangedTask = computed(() => {
  if (JSON.stringify(taskItem.value) !== contrastTask.value) // changed
    return false;
  return true;
});

provide('dialogTaskVisible', dialogTaskVisible);
provide('dialogUploadVisible', dialogUploadVisible);

provide('taskItem', taskItem);
provide('disableUnchangedTask', disableUnchangedTask);
provide('taskOrderItem', taskOrderItem);
provide('listQuery', listQuery);
provide('typeArr', typeArr);
provide('multipleSelection', multipleSelection);
/* End Data */


const orderEnum = ref({}); // [{ orderId : {...orderItem} }]
function queryTask() {
  const params = new URLSearchParams(listQuery.value);
  typeArr.value.forEach(type => {
    params.append('taskType', type);
  });

  queryTasksAPI(params).then((data) => {
    dataList.value = data.items;
    total.value = data.total;

    const orderIdArr = getTaskOrderIdArr(dataList.value);
    queryAssignedBatchOrdersAPI(orderIdArr).then(data => { // 获取所有task相关的order list
      data.forEach(async order => {
        orderEnum.value[order.id] = await formatAssignedOrderItem(order);
      });
    });
  });
}

const fetchList = () => {
  setTimeout(() => queryTask(), 350);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'task', fetchList);

const orderItem = shallowRef(null);
const drawerOrderVisible = ref(false);
const showOrderDrawer = async order => {
  showFullScreenLoading();
  orderItem.value = await formatAssignedOrderItem(order);
  drawerOrderVisible.value = true;
  tryHideFullScreenLoading();
};

function recordContrastTask () {
  contrastTask.value = JSON.stringify(taskItem.value);
}

function showTaskDialog () {
  recordContrastTask();
  dialogTaskVisible.value = true;
}

const handleDetailRow = (task, type) => {
  const taskId = task.id;
  if (type === 'remove') {
    deleteTaskAPI(taskId).then(() => fetchList());
    return;
  }
  findTaskAPI(taskId).then((data) => {
    taskItem.value = Object.assign({}, data); // copy obj
    type === 'edit' && (contrastData.value = Object.assign({}, data));
  });
  const orderId = task.orderId;
  findAssignedOrderAPI(orderId).then(async data => {
    taskOrderItem.value = await formatAssignedOrderItem(data);
    type === 'edit' && (dialogStatus.value = 'update');
    showTaskDialog();
  });
};

const updateTaskItem = () => {
  setTimeout(() => {
    const taskId = taskItem.value.id;
    taskId && findTaskAPI(taskId).then(data => {
      taskItem.value = data;
    });
  }, 200);
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

:deep(.el-dialog)
  width: 80%

.el-row
  justify-content: space-between
  margin-right: 2rem
  margin-left: 2rem
  .el-form-item
    width: 42%

.el-form-item__content div
  width: 100%
</style>
