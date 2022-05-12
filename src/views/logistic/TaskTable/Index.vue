<template>
  <div class="page">
    <FilterHeader
      @fetch-list="fetchList"
    />
    <el-table
      :key="tableKey"
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
        label="ID"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>
            #<span
              class="link-type"
              @click="handleDetailRow(row, 'view')"
            >{{
              row.id
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Order ID"
        width="220px"
        align="center"
      >
        <template #default="{ row }">
          <AssignedOrderId
            :order="orderEnum[row.orderId]"
            @show-order-drawer="showOrderDrawer(orderEnum[row.orderId])"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Source"
        width="110px"
        align="center"
      >
        <template #default="{ row }">
          {{ warehouseEnum[row.sourceId] }}
        </template>
      </el-table-column>
      <el-table-column
        label="Target"
        width="110px"
        align="center"
      >
        <template #default="{ row }">
          {{ warehouseEnum[row.targetId] }}
        </template>
      </el-table-column>
      <el-table-column
        label="Task Type"
        width="110px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>
            {{ taskTypeEnum[row.taskType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Last Modified"
        width="160px"
        align="center"
      >
        <template #default="{ row }">
          {{ row.lastModified }}
        </template>
      </el-table-column>
      <el-table-column
        label="Task Units Status"
        width="260px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>
            {{ calTaskStatus(row.taskType, row.packages) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        class-name="product-column"
        label="Content"
        width="240px"
      >
        <template #default="{ row }">
          <template
            v-for="product in row.products"
            :key="product.sku"
          >
            <div>
              <svg-icon
                :icon-name="
                  codeIconEnum[product.productCode] || 'product-other'
                "
              />
              <span class="mgl-5">
                {{ codeNameEnum[product.productCode] || product.productCode }}:
                <el-tag
                  class="mgl-5"
                  size="small"
                >{{ product.quantity }}</el-tag>
              </span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
            type="primary"
            size="small"
            @click="handleDetailRow(row, 'edit')"
          >
            Edit
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleDetailRow(row, 'view')"
          >
            View Detail
          </el-button>
          <el-popconfirm
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
            @confirm="handleDetailRow(row, 'remove')"
          >
            <template #reference>
              <el-button
                v-if="row.status != 'deleted'"
                v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
                size="small"
                type="danger"
              >
                Delete
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total > 0"
      :total="total"
      @fetchList="fetchList"
    />

    <TaskDialog
      :empty-task-item="emptyTaskItem"
      :warehouse-enum="warehouseEnum"
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

<script lang="ts" setup>
import FilterHeader from './FilterHeader.vue';
import { TaskDialog, AssignedOrderId, OrderDescription } from '../components';
import {
  queryTasksAPI,
  findTaskAPI,
  deleteTaskAPI,
  findAssignedOrderAPI,
  queryAssignedBatchOrdersAPI
} from '@/api/logistic';
import { taskTypeEnum, codeNameEnum, codeIconEnum } from '@/enums/logistic';
import { formatAssignedOrderItem, getTaskOrderIdArr } from '@/utils/logistic';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading';
import { useLogisticStore } from '@/store';

/* Start Data */
const { warehouseEnum } = storeToRefs(useLogisticStore());
const taskOrderItem = shallowRef(null);

const dialogStatus = ref('view');
const dialogTaskVisible = ref(false);

const multipleSelection = ref([]);
const taskItem = ref({
  id: null,
  orderId: null,
  sourceId: null,
  targetId: null,
  taskType: null,
  returnReason: null,
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
  deliveryCost: null,
  liftgateCost: null,
  limitedCost: null,
  residentialCost: null,
  insideCost: null,
  insureCostL: null,
});

const specifySerailArr = ref([
  {
    serial: null,
  },
]);

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);

const listQuery = ref({
  page: 1,
  perPage: 10,
});
const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('specifySerailArr', specifySerailArr);
provide('taskOrderItem', taskOrderItem);
provide('listQuery', listQuery);
provide('multipleSelection', multipleSelection);
/* End Data */


const orderEnum = ref({}); // [{ orderId : {...orderItem} }]
function queryTask() {
  queryTasksAPI(listQuery.value).then((data) => {
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
  setTimeout(() => queryTask(), 200);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'task', fetchList);

const calTaskStatus = (taskType, packages) => {
  const statusSet = {};
  packages.forEach((item) => {
    item?.units.forEach((unit) => {
      statusSet[unit.status] = statusSet[unit.status] || 0 + 1;
    });
  });
  const setKey = Object.keys(statusSet);
  const setKeyLen = setKey.length;

  if (setKeyLen === 1) {
    const unitStatus = statusSet[setKey[0]];
    switch (unitStatus) {
    case 'DELIVERING':
    case 'RETURNING':
      return 'Fulfilling';
    case 'COMPLETE_WITH_DELIVERED':
      return 'Complete with success';
    case 'COMPLETE_WITH_RETURNED':
    case 'LOST':
      return 'Complete with failure';
    case 'DELIVERED_BUT_UNCHECKED':
      if (taskType !== 'FULFILLMENT' || taskType !== 'REPLACE')
        return 'Delivered but imcomplete';
      break;
    case 'RETURNED_BUT_UNCHECKED':
      if (taskType !== 'RETURN') return 'Failed but imcomplete';
      break;
    }
  }
  let res = '';
  if (
    statusSet['LOST'] ||
    statusSet['RETURNED_BUT_UNCHECKED'] ||
    statusSet['RETURNING']
  ) {
    res = res ? res + ' | Failed' : 'Failed';
  }
  if (statusSet['DELIVERING'] || statusSet['RETURNING']) {
    res = res ? res + ' | Incomplete' : 'Incomplete';
  }
  if (
    statusSet['DELIVERED_BUT_UNCHECKED'] ||
    statusSet['COMPLETE_WITH_DELIVERED'] ||
    statusSet['COMPLETE_WITH_RETURNED'] ||
    statusSet['RETURNED_BUT_UNCHECKED']
  ) {
    res = res ? res + ' | Complete' : 'Complete';
  }
  return res;
};

const handleSelectionChange = (selectedArr) => {
  multipleSelection.value = selectedArr.sort(
    (pre, next) => new Date(pre.createdAt).getTime() - new Date(next.createdAt).getTime()
  );
};

const handleCloseDrawer = (done) => {
  done();
};

const orderItem = shallowRef(null);
const drawerOrderVisible = ref(false);
const showOrderDrawer = async order => {
  showFullScreenLoading();
  orderItem.value = await formatAssignedOrderItem(order);
  drawerOrderVisible.value = true;
  tryHideFullScreenLoading();
};

const handleDetailRow = (_row, type) => {
  const taskId = _row.id;
  if (type === 'remove') {
    deleteTaskAPI(taskId).then(() => fetchList());
    return;
  }
  findTaskAPI(taskId).then((data) => {
    taskItem.value = Object.assign({}, data); // copy obj
    type === 'edit' && (contrastData.value = Object.assign({}, data));
  });
  const orderId = _row.orderId;
  findAssignedOrderAPI(orderId).then(async data => {
    taskOrderItem.value = await formatAssignedOrderItem(data);
    type === 'edit' && (dialogStatus.value = 'update');
    dialogTaskVisible.value = true;
  });
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

.el-row
  justify-content: space-between
  margin-right: 2rem
  margin-left: 2rem
  .el-form-item
    width: 42%

.el-form-item__content div
  width: 100%
</style>
