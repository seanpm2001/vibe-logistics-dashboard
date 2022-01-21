<template>
  <div class="page">
    <div class="filter-container">
      <el-input :disabled="isDialogPattern('view')" v-model="listQuery.title" placeholder="Batch Num" style="width: 120px;" @keyup.enter="handleFilter" />
      <el-select :disabled="isDialogPattern('view') || true" v-model="listQuery.sort" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button disabled v-wave type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button  type="primary" icon="el-icon-edit" @click="showCreateDialog">
        Add
      </el-button>
      <el-button disabled v-wave :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showMultSelection" style="margin-left:15px;">
        Multiple Selection
      </el-checkbox>
      <el-button v-if="showMultSelection" style="float: right;" v-wave  type="danger" icon="el-icon-delete" @click="handleDelSelected">
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
      <el-table-column label="Content" width="240px">
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

    <el-dialog
      width="80%"
      title="Freight"
      v-model="dialogFreightVisible"
      :before-close="beforeCloseDialog"
      :close-on-click-modal="false"
    >
      <FreightForm
        ref="freightForm"
        :warehouseOptions="warehouseOptions"
        :emptyFreightForm="emptyFreightForm"
        @fetchList="fetchList"
      />

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
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, provide } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import FreightForm from './components/FreightForm.vue';
import { parseTime } from '/@/assets/utils/format';
import { queryFreightsAPI, findFreightAPI, deleteFreightAPI, listBatchesAPI } from "/@/server/api/logistic";
import { freightStatusOptions, forwarderOptions, productMap, productIconMap } from '/@/assets/enum/logistic';

/* start data */
const store = useStore();
const warehouseOptions = computed(() => store.getters.warehouseOptions);

const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
});

const freightItem = ref({
  id: 0,
  number: null,
  etaWh: null,
  ataWh: null,
  ataDp: null,
  etaDp: null,
  etdOp: null,
  atdOp: null,
  pickup: null,
  targetId: null,
  status: null,
  mode: null,
  oriPort: null,
  destPort: null,
  container: null,
  cost: null,
  oceanForwarder: null,
});
const emptyFreightForm = JSON.parse(JSON.stringify(freightItem))._value;

const batchArr = ref([]);
const contrastData = ref(null);
const sortOptions = [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }];

const showMultSelection = ref(false);

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  'Delivered': 'info',
  'Cancelled': 'danger',
};

const tableKey = ref(0);
const dataList = ref(null);
const total = ref(0);
const listLoading = ref(true); // queryList loading
const dialogFreightVisible = ref(false);
const dialogStatus = ref(null);
const multipleSelection = ref([]);

const downloadLoading = ref(false);

// provide data for sub-components
provide('freightItem', freightItem);
provide('contrastData', contrastData);
provide('batchArr', batchArr);
provide('dialogStatus', dialogStatus);
/* end data */

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.value.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

const isDialogPattern = type => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  queryFreightsAPI(listQuery.value).then(data => {
    dataList.value = data.items;
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

const resetForm = () => {
  proxy.$refs['freightForm'].resetForm();
};

const showCreateDialog = () => {
  resetForm();
  dialogStatus.value = 'create';
  dialogFreightVisible.value = true;
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
    freightItem.value = Object.assign({}, data); // copy obj
    type === 'edit' && (contrastData.value = Object.assign({}, data));
    listBatches(freightId, () => {
      dialogStatus.value = type;
      dialogFreightVisible.value = true;
    });
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
  return dataList.value.map(v => filterVal.map(j => {
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

const beforeCloseDialog = done => {
  if (dialogStatus.value !== 'edit') {
    resetForm();
    done();
    return;
  }
  
  const isChanged = JSON.stringify(contrastData.value) !== JSON.stringify(freightItem.value);
  if (!isChanged) {
    resetForm();
    done();
  }
  isChanged && ElMessageBox.confirm(
    `Unsaved changes, are you sure to leave?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === "confirm") {
          resetForm();
          done();
        }
      },
    }
  );
};

onMounted(() => {
  listQuery.value = store.getters.listQuery['freight'];
  fetchList();
});

onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    pageName: 'freight'
  });
});
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

.el-row
  padding-right: 1rem
  padding-left: 1rem
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
