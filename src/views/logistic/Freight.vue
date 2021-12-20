<template>
  <div class="page">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Batch Num" style="width: 120px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-wave class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-wave :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showMode" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        Mode
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="600"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template v-slot="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Batch Number" width="140px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleUpdate(row)">{{ row.batch_number }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template v-slot="{row}">
          <el-tag :type="row.status === 'In Transit' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showMode" label="Mode" width="80px" align="center">
        <template v-slot="{row}">
          <el-tag>
            <span>{{ row.mode }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ETA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.eta_wh, '{m}/{d}/{y}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ATA WH" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.ata_wh, '{m}/{d}/{y}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ETA POD" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.eta_pod, '{m}/{d}/{y}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pickup" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ parseTime(row.pickup, '{m}/{d}/{y}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="content-column" label="Content" width="200px">
        <template v-slot="{row}">
          <div v-if="row.content.board55_v1">
            <svg-icon icon-name="board" class="content-icon" />
            <span>Board: <span class="count">{{ row.content.board55_v1 }}</span></span>
          </div>
          <div v-if="row.content.stand55_v1">
            <svg-icon icon-name="stand" class="content-icon is-current" />
            <span>White stand: <span class="count">{{ row.content.stand55_v1 }}</span></span>
          </div>
          <div v-if="row.content.board75_pro">
            <svg-icon icon-name="board" class="content-icon" />
            <span>Board 75: <span class="count">{{ row.content.board75_pro }}</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            View detail
          </el-button>
          <el-popconfirm @confirm="handleDelete(row,$index)" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
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

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <div class="dialog-header">Common</div>
      <el-form ref="dataForm" :rules="rules" :model="freightForm" label-position="left" label-width="180px" style="min-width: 600px; margin-right:32px; margin-left:32px;">
        <el-row>
          <el-form-item label="Destination Warehouse" prop="destination">
            <el-select v-model="freightForm.destination" class="filter-item" placeholder="Please select">
              <el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Batch number">
            <el-input v-model="freightForm.batch_number" />
          </el-form-item>
          <el-form-item label="Ocean Freight Cost">
            <el-input v-model="freightForm.freight_cost" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Status">
            <el-select v-model="freightForm.status" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Ocean Forwarder">
            <el-select v-model="freightForm.ocean_forwarder" class="filter-item" placeholder="Please select">
              <el-option v-for="item in forwarderOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Origin Port" prop="ori_port">
            <el-select v-model="freightForm.ori_port" class="filter-item" placeholder="Please select">
              <el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Destination Port" prop="dest_port">
            <el-select v-model="freightForm.dest_port" class="filter-item" placeholder="Please select">
              <el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Container Type">
            <el-select v-model="freightForm.container" class="filter-item" placeholder="Please select">
              <el-option v-for="item in containerOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mode">
            <el-select v-model="freightForm.mode" class="filter-item" placeholder="Please select">
              <el-option v-for="item in modeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Warehouse" prop="eta_wh">
            <el-date-picker v-model="freightForm.eta_wh" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Warehouse" prop="ata_wh" ref="ataWh">
            <el-date-picker v-model="freightForm.ata_wh" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETD Origin Port" prop="etd_op">
            <el-date-picker v-model="freightForm.etd_op" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATD Origin Port" prop="atd_op" ref="atdOp">
            <el-date-picker v-model="freightForm.atd_op" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ETA Destination Port" prop="eta_dp">
            <el-date-picker v-model="freightForm.eta_dp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="ATA Destination Port" prop="ata_dp">
            <el-date-picker v-model="freightForm.ata_dp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Transit Time">
            <el-input disabled v-model="transitTime" placeholder=""/>
          </el-form-item>
          <el-form-item label="Transit Options">
            <el-select v-model="freightForm.transit_time_type" class="filter-item" placeholder="Please select" ref="transitOption">
              <el-option v-for="item in transitTimeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-divider></el-divider>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus" @click="handleAddSubBatch">
          Add Sub-Batch
        </el-button>
        <div ref="sub-batch-box" v-for="(item, index) in subBatchArr" :key="index">
          <sub-batch :subBatchIdx=index :warehouseOptions=warehouseOptions @deleteSubBatch="deleteSubBatch"></sub-batch>
        </div>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="resetForm">
            Reset
          </el-button>
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { parseTime } from '/@/assets/utils/index';
import Pagination from '/@/components/Pagination.vue';
import { listFreightsAPI } from "/@/server/api/logistic";
import subBatch from './components/SubBatch.vue';

const store = useStore();
const { proxy } = getCurrentInstance();
const refs = proxy.$refs;

const listQuery = ref({
  page: 1,
  limit: 10,
  content: undefined,
  title: undefined,
  type: undefined,
  sort: '+id'
});

const subBatchArr = ref([]);

const warehouseOptions = ['FBA-US', 'FBA-CA', 'FBA-DE', 'FBA-UK', 'FBA-JP', 'IWIN', 'RED STAG', 'VIBE BEL', 'FPL-CA', 'FPL-AU', 'TOYOND', 'TCL', 'SF (Fuqing)', 'Jiguang', 'HH', 'Zhongao', 'TPV', 'Customer'];
// const calendarTypeOptions = ref([
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]);
const transitTimeOptions = ['day', 'week'];
const sortOptions = [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }];
const statusOptions = ['In Transit', 'Delivered', 'Canceled', 'Picked up'];
const forwarderOptions = ['Full Power Logistics', 'FLEXPORT', 'LIGHTNING', 'AGL', 'SF'];
const modeOptions = ['Ocean', 'Air', 'Truck'];
const containerOptions = ['20GP', '40GP', '40HQ', '45HQ', 'LCL'];
const showMode = ref(false);

