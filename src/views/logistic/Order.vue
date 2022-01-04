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
      <el-table-column label="Order" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.number }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{ warehouseOptions[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Warehouse Tasks & Items" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusTypeDict[row.status]">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.etaWh?.split('T')[0] }}</span>
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

    <el-dialog :title="titleMap[dialogStatus]" v-model="dialogFormVisible" :before-close="beforeCloseDialog" :close-on-click-modal="false">
      <div class="dialog-header">Common</div>
      <el-form ref="dataForm" :rules="rules" :model="freightForm" label-position="left" label-width="180px">
        <el-row>
          <el-form-item label="Destination Warehouse" prop="targetId">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.targetId" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in warehouseOptions" :key="key" :label="item" :value="Number(key)" />
            </el-select>
          </el-form-item>
          <el-form-item label="Batch number" prop="number">
            <el-input :disabled="dialogPattern('view')" v-model="freightForm.number" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Status" prop="status">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.status" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in statusOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Freight Cost" prop="cost">
            <el-input :disabled="dialogPattern('view')" v-model="freightForm.cost" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Mode" prop="mode">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.mode" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in modeOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Forwarder" prop="oceanForwarder">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.oceanForwarder" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in forwarderOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Origin Port" prop="oriPort">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.oriPort" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in oriPortOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Destination Port" prop="destPort">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.destPort" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in destPortOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Container Type" prop="container">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.container" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in containerOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Pick Up" prop="pickup">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.pickup" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Warehouse" prop="etaWh">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.etaWh" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Warehouse" prop="ataWh">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.ataWh" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETD Origin Port" prop="etdOp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.etdOp" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATD Origin Port" prop="atdOp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.atdOp" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Destination Port" prop="etaDp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.etaDp" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Destination Port" prop="ataDp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.ataDp" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Transit Time">
            <el-input disabled v-model="transitTime" placeholder=""/>
          </el-form-item>
          <el-form-item label="Transit Options">
            <el-select :default="1" :disabled="dialogPattern('view')" v-model="transit_time_base" class="filter-item" placeholder="Please select">
              <el-option v-for="item in transitTimeOptions" :key="item" :label="item.key" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <div class="f-row controls" v-if="!dialogPattern('view')">
          <el-button v-if="dialogPattern('create')" style="margin-left: 10px;" type="primary" @click="createFreight">
            Submit Common Section
          </el-button>
          <el-button v-if="dialogPattern('edit')" style="margin-left: 10px;" type="primary" @click="updateFreight">
            Update Common Section
          </el-button>
          <el-tooltip
            class="tips"
            effect="light"
            content="You need to have/submit a common part before 'Add new Sub-Batch'"
            placement="right"
          >
            <svg-icon icon-name="tips" />
          </el-tooltip>
        </div>
        <el-divider></el-divider>

        <template v-for="(item, index) in batchArr" :key="index">
          <batch
            :ref="`batch-${index}`"
            :freightId=freightForm.id
            :batchIdx=index
            :batchItem=item
            :warehouseOptions=warehouseOptions
            :dialogStatus=dialogStatus
            @deleteBatch="deleteBatch"
            @submitBatch="createBatch"
            @editBatch="updateBatch"
          />
        </template>

        <div class="f-row">
          <el-button class="filter-item" v-if="!dialogPattern('view')" :disabled="disableNewBatch" style="margin-left: 26px;" type="primary" icon="el-icon-circle-plus" @click="addBatch">
            Add Sub-Batch
          </el-button>
        </div>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button v-if="dialogPattern('create')"  @click="resetForm">
            Reset
          </el-button>
          <el-button @click="dialogFormVisible = false">
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
