<template>
  <div class="page">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="Package Info"
        style="width: 120px"
      />
      <el-button v-wave @click="handleFilter" type="primary" :icon="Search">
        Search
      </el-button>
      <el-button disabled v-wave @click="handleFilter" type="primary" :icon="Filter">
        Filter Warehousing List
      </el-button>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER']"
        style="float: right"
        v-wave
        type="danger"
        :icon="Delete"
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
            #<span class="link-type">{{ row.id }}</span>
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
      <el-table-column label="Task Type" width="120px" align="center">
        <template v-slot="{ row }">
          {{ taskTypeEnum[row.task.taskType] }}
        </template>
      </el-table-column>
      <el-table-column label="Units's Serials: Status" width="560px">
        <template v-slot="{ row }">
          <template v-for="unit in row.units" :key="unit">
            <el-row justify="start" align="middle">
              <span class="link" @click="viewUnitDescription(unit, row.task.products)">{{ unit.serial }}</span>
              <el-button
                :disabled="unit.checked || !ifMeetHousingCondtion(row.task.taskType, unit.status)"
                size="small"
                :type="unit.checked ? 'success' : 'primary'"
                @click="viewUnitDescription(unit, row.task.products)"
              >
                Check
              </el-button>
              <el-select
                v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
                v-model="unit.status"
                style="width: 210px; margin: 0 10px;"
                placeholder="Please select"
                @change="onUnitStatusChange(unit)"
              >
                <el-option v-for="(status, key) in packageStatusEnum" :key="status" :label="status" :value="key" />
              </el-select>
              
              <el-button
                v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
                v-if="ifMeetHousingCondtion(row.task.taskType, unit.status)"
                :disabled="!unit.checked"
                size="small"
                type="primary"
                @click="editHousingTask(unit, row.task)"
              >
                Warehousing
              </el-button>
            </el-row>
          </template>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="200px">
        <template v-slot="{ row }">
          <template v-for="product in row.task.products" :key="product.productCode">
            <div>
              <svg-icon :icon-name="codeIconEnum[product.productCode] || 'product-other'" />
              <span class="mgl-5">
                {{ codeNameEnum[product.productCode] || product.productCode }}:
                <el-tag class="mgl-5" size="small">{{ product.quantity }}</el-tag>
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
      @fetchList="fetchList"
    />

    <el-drawer v-model="drawerUnitVisible" title="Unit Info" size="60%" direction="ltr">
      <UnitDescription 
        :serialScopeArr="serialScopeArr"
        @fetchList="fetchList"
      />
    </el-drawer>

    <HousingDialog
      ref="housingDialog"
      :warehouseEnum="warehouseEnum"
      @findUnit="findUnit"
    />
  </div>
</template>

<script setup>
import { Delete, Search, Filter } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import UnitDescription from './UnitDescription.vue';
import HousingDialog from './WarehousingDialog.vue';
import { parseTime, jsonToHump } from '@/utils/format';
import { queryPackagesAPI, deletePackageAPI, queryUnitsAPI, updatePackageUnitAPI } from '@/api/logistic';
import {
  packageStatusEnum,
  taskTypeEnum,
  codeNameEnum,
  codeIconEnum,
  skuCodeEnum,
  carrierEnum,
} from '@/enums/logistic';
import { useLogisticStore } from '@/store';

/* Start data */
const logisticStore = useLogisticStore();
const { warehouseEnum } = storeToRefs(logisticStore);
const { proxy } = getCurrentInstance();

const listQuery = ref({
  page: 1,
  perPage: 10,
  search: '',
});

const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);
const warehousingItem = ref({});

const listLoading = ref(true);
const drawerUnitVisible = ref(false);
const multipleSelection = ref([]);

const warehousingTaskInfo = ref({
  id: null,
  targetId: null,
  packageId: null,
  taskId: null,
  taskType: null,
});

const dialogHousingVisible = ref(false);
const dialogCheckUnitVisible = ref(false);

// Warehousing Dialog
provide('warehousingTaskInfo', warehousingTaskInfo);
provide('dialogHousingVisible', dialogHousingVisible);
provide('dialogCheckUnitVisible', dialogCheckUnitVisible);
provide('warehousingItem', warehousingItem);
provide('listQuery', listQuery);

// Unit Description
const unitItem = ref({});
const serialScopeArr = ref([]);
provide('unitItem', unitItem);
/* End data */
const ifMeetHousingCondtion = (taskType, unitStatus) => {
  if (unitStatus === 'RETURNED_BUT_UNCHECKED') {
    const meetTaskArr = ['FULFILLMENT', 'REPLACE', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  } else if (unitStatus === 'DELIVERED_BUT_UNCHECKED') {
    const meetTaskArr = ['RETURN', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  }
  return false;
};

function queryPackage() {
  listLoading.value = true;
  queryPackagesAPI(listQuery.value).then((data) => {
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
}

const fetchList = () => {
  setTimeout(() => queryPackage(), 200);
};

const handlePagination = (_config) => {
  Object.assign(listQuery.value, _config);
  fetchList();
};

const handleCloseDrawer = (done) => {
  done();
};

const findUnit = (unitSerial) => {
  return queryUnitsAPI({ serial: unitSerial }).then((data) => {
    unitItem.value = data[0] || unitItem.value;
  });
};

const editHousingTask = (_unit, _task) => {
  // 更新unitItem
  findUnit(_unit.serial).then(() => {
    // 更新task info related
    warehousingTaskInfo.value = Object.assign({}, {
      taskId: _task.id,
      targetId: _task.targetId,
      taskType: _task.taskType,
      packageId: _unit.packageId,
    });
    jsonToHump(_unit); // TODO: bug, jsonToHump failed in query API
    // 初始化 accessories for v-model="warehousingItem.accessories[0].quantity/productCode"
    _unit.accessories[0] = Object.assign({ productCode: null, quantity: null }, _unit.accessories[0]);
    warehousingItem.value = _unit;
    dialogHousingVisible.value = true;
  });
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

const viewUnitDescription = (unit, products) => {
  products.forEach(product => {
    serialScopeArr.value = [].concat(product.serialNote);
  });
  unitItem.value = unit;
  drawerUnitVisible.value = true;
};

const onUnitStatusChange = (unit) => {
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        updatePackageUnitAPI(unit.packageId, unit.id, unit);
      } else {
        fetchList();
      }
    },
  });
};

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}')
    // init warehouseEnum:{}
    logisticStore.setWarehouseEnum();
}

onMounted(() => {
  initGlobalData();

  listQuery.value = logisticStore.listQuery['package'];
  fetchList();
});
onBeforeUnmount(() => {
  logisticStore.setListQuery({
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

.link
  margin-right: 15px
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
