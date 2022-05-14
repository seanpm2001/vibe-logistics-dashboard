<template>
  <div class="page">
    <FilterHeader
      @fetch-list="fetchList"
      @show-create-dialog="showCreateDialog"
    />
    <FrieghtTable
      :data-list="dataList"
      :warehouse-enum="warehouseEnum"
      @fetch-list="fetchList"
      @handle-detail-row="handleDetailRow"
    />

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
import { ElMessageBox } from 'element-plus';
import FilterHeader from './FilterHeader.vue';
import FreightForm from './FreightForm/Index.vue';
import FrieghtTable from './FrieghtTable.vue';
import { useLogisticStore } from '@/store';

import {
  queryFreightsAPI,
  findFreightAPI,
  deleteFreightAPI,
  listBatchesAPI,
} from '@/api';

const { warehouseEnum } = storeToRefs(useLogisticStore());


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

const dialogFreightVisible = ref(false);
const dialogStatus = ref(null);
const multipleSelection = ref([]);

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
provide('multipleSelection', multipleSelection);
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

const listBatches = (_freightId, callback) => {
  listBatchesAPI(_freightId).then((data) => {
    batchArr.value = data;
    callback && callback();
  });
};

const handleDetailRow = (freight, type) => {
  const freightId = freight.id;
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
