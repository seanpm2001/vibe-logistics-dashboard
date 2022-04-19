<template>
  <div class="page">
    <div class="filter-container">
      <el-select
        placeholder="Task type"
        v-model="showTaskPattern"
        style="width: 155px"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, key) in taskPatternEnum"
          :key="item"
          :label="item"
          :value="key"
        />
      </el-select>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="68vh"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" width="120px" align="center">
        <template v-slot="{ row }">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{
              row.id
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Order ID" width="120px" align="center">
        <template v-slot="{ row }">
          <el-tag
            >#<span class="link-type">{{ row.orderId }}</span></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="Source" width="110px" align="center">
        <template v-slot="{ row }">
          {{ warehouseEnum[row.sourceId] }}
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{ row }">
          {{ warehouseEnum[row.targetId] }}
        </template>
      </el-table-column>
      <el-table-column label="Task Type" width="110px" align="center">
        <template v-slot="{ row }">
          <el-tag>
            {{ taskTypeEnum[row.taskType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Modified" width="160px" align="center">
        <template v-slot="{ row }">
          {{ row.lastModified }}
        </template>
      </el-table-column>
      <el-table-column label="Task Units Status" width="260px" align="center">
        <template v-slot="{ row }">
          <el-tag>
            {{ calTaskStatus(row.taskType, row.packages) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="240px">
        <template v-slot="{ row }">
          <template v-for="product in row.products" :key="product.sku">
            <div>
              <svg-icon
                :icon-name="
                  codeIconEnum[product.productCode] || 'product-other'
                "
              />
              <span class="mgl-5">
                {{ codeNameEnum[product.productCode] || product.productCode }}:
                <el-tag class="mgl-5" size="small">{{ product.quantity }}</el-tag>
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
        <template v-slot="{ row }">
          <el-button
            v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
            type="primary"
            size="small"
            @click="handleDetailRow(row, 'edit')"
          >
            Edit
          </el-button>
          <el-button type="success" size="small" @click="handleDetailRow(row, 'view')">
            View Detail
          </el-button>
          <el-popconfirm
            @confirm="handleDetailRow(row, 'remove')"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
          >
            <template #reference>
              <el-button
                v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
                v-if="row.status != 'deleted'"
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

    <Pagination v-show="total > 0" :total="total" @fetchList="fetchList" />

    <TaskDialog
      :emptyTaskItem="emptyTaskItem"
      :warehouseEnum="warehouseEnum"
      :dialogStatus="dialogStatus"
    />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import TaskDialog from './components/taskDialog/Index.vue';
import {
  listWarehousesAPI,
  queryTasksAPI,
  findTaskAPI,
  deleteTaskAPI,
  findAssignedOrderAPI,
} from '/@/api/logistic';
import {
  packageStatusEnum,
  taskTypeEnum,
  codeNameEnum,
  codeIconEnum,
  skuCodeEnum,
} from '/@/enums/logistic';
import { formatAssignedOrderItem } from '/@/utils/logistic';
import { useLogisticStore } from '/@/stores';

/* Start Data */
const logisticStore = useLogisticStore();
const { warehouseEnum } = storeToRefs(logisticStore);

const listQuery = ref({
  page: 1,
  perPage: 10,
});

const tableKey = ref(0);
const dataList = shallowRef(null);
const taskOrderItem = shallowRef(null);
const packageList = ref([]);

const total = ref(0);
const listLoading = ref(true);
const dialogStatus = ref('view');
const downloadLoading = ref(false);
const disableNewShipment = ref(true);
const dialogTaskVisible = ref(false);

const multipleSelection = ref([]);
const shipmentArr = ref([]);
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
  insureCostL: null,
});

const specifySerailArr = ref([
  {
    serial: null,
  },
]);

const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const contrastData = ref(null);
const showTaskPattern = ref(null);
const taskPatternEnum = {
  'MY-ONLY': 'My task only',
  ALL: 'All tasks',
};

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('specifySerailArr', specifySerailArr);
provide('taskOrderItem', taskOrderItem);
provide('listQuery', listQuery);
/* End Data */

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

const fetchList = () => {
  listLoading.value = true;
  queryTasksAPI(listQuery.value).then((_data) => {
    dataList.value = _data.items;
    total.value = _data.total;
    listLoading.value = false;
  });
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handlePagination = (_config) => {
  Object.assign(listQuery.value, _config);
  fetchList();
};

const handleCloseDrawer = (done) => {
  done();
};

const handleDetailRow = (_row, _type) => {
  const taskId = _row.id;
  if (_type === 'remove') {
    deleteTaskAPI(taskId).then(() => fetchList());
    return;
  }
  findTaskAPI(taskId).then((_data) => {
    taskItem.value = Object.assign({}, _data); // copy obj
    _type === 'edit' && (contrastData.value = Object.assign({}, _data));
  });
  const orderId = _row.orderId;
  findAssignedOrderAPI(orderId).then((_data) => {
    taskOrderItem.value = formatAssignedOrderItem(_data);
    _type === 'edit' && (dialogStatus.value = 'update');
    dialogTaskVisible.value = true;
  });
};

const init = () => {
  listWarehousesAPI().then((data) => {
    fetchList(); // fetch list
    data.forEach((item) => warehouseEnum.value[item.id] = item.name);
  });
};

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}')
    // init warehouseEnum:{}
    logisticStore.setWarehouseEnum();
}

onMounted(() => {
  initGlobalData();

  listQuery.value = logisticStore.listQuery['task'];
  console.log('listQuery.value: ', listQuery.value);
  fetchList();
});

onBeforeUnmount(() => {
  logisticStore.setListQuery({
    query: listQuery.value,
    perPage: listQuery.perPage,
    pageName: 'task',
  });
});
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

.filter-container
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem

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
