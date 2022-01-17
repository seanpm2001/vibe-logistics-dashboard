<template>
  <div class="page">
    <div class="filter-container">
      <el-input :disabled="isDialogPattern('view')" v-model="listQuery.title" placeholder="Batch Num" style="width: 120px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select :disabled="isDialogPattern('view') || true" v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button disabled v-wave class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showCreateDialog">
        Add
      </el-button>
      <el-button disabled v-wave :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showMultSelection" class="filter-item" style="margin-left:15px;">
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
      <el-table-column v-if="showMultSelection" type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />
      <el-table-column label="Batch Number" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.number }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{ warehouseOptions[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusTypeDict[row.status]">
            {{ freightStatusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ETA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.etaWh?.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ATA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.ataWh?.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ETA DP" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.etaDp?.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pickup" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.pickup?.split('T')[0] }}</span>
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

    <Pagination
      v-show="total>0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.perPage"
      @pagination="handlePagination"
    />

    <el-dialog width="80%" :title="titleMap[dialogStatus]" v-model="dialogFreightVisible" :before-close="beforeCloseDialog" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="freightForm" label-position="left" label-width="180px">
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Destination Warehouse" prop="targetId">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.targetId" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in warehouseOptions" :key="key" :label="item" :value="Number(key)" />
            </el-select>
          </el-form-item>
          <el-form-item label="Batch number" prop="number">
            <el-input :disabled="isDialogPattern('view')" v-model="freightForm.number" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Status" prop="status">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.status" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in freightStatusOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Freight Cost" prop="cost">
            <el-input :disabled="isDialogPattern('view')" v-model="freightForm.cost" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Mode" prop="mode">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.mode" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in modeOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Forwarder" prop="oceanForwarder">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.oceanForwarder" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in forwarderOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Origin Port" prop="oriPort">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.oriPort" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in oriPortOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Destination Port" prop="destPort">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.destPort" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in destPortOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Container Type" prop="container">
            <el-select :disabled="isDialogPattern('view')" v-model="freightForm.container" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in containerOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Pick Up" prop="pickup">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.pickup" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="ETD Origin Port" prop="etdOp">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.etdOp" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATD Origin Port" prop="atdOp">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.atdOp" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="ETA Destination Port" prop="etaDp">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.etaDp" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Destination Port" prop="ataDp">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.ataDp" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="ETA Warehouse" prop="etaWh">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.etaWh" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Warehouse" prop="ataWh">
            <el-date-picker :disabled="isDialogPattern('view')" v-model="freightForm.ataWh" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Transit Time">
            <el-input disabled v-model="transitTime" placeholder=""/>
          </el-form-item>
          <el-form-item label="Transit Options">
            <el-select :default="1" :disabled="isDialogPattern('view')" v-model="transitTimeBase" class="filter-item" placeholder="Please select">
              <el-option v-for="item in transitTimeOptions" :key="item" :label="item.key" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <div class="f-row controls" v-if="!isDialogPattern('view')">
          <el-button v-if="isDialogPattern('create')" style="margin-left: 10px;" type="primary" @click="createFreight">
            Submit Common Section
          </el-button>
          <el-button v-if="isDialogPattern('edit')" style="margin-left: 10px;" type="primary" @click="updateFreight">
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

        <el-card v-if="batchArr.length > 0">
          <template v-for="(item, index) in batchArr" :key="index">
            <BatchForm
              :ref="`batch-${index}`"
              :freightId=freightForm.id
              :batchIdx=index
              :batchItem=item
              :warehouseOptions=warehouseOptions
              :dialogStatus=dialogStatus
              @deleteBatch="removeBatch"
              @createBatch="submitBatch"
              @editBatch="updateBatch"
            />
          </template>
        </el-card>
        
        <div class="f-row">
          <el-button class="filter-item" v-if="!isDialogPattern('view')" :disabled="disableNewBatch" style="margin-left: 26px;" type="primary" icon="el-icon-circle-plus" @click="handleAddBatch">
            Add Sub-Batch
          </el-button>
        </div>
      </el-form>
      <template v-slot:footer>
        <el-button v-if="isDialogPattern('create')"  @click="resetForm">
          Reset
        </el-button>
        <el-button @click="dialogFreightVisible = false">
          Close
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import BatchForm from './components/BatchForm.vue';
import { parseTime } from '/@/assets/utils/format';
import {
  queryFreightsAPI, createFreightAPI, findFreightAPI, updateFreightAPI, deleteFreightAPI,
  listWarehousesAPI, listBatchesAPI, deleteBatchAPI
} from "/@/server/api/logistic";
import {
  freightStatusOptions, forwarderOptions, modeOptions, containerOptions, oriPortOptions, destPortOptions,
  productMap, productIconMap
} from '/@/assets/enum/logistic';

const store = useStore();
const warehouseOptions = computed(() => store.getters.warehouseOptions);

const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
});

const batchArr = ref([]);

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
const dialogFreightVisible = ref(false);
const dialogStatus = ref('');
const multipleSelection = ref([]);
const titleMap= {
  view: 'View',
  edit: 'Edit',
  create: 'Create',
};
const rules = ref({
  targetId: [{ required: true, message: 'destination is required', trigger: 'change' }],
  number: [{ required: true, message: 'batch number is required', trigger: 'change' }],
});
const downloadLoading = ref(false);
const disableNewBatch = ref(true);

