<template>
  <div class="page">
    <el-row justify="space-between" class="filter-container">
      <el-row>
        <el-input
          :disabled="isDialogPattern('view')"
          v-model="listQuery.title"
          placeholder="Batch Num"
          style="width: 120px"
          @keyup.enter="handleFilter"
        />
        <el-select
          :disabled="isDialogPattern('view') || true"
          v-model="listQuery.sort"
          style="width: 150px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in sortEnum"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-button
          disabled
          v-wave
          type="primary"
          :icon="Search"
          @click="handleFilter"
        >
          Search
        </el-button>
        <el-button type="primary" :icon="Edit" @click="showCreateDialog">
          Add
        </el-button>
        <el-button
          disabled
          v-wave
          :loading="downloadLoading"
          type="primary"
          :icon="Download"
          @click="handleDownload"
        >
          Export
        </el-button>
      </el-row>
      <el-button
        style="float: right"
        v-wave
        type="danger"
        icon="el-icon-delete"
        @click="handleDelSelected"
      >
        Delete Selected Item
      </el-button>
    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="68vh"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      />
      <el-table-column label="Batch Number" width="120px" align="center">
        <template v-slot="{ row }">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{
              row.number
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{ row }">
          <el-tag>{{ warehouseEnum[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
        <template v-slot="{ row }">
          <el-tag :type="statusTypeDict[row.status]">
            {{ freightStatusEnum[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="ETA WH" width="120px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.etaWh?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ATA WH" width="120px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.ataWh?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ETA DP" width="120px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.etaDp?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pickup" width="120px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.pickup?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Content" width="240px">
        <template v-slot="{ row }">
          <template v-for="(item, key) in row.content" :key="item">
            <div>
              <svg-icon :icon-name="codeIconEnum[key]" />
              <span class="mgl-5"
                >{{ codeNameEnum[key] }}:<el-tag class="mgl-5" size="small">{{
                  item
                }}</el-tag></span
              >
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template v-slot="{ row }">
          <el-button v-permission="['ADMIN','VIBE_MANAGER']" type="primary" size="small" @click="handleDetailRow(row, 'edit')">
            Edit
          </el-button>
          <el-button type="success" size="small" @click="handleDetailRow(row, 'view')">
            View detail
          </el-button>
          <el-popconfirm
            @confirm="handleDetailRow(row, 'remove')"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
          >
            <template #reference>
              <el-button v-permission="['ADMIN','VIBE_MANAGER']" v-if="row.status != 'deleted'" size="small" type="danger">
                Delete
              </el-button>
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

    <el-dialog
      width="80%"
      title="Freight"
      v-model="dialogFreightVisible"
      :before-close="beforeCloseDialog"
      :close-on-click-modal="false"
    >
      <FreightForm
        ref="freightForm"
        :warehouseEnum="warehouseEnum"
        :emptyFreightForm="emptyFreightForm"
        @fetchList="fetchList"
      />

      <template v-slot:footer>
        <el-button v-if="isDialogPattern('create')" @click="resetForm"> Reset </el-button>
        <el-button @click="dialogFreightVisible = false"> Close </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { Download, Edit, Search } from '@element-plus/icons-vue';
import FreightForm from './FreightForm.vue';
import { parseTime } from '@/utils/format';
import { useLogisticStore } from '@/store';

const logisticStore = useLogisticStore();
const { warehouseEnum } = storeToRefs(logisticStore);

import {
  queryFreightsAPI,
  findFreightAPI,
  deleteFreightAPI,
  listBatchesAPI,
} from '@/api/logistic';
import {
  freightStatusEnum,
  forwarderEnum,
  codeNameEnum,
  codeIconEnum,
} from '@/enums/logistic';

// onRenderTriggered(e => {
//   console.log('e: ', e);

// });

/* start data */
const { proxy } = getCurrentInstance();

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
const sortEnum = [
  { label: 'ID Ascending', key: '+id' },
  { label: 'ID Descending', key: '-id' },
];

const dialogFreightVisible = ref(false);
const dialogStatus = ref(null);
const multipleSelection = ref([]);

const downloadLoading = ref(false);

const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);
const listLoading = ref(true); // queryList loading
const listQuery = ref({
  page: 1,
  perPage: 10,
});

// provide data for sub-components
provide('freightItem', freightItem);
provide('contrastData', contrastData);
provide('batchArr', batchArr);
provide('dialogStatus', dialogStatus);
provide('listQuery', listQuery);
/* end data */

const isDialogPattern = (type) => dialogStatus.value === type;

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  Delivered: 'info',
  Cancelled: 'danger',
};

function queryFreight() {
  listLoading.value = true;
  queryFreightsAPI(listQuery.value).then((_data) => {
    dataList.value = _data.items;
    total.value = _data.total;
    listLoading.value = false;
  });
}

const fetchList = () => {
  setTimeout(() => queryFreight(), 200);
};

const handlePagination = (_config) => {
  Object.assign(listQuery.value, _config);
  fetchList();
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const sortChange = (_data) => {
  const { prop, order } = _data;
  if (prop === 'id') {
    sortByID(order);
  }
};

const sortByID = (_order) => {
  if (_order === 'ascending') {
    listQuery.value.sort = '+id';
  } else {
    listQuery.value.sort = '-id';
  }
  handleFilter();
};

const resetForm = () => {
  proxy.$nextTick(() => {
    proxy.$refs['freightForm']?.resetForm();
  });
};

const showCreateDialog = () => {
  resetForm();
  dialogStatus.value = 'create';
  dialogFreightVisible.value = true;
};

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.id - pre.id);
};

const handleDelSelected = () => {
  multipleSelection.value.forEach((_item) => {
    const freightId = _item.id;
    deleteFreightAPI(freightId);
  });
  multipleSelection.value = [];
  fetchList();
};

const listBatches = (_freightId, callback) => {
  listBatchesAPI(_freightId).then((_data) => {
    batchArr.value = _data;
    callback && callback();
  });
};

const handleDetailRow = (_row, _type) => {
  const freightId = _row.id;
  if (_type === 'remove') {
    deleteFreightAPI(freightId).then(() => fetchList());
    return;
  }
  findFreightAPI(freightId).then((_data) => {
    freightItem.value = Object.assign({}, _data); // copy obj
    _type === 'edit' && (contrastData.value = Object.assign({}, _data));
    listBatches(freightId, () => {
      dialogStatus.value = _type;
      dialogFreightVisible.value = true;
    });
  });
};

const handleDownload = () => {
  downloadLoading.value = true;
  import('@/utils/excel').then((excel) => {
    const tHeader = ['title', 'type', 'status'];
    const filterVal = ['title', 'type', 'status'];
    const data = formatJson(filterVal);
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: 'table-list',
    });
    downloadLoading.value = false;
  });
};

const formatJson = (_filterVal) => {
  return dataList.value.map((v) =>
    _filterVal.map((j) => {
      if (j === 'timestamp') {
        return parseTime(v[j]);
      } else {
        return v[j];
      }
    })
  );
};

const getSortClass = (_key) => {
  const sort = listQuery.value.sort;
  return sort === `+${_key}` ? 'ascending' : 'descending';
};

const beforeCloseDialog = (done) => {
  if (dialogStatus.value !== 'edit') {
    resetForm();
    done();
    return;
  }

  const isChanged =
    JSON.stringify(contrastData.value) !== JSON.stringify(freightItem.value);
  console.log('isChanged: ', isChanged);
  
  if (!isChanged) {
    resetForm();
    done();
  }
  isChanged &&
    ElMessageBox.confirm('Unsaved changes, are you sure to leave?', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          resetForm();
          done();
        }
      },
    });
};

function initGlobalData() {
  if (JSON.stringify(warehouseEnum.value) === '{}')
    logisticStore.setWarehouseEnum();
}

onMounted(() => {
  initGlobalData();

  listQuery.value = logisticStore.listQuery['freight'];
  fetchList();
});

onBeforeUnmount(() => {
  logisticStore.setListQuery({
    query: listQuery.value,
    perPage: listQuery.perPage,
    pageName: 'freight',
  });
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

:deep(.el-dialog__body)
  padding-left: 32px
  padding-right: 32px
  .el-form .el-row > .el-form-item
    width: 42%

:deep(.el-table thead tr > th.el-table__cell .cell)
  height: 20px
  .el-checkbox
    height: 14px
    vertical-align: middle

.el-form-item__content div
  width: 100%
</style>
