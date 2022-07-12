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
    />
    <el-table-column
      label="Task ID"
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
      label="External ID"
      width="220px"
      align="center"
    >
      <template #default="{ row }">
        <template
          v-for="item in orderEnum[row.orderId]?.rawOrders"
          :key="item.id"
        >
          <el-tag
            class="cursor-pointer"
            @click="copy(getExternalId(item.id, row.id))"
          >
            {{ getExternalId(item.id, row.id) }}
          </el-tag>
        </template>
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
        <el-tag
          :type="taskColorEnum[row.taskType] || ''"
        >
          {{ taskTypeEnum[row.taskType] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Created At"
      width="170px"
      align="center"
    >
      <template #default="{ row }">
        {{ formatTimeString(row.createdAt) }}
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
      label="Carrier"
      width="160px"
      align="center"
    >
      <template #default="{ row }">
        {{ row.carrier }}
      </template>
    </el-table-column>
    <el-table-column
      label="UPS Label Synced"
      width="160px"
      align="center"
    >
      <template #default="{ row }">
        <el-tag
          v-if="checkUPSLabelSynced(row) !== null"
          :type="!!checkUPSLabelSynced(row) ? '' : 'danger'"
        >
          {{ checkUPSLabelSynced(row) }} label(s)
        </el-tag>
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
</template>

<script lang="ts" setup>
import { AssignedOrderId } from '../components';
import { taskTypeEnum, taskColorEnum, codeNameEnum, codeIconEnum } from '@/enums/logistic';
import { formatTimeString, getExternalId, copy } from '@/utils/logistic';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
  orderEnum: {
    type: Object,
    default: () => {}
  }
});

const multipleSelection = inject('multipleSelection') as any;

const tableKey = ref(0);
const emit = defineEmits(['fetchList', 'showOrderDrawer', 'handleDetailRow']);
const fetchList = () => emit('fetchList');
const handleDetailRow = (task, type) => emit('handleDetailRow', task, type);
const showOrderDrawer = (order) => emit('showOrderDrawer', order);

const handleSelectionChange = (selectedArr) => {
  multipleSelection.value = selectedArr.sort(
    (pre, next) => new Date(pre.createdAt).getTime() - new Date(next.createdAt).getTime()
  );
};

const IWINID = 6;

const checkUPSLabelSynced = (row) => {
  if (row.carrier === 'UPS' && (row.sourceId === IWINID || row.targetId === IWINID)) {
    const note = row.trackingNumberNote;
    if (note) {
      let len = note.match(/;/g)?.length || 0;
      !note.endsWith(';') && len++;
      return len;
    }
    return 0;
  }
  return null;
};

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
</script>

<style lang="sass" scoped>
:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 20px
  .el-checkbox
    height: 14px
    vertical-align: middle

</style>
