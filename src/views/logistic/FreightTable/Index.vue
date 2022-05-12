<template>
  <div class="page">
    <el-row
      justify="space-between"
      class="filter-container"
    >
      <el-row>
        <el-input
          v-model="listQuery.title"
          :disabled="isDialogPattern('view')"
          placeholder="Batch Num"
          style="width: 120px"
          @keyup.enter="handleFilter"
        />
        <el-select
          v-model="listQuery.sort"
          :disabled="isDialogPattern('view') || true"
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
          v-wave
          disabled
          type="primary"
          :icon="Search"
          @click="handleFilter"
        >
          Search
        </el-button>
        <el-button
          type="primary"
          :icon="Edit"
          @click="showCreateDialog"
        >
          Add
        </el-button>
        <el-button
          v-wave
          disabled
          :loading="downloadLoading"
          type="primary"
          :icon="Download"
          @click="handleDownload"
        >
          Export
        </el-button>
      </el-row>
      <el-button
        v-wave
        style="float: right"
        type="danger"
        :icon="Delete"
        @click="handleDelSelected"
      >
        Delete Selected Item
      </el-button>
    </el-row>
    <el-table
      :key="tableKey"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="68vh"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        height="40"
        align="center"
      />
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      />
      <el-table-column
        label="Batch Number"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>
            #<span
              class="link-type"
              @click="handleDetailRow(row, 'view')"
            >{{
              row.number
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Target"
        width="110px"
        align="center"
      >
        <template #default="{ row }">
          <el-tag>{{ warehouseEnum[row.targetId] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="statusTypeDict[row.status]">
            {{ freightStatusEnum[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="ETA WH"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ row.etaWh?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ATA WH"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ row.ataWh?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ETA DP"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ row.etaDp?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Pickup"
        width="120px"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ row.pickup?.split("T")[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Content"
        width="240px"
      >
        <template #default="{ row }">
          <template
            v-for="(item, key) in row.content"
            :key="item"
          >
            <div>
              <svg-icon :icon-name="codeIconEnum[key]" />
              <span class="mgl-5">{{ codeNameEnum[key] }}:<el-tag
                class="mgl-5"
                size="small"
              >{{
                item
              }}</el-tag></span>
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
        <template #default="{ row }">
          <el-button
            v-permission="['ADMIN','VIBE_MANAGER']"
            type="primary"
            size="small"
            @click="handleDetailRow(row, 'edit')"
          >
            Edit
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleDetailRow(row, 'view')"
          >
            View detail
          </el-button>
          <el-popconfirm
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="red"
            title="Are you sure to delete this?"
            @confirm="handleDetailRow(row, 'remove')"
          >
            <template #reference>
              <el-button
                v-if="row.status != 'deleted'"
                v-permission="['ADMIN','VIBE_MANAGER']"
                size="small"
                type="danger"
              >
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
      v-model="dialogFreightVisible"
      width="80%"
      title="Freight"
      :before-close="beforeCloseDialog"
      :close-on-click-modal="false"
    >
      <FreightForm
        ref="freightForm"
        :warehouse-enum="warehouseEnum"
        :empty-freight-form="emptyFreightForm"
        @fetchList="fetchList"
      />

      <template #footer>
        <el-button
          v-if="isDialogPattern('create')"
          @click="resetForm"
        >
          Reset
        </el-button>
        <el-button @click="dialogFreightVisible = false">
          Close
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Download, Edit, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import FreightForm from './FreightForm.vue';
import { parseTime } from '@/utils/format';
import { useLogisticStore } from '@/store';

const { warehouseEnum } = storeToRefs(useLogisticStore());

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
/* End data */

/* Start query related */

function queryFreight() {
  queryFreightsAPI(listQuery.value).then((data) => {
    dataList.value = data.items;
    total.value = data.total;
  });
}

const fetchList = () => {
  setTimeout(() => queryFreight(), 200);
};

useWarehouseEnumHook();
useQueryHook(listQuery, 'freight', fetchList);
/* End query related */

const isDialogPattern = (type) => dialogStatus.value === type;

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  Delivered: 'info',
  Cancelled: 'danger',
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const sortChange = (data) => {
  const { prop, order } = data;
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
  nextTick(() => {
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
  listBatchesAPI(_freightId).then((data) => {
    batchArr.value = data;
    callback && callback();
  });
};

const handleDetailRow = (_row, type) => {
  const freightId = _row.id;
  if (type === 'remove') {
    deleteFreightAPI(freightId).then(() => fetchList());
    return;
  }
  findFreightAPI(freightId).then((data) => {
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
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          resetForm();
          done();
        }
      },
    });
};
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
