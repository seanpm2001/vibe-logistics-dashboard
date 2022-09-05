<template>
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
      :selectable="row => row.orderFrom !== 'AFN'"
    />
    <el-table-column
      class-name="order-info"
      label="Order"
      width="240px"
      align="center"
    >
      <template #default="{ row }">
        <AssignedOrderId
          :order="row"
          @show-order-drawer="showOrderDrawer(row)"
        />
        <p>{{ formatVBDate(row.createdAt) }}</p>
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
      v-if="!showAssignedOrder"
      label="Review Status"
      min-width="280px"
      align="center"
    >
      <template #default="{ row }">
        <el-tag
          v-if="!notFraudOrder(row)"
          size="large"
          :type="isReviewedOrder(row) ? 'success' : 'danger'"
        >
          {{ isReviewedOrder(row) ? 'Reviewed' : 'Reviewing' }}
        </el-tag>
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
              v-for="(quantity, code) in row?.productsQty"
              :key="code"
            >
              <div align="left">
                <svg-icon :icon-name="codeIconEnum[code] || 'product-other'" />
                <span class="mgl-5">{{ codeNameEnum[code] || code }}:
                  <el-tag
                    class="mgl-5"
                    size="small"
                  >{{ quantity }}</el-tag>
                </span>
              </div>
            </template>
          </template>
          <template v-else>
            <template
              v-for="product in combineSameProductQuantityArr(row.items)"
              :key="product"
            >
              <div align="left">
                <svg-icon :icon-name="codeIconEnum[product.productCode] || 'product-other'" />
                <span class="mgl-5">{{ codeNameEnum[product.productCode] || product.productCode }}:<el-tag
                  class="mgl-5"
                  size="small"
                >{{ product.quantity }}</el-tag></span>
              </div>
            </template>
          </template>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="showAssignedOrder"
      label="Warehouse Task"
      width="240px"
      align="center"
    >
      <template #default="{ row }">
        <template
          v-for="(task, index) in row.tasks"
          :key="task.id"
        >
          <div class="mgb-5">
            <el-tag
              type="success"
              class="cursor-pointer mgr-5"
              @click="editWarehouseTask(row.id, task.id)"
            >
              Task {{ index+1 }}
            </el-tag>
            <el-tag class="mgr-5">
              {{ task.taskType }}
            </el-tag>
            <el-popconfirm
              v-if="task?.id"
              confirm-button-text="OK"
              cancel-button-text="No, Thanks"
              icon-color="red"
              title="Are you sure to delete this?"
              @confirm="deleteTaskAPI(task.id).then(() => fetchList())"
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
        <div v-if="row.orderFrom === 'AFN'">
          FBA-{{ row.marketplace }} Order
        </div>
        <div v-else>
          <el-button
            v-show="!showAssignedOrder"
            type="primary"
            size="small"
            :disabled="!isReviewedOrder(row) && !notFraudOrder(row)"
            @click="showAssignDialog('assign', row.id)"
          >
            Assign & Add 1st WH Task
          </el-button>
          <el-button
            v-show="showAssignedOrder"
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            type="success"
            size="small"
            @click="showTaskTypeDialog(row.id)"
          >
            Add WH Task
          </el-button>
          <el-button
            v-show="showAssignedOrder"
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
            type="danger"
            size="small"
            @click="unassignOrders(row)"
          >
            unAssign
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { AssignedOrderId, OrderShipmentInfo } from '../components';
import { formatVBDate, combineSameProductQuantityArr } from '@/utils/logistic';
import { deleteTaskAPI } from '@/api';
import { packageStatusEnum, codeNameEnum, codeIconEnum } from '@/enums/logistic';


defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
});

const multipleSelection = inject('multipleSelection') ;
const listQuery = inject('listQuery') ;

const showAssignedOrder = computed(() => listQuery.value.showAssignedOrder);

const tableKey = ref(0);
const emit = defineEmits(['fetchList', 'showOrderDrawer', 'editWarehouseTask', 'showAssignDialog', 'unassignOrders', 'showTaskTypeDialog']);
const fetchList = () => emit('fetchList');
// const addWarehouseTask = (orderId) => emit('addWarehouseTask', orderId);
const editWarehouseTask = (orderId, taskId) => emit('editWarehouseTask', orderId, taskId);
const showOrderDrawer = (order) => emit('showOrderDrawer', order);
const showAssignDialog = (type, orderId) => emit('showAssignDialog', type, orderId);
const unassignOrders = order => emit('unassignOrders', order);
const showTaskTypeDialog = (orderId) => emit('showTaskTypeDialog', orderId);

const handleSelectionChange = (selectedArr) => {
  multipleSelection.value = selectedArr.sort(
    (pre, next) => new Date(pre.createdAt).getTime() - new Date(next.createdAt).getTime()
  );
};

const notFraudOrder = order => !(
  order.businessVerificationRequired || order.financeVerificationRequired
);

const REVIEWED_ORDER_TIMESTAMP = 1661990400000;
const isReviewedOrder = order => {
  // 9.1 号前订单默认reviewed
  const createdTimestamp = +new Date(order.createdAt).getTime();
  if (createdTimestamp < REVIEWED_ORDER_TIMESTAMP)
    return true;

  const attachment = order?.attachment;
  if (!attachment)
    return false;

  if (order.businessVerificationRequired || order.financeVerificationRequired || order.csReviewRequired) {
    if (
      attachment.businessVerified === order.businessVerificationRequired
        && attachment.financeVerified === order.financeVerificationRequired
          && attachment.csVerified === order.csVerified
    ) return true;
  }
  return false;
};
</script>

<style lang="sass" scoped>

</style>
