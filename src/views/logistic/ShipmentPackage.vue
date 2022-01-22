<template>
  <div class="page">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="Package Info" style="width: 120px;" />
      <el-button v-wave @click="handleFilter" type="primary" icon="el-icon-search">
        Search
      </el-button>
      <el-button disabled v-wave @click="handleFilter" type="primary">
        <svg-icon icon-name="filter" class="el-icon"></svg-icon>
        Filter Warehousing List
      </el-button>
      <el-button style="float: right;" v-wave  type="danger" icon="el-icon-delete" @click="handleDelSelected">
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
      style="width: 100%;"
      height="68vh"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="Package ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type">{{ row.id }}-S1P2</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Tracking Num" prop="trackingNumber" align="center" width="120px" />
      <el-table-column label="Last Modified" width="130px" align="center">
        <template v-slot="{row}">
          {{ row.lastModified?.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ packageStatusEnum[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="200px">
        <template v-slot="{row}">
          <template v-for="(item, key) in row.content" :key="item">
            <div>
              <svg-icon :icon-name="productIconMap[key]"  />
              <span class="mgl-5">{{productMap[key]}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Units's Serials" width="150px">
        <template v-slot="{row}">
          <template v-for="item in row.serials" :key="item">
            <p class="link" @click="viewItemSerial(item.id)">{{item.serial}}</p>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="100px" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-popconfirm @confirm="deleteShipment(row,$index)" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
            <template #reference>
              <el-button size="mini" type="danger">
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

    <el-drawer
      v-model="drawerUnitVisible"
      title="Unit Info"
      size="50%"
      direction="ltr"
    >
      <UnitDescription/>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, provide } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/src/message-box.scss";
import Pagination from '/@/components/Pagination.vue';
import UnitDescription from './components/UnitDescription.vue';
import { parseTime } from '/@/utils/format';
import { queryPackagesAPI, deletePackageAPI, findUnitAPI } from "/@/server/api/logistic";
import { packageStatusEnum, taskTypeEnum, productMap, productIconMap } from '/@/assets/enum/logistic';

/* Start data */
const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
  search: '',
});

const tableKey = ref(0);
const dataList = ref(null);
const total = ref(0);
const unitItem = ref({});

const listLoading = ref(true);
const drawerUnitVisible = ref(false);
const dialogStatus = ref('');
const multipleSelection = ref([]);
const titleMap= ref({
  view: 'View',
  update: 'Edit',
  create: 'Create',
});
const rules = ref({
  targetId: [{ required: true, message: 'destination is required', trigger: 'change' }],
  number: [{ required: true, message: 'batch number is required', trigger: 'change' }],
});
const downloadLoading = ref(false);
const disableNewBatch = ref(true);

provide('unitItem', unitItem);
/* End data */
const isDialogPattern = type => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  queryPackagesAPI(listQuery.value).then(data => {
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

const handleCloseDrawer = done => {
  done();
};

const handleDetailRow = (row, type) => {
  const shipmentId = row.id;
  if (type === 'remove') {
    deletePackageAPI(shipmentId).then(() => {
      fetchList();
    });
    return;
  }
  
  // queryPackagesAPI(row.id).then(data => {
  //   packageList.value = data;
  //   dialogTableVisible.value = true;
  // });
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.id - pre.id);
};

const handleDelSelected = () => {
  multipleSelection.value.forEach(item => {
    const freightId = item.id;
    deletePackageAPI(freightId);
  });
  multipleSelection.value = [];
  fetchList();
};

const viewItemSerial = unitId => {
  findUnitAPI(unitId).then(data => {
    unitItem.value = data;
    drawerUnitVisible.value = true;
  });
};

onMounted(() => {
  listQuery.value = store.getters.listQuery['package'];
  fetchList();
});

onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    pageName: 'package'
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
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
