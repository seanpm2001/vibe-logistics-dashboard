<template>
  <div class="page">
    <div class="filter-container">
      <el-input :disabled="dialogPattern('view')" v-model="listQuery.title" placeholder="Batch Num" style="width: 120px;" class="filter-item" @keyup.enter="handleFilter" />
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
      <el-table-column v-if="showMultSelection" type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template v-slot="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Batch Number" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.number }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>{{ warehouseOptions[row.target_id] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="statusTypeDict[row.status]">
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ETA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.eta_wh.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ATA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.ata_wh.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ETA DP" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.eta_dp.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pickup" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.pickup.split('T')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="content-column" label="Content" width="200px">
        <template v-slot="{row}">
          <div v-if="row.content?.board55_v1">
            <svg-icon icon-name="board" class="content-icon" />
            <span>Board: <span class="count">{{ row.content?.board55_v1 }}</span></span>
          </div>
          <div v-if="row.content?.stand55_v1">
            <svg-icon icon-name="stand" class="content-icon is-current" />
            <span>White stand: <span class="count">{{ row.content?.stand55_v1 }}</span></span>
          </div>
          <div v-if="row.content?.board75_pro">
            <svg-icon icon-name="board" class="content-icon" />
            <span>Board 75: <span class="count">{{ row.content?.board75_pro }}</span></span>
          </div>
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
      v-model:limit="listQuery.limit"
      @pagination="handlePagination"
    />

    <el-dialog :title="titleMap[dialogStatus]" v-model="dialogFormVisible" :before-close="beforeCloseDialog" :close-on-click-modal="false">
      <div class="dialog-header">Common</div>
      <el-form ref="dataForm" :rules="rules" :model="freightForm" label-position="left" label-width="180px">
        <el-row>
          <el-form-item label="Destination Warehouse" prop="target_id">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.target_id" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in warehouseOptions" :key="key" :label="item" :value="Number(key)" />
            </el-select>
          </el-form-item>
          <el-form-item label="Pick Up" prop="pickup">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.pickup" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Warehouse" prop="eta_wh">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.eta_wh" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Warehouse" prop="ata_wh">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.ata_wh" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETD Origin Port" prop="etd_op">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.etd_op" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATD Origin Port" prop="atd_op">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.atd_op" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Destination Port" prop="eta_dp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.eta_dp" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Destination Port" prop="ata_dp">
            <el-date-picker :disabled="dialogPattern('view')" v-model="freightForm.ata_dp" type="date" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Transit Time">
            <el-input disabled v-model="transitTime" placeholder=""/>
          </el-form-item>
          <el-form-item label="Transit Options">
            <el-select :default="1" :disabled="dialogPattern('view')" v-model="transit_time_base" class="filter-item" placeholder="Please select" ref="transitOption">
              <el-option v-for="item in transitTimeOptions" :key="item" :label="item.key" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Batch number" prop="number">
            <el-input :disabled="dialogPattern('view')" v-model="freightForm.number" />
          </el-form-item>
          <el-form-item label="Ocean Freight Cost" prop="cost">
            <el-input :disabled="dialogPattern('view')" v-model="freightForm.cost" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Status" prop="status">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.status" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in statusOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Forwarder" prop="ocean_forwarder">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.ocean_forwarder" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in forwarderOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Origin Port" prop="ori_port">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.ori_port" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in oriPortOptions" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Destination Port" prop="dest_port">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.dest_port" class="filter-item" placeholder="Please select">
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
          <el-form-item label="Mode" prop="mode">
            <el-select :disabled="dialogPattern('view')" v-model="freightForm.mode" class="filter-item" placeholder="Please select">
              <el-option v-for="(item, key) in modeOptions" :key="item" :label="item" :value="key" />
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
        <div ref="batch-box" v-for="(item, index) in batchArr" :key="index">
          <batch :batchIdx=index :warehouseOptions=warehouseOptions @deleteBatch="deleteBatch"></batch>
        </div>
        <div class="f-row">
          <el-button class="filter-item" v-if="!dialogPattern('view')" :disabled="disableNewBatch" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus" @click="addBatch">
            Add Sub-Batch
          </el-button>
          <el-button v-if="!dialogPattern('view')" :disabled="!disableNewBatch" class="filter-item" style="margin-left: 10px;" type="primary" @click="submitBatch">
            Submit Sub-Batch
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
import { ElMessage, ElMessageBox } from "element-plus";
import { parseTime } from '/@/assets/utils/format';
import Pagination from '/@/components/Pagination.vue';
import { listWarehousesAPI, createFreightAPI, findFreightAPI, listFreightsAPI, updateFreightAPI, deleteFreightAPI } from "/@/server/api/logistic";
import batch from './components/Batch.vue';
import { statusOptions, forwarderOptions, modeOptions, containerOptions, oriPortOptions, destPortOptions } from './enum/freight';

const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  per_page: 10,
  number: undefined,
  sort: '-id'
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
  target_id: [{ required: true, message: 'destination is required', trigger: 'change' }],
  status: [{ required: true, message: 'type is required', trigger: 'change' }],
});
const downloadLoading = ref(false);
const disableNewBatch = ref(false);

