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
        v-permission="['ADMIN', 'VIBE_MANAGER']"
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
          {{ row.task.carrier }}
        </template>
      </el-table-column>
      <el-table-column label="Units's Serials: Status" width="560px">
        <template v-slot="{ row }">
          <template v-for="unit in row.units" :key="unit">
            <span class="link" @click="viewItemSerial(unit.serial)">{{ unit.serial }}</span>
            <el-button
              v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
              size="small"
              type="primary"
              @click="checkUnit(unit, row.task)"
            >
              Check
            </el-button>
            <el-select
              v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
              v-model="unit.status"
              style="width: 210px; margin: 0 10px;"
              placeholder="Please select"
              @change="handleUpdateUnitStatus(unit)"
            >
              <el-option v-for="(status, key) in packageStatusEnum" :key="status" :label="status" :value="key" />
            </el-select>
            
            <el-button
              v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
              v-if="ifMeetHousingCondtion(row.task.taskType, unit.status)"
              size="small"
              type="primary"
              @click="editHousingTask(unit, row.task)"
            >
              Warehousing
            </el-button>
            <br>
          </template>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="200px">
        <template v-slot="{ row }">
          <template v-for="unit in row.task.units" :key="unit.sku">
            <div>
              <svg-icon :icon-name="productIconMap[skuProdcutEnum[unit.sku]] || 'product-other'" />
              <span class="mgl-5">
                {{ productMap[skuProdcutEnum[unit.sku]] || unit.sku }}:
                <el-tag class="mgl-5" size="small">{{ unit.quantity }}</el-tag>
              </span>
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
        v-permission="['ADMIN', 'VIBE_MANAGER']"
        fixed="right"
        label="Actions"
        align="center"
        min-width="240px"
        class-name="small-padding fixed-width"
      >
        <template v-slot="{ row }">
          <el-popconfirm
            @confirm="deletePackage(row.id)"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
          >
            <template #reference>
              <el-button size="small" type="danger"> Delete</el-button>
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
      :dialogStatus="dialogStatus"
    />
  </div>
</template>

<script setup>import { ElMessage, ElMessageBox } from 'element-plus';
import UnitDescription from '../components/UnitDescription.vue';
import HousingDialog from './WarehousingDialog.vue';
import { parseTime, jsonToHump } from '/@/utils/format';
import { queryPackagesAPI, deletePackageAPI, queryUnitsAPI, updatePackageUnitAPI } from '/@/api/logistic';
import {
  packageStatusEnum,
  taskTypeEnum,
  productMap,
  productIconMap,
  skuProdcutEnum,
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
const warehousingItem = ref({});

const listLoading = ref(true);
const drawerUnitVisible = ref(false);
const dialogStatus = ref('');
const multipleSelection = ref([]);

const warehousingTaskInfo = ref({
  id: null,
  targetId: null,
  packageId: null,
  taskId: null,
  taskType: null,
});

const dialogHousingVisible = ref(false);

provide('warehousingTaskInfo', warehousingTaskInfo);
provide('dialogHousingVisible', dialogHousingVisible);
provide('unitItem', unitItem);
provide('warehousingItem', warehousingItem);
/* End data */
const ifMeetHousingCondtion = (taskType, unitStatus) => {
  if (unitStatus === 'RETURNED_BUT_UNCHECKED') {
    const meetTaskArr = ['FULFILLMENT', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  } else if (unitStatus === 'DELIVERED_BUT_UNCHECKED') {
    const meetTaskArr = ['RETURN', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  }
  return false;
};

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

const checkUnit = (_unit, _task) => {
  console.log('_unit, _task: ', _unit, _task);

};

const editHousingTask = (_unit, _task) => {
  warehousingTaskInfo.value = Object.assign({}, {
    taskId: _task.id,
    targetId: _task.targetId,
    taskType: _task.taskType,
    packageId: _unit.packageId,
  });
  jsonToHump(_unit); // TODO: bug, jsonToHump failed in query API
  warehousingItem.value = _unit;
  dialogHousingVisible.value = true;
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.id - pre.id);
};

const deletePackage = (packageId) => {
  deletePackageAPI(packageId).then(() => {
    console.log('packageId: ', packageId);
    fetchList();
  });
};

const handleDelSelected = () => {
  multipleSelection.value.forEach((item) => {
    const packageId = item.id;
    deletePackageAPI(packageId);
  });
  multipleSelection.value = [];
  fetchList();
};

const viewItemSerial = (_unitSerial) => {
  queryUnitsAPI({ serial: _unitSerial }).then((_data) => {
    unitItem.value = _data[0];
    drawerUnitVisible.value = true;
  });
};

const handleUpdateUnitStatus = (unit) => {
  ElMessageBox.confirm(
    'Update it?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          updatePackageUnitAPI(unit.packageId, unit.id, unit);
        } else {
          fetchList();
        }
      },
    }
  );
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
    perPage: listQuery.perPage,
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
