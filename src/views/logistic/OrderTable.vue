<template>
  <div class="page">
    <el-row
      justify="space-between"
      class="filter-container"
    >
      <el-row>
        <el-input
          v-model="listQuery.search"
          placeholder="Order Info"
          style="width: 150px"
        >
          <template #append>
            <el-button
              v-wave
              type="primary"
              :icon="Search"
              @click="handleFilter"
            />
          </template>
        </el-input>
        <el-select
          v-model="showAssignedOrder"
          :disabled="listLoading"
          placeholder="Assigned Order"
          style="width: 175px"
          @change="handleFilter"
        >
          <el-option
            v-for="(item, key) in { 'Assigned Orders': true, 'Unassigned Orders': false }"
            :key="item"
            :label="key"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="listQuery.orderFrom"
          disabled
          placeholder="Order From"
          style="width: 130px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in ['AFN', 'Shopify', 'MFN']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-row>
      <div v-if="!showAssignedOrder">
        <el-button 
          v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
          :disabled="!multipleSelection?.length"
          type="primary"
          @click="showAssignDialog('assignSelected')"
        >
          Assign Selected
        </el-button>
        <el-button
          v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
          :disabled="!multipleSelection?.length"
          type="primary"
          @click="showAssignDialog('combineAndAssign')"
        >
          Combine & Assign Selected
        </el-button>
      </div>
      <div v-else>
        <el-button
          v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
          :disabled="!multipleSelection?.length"
          type="primary"
          :icon="Delete"
          @click="unassignSelected()"
        >
          Unassign Selected
        </el-button>
      </div>
    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="68vh"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        height="40"
        align="center"
      />
      <el-table-column
        class-name="order-info"
        label="Order"
        width="240px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag @click="showOrderDrawer(row)">
            #<span class="link-type">{{ row.id }}</span>
          </el-tag>
          <div v-if="row.rawOrders">
            <template
              v-for="item in row.rawOrders"
              :key="item.id"
            >
              <el-tag @click="showOrderDrawer(item)">
                #{{ item.id }}
              </el-tag>
              <br>
            </template>
          </div>
          <p>{{ formatDate(row.createdAt) }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Shipment Info"
        min-width="280px"
        align="center"
      >
        <template #default="{ row }">
          <OrderShipmentInfo :order-item="row" />
        </template>
      </el-table-column>
      <el-table-column
        label="Products"
        width="255px"
        align="center"
      >
        <template #default="{ row }">
          <div class="product-row">
            <template v-if="showAssignedOrder">
              <template
                v-for="item in row.items"
                :key="item.productCode"
              >
                <div align="left">
                  <svg-icon :icon-name="codeIconEnum[item.productCode] || 'product-other'" />
                  <span class="mgl-5">{{ codeNameEnum[item.productCode] || item.productCode }}:
                    <el-tag
                      class="mgl-5"
                      size="small"
                    >{{ item.quantity }}</el-tag>
                  </span>
                </div>
              </template>
            </template>
            <template v-else>
              <template
                v-for="item in row.items"
                :key="item.productCode"
              >
                <div align="left">
                  <svg-icon :icon-name="codeIconEnum[item.productCode] || 'product-other'" />
                  <span class="mgl-5">{{ codeNameEnum[item.productCode] || item.productCode }}:<el-tag
                    class="mgl-5"
                    size="small"
                  >{{ item.quantity }}</el-tag></span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Warehouse Task"
        width="240px"
        align="center"
      >
        <template #default="{ row }">
          <template
            v-for="(item, index) in row.tasks"
            :key="item.id"
          >
            <div class="mgb-5">
              <el-tag
                class="cursor-pointer"
                @click="editWarehouseTask(row.id, item.id)"
              >
                Task {{ index+1 }}
              </el-tag>
              <el-popconfirm
                v-if="item?.id"
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                icon-color="red"
                title="Are you sure to delete this?"
                @confirm="deleteTaskAPI(item.id).then(() => fetchList())"
              >
                <template #reference>
                  <svg-icon
                    class="cursor-pointer"
                    icon-name="close"
                  />
                </template>
              </el-popconfirm>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>
            {{ packageStatusEnum[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions"
        align="center"
        min-width="240px"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            v-if="!showAssignedOrder"
            type="primary"
            size="small"
            @click="showAssignDialog('assign', row.id)"
          >
            Assign & Add 1st WH Task
          </el-button>
          <el-button
            v-if="showAssignedOrder"
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            type="success"
            size="small"
            @click="addWarehouseTask(row.id)"
          >
            Add WH Task
          </el-button>
          <el-button
            v-if="showAssignedOrder"
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            type="danger"
            size="small"
            @click="unassignOrders(row)"
          >
            unAssign
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
      <el-row
        class="mgb-5"
        align="middle"
      >
        Please select Warehouse:  &ensp;*
        <el-select
          v-model="sourceId"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in warehouseEnum"
            :key="item"
            :label="item"
            :value="Number(key)"
          />
        </el-select>
      </el-row>
      <el-row
        class="mgb-5"
        align="middle"
      >
        Please select Transport: &ensp;*
        <el-select
          v-model="taskTransport"
          placeholder="Please select"
        >
          <el-option
            v-for="(transport, key) in transportEnum"
            :key="key"
            :label="transport"
            :value="key"
          />
        </el-select>
      </el-row>
      <el-row
        v-if="taskTransport"
        align="middle"
      >
        Please select Carrier: &ensp;
        <el-select
          v-model="taskCarrier"
          placeholder="Please select"
        >
          <el-option
            v-for="(carrier, key) in transportCarrierEnum[taskTransport]"
            :key="key"
            :label="carrier"
            :value="key"
          />
        </el-select>
      </el-row>
      <template #footer>
        <el-button
          type="primary"
          @click="assignOrders()"
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
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { Search, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import TaskDialog from './components/taskDialog/Index.vue';
import OrderDescription from './components/OrderDescription.vue';
import OrderShipmentInfo from './components/OrderShipmentInfo.vue';
import {
  queryOrdersAPI,
  queryAssignedOrdersAPI,
  assignOrdersAPI,
  unassignOrdersAPI,
  findAssignedOrderAPI,
  findTaskAPI,
  createTaskAPI,
  deleteTaskAPI
} from '@/api/logistic';
import { formatAssignedOrderItem } from '@/utils/logistic';
import { packageStatusEnum, codeNameEnum, codeIconEnum, transportEnum, transportCarrierEnum, codeSkuArrEnum } from '@/enums/logistic';
import { useUserStore, useLogisticStore } from '@/store';

/* Start data */
const router = useRouter();
const { role } = storeToRefs(useUserStore());
const { warehouseEnum } = storeToRefs(useLogisticStore());

const { proxy } = getCurrentInstance();

const dialogAssignVisible = ref(false);
const dialogTaskVisible = ref(false);
const drawerOrderVisible = ref(false);

const showAssignedOrder = ref(false);
const assignPattern = ref('');
const assignOrderId = ref(null);
const dialogStatus = ref('view'); // 点开Warehouse Task默认为view pattern

const multipleSelection = ref([]);
const orderItem = shallowRef(null);
const taskOrderItem = shallowRef(null);
const taskItem = ref({
  id: null,
  orderId: null,
  sourceId: null,
  targetId: null,
  taskType: null,
  returnReason: null,
  newAddress: null,
  note: null,
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

const specifySerailArr = ref([{
  serial: null,
}]);

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);

const taskPermissionArr = ['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR'];

const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);
const listLoading = ref(true);
const listQuery = ref({
  page: 1,
  perPage: 10,
  search: null,
  orderFrom: null,
});

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('specifySerailArr', specifySerailArr);
provide('taskOrderItem', taskOrderItem);
provide('listQuery', listQuery);
/* End data */

/* Start Query Related */
function queryOrders () {
  listLoading.value = true;
  (showAssignedOrder.value
    ? queryAssignedOrdersAPI(listQuery.value)
    : queryOrdersAPI(listQuery.value)
  ).then((data) => {
    dataList.value = data.items;
    if (showAssignedOrder.value) {
      dataList.value.forEach((item) => {
        formatAssignedOrderItem(item);
      });
    }
    total.value = data.total;
    listLoading.value = false;
  });
}

function fetchList() {
  setTimeout(() => queryOrders(), 200);
}

useWarehouseEnumHook();
useQueryHook(listQuery, 'order', fetchList);
/* End Query Related */

const formatDate = date => date.replace('T', ' ').replace(/\.\d+/, '');

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const showOrderDrawer = (_raw) => {
  orderItem.value = _raw;
  drawerOrderVisible.value = true;
};

const showAssignDialog = (type, _orderId) => {
  assignPattern.value = type;
  assignOrderId.value = _orderId || null;
  dialogAssignVisible.value = true;
};

function removeEmptyProducts (taskItem) {
  if (JSON.stringify(taskItem.products[0]) === '{}')
    delete taskItem['products'];
}

async function submitInitTaskItem (products, assignedData, orderId) {
  const { sourceWHId, carrier, transportMode } = assignedData;

  const task = {};
  task.orderId = orderId;
  task.taskType = 'FULFILLMENT';
  task.sourceId = sourceWHId;
  task.targetId = 18; // Default Customer
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

  await createTaskAPI(task).then(data => {
    taskId = data.id;
  });
  return taskId;
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

const sourceId = ref(null);
const taskTransport = ref(null);
const taskCarrier = ref(null);
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
      const products = formatAssignedOrderItem(data)?.items;
      const taskId = await submitInitTaskItem(products, assignedData, data.id);
      taskId && editWarehouseTask(data.id, taskId);
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
  unassignOrdersAPI(order.id).then((data) => {
    fetchList();
  });
};

const unassignSelected = () => {
  multipleSelection.value.forEach((item) => {
    unassignOrders(item);
  });
  multipleSelection.value = [];
  fetchList();
};

const addWarehouseTask = (_orderId, sourceWHId) => {
  taskItem.value = Object.assign({}, emptyTaskItem);
  findAssignedOrderAPI(_orderId).then((data) => {
    taskItem.value.orderId = _orderId;
    taskOrderItem.value = formatAssignedOrderItem(data);
    dialogStatus.value = 'create';
    dialogTaskVisible.value = true;
  });
};

const editWarehouseTask = (orderId, taskId) => {
  if (!taskPermissionArr.includes(role.value)) {
    ElMessage.error('You don\'t have permission');
    return;
  }
  findAssignedOrderAPI(orderId).then((data) => {
    taskOrderItem.value = formatAssignedOrderItem(data);
    findTaskAPI(taskId).then(data => {
      taskItem.value = data;
      dialogStatus.value = 'update';
      dialogTaskVisible.value = true;
    });
  });
};

const handleSelectionChange = (selectedArr) => {
  multipleSelection.value = selectedArr.sort(
    (pre, next) => new Date(pre.createdAt) - new Date(next.createdAt)
  );
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
