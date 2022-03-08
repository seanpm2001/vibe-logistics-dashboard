<template>
  <div class="page">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="Package Info"
        style="width: 120px"
      />
      <el-button v-wave @click="handleFilter" type="primary" icon="el-icon-search">
        Search
      </el-button>
      <el-button disabled v-wave @click="handleFilter" type="primary">
        <svg-icon icon-name="filter" class="el-icon"></svg-icon>
        Filter Warehousing List
      </el-button>
      <el-button
        style="float: right"
        v-wave
        type="danger"
        icon="el-icon-delete"
        @click="handleDelSelected"
      >
        Delete Selected Item
      </el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="Package ID" width="120px" align="center">
        <template v-slot="{ row }">
          <el-tag>
            #<span class="link-type">{{ row.id }}-S1P2</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Tracking Num"
        prop="trackingNumber"
        align="center"
        width="120px"
      />
      <el-table-column label="Carrier" width="160px" align="center">
        <template v-slot="{ row }">
          {{ warehouseEnum[row.task.carrier] }}
        </template>
      </el-table-column>
      <el-table-column label="Units's Serials: Status" width="480px">
        <template v-slot="{ row }">
          <template v-for="item in row.units" :key="item">
            <span class="link" @click="viewItemSerial(item.serial)">{{ item.serial }}</span>
            <el-select style="width: 210px; margin-right: 10px;" :disabled="isDialogPattern('view')" v-model="item.status" placeholder="Please select">
              <el-option v-for="(item, key) in packageStatusEnum" :key="item" :label="item" :value="key" />
            </el-select>
            <el-button size="small" type="primary" @click="editHousingTask(item, row.task)">Warehousing</el-button>
            <br>
          </template>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="200px">
        <template v-slot="{ row }">
          <template v-for="item in row.task.units" :key="item.sku">
            <div>
              <svg-icon :icon-name="productIconMap[item.sku] || 'product-other'" />
              <span class="mgl-5"
                >{{ productMap[item.sku] || item.sku }}:<el-tag class="mgl-5" size="small">{{
                  item.quantity
                }}</el-tag></span
              >
            </div>
          </template>
        </template>
      </el-table-column>
         <el-table-column label="Last Modified" width="160px" align="center">
        <template v-slot="{ row }">
          {{ row.lastModified }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions"
        align="center"
        min-width="240px"
        class-name="small-padding fixed-width"
      >
        <template v-slot="{ row, $index }">
          <el-popconfirm
            @confirm="deleteShipment(row, $index)"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
          >
            <template #reference>
              <el-button size="small" type="danger"> Delete </el-button>
            </template>
          </el-popconfirm>
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

    <el-drawer v-model="drawerUnitVisible" title="Unit Info" size="50%" direction="ltr">
      <UnitDescription />
    </el-drawer>

    <HousingDialog
      ref="housingDialog"
      :warehouseEnum="warehouseEnum"
      :emptyWarehousingItem="emptyWarehousingItem"
      :dialogStatus="dialogStatus"
    />
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import UnitDescription from '../components/UnitDescription.vue';
import HousingDialog from './WarehousingDialog.vue';
import { parseTime } from '/@/utils/format';
import { queryPackagesAPI, deletePackageAPI, findUnitAPI } from '/@/api/logistic';
import {
  packageStatusEnum,
  taskTypeEnum,
  productMap,
  productIconMap,
  carrierEnum,
} from '/@/enums/logistic';

/* Start data */
const store = useStore();
const { proxy } = getCurrentInstance();
const warehouseEnum = computed(() => store.getters.warehouseEnum);

const listQuery = ref({
  page: 1,
  perPage: 10,
  search: '',
});

const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);
const unitItem = ref({});

const listLoading = ref(true);
const drawerUnitVisible = ref(false);
const dialogStatus = ref('');
const multipleSelection = ref([]);

const warehousingItem = ref({
  id: null,
  targetId: null,
  packageId: null,
  taskId: null,
  taskType: null,
});
const emptyWarehousingItem = JSON.parse(JSON.stringify(warehousingItem))._value;

const dialogHousingVisible = ref(false);

provide('warehousingItem', warehousingItem);
provide('dialogHousingVisible', dialogHousingVisible);
provide('unitItem', unitItem);
/* End data */
const isDialogPattern = (type) => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  queryPackagesAPI(listQuery.value).then((_data) => {
    dataList.value = _data.items;
    total.value = _data.total;
    listLoading.value = false;
  });
};

const handlePagination = (_config) => {
  listQuery.value = Object.assign(listQuery.value, _config);
  fetchList();
};

const handleCloseDrawer = (done) => {
  done();
};

const editHousingTask = (_unit, _task) => {
  warehousingItem.value = Object.assign({}, {
    taskId: _task.id,
    targetId: _task.targetId,
    taskType: _task.taskType,
    packageId: _unit.packageId,
  });
  dialogHousingVisible.value = true;
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.id - pre.id);
};

const handleDelSelected = () => {
  multipleSelection.value.forEach((item) => {
    const freightId = item.id;
    deletePackageAPI(freightId);
  });
  multipleSelection.value = [];
  fetchList();
};

const viewItemSerial = (_unitSerial) => {
  findUnitAPI(_unitSerial).then((_data) => {
    unitItem.value = _data;
    drawerUnitVisible.value = true;
  });
};

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}')
    // init warehouseEnum:{}
    store.dispatch('logistic/setWarehouseEnum');
}

onMounted(() => {
  initGlobalData();

  listQuery.value = store.getters.listQuery['package'];
  fetchList();
});
onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    pageName: 'package',
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
  .el-icon
    width: 1em
    height: 1em

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

.link
  margin-right: 15px
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