const tableKey = ref(0);
const list = ref(null);
const total = ref(0);
const listLoading = ref(true);
const dialogFormVisible = ref(false);
const dialogStatus = ref('');
const textMap= ref({
  update: 'Edit',
  create: 'Create'
});
const rules = ref({
  destination: [{ required: true, message: 'type is required', trigger: 'change' }],
  status: [{ required: true, message: 'type is required', trigger: 'change' }],
  timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
  title: [{ required: true, message: 'title is required', trigger: 'blur' }]
});
const downloadLoading = ref(false);

const transitTime = computed(() => {
  const time = '123';
  const transitOption = refs['transitOption'];
  console.log('transitOption: ', transitOption);
  refs['ataWh'];
  console.log('ref ', refs['ataWh']);
  refs['atdOp'];
  console.log('atdO: ', refs['atdOp']);
  return time;
});

const freightForm = ref({
  id: undefined,
  eta_wh: '',
  ata_wh: '',
  ata_dp: '',
  eta_dp: '',
  etd_op: '',
  atd_op: '',
  pickup: '',
  batch_number: '',
  ocean_forwarder: '',
  content: {
    'board55_v1': '',
    'stand55_v1': '',
    'board75_pro': ''
  },
  batch_subs: {
  },
  type: '',
  mode: '',
  transit_time_type: '',
  status: '',
});

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.value.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

const fetchList = () => {
  listLoading.value = true;
  listFreightsAPI(listQuery.value).then(data => {
    list.value = data.items;
    total.value = data.total;

    // Just to simulate the time of the request
    setTimeout(() => {
      listLoading.value = false;
    }, 1.5 * 1000);
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

const resetForm = () => {
  freightForm.value = {
    id: undefined,
    content: {},
    remark: '',
    timestamp: new Date(),
    title: '',
    status: '',
    type: ''
  };
};

const handleCreate = () => {
  resetForm();
  dialogStatus.value = 'create';
  dialogFormVisible.value = true;
  proxy.$nextTick(() => {
    refs['dataForm'].clearValidate();
  });
};

const createData = () => {
  refs['dataForm'].validate((valid) => {
    if (valid) {
      freightForm.value.id = parseInt(Math.random() * 100) + 1024; // mock a id
      freightForm.value.author = 'vibe';
      // createArticle(freightForm.value).then(() => {
      //   list.value.unshift(freightForm.value)
      //   dialogFormVisible.value = false
      //   ElMessage.success('Create Successfully', 3)
      // })
    }
  });
};

const handleUpdate = row => {
  freightForm.value = Object.assign({}, row); // copy obj
  freightForm.value.timestamp = new Date(freightForm.value.timestamp);
  dialogStatus.value = 'update';
  dialogFormVisible.value = true;
  proxy.$nextTick(() => {
    refs['dataForm'].clearValidate();
  });
};

const updateData = () => {
  refs['dataForm'].validate((valid) => {
    if (valid) {
      const tempData = Object.assign({}, freightForm.value);
      tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      // updateArticle(tempData).then(() => {
      //   const index = list.value.findIndex(v => v.id === freightForm.value.id)
      //   list.value.splice(index, 1, freightForm.value)
      //   dialogFormVisible.value = false
      //   ElMessage.success('Update Successfully', 3)
      // })
    }
  });
};

const handleDelete = (row, index) => {
  ElMessage.success('Delete Successfully', 3);
  list.value.splice(index, 1);
};

const handleDownload = () => {
  downloadLoading.value = true;
  import('/@/assets/utils/excel').then(excel => {
    const tHeader = ['timestamp', 'title', 'type', 'content', 'status'];
    const filterVal = ['timestamp', 'title', 'type', 'content', 'status'];
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

const deleteSubBatch = idx => {
  subBatchArr.value.splice(idx, 1);
};

const handleAddSubBatch = () => {
  subBatchArr.value.push({});
};

fetchList();
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 118px)

.dialog-header
  margin-left: 2rem
  margin-bottom: 1rem
  font-size: 18px
  font-weight: 500

.filter-container
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem

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
