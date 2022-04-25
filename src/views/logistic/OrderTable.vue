<template>
  <div class="page">
    <el-row justify="space-between" class="filter-container">
      <el-row>
        <el-input
          v-model="listQuery.search"
          placeholder="Order Info"
          style="width: 120px"
        />
        <el-button @click="handleFilter" v-wave type="primary" :icon="Search">
          Search
        </el-button>
        <el-select
          :disabled="listLoading"
          placeholder="Assigned Order"
          v-model="showAssignedOrder"
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
          disabled
          placeholder="Order From"
          v-model="listQuery.orderFrom"
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
        <el-button v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']" type="primary" @click="showAssignDialog('assignSelected')">
          Assign Selected
        </el-button>
        <el-button v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']" type="primary" @click="showAssignDialog('combineAndAssign')">
          Combine & Assign Selected
        </el-button>
      </div>
      <div v-else>
        <el-button
          v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
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
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column class-name="order-info" label="Order" width="240px" align="center">
        <template v-slot="{ row }">
          <el-tag @click="showOrderDrawer(row)">
            #<span class="link-type">{{ row.id }}</span>
          </el-tag>
          <div v-if="row.rawOrders">
            <template v-for="item in row.rawOrders" :key="item.id">
              <el-tag @click="showOrderDrawer(item)">#{{ item.id }}</el-tag>
              <br />
            </template>
          </div>
          <p>{{ formatDate(row.createdAt) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" min-width="280px" align="center">
        <template v-slot="{ row }">
          <OrderShipmentInfo :orderItem="row" />
        </template>
      </el-table-column>
      <el-table-column label="Products" width="255px" align="center">
        <template v-slot="{ row }">
          <div class="product-row">
            <template v-if="showAssignedOrder">
              <template v-for="item in row.items" :key="item.productCode">
                <div align="left">
                  <svg-icon :icon-name="codeIconEnum[item.productCode] || 'product-other'" />
                  <span class="mgl-5">{{ codeNameEnum[item.productCode] || item.productCode }}:
                    <el-tag class="mgl-5" size="small">{{ item.quantity }}</el-tag>
                  </span>
                </div>
              </template>
            </template>
            <template v-else>
              <template v-for="item in row.items" :key="item.productCode">
                <div align="left">
                  <svg-icon :icon-name="codeIconEnum[item.productCode] || 'product-other'" />
                  <span class="mgl-5"
                    >{{ codeNameEnum[item.productCode] || item.productCode }}:<el-tag
                      class="mgl-5"
                      size="small"
                      >{{ item.quantity }}</el-tag
                    ></span
                  >
                </div>
              </template>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Warehouse Task" width="240px" align="center">
        <template v-slot="{ row }">
          <template v-for="(item, index) in row.tasks" :key="item.id">
            <div class="mgb-5">
              <el-tag class="cursor-pointer" @click="editWarehouseTask(row.id, item.id)">
                Task {{index+1}}
              </el-tag>
              <el-popconfirm
                  v-if="item?.id"
                  @confirm="deleteTaskAPI(item.id).then(() => fetchList())"
                  confirm-button-text="OK"
                  cancel-button-text="No, Thanks"
                  icon-color="red"
                  title="Are you sure to delete this?"
                >
                  <template #reference>
                    <svg-icon class="cursor-pointer" icon-name="close" />
                  </template>
              </el-popconfirm>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{ row }">
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
        <template v-slot="{ row }">
          <el-button
            v-if="!showAssignedOrder"
            type="primary"
            size="small"
            @click="showAssignDialog('assign', row.id)"
          >
            Assign & Add 1st WH Task
          </el-button>
          <el-button
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            v-if="showAssignedOrder"
            type="success"
            size="small"
            @click="addWarehouseTask(row.id)"
          >
            Add WH Task
          </el-button>
          <el-button
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            v-if="showAssignedOrder"
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
      width="32%"
      title="Assign Warehouse"
      v-model="dialogAssignVisible"
      :close-on-click-modal="false"
    >
      <el-row class="mgb-5" align="middle">
        Please select Warehouse:  &ensp;*
        <el-select v-model="sourceId" placeholder="Please select">
          <el-option
            v-for="(item, key) in warehouseEnum"
            :key="item"
            :label="item"
            :value="Number(key)"
          />
        </el-select>
      </el-row>
      <el-row align="middle">
        Please select Carrier: &ensp;
        <el-select v-model="carrier" placeholder="Please select">
          <el-option v-for="(item, key) in carrierEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-row>
      <template v-slot:footer>
        <el-button type="primary" @click="assignOrders()"> submit </el-button>
      </template>
    </el-dialog>

    <TaskDialog
      ref="taskForm"
      :warehouseEnum="warehouseEnum"
      :emptyTaskItem="emptyTaskItem"
      :dialogStatus="dialogStatus"
    />

    <el-drawer v-model="drawerOrderVisible" title="Order Info" size="60%" direction="ltr">
      <OrderDescription :orderItem="orderItem" />
    </el-drawer>
  </div>
</template>

<script setup>
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
import { parseTime } from '@/utils/format';
import { formatAssignedOrderItem } from '@/utils/logistic';
import { packageStatusEnum, codeNameEnum, codeIconEnum, carrierEnum } from '@/enums/logistic';
import { useUserStore, useLogisticStore } from '@/store';

/* Start data */
const router = useRouter();
const { role } = storeToRefs(useUserStore());
const logisticStore = useLogisticStore();
const { warehouseEnum } = storeToRefs(logisticStore);

const { proxy } = getCurrentInstance();

const dialogAssignVisible = ref(false);
const dialogTaskVisible = ref(false);
const drawerOrderVisible = ref(false);

const showAssignedOrder = ref(true);
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

const formatDate = date => date.replace('T', ' ').replace(/\.\d+/, '');

function queryOrders () {
  listLoading.value = true;
  (showAssignedOrder.value
    ? queryAssignedOrdersAPI(listQuery.value)
    : queryOrdersAPI(listQuery.value)
  ).then((_data) => {
    dataList.value = _data.items;
    if (showAssignedOrder.value) {
      dataList.value.forEach((item) => {
        formatAssignedOrderItem(item);
      });
    }
    total.value = _data.total;
    listLoading.value = false;
  });
}

function fetchList() {
  setTimeout(() => queryOrders(), 200);
}

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const showOrderDrawer = (_raw) => {
  orderItem.value = _raw;
  drawerOrderVisible.value = true;
};

const showAssignDialog = (_type, _orderId) => {
  assignPattern.value = _type;
  assignOrderId.value = _orderId || null;
  dialogAssignVisible.value = true;
};

async function submitInitTaskItem (products, sourceWHId, carrier, orderId) {
  taskItem.value = emptyTaskItem;
  taskItem.value.orderId = orderId;
  taskItem.value.taskType = 'FULFILLMENT';
  taskItem.value.sourceId = sourceWHId;
  taskItem.value.targetId = 18; // Default Customer
  taskItem.value.carrier = carrier;
  products.forEach((product, idx) => {
    taskItem.value.products[idx] = {
      productCode: product.productCode,
      sku: null,
      condition: 'GOOD',
      quantity: product.quantity,
      serialNote: null,
    };
  });
  let taskId = null;
  await createTaskAPI(taskItem.value).then(_data => {
    taskItem.value = emptyTaskItem;
    taskId = _data.id;
  });
  return taskId;
}

function assignSelectedOrders(sourceWHId, carrier, selectedArr) {
  if (!selectedArr.length) {
    ElMessage.error('Please at least select an order!');
    return;
  }
  multipleSelection.value.forEach((item) => {
    assignOrdersAPI(sourceWHId, [item.id]).then(data => {
      submitInitTaskItem(item.items, sourceWHId, carrier, data.id); // 传递products {productCode: '', quantity: 0}
    });
  });
}

const sourceId = ref(null);
const carrier = ref(null);
const assignOrders = () => {
  const sourceWHId = sourceId.value;
  const carrier = carrier.value;
  const selectedArr = multipleSelection.value;
  if (!sourceWHId) {
    ElMessage.error('Please select a target warehouse!');
    return;
  }
  const pattern = assignPattern.value; // ['assign', 'assignSelected', 'combineAndAssign']
  const orderArr = [];
  
  if (pattern === 'assignSelected') {
    // 单独处理批量assign，不展示warehouse task dialog
    assignSelectedOrders(sourceWHId, carrier, selectedArr);
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
      const taskId = await submitInitTaskItem(products, sourceWHId, carrier, data.id);
      taskId && editWarehouseTask(data.id, taskId);
    })
    .finally(() => {
      dialogAssignVisible.value = false;
      fetchList();
    });
};

const unassignOrders = (order) => {
  if (order.tasks.length > 0) {
    ElMessage.error('Please remove all tasks before unassign!');
    return;
  }
  unassignOrdersAPI(order.id).then((data) => {
    fetchList();
  });
};

const unassignSelected = () => {
  multipleSelection.value.forEach((item) => {
    unassignOrders(item.id);
  });
  multipleSelection.value = [];
  fetchList();
};

const addWarehouseTask = (_orderId, sourceWHId) => {
  taskItem.value = Object.assign({}, emptyTaskItem);
  findAssignedOrderAPI(_orderId).then((_data) => {
    taskItem.value.orderId = _orderId;
    taskOrderItem.value = formatAssignedOrderItem(_data);
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
  multipleSelection.value = selectedArr.sort((pre, next) => next.orderId > pre.orderId);
};

const resetForm = () => {};

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}') // init warehouseEnum:{}
    logisticStore.setWarehouseEnum();
}

onMounted(() => {
  initGlobalData();

  listQuery.value = logisticStore.listQuery['order'];
  fetchList();
});

onBeforeUnmount(() => {
  logisticStore.setListQuery({
    query: listQuery.value,
    pageName: 'order',
  });
});
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
