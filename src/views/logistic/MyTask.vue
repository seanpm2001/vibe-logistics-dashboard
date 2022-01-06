<template>
  <div class="page">
    <div class="filter-container">
      <el-select :disabled="dialogPattern('view')" v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-wave class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showCreateDialog">
        Add
      </el-button>
      <el-button v-wave :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showMultSelection" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        Multiple Selection
      </el-checkbox>
      <el-button v-if="showMultSelection" class="filter-item" style="float: right;" v-wave  type="danger" icon="el-icon-delete" @click="handleDelSelected">
        Delete Selected Item
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="68vh"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
      <el-table-column label="Order ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.order_id }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Source" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{ warehouseOptions[row.sourceId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{ warehouseOptions[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusTypeDict[row.status]">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Modified" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{warehouseOptions[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Task Status" width="120px" align="center">
        <el-tag :type="statusTypeDict[row.status]">
          {{ statusOptions[row.status] }}
        </el-tag>
      </el-table-column>
      <el-table-column label="Content" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{warehouseOptions[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetailRow(row, 'edit')">
            Edit
          </el-button>
          <el-button type="success" size="mini" @click="handleDetailRow(row, 'view')">
            View detail
          </el-button>
          <el-popconfirm @confirm="deleteFreight(row,$index)" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
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

  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { parseTime } from '/@/assets/utils/format';
import Pagination from '/@/components/Pagination.vue';
import {
  listWarehousesAPI,
  queryFreightsAPI, createFreightAPI, findFreightAPI, updateFreightAPI, deleteFreightAPI,
  listBatchesAPI, deleteBatchAPI
} from "/@/server/api/logistic";
import batch from './components/Batch.vue';
import { statusOptions, forwarderOptions, modeOptions, containerOptions, oriPortOptions, destPortOptions, productMap, productIconMap } from './enum/freight';

const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  per_page: 10,
});

const batchArr = ref([]);

const warehouseOptions = ref({});
const transitTimeOptions = [{key: 'day', value: 1}, {key: 'week', value: 7}];
const sortOptions = [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }];

const showMultSelection = ref(false);

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  'Delivered': 'info',
  'Cancelled': 'danger',
};

const tableKey = ref(0);
const list = ref(null);
const total = ref(0);
const listLoading = ref(true);
const dialogFormVisible = ref(false);
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
