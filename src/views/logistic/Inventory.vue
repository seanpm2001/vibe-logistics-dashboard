<template>
  <div class="page">
    <div class="filter-container">
      <el-input v-model="listQuery.warehouse_name" placeholder="Warehouse" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
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
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
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
      @sort-change="sortChange"
    >
      <el-table-column label="Warehouse" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.warehouse_name }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="BN" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Content">
          <el-rate v-model="temp.content" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </template>

    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { parseTime } from '/@/assets/utils/format';
import Pagination from '/@/components/Pagination.vue';
import { listInventoriesAPI } from "/@/server/api/logistic";

const store = useStore();
const { proxy } = getCurrentInstance();

const listQuery = ref({
  page: 1,
  limit: 10,
  content: undefined,
  title: undefined,
  type: undefined,
  sort: '+id'
});

const contentOptions = ref([1, 2, 3]);
const calendarTypeOptions = ref([
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]);
const sortOptions = ref([{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]);
const statusOptions = ref(['In Transit', 'Delivered', 'Deleted']);
const showReviewer = ref(false);

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
const dialogPvVisible = ref(false);
const pvData = ref([]);
const rules = ref({
  type: [{ required: true, message: 'type is required', trigger: 'change' }],
  timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
  title: [{ required: true, message: 'title is required', trigger: 'blur' }]
});
const downloadLoading = ref(false);

const temp = ref({
  id: undefined,
  content: {},
  remark: '',
  timestamp: new Date(),
  title: '',
  type: '',
  status: 'In Transit'
});

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.value.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

const getList = () => {
  listLoading.value = true;
  listInventoriesAPI(listQuery.value).then(data => {
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
  getList();
};

const handleFilter = () => {
  listQuery.value.page = 1;
  getList();
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

const resetTemp = () => {
  temp.value = {
    id: undefined,
    content: {},
    remark: '',
    timestamp: new Date(),
    title: '',
    status: 'In Transit',
    type: ''
  };
};

const handleCreate = () => {
  resetTemp();
  dialogStatus.value = 'create';
  dialogFormVisible.value = true;
  proxy.$nextTick(() => {
    proxy.$refs['dataForm'].clearValidate();
  });
};

const createData = () => {
  proxy.$refs['dataForm'].validate((valid) => {
    if (valid) {
      temp.value.id = parseInt(Math.random() * 100) + 1024; // mock a id
      temp.value.author = 'vibe';
      // createArticle(temp.value).then(() => {
      //   list.value.unshift(temp.value)
      //   dialogFormVisible.value = false
      // })
    }
  });
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
      //   const index = list.value.findIndex(v => v.id === temp.value.id)
      //   list.value.splice(index, 1, temp.value)
      //   dialogFormVisible.value = false
      //   ElMessage.success('Update Successfully', 3)
      // })
    }
  });
};

const handleDelete = (row, index) => {
  list.value.splice(index, 1);
};

const handleFetchPv = pv => {
  console.log('pv: ', pv);
  // fetchPv(pv).then(response => {
  //   pvData.value = response.data.pvData
  //   dialogPvVisible.value = true
  // })
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

getList();
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


</style>