const transitTime = computed(() => {
  const formData = freightForm.value;
  return Math.abs(+formData.ata_wh - +formData.atd_op)/(86400*1000*transit_time_base.value);
});
const transit_time_base = ref(1);

const freightForm = ref({
  id: undefined,
  number: '',
  eta_wh: null,
  ata_wh: null,
  ata_dp: null,
  eta_dp: null,
  etd_op: null,
  atd_op: null,
  pickup: null,
  target_id: '',
  status: '',
  mode: '',
  ori_port: '',
  dest_port: '',
  container: '',
  cost: '',
  ocean_forwarder: '',
  // content: {
  //   'board55_v1': '',
  //   'stand55_v1': '',
  //   'board75_pro': ''
  // },
  // batch_subs: []
});

const emptyForm = Object.assign({}, freightForm.value);
let contrastData = null;

const datePropertyArr = ['ata_dp', 'atd_op', 'eta_dp', 'etd_op', 'pickup', 'ata_wh', 'eta_wh'];

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.value.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

const dialogPattern = type => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  listFreightsAPI(listQuery.value).then(data => {
    list.value = data;
    total.value = data.length;

    // Just to simulate the time of the request
    setTimeout(() => {
      listLoading.value = false;
    }, 500);
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

const handleDetailRow = (row, type) => {
  findFreightAPI(row.id).then(data => {
    freightForm.value = Object.assign({}, data); // copy obj
    type === 'edit' && (contrastData = Object.assign({}, data));
  });
  dialogStatus.value = type;
  dialogFormVisible.value = true;
};

const showCreateDialog = () => {
  dialogStatus.value = 'create';
  dialogFormVisible.value = true;
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
      createFreightAPI(formData).then(() => {
        list.value.push(formData);
        total.value++;
        dialogFormVisible.value = false;
        dialogStatus.value = 'edit';
        ElMessage.success('Create Successfully', 3);
      });
    }
  });
};

const updateFreight = () => {
  proxy.$refs['dataForm'].validate((valid) => {
    if (valid) {
      const updates = freightForm.value;
      const tempData = Object.assign({}, updates);
      updateFreightAPI(updates.id, tempData).then(data => {
        ElMessage.success('Update Successfully', 3);
      });
    }
  });
};

const deleteFreight = (row, index) => {
  deleteFreightAPI(row.id).then(() => {
    list.value.splice(index, 1);
    total.value--;
  });
  ElMessage.success('Delete Successfully', 3);
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.id - pre.id);
};

const handleDelSelected = () => {
  multipleSelection.value.forEach(item => {
    deleteFreightAPI(item.id).then(() => {
      const idx = list.value.indexOf(item);
      list.value.splice(idx, 1);
      total.value--;
    });
  });
  ElMessage.success('Delete Successfully', 3);
  multipleSelection.value = [];
  fetchList();
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

const deleteBatch = idx => {
  batchArr.value.splice(idx, 1);
  deleteFreightAPI(idx);
  disableNewBatch.value = false;
};

const addBatch = () => {
  if (!freightForm.value.id) {
    ElMessage.error('You need to "Submit Common Section" before "Add Sub-Batch"', 3);
    return;
  }
  batchArr.value.push({});
  disableNewBatch.value = true;
};

const submitBatch = freightId => {
  console.log('freightId: ', freightForm.value);
};

const init = () => {
  listWarehousesAPI().then(data => {
    data.forEach(item => {
      warehouseOptions.value[item.id] = item.name;
    });
  });
};

fetchList();
onMounted(() => {
  init();
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

.dialog-header
  margin-left: 2rem
  margin-bottom: 1rem
  font-size: 18px
  font-weight: 500

.filter-container
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem

.f-row.controls
  align-items: center
  .tips
    margin-left: 12px
    width: 20px
    height: 20px

:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 14px
  line-height: 14px
  .el-checkbox
    height: 14px

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
