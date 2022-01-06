<template>
  <div class="page">
    <div class="filter-container">
      <el-button v-wave class="filter-item" type="primary" icon="el-icon-search">
        Search
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
      <el-table-column label="Carrier" prop="shipping_carrier" sortable="custom" align="center" width="80" />
      <el-table-column label="WT Type" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ whTypeOptions[row.warehouse_task_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Modified" width="130px" align="center">
        <template v-slot="{row}">
          {{ row.last_modified?.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusTypeDict[row.status]">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="content-column" label="Content" width="200px">
        <template v-slot="{row}">
          <template v-for="(item, key) in row.content" :key="item">
            <div>
              <svg-icon :icon-name="productIconMap[key]" class="content-icon" />
              <span>{{productMap[key]}}:<span class="count">{{ item }}</span></span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="200px" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="success" size="mini" @click="handleDetailRow(row, 'view')">
            View detail
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

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.per_page"
      @pagination="handlePagination"
    />

    <el-dialog title="Shipment Package" v-model="dialogTableVisible" :close-on-click-modal="false">
      <ShipPackage
        :packageList="packageList"
      />
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">
            Close
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import ShipPackage from './components/ShipPackage.vue';
import { parseTime } from '/@/assets/utils/format';
import { queryShipmentsAPI, deleteShipmentAPI, listShipPackagesAPI } from "/@/server/api/logistic";
import { statusOptions, whTypeOptions } from './enum/shipment';
import { productMap, productIconMap } from './enum/product';


const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  per_page: 10,
});

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  'Delivered': 'info',
  'Cancelled': 'danger',
};

const tableKey = ref(0);
const dataList = ref(null);
const packageList = ref([]);
const total = ref(0);
const listLoading = ref(true);
const dialogTableVisible = ref(false);
const drawerSerialVisible = ref(false);
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

const dialogPattern = type => dialogStatus.value === type;
const fetchList = () => {
  listLoading.value = true;
  queryShipmentsAPI(listQuery.value).then(data => {
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
  const loadingInstance = ElLoading.service({fullscreen: true});
  const shipmentId = row.id;
  if (type === 'remove') {
    deleteShipmentAPI(shipmentId).then(() => {
      ElMessage.success(`Delete Shipment ${shipmentId}(ID) Successfully`, 3);
      fetchList();
    }).catch(() => ElMessage.error(`Failed to delete Shipment ${shipmentId}(ID)`, 3))
      .finally(() => loadingInstance.close());
    return;
  }
  
  listShipPackagesAPI(row.id).then(data => {
    packageList.value = data;
    dialogTableVisible.value = true;
  }).catch(() => ElMessage.error(`Failed to query Shipment ${shipmentId}(ID)'s Packages`, 3))
    .finally(() => loadingInstance.close());
};

fetchList();

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

.f-row.controls
  align-items: center
  margin-left: 1rem
  .tips
    margin-left: 1rem
    width: 20px
    height: 20px
    cursor: pointer

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

.content-column
  .count
    vertical-align: baseline
    padding: 1px 8px
    font-size: 75%
    font-weight: 700
    line-height: 1
    text-align: center
    white-space: nowrap
    color: #212529
    border-radius: 0.25rem
    background-color: #f8f9fa
  .content-icon
    margin-right: .25rem
</style>
