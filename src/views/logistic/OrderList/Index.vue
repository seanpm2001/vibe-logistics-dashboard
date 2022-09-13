<template>
  <div class="page">
    <FilterHeader
      @fetch-list="fetchList"
      @show-assign-dialog="showAssignDialog"
      @unassign-orders="unassignOrders"
    />
    <OrderTable
      :data-list="dataList"
      :warehouse-enum="warehouseEnum"
      @fetch-list="fetchList"
      @show-order-drawer="showOrderDrawer"
      @edit-warehouse-task="editWarehouseTask"
      @show-assign-dialog="showAssignDialog"
      @show-task-type-dialog="showTaskTypeDialog"
      @unassign-orders="unassignOrders"
    />

    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />

    <el-dialog
      v-model="dialogAssignVisible"
      width="32%"
      title="Assign Warehouse"
      :close-on-click-modal="false"
    >
      <AssignOrderForm
        :warehouse-enum="warehouseEnum"
      />
      <template #footer>
        <el-button
          type="primary"
          @click="assignOrders()"
        >
          submit
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogTasktypeVisible"
      width="32%"
      title="Assign Warehouse"
      :close-on-click-modal="false"
    >
      <el-row
        align="middle"
      >
        Please select task type:  &ensp;*
        <el-select
          v-model="dialogTaskType"
          placeholder="Please select"
        >
          <el-option
            v-for="(type, key) in taskTypeEnum"
            :key="type"
            :label="type"
            :value="key"
          />
        </el-select>
      </el-row>
      <template #footer>
        <el-button
          type="primary"
          @click="addWarehouseTask()"
        >
          submit
        </el-button>
      </template>
    </el-dialog>

    <TaskDialog
      ref="taskForm"
      :warehouse-enum="warehouseEnum"
      :empty-task-item="emptyTaskItem"
      :dialog-status="dialogStatus"
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

<script setup>
import FilterHeader from './FilterHeader.vue';
import OrderTable from './OrderTable.vue';
import AssignOrderForm from './AssignOrderForm.vue';
import { ElMessage } from 'element-plus';
import { TaskDialog, OrderDescription } from '../components';
import {
  queryOrdersAPI,
  queryAssignedOrdersAPI,
  assignOrdersAPI,
  unassignOrdersAPI,
  findAssignedOrderAPI,
  findTaskAPI,
  createTaskAPI,
} from '@/api';
import { formatAssignedOrderItem } from '@/utils/logistic';
import { codeSkuArrEnum, taskTypeEnum } from '@/enums';
import { useUserStore, useLogisticStore } from '@/store';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading';

/* Start data */
const { role } = storeToRefs(useUserStore());
const { warehouseEnum } = storeToRefs(useLogisticStore());

const dialogAssignVisible = ref(false);
const dialogTasktypeVisible = ref(false);
const dialogTaskVisible = ref(false);

const assignPattern = ref('');
const assignOrderId = ref(null);
const dialogStatus = ref('view'); // 点开Warehouse Task默认为view pattern

const dialogTaskType = ref(null);
let dialogOrderId = ref(null);

const multipleSelection = ref([]);
const taskOrderItem = shallowRef(null);
const taskItem = ref({
  id: null,
  orderId: null,
  sourceId: null,
  targetId: null,
  taskType: null,
  returnReason: null,
  returnDetails: null,
  newAddress: null,
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
  // shipment info
  carrier: null,
  transportMode: null,
  deliveryCost: null,
  liftgateCost: null,
  limitedCost: null,
  residentialCost: null,
  insideCost: null,
  insureCost: null,
});

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);

const taskPermissionArr = ['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR'];

const dataList = shallowRef(null);
const total = ref(0);
const listQuery = ref({
  page: 1,
  perPage: 20,
  search: null,
  orderFrom: null,
  showAssignedOrder: false,
});

const contrastTask = ref(null);

const disableUnchangedTask = computed(() => {
  if (JSON.stringify(taskItem.value) !== contrastTask.value) // changed
    return false;
  return true;
});

