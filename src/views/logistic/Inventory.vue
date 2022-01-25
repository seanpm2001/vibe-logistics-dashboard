<template>
  <div class="page">
    <el-row justify="space-between" class="filter-container">
      <el-row>
        <el-input v-model="listQuery.search" placeholder="Search" style="width: 200px;" @keyup.enter="handleFilter" />
        <el-button v-wave type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
        <el-button v-wave :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button>
      </el-row>

      <el-button type="primary" icon="el-icon-edit" @click="addWarehouseMoveTask">
        Add a warehouse move task
      </el-button>
    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      height="68vh"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column label="Warehouse" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.search }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="In Stock" width="200px">
        <template v-slot="{row}">
          <div v-if="row.in_stock.board55_v1">
            <svg-icon icon-name="board" class="product-icon" />
            <span>55″ Board: <span class="count">{{ row.in_stock.board55_v1 }}</span></span>
          </div>
          <div v-if="row.in_stock.stand_white55_v1">
            <svg-icon icon-name="stand" class="product-icon is-current" />
            <span>55″ White Stand: <span class="count">{{ row.in_stock.stand_white55_v1 }}</span></span>
          </div>
          <div v-if="row.in_stock.stand_red55_v1">
            <svg-icon icon-name="stand" class="product-icon is-red" />
            <span>55″ Red Stand: <span class="count">{{ row.in_stock.stand_red55_v1 }}</span></span>
          </div>
          <div v-if="row.in_stock.stylus55_x2">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Stylus ×2: <span class="count">{{ row.in_stock.stylus55_x2 }}</span></span>
          </div>
          <div v-if="row.in_stock.stylus55_active">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Active Stylus: <span class="count">{{ row.in_stock.stylus55_active }}</span></span>
          </div>
          <div v-if="row.in_stock.board75_pro">
            <svg-icon icon-name="board" class="product-icon" />
            <span>75″ Board: <span class="count">{{ row.in_stock.board75_pro }}</span></span>
          </div>
          <div v-if="row.in_stock.stand75_pro">
            <svg-icon icon-name="stand" class="product-icon is-grey" />
            <span>75″ Grey Stand: <span class="count">{{ row.in_stock.stand75_pro }}</span></span>
          </div>
          <div v-if="row.in_stock.ops75_pro">
            <svg-icon icon-name="ops-75" class="product-icon" />
            <span>75″ OPS: <span class="count">{{ row.in_stock.ops75_pro }}</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Avaliable" width="200px">
        <template v-slot="{row}">
          <div v-if="row.available.board55_v1">
            <svg-icon icon-name="board" class="product-icon" />
            <span>55″ Board: <span class="count">{{ row.available.board55_v1 }}</span></span>
          </div>
          <div v-if="row.available.stand_white55_v1">
            <svg-icon icon-name="stand" class="product-icon is-current" />
            <span>55″ White Stand: <span class="count">{{ row.available.stand_white55_v1 }}</span></span>
          </div>
          <div v-if="row.available.stand_red55_v1">
            <svg-icon icon-name="stand" class="product-icon is-red" />
            <span>55″ Red Stand: <span class="count">{{ row.available.stand_red55_v1 }}</span></span>
          </div>
          <div v-if="row.available.stylus55_x2">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Stylus ×2: <span class="count">{{ row.available.stylus55_x2 }}</span></span>
          </div>
          <div v-if="row.available.stylus55_active">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Active Stylus: <span class="count">{{ row.available.stylus55_active }}</span></span>
          </div>
          <div v-if="row.available.board75_pro">
            <svg-icon icon-name="board" class="product-icon" />
            <span>75″ Board: <span class="count">{{ row.available.board75_pro }}</span></span>
          </div>
          <div v-if="row.available.stand75_pro">
            <svg-icon icon-name="stand" class="product-icon is-grey" />
            <span>75″ Grey Stand: <span class="count">{{ row.available.stand75_pro }}</span></span>
          </div>
          <div v-if="row.available.ops75_pro">
            <svg-icon icon-name="ops-75" class="product-icon" />
            <span>75″ OPS: <span class="count">{{ row.available.ops75_pro }}</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Pending In" width="200px">
        <template v-slot="{row}">
          <div v-if="row.pending_in.board55_v1">
            <svg-icon icon-name="board" class="product-icon" />
            <span>55″ Board: <span class="count">{{ row.pending_in.board55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_in.stand_white55_v1">
            <svg-icon icon-name="stand" class="product-icon is-current" />
            <span>55″ White Stand: <span class="count">{{ row.pending_in.stand_white55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_in.stand_red55_v1">
            <svg-icon icon-name="stand" class="product-icon is-red" />
            <span>55″ Red Stand: <span class="count">{{ row.pending_in.stand_red55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_in.stylus55_x2">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Stylus ×2: <span class="count">{{ row.pending_in.stylus55_x2 }}</span></span>
          </div>
          <div v-if="row.pending_in.stylus55_active">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Active Stylus: <span class="count">{{ row.pending_in.stylus55_active }}</span></span>
          </div>
          <div v-if="row.pending_in.board75_pro">
            <svg-icon icon-name="board" class="product-icon" />
            <span>75″ Board: <span class="count">{{ row.pending_in.board75_pro }}</span></span>
          </div>
          <div v-if="row.pending_in.stand75_pro">
            <svg-icon icon-name="stand" class="product-icon is-grey" />
            <span>75″ Grey Stand: <span class="count">{{ row.pending_in.stand75_pro }}</span></span>
          </div>
          <div v-if="row.pending_in.ops75_pro">
            <svg-icon icon-name="ops-75" class="product-icon" />
            <span>75″ OPS: <span class="count">{{ row.pending_in.ops75_pro }}</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Pending Out" width="200px">
        <template v-slot="{row}">
          <div v-if="row.pending_out.board55_v1">
            <svg-icon icon-name="board" class="product-icon" />
            <span>55″ Board: <span class="count">{{ row.pending_out.board55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_out.stand_white55_v1">
            <svg-icon icon-name="stand" class="product-icon is-current" />
            <span>55″ White Stand: <span class="count">{{ row.pending_out.stand_white55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_out.stand_red55_v1">
            <svg-icon icon-name="stand" class="product-icon is-red" />
            <span>55″ Red Stand: <span class="count">{{ row.pending_out.stand_red55_v1 }}</span></span>
          </div>
          <div v-if="row.pending_out.stylus55_x2">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Stylus ×2: <span class="count">{{ row.pending_out.stylus55_x2 }}</span></span>
          </div>
          <div v-if="row.pending_out.stylus55_active">
            <svg-icon icon-name="stylus" class="product-icon" />
            <span>55″ Active Stylus: <span class="count">{{ row.pending_out.stylus55_active }}</span></span>
          </div>
          <div v-if="row.pending_out.board75_pro">
            <svg-icon icon-name="board" class="product-icon" />
            <span>75″ Board: <span class="count">{{ row.pending_out.board75_pro }}</span></span>
          </div>
          <div v-if="row.pending_out.stand75_pro">
            <svg-icon icon-name="stand" class="product-icon is-grey" />
            <span>75″ Grey Stand: <span class="count">{{ row.pending_out.stand75_pro }}</span></span>
          </div>
          <div v-if="row.pending_out.ops75_pro">
            <svg-icon icon-name="ops-75" class="product-icon" />
            <span>75″ OPS: <span class="count">{{ row.pending_out.ops75_pro }}</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="300px" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total>0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="handlePagination"
    />

    <TaskDialog
      :emptyTaskItem="emptyTaskItem"
      :warehouseEnum="warehouseEnum"
      :dialogStatus="dialogStatus"
    />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { parseTime } from '/@/utils/format';
import Pagination from '/@/components/Pagination.vue';
import TaskDialog from './components/TaskDialog.vue';
import { listInventoriesAPI } from "/@/api/logistic";

/* Start Data */
const store = useStore();
const { proxy } = getCurrentInstance();

const warehouseEnum = computed(() => store.getters.warehouseEnum);

const listQuery = ref({
  page: 1,
  limit: 10,
  search: undefined,
  sort: '+id'
});


const sortEnum = ref([{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]);

const tableKey = ref(0);
const dataList = shallowRef(null);
const total = ref(0);
const listLoading = ref(true);
const dialogTaskVisible = ref(false);
const dialogStatus = ref('');
const downloadLoading = ref(false);

const taskItem = ref({
  id: 0,
  orderId: null,
  sourceId: null,
  targetId: null,
  type: null,
  status: null,
  usedUnitArr: [{
    usedAge: null,
    condition: null,
    serial: null,
  }],
  specifySerailArr: [{
    serial: null,
  }]
});
const emptyTaskItem = JSON.parse(JSON.stringify(taskItem))._value;
const taskOrderItem = null;

provide('dialogTaskVisible', dialogTaskVisible);
provide('taskItem', taskItem);
provide('taskOrderItem', taskOrderItem);
/* End Data */

const temp = ref({
  id: 0,
  content: {},
  remark: '',
  timestamp: new Date(),
  title: '',
  type: '',
  status: 'In Transit'
});

const addWarehouseMoveTask = () => {
  taskItem.value = Object.assign({}, emptyTaskItem);
  taskItem.value.type = 'MOVE';
  dialogStatus.value = 'create';
  dialogTaskVisible.value = true;
};

const fetchList = () => {
  listLoading.value = true;
  listInventoriesAPI(listQuery.value).then(data => {
    dataList.value = data.items;
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

const handleModifyStatus = (row, status) => {
  ElMessage.success('操作Success', 3);
  row.status = status;
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

const handleUpdate = row => {
  temp.value = Object.assign({}, row); // copy obj
  temp.value.timestamp = new Date(temp.value.timestamp);
  dialogStatus.value = 'update';
  dialogFormVisible.value = true;
  proxy.$nextTick(() => {
    proxy.$refs['dataForm'].clearValidate();
  });
};

const updateData = () => {
  proxy.$refs['dataForm'].validate((valid) => {
    if (valid) {
      const tempData = Object.assign({}, temp.value);
      tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      // updateArticle(tempData).then(() => {
      //   const index = dataList.value.findIndex(v => v.id === temp.value.id)
      //   dataList.value.splice(index, 1, temp.value)
      //   dialogFormVisible.value = false
      //   ElMessage.success('Update Successfully', 3)
      // })
    }
  });
};

const handleDelete = (row, index) => {
  dataList.value.splice(index, 1);
};


const handleDownload = () => {
  downloadLoading.value = true;
  import('/@/utils/excel').then(excel => {
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

onMounted(() => {
  if (JSON.stringify(warehouseEnum.value) === '{}') // init warehouseEnum
    store.dispatch('logistic/setWarehouseEnum');

  listQuery.value = store.getters.listQuery['inventory'];
  fetchList();
});

onBeforeUnmount(() => {
  store.commit('logistic/SET_LIST_QUERY', {
    query: listQuery.value,
    pageName: 'inventory'
  });
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

</style>