const transitTime = computed(() => {
  const formData = freightForm.value;
  return Math.abs(+formData.ataWh - +formData.atdOp)/(86400*1000*transitTimeBase.value);
});
const transitTimeBase = ref(1);

const freightForm = ref({
  id: undefined,
  number: '',
  etaWh: null,
  ataWh: null,
  ataDp: null,
  etaDp: null,
  etdOp: null,
  atdOp: null,
  pickup: null,
  targetId: '',
  status: '',
  mode: '',
  oriPort: '',
  destPort: '',
  container: '',
  cost: '',
  oceanForwarder: '',
});

const emptyForm = JSON.parse(JSON.stringify(freightForm))._value;
let contrastData = null;

const datePropertyArr = ['ataDp', 'atdOp', 'etaDp', 'etdOp', 'pickup', 'ataWh', 'etaWh'];

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.value.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

const isDialogPattern = type => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  queryFreightsAPI(listQuery.value).then(data => {
    list.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const sortChange = data => {
  const { prop, order } = data;
  if (prop === 'id') {
    sortByID(order);
  }
};

const sortByID = order => {
  if (order === 'ascending') {
    listQuery.value.sort = '+id';
  } else {
    listQuery.value.sort = '-id';
  }
  handleFilter();
};

const beforeCloseDialog = done => {
  if (dialogStatus.value !== 'edit') {
    done();
    return;
  }
  const isChanged = JSON.stringify(contrastData) !== JSON.stringify(freightForm.value);
  !isChanged && done();
  isChanged && ElMessageBox.confirm(
    `Unsaved changes, are you sure to leave?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === "confirm") {
          done();
        }
      },
    }
  );
};

const resetForm = () => {
  proxy.$nextTick(() => {
    proxy.$refs['dataForm'].clearValidate();
    freightForm.value = Object.assign({}, emptyForm);
  });
};

const showCreateDialog = () => {
  batchArr.value = [];
  dialogStatus.value = 'create';
  dialogFreightVisible.value = true;
  resetForm();
};

const formatDate = arr => {
  datePropertyArr.forEach(key => {
    arr[key] = parseTime(arr[key], '{y}-{m}-{d}');
  });
  return arr;
};

const createFreight = () => {
  proxy.$refs['dataForm'].validate((valid) => {
    if (valid) {
      const formData = formatDate(freightForm.value);
      createFreightAPI(formData).then(data => {
        freightForm.value = data;
        dialogStatus.value = 'edit';
        disableNewBatch.value = false;
        fetchList();
      });
    }
  });
};

const updateFreight = () => {
  proxy.$refs['dataForm'].validate((valid) => {
    if (valid) {
      const updates = freightForm.value;
      updateFreightAPI(updates.id, updates).then(data => {
        freightForm.value = data;
      });
    }
  });
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.id - pre.id);
};

const handleDelSelected = () => {
  multipleSelection.value.forEach(item => {
    const freightId = item.id;
    deleteFreightAPI(freightId);
  });
  multipleSelection.value = [];
  fetchList();
};

const listBatches = (freightId, callback) => {
  listBatchesAPI(freightId).then(data => {
    batchArr.value = data;
    callback && callback();
  });
};

const handleDetailRow = (row, type) => {
  const freightId = row.id;
  if (type === 'remove') {
    deleteFreightAPI(freightId).then(() => fetchList());
    return;
  }
  findFreightAPI(freightId).then(data => {
    freightForm.value = Object.assign({}, data); // copy obj
    type === 'edit' && (contrastData = Object.assign({}, data));
    batchArr.value = [];
    listBatches(freightId, () => disableNewBatch.value = false);
    dialogStatus.value = type;
    disableNewBatch.value = true;
    dialogFreightVisible.value = true;
  });
};

const handleDownload = () => {
  downloadLoading.value = true;
  import('/@/assets/utils/excel').then(excel => {
    const tHeader = [ 'title', 'type', 'status'];
    const filterVal = [ 'title', 'type', 'status'];
    const data = formatJson(filterVal);
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: 'table-list'
    });
    downloadLoading.value = false;
  });
};

const formatJson = filterVal => {
  return list.value.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return parseTime(v[j]);
    } else {
      return v[j];
    }
  }));
};

const getSortClass = key => {
  const sort = listQuery.value.sort;
  return sort === `+${key}` ? 'ascending' : 'descending';
};

// const handleSizeChange = val => {
//   listQuery.value.limit = val;
// };

// const handleCurrentChange = val => {
//   listQuery.value.page = val;
// };

const removeBatch = (idx, batchId) => {
  batchArr.value.splice(idx, 1);
  disableNewBatch.value = false;
  fetchList();
};

const handleAddBatch = () => {
  if (!freightForm.value.id) {
    ElMessage.error('You need to "Submit Common Section" before "Add Sub-Batch"', 3);
    return;
  }
  batchArr.value.push({costs: {}, sourceId: '', items: []});
  disableNewBatch.value = true;
};

const submitBatch = (batch, freightId, batchIdx) => {
  disableNewBatch.value = false;
  fetchList();
};

const updateBatch = (data, batchIdx) => {
  fetchList();
};

fetchList();
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

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

.el-row
  padding-right: 2rem
  padding-left: 2rem
  .el-form-item
    width: 42%
:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 20px
  .el-checkbox
    height: 14px
    vertical-align: middle

.el-form-item__content div
  width: 100%
</style>