const disableAssign = ref(false);
provide('disableAssign', disableAssign);

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('disableUnchangedTask', disableUnchangedTask);
provide('taskOrderItem', taskOrderItem);
provide('listQuery', listQuery);
provide('multipleSelection', multipleSelection);

const sourceId = ref(null);
const taskTransport = ref(null);
const taskCarrier = ref(null);
// AssignOrderForm
provide('sourceId', sourceId);
provide('taskCarrier', taskCarrier);
provide('taskTransport', taskTransport);
/* End data */

/* Start Query Related */
function queryOrders () {
  const showAssignedOrder = listQuery.value.showAssignedOrder;
  (showAssignedOrder
    ? queryAssignedOrdersAPI(listQuery.value)
    : queryOrdersAPI(listQuery.value)
  ).then((data) => {
    dataList.value = data.items;
    if (showAssignedOrder) {
      dataList.value.forEach(async item => {
        await formatAssignedOrderItem(item);
      });
    }
    total.value = data.total;
  });
}

function fetchList() {
  setTimeout(() => queryOrders(), 350);
}

useWarehouseEnumHook();
useQueryHook(listQuery, 'order', fetchList);
/* End Query Related */

const orderItem = shallowRef(null);
const drawerOrderVisible = ref(false);
const showOrderDrawer = async order => {
  showFullScreenLoading();
  orderItem.value = await formatAssignedOrderItem(order);
  drawerOrderVisible.value = true;
  tryHideFullScreenLoading();
};

const showAssignDialog = (type, orderId) => {
  sourceId.value = null;
  taskTransport.value = null;
  taskCarrier.value = null;

  assignPattern.value = type;
  assignOrderId.value = orderId || null;
  dialogAssignVisible.value = true;
};

function removeEmptyProducts (taskItem) {
  if (JSON.stringify(taskItem.products[0]) === '{}')
    delete taskItem['products'];
}

const showTaskTypeDialog = (orderId) => {
  dialogTasktypeVisible.value = true;
  dialogOrderId = orderId;
};

const getCustomerId = () => Number(Object.keys(warehouseEnum.value).find(key => warehouseEnum.value[key] === 'Customer'));

async function submitInitTaskItem (products, assignedData, orderId, ifSubmit = true) {
  const { sourceWHId = null, carrier = null, transportMode = null } = assignedData;

  const task = {} ;
  task.orderId = orderId;
  task.taskType = 'FULFILLMENT';
  task.sourceId = sourceWHId;
  task.targetId = getCustomerId(); // Default Customer
  task.carrier = carrier;
  task.transportMode = transportMode;
  task.products = [];

  // 初始化products的内容, 若product_code对应的sku只有一个，赋该值
  for (let idx = products.length - 1; idx >= 0; idx--) {
    const productCode = products[idx].productCode;
    if (productCode.includes('EPP')) {
      products.splice(idx, 1);
      continue;
    }

    let sku = null;
    if (codeSkuArrEnum[productCode].length === 1)
      sku = codeSkuArrEnum[productCode][0] || null;

    task.products[idx] = {
      productCode: productCode,
      sku: sku,
      condition: 'GOOD',
      quantity: products[idx].quantity,
      serialNote: null,
    };
  }

  removeEmptyProducts(task); // 若products变成[{}]，删除task.products

  let taskId = null;

  if (ifSubmit) {
    await createTaskAPI(task).then(data => {
      taskId = data.id;
    }).catch(error => {
      unassignOrdersAPI(orderId).then(() => fetchList());
    });

    return taskId;
  } else {
    taskItem.value = Object.assign({}, task);
  }
}

