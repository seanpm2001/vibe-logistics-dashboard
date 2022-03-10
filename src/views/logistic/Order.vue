<template>
  <div class="page">
    <el-row justify="space-between" class="filter-container">
      <el-row>
        <el-input
          v-model="listQuery.search"
          placeholder="Order Info"
          style="width: 120px"
        />
        <el-button @click="handleFilter" v-wave type="primary" icon="el-icon-search">
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
        <el-button type="primary" @click="showAssignDialog('assignSelected')">
          Assign Selected
        </el-button>
        <el-button type="primary" @click="showAssignDialog('combineAndAssign')">
          Combine & Assign Selected
        </el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="unassignSelected()">
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
          <p>{{ row.createdAt }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" min-width="280px" align="center">
        <template v-slot="{ row }">
          <div class="shipment-info" align="left">
            <el-tag size="small" v-if="row.shippingName">
              ATTN: {{ row.shippingName }}
            </el-tag>
            <el-tag size="small" v-if="row.shippingCompany">{{
              row.shippingCompany
            }}</el-tag>
            <el-tag size="small" v-if="row.shippingAddress1">{{
              row.shippingAddress1
            }}</el-tag>
            <el-tag size="small" v-if="row.shippingAddress2">{{
              row.shippingAddress2
            }}</el-tag>
            <el-tag
              size="small"
              v-if="
                row.shippingCity ||
                row.shippingState ||
                row.shippingZip ||
                row.shippingCountry
              "
            >
              {{ row.shippingCity }}, {{ row.shippingState }}, {{ row.shippingZip }},
              {{ row.shippingCountry }}
            </el-tag>
            <p style="visibility: hidden">placeholder</p>
            <el-tag size="small" v-if="row.shippingPhone">
              TEL: {{ row.shippingPhone }}
            </el-tag>
            <br />
            <a :href="'mailto:' + row.email" class="link" target="_blank">{{
              row.email
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Units" width="255px" align="center">
        <template v-slot="{ row }">
          <div class="product-row">
            <template v-if="showAssignedOrder">
              <template v-for="item in row.items" :key="item.productCode">
                <div align="left">
                  <svg-icon :icon-name="productIconMap[item.productCode] || 'product-other'" />
                  <span class="mgl-5">{{ productMap[item.productCode] || item.productCode }}:
                    <el-tag class="mgl-5" size="small">{{ item.quantity }}</el-tag>
                  </span>
                </div>
              </template>
            </template>
            <template v-else>
              <template v-for="item in row.items" :key="item.productCode">
                <div align="left">
                  <svg-icon :icon-name="productIconMap[item.productCode] || 'product-other'" />
                  <span class="mgl-5"
                    >{{ productMap[item.productCode] || item.productCode }}:<el-tag
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
            <el-tag class="cursor-pointer" @click="editWarehouseTask(row.id, item)">Task {{index+1}}</el-tag>
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
            v-if="showAssignedOrder"
            type="success"
            size="small"
            @click="addWarehouseTask(row.id)"
          >
            Add WH Task
          </el-button>
          <el-button
            v-if="showAssignedOrder"
            type="danger"
            size="small"
            @click="unassignOrders(row.id)"
          >
            unAssign
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.perPage"
      @pagination="handlePagination"
    />

    <el-dialog
      width="32%"
      title="Assign Warehouse"
      v-model="dialogAssignVisible"
      :close-on-click-modal="false"
    >
      <el-row align="middle">
        Target Warehouse: &ensp;
        <el-select v-model="targetId" placeholder="Please select">
          <el-option
            v-for="(item, key) in warehouseEnum"
            :key="item"
            :label="item"
            :value="Number(key)"
          />
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

<script setup>import { ElMessage, ElMessageBox } from 'element-plus';
import TaskDialog from './components/taskDialog/Index.vue';
import OrderDescription from './components/OrderDescription.vue';
import {
  queryOrdersAPI,
  queryAssignedOrdersAPI,
  assignOrdersAPI,
  unassignOrdersAPI,
  findUnitAPI,
  findAssignedOrderAPI,
  findTaskAPI
} from '/@/api/logistic';
import { parseTime } from '/@/utils/format';
import { formatAssignedOrderItem } from '/@/utils/logistic';
import { packageStatusEnum, productMap, productIconMap } from '/@/enums/logistic';

/* Start data */
const store = useStore();
const router = useRouter();
const warehouseEnum = computed(() => store.getters.warehouseEnum);

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
  id: 0,
  orderId: null,
  sourceId: null,
  targetId: null,
  taskType: null,
  newAddress: null,
  note: null,
  units: [{
    sku: null,
    condition: null,
    quantity: null,
  }],
  // shipment info
  carrier: null,
  deliveryCost: null,
  liftgateCost: null,
  limitedAccessCost: null,
  residentialCost: null,
  insideCost: null,
  insureCostL: null,
});
const usedUnitArr = ref([{
  condition: null,
  serial: null,
}]);
const specifySerailArr = ref([{
  serial: null,
}]);

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('usedUnitArr', usedUnitArr);
provide('specifySerailArr', specifySerailArr);
provide('taskOrderItem', taskOrderItem);
/* End data */

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

function fetchList() {
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

function assignSelectedOrders(_targetWHId, _selectedArr) {
  if (!_selectedArr.length) {
    ElMessage.error('Please at least select an order!', 3);
    return;
  }
  multipleSelection.value.forEach((item) => {
    assignOrdersAPI(_targetWHId, [item.id]);
  });
}

const targetId = ref(null);
const assignOrders = () => {
  const targetWHId = targetId.value;
  const selectedArr = multipleSelection.value;
  if (!targetWHId) {
    ElMessage.error('Please select a target warehouse!', 3);
    return;
  }
  const pattern = assignPattern.value; // ['assign', 'assignSelected', 'combineAndAssign']
  const orderArr = [];
  if (pattern === 'assignSelected') {
    // 单独处理assign多个，不展示warehouse task dialog
    assignSelectedOrders(targetWHId, selectedArr);
    dialogAssignVisible.value = false;
    return;
  } else if (pattern === 'combineAndAssign') {
    // 批量assign
    multipleSelection.value.forEach((item) => {
      orderArr.push(item.id);
    });
  } else {
    // assign单个
    orderArr.push(assignOrderId.value);
  }
  // 调用assign orders API
  assignOrdersAPI(targetWHId, orderArr)
    .then((_data) => {
      dialogAssignVisible.value = false;
      addWarehouseTask(_data.id, true); // (orderId, isAfterAssign)
    })
    .finally(() => {
      dialogAssignVisible.value = false;
      fetchList();
    });
};

const unassignOrders = (_orderId) => {
  unassignOrdersAPI(_orderId).then((_data) => {
    console.log('data: ', _data);
  });
};

const unassignSelected = () => {
  multipleSelection.value.forEach((item) => {
    unassignOrders(item.id);
  });
  multipleSelection.value = [];
  fetchList();
};

const addWarehouseTask = (_orderId, _isAfterAssign) => {
  findAssignedOrderAPI(_orderId).then((_data) => {
    taskItem.value = Object.assign({}, emptyTaskItem);
    taskItem.value.orderId = _orderId;
    taskOrderItem.value = formatAssignedOrderItem(_data);
    _isAfterAssign && (taskItem.value.type = 'FULFILLMENT');
    dialogStatus.value = 'create';
    dialogTaskVisible.value = true;
  });
};

const editWarehouseTask = (_orderId, _taskItem) => {
  findAssignedOrderAPI(_orderId).then((_data) => {
    taskOrderItem.value = formatAssignedOrderItem(_data);
    findTaskAPI(_taskItem.id).then(_data => {
      taskItem.value = _data;
      dialogStatus.value = 'update';
      dialogTaskVisible.value = true;
    });
  });
};

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.orderId > pre.orderId);
};

const handlePagination = (_config) => {
  console.log('_config: ', _config);
  listQuery.value = Object.assign(listQuery.value, _config);
};

const resetForm = () => {};

// const beforeCloseDialog = done => {
//   if (dialogStatus.value !== 'edit') {
//     resetForm();
//     done();
//     return;
//   }

//   const isChanged = JSON.stringify(contrastData) !== JSON.stringify(freightItem.value);
//   if (!isChanged) {
//     resetForm();
//     done();
//   }
//   isChanged && ElMessageBox.confirm(
//     `Unsaved changes, are you sure to leave?`,
//     'Warning',
//     {
//       confirmButtonText: 'OK',
//       cancelButtonText: 'Cancel',
//       type: 'warning',
//       callback: (action) => {
//         if (action === "confirm") {
//           resetForm();
//           done();
//         }
//       },
//     }
//   );
// };

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}')
    // init warehouseEnum:{}
    store.dispatch('logistic/setWarehouseEnum');
}

onMounted(() => {
  initGlobalData();

  listQuery.value = store.getters.listQuery['order'];
  fetchList();
});

onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    perPage: listQuery.perPage,
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
.shipment-info
  .el-tag
    margin-right: 50%

.el-form-item__content div
  width: 100%

.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
