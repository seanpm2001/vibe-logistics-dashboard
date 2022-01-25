<template>
  <div class="page">
    <div class="filter-container">
      <el-select placeholder="Task type" v-model="showTaskPattern" style="width: 155px" @change="handleFilter">
        <el-option v-for="(item, key) in taskPatternEnum" :key="item" :label="item" :value="key" />
      </el-select>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="68vh"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.id }}-S1</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Order ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>#<span class="link-type">{{ row.id }}</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Source" width="110px" align="center">
        <template v-slot="{row}">
          {{ warehouseEnum[row.sourceId] }}
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{row}">
          {{ warehouseEnum[row.targetId] }}
        </template>
      </el-table-column>
      <el-table-column label="WT Type" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ taskTypeEnum[row.warehouseTaskType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Modified" width="160px" align="center">
        <template v-slot="{row}">
          {{ row.lastModified }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ packageStatusEnum[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="240px">
        <template v-slot="{row}">
          <template v-for="(item, key) in row.content" :key="item">
            <div>
              <svg-icon :icon-name="productIconMap[key]"  />
              <span class="mgl-5">{{productMap[key]}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleDetailRow(row, 'edit')">
            Edit
          </el-button>
          <el-button type="success" size="mini" @click="handleDetailRow(row, 'view')">
            View Detail
          </el-button>
          <el-popconfirm @confirm="handleDetailRow(row, 'remove')" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
            <template #reference>
              <el-button v-if="row.status!='deleted'" size="mini" type="danger">
                Delete
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total>0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.perPage"
      @pagination="handlePagination"
    />

    <TaskDialog
      :emptyTaskItem="emptyTaskItem"
      :warehouseEnum="warehouseEnum"
      :dialogStatus="dialogStatus"
    />
  </div>
</template>

<script setup>

import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import TaskDialog from './components/TaskDialog.vue';
import { listWarehousesAPI, queryTasksAPI, findTaskAPI, deleteTaskAPI, listShipmentsAPI, findAssignedOrderAPI } from "/@/api/logistic";
import { packageStatusEnum, taskTypeEnum, productMap, productIconMap } from '/@/enums/logistic';
import { formatAssignedOrderItem } from '/@/utils/logistic';

/* Start Data */
const store = useStore();
const warehouseEnum = computed(() => store.getters.warehouseEnum);

const { proxy } = getCurrentInstance();
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
const dialogStatus = ref('');
const downloadLoading = ref(false);
const disableNewShipment = ref(true);
const dialogTaskVisible = ref(false);

const multipleSelection = ref([]);
const shipmentArr = ref([]);
const taskItem = ref({
  id: 0,
  orderId: null,
  sourceId: null,
  targetId: null,
  type: null,
  status: null,
  usedUnitArr: [{
    usedAge: null,
    condition: null,
    serial: null,
  }],
  specifySerailArr: [{
    serial: null,
  }]
});
const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
// let contrastData = null;
const showTaskPattern = ref(null);
const taskPatternEnum = {
  'MY-ONLY': 'My task only',
  'ALL': 'All tasks'
};

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('taskOrderItem', taskOrderItem);
/* End Data */

const fetchList = () => {
  listLoading.value = true;
  queryTasksAPI(listQuery.value).then(data => {
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

const handleCloseDrawer = done => {
  done();
};

const listShipments = (orderId, callback) => {
  listShipmentsAPI(orderId).then(data => {
    shipmentArr.value = data;
    callback && callback();
  });
};

const handleDetailRow = (row, type) => {
  const orderId = row.id;
  if (type === 'remove') {
    deleteTaskAPI(orderId).then(() => fetchList());
    return;
  }
  findAssignedOrderAPI(orderId).then(data => {
    taskItem.value = Object.assign({}, emptyTaskItem);
    taskItem.value.orderId = orderId;
    taskOrderItem.value = formatAssignedOrderItem(data);
    dialogStatus.value = 'create';
    dialogTaskVisible.value = true;
  });
};

const init = () => {
  listWarehousesAPI().then(data => {
    fetchList(); // fetch list
    data.forEach(item => {
      warehouseEnum.value[item.id] = item.name;
    });
  });
};

onMounted(() => {
  if (JSON.stringify(warehouseEnum.value) === '{}') // init warehouseEnum
    store.dispatch('logistic/setWarehouseEnum');

  listQuery.value = store.getters.listQuery['task'];
  fetchList();
});

onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    pageName: 'task'
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