function assignSelectedOrders(assignedData, selectedArr) {
  const { sourceWHId } = assignedData;

  if (!selectedArr.length) {
    ElMessage.error('Please at least select an order!');
    return;
  }
  const assignOrder = (sourceWHId, selection) => {
    assignOrdersAPI(sourceWHId, [selection.id]).then(data => {
      submitInitTaskItem(selection.items, assignedData, data.id); // 传递products {productCode: '', quantity: 0}
    });
  };
  const promiseArr = [];
  multipleSelection.value.forEach((item) => {
    promiseArr.push(assignOrder(sourceWHId, item));
  });
  Promise.allSettled(promiseArr).then(() => fetchList());
}

const assignOrders = () => {
  const sourceWHId = sourceId.value;
  const assignedData = {
    sourceWHId,
    carrier: taskCarrier.value,
    transportMode: taskTransport.value
  };
  const selectedArr = multipleSelection.value;
  if (!sourceWHId) {
    ElMessage.error('Please select a target warehouse!');
    return;
  }
  const pattern = assignPattern.value; // ['assign', 'assignSelected', 'combineAndAssign']
  const orderArr = [];

  if (pattern === 'assignSelected') {
    // 单独处理批量assign，不展示warehouse task dialog
    assignSelectedOrders(assignedData, selectedArr);
    dialogAssignVisible.value = false;
    fetchList();
    return;
  } else if (pattern === 'combineAndAssign') {
    // 合并order并assign
    multipleSelection.value.forEach((item) => {
      orderArr.push(item.id);
    });
  } else {
    // assign单个
    orderArr.push(assignOrderId.value);
  }

  // 调用batch assign orders API
  assignOrdersAPI(sourceWHId, orderArr)
    .then(async (data) => {
      dialogAssignVisible.value = false;
      const products = await formatAssignedOrderItem(data)?.items;
      await submitInitTaskItem(products, assignedData, data.id, false);
      // taskId && editWarehouseTask(data.id, taskId);
      taskOrderItem.value = await formatAssignedOrderItem(data);
      dialogStatus.value = 'update';
      showTaskDialog();
      ElMessage.warning('Please Submit yourself');
    })
    .finally(() => {
      dialogAssignVisible.value = false;
      fetchList();
    });
};

const unassignOrders = (order) => {
  if (order.tasks?.length > 0) {
    ElMessage.error('Please remove all tasks before unassign!');
    return;
  }
  unassignOrdersAPI(order.id)
    .then(() => fetchList());
};

function recordContrastTask () {
  contrastTask.value = JSON.stringify(taskItem.value);
}

function showTaskDialog () {
  recordContrastTask();
  dialogTaskVisible.value = true;
  dialogTasktypeVisible.value = false;
  dialogTaskType.value = null;
}

const addWarehouseTask = () => {
  const orderId = dialogOrderId;
  taskItem.value = Object.assign({}, emptyTaskItem);
  findAssignedOrderAPI(orderId).then(async data => {
    taskItem.value.orderId = orderId;
    taskItem.value.taskType = dialogTaskType.value;
    console.log('taskItem: ', taskItem);
    taskOrderItem.value = await formatAssignedOrderItem(data);
    dialogStatus.value = 'create';

    initProductsDifferType();

    showTaskDialog();
  });
};

function initProductsDifferType () {
  const type = dialogTaskType.value;
  if (type === 'FULFILLMENT') {
    const products = taskOrderItem.value.items;
    submitInitTaskItem(products, {}, dialogOrderId, false);
  }
}

const editWarehouseTask = (orderId, taskId) => {
  if (!taskPermissionArr.includes(role.value)) {
    ElMessage.error('You don\'t have permission');
    return;
  }
  findAssignedOrderAPI(orderId).then(async data => {
    taskOrderItem.value = await formatAssignedOrderItem(data);
    findTaskAPI(taskId).then(data => {
      taskItem.value = data;
      dialogStatus.value = 'update';
      showTaskDialog();
    });
  });
};

const resetForm = () => {};
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 20px
  .el-checkbox
    height: 14px
    vertical-align: middle

.product-row
  max-width: 90%
  margin: 0 auto

.order-info
  .el-tag
    cursor: pointer

.el-form-item__content div
  width: 100%

.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
