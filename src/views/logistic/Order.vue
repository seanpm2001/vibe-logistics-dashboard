<template>
  <div class="page">
    <div class="filter-container">
      <div class="left">
        <el-input placeholder="Order ID" style="width: 120px;" />
        <el-button disabled v-wave class="filter-item" type="primary" icon="el-icon-search">
          Search
        </el-button>
      </div>
      <div>
        <el-button type="primary" @click="assignSelected">
          Assign Selected
        </el-button>
        <el-button type="primary" @click="combineAndAssign">
          Combine & Assign Selected
        </el-button>
      </div>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="Order" width="180px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.order_id }}</span>
          </el-tag>
          <p align="left">{{row.last_modified}}</p>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" width="180px" align="center">
        <template v-slot="{row}">
          <p align="left">ATTN: Adrian Balfour envorso</p>
          <p align="left">2925 State route 247</p>
          <div align="left" class="link">{{row.email}}</div>
        </template>
      </el-table-column>
      <el-table-column label="WH Tasks & Units" width="180px" align="center">
        <template v-slot="{row}">
          task1 
          <template v-for="item in row.serials" :key="item">
            <p class="link">{{item.serial}}</p>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ statusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="300px" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetailRow(row, 'edit')">
            Assign
          </el-button>
          <el-button type="success" size="mini" @click="handleDetailRow(row, 'view')">
            Add WH Task
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

    <el-dialog :title="titleMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false">
      <div class="dialog-header">Common</div>
      <el-form ref="dataForm" :rules="rules" :model="freightForm" label-position="left" label-width="180px">
        123
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
import { computed, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import {
  queryOrdersAPI,
} from "/@/server/api/logistic";
import { statusOptions } from './enum/shipment';

const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  per_page: 10,
});

const tableKey = ref(0);
const dataList = ref(null);
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

const dialogPattern = type => dialogStatus.value === type;

const fetchList = () => {
  listLoading.value = true;
  queryOrdersAPI(listQuery.value).then(data => {
    console.log('data: ', data);
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const assignSelected = () => {
  multipleSelection.value.forEach(item => {
    console.log('item: ', item);
  });
};

const combineAndAssign = () => {
  multipleSelection.value.forEach(item => {
    console.log('item: ', item);
  });
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.id - pre.id);
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

fetchList();

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
  display: flex
  justify-content: space-between
  margin-bottom: .5rem
  .left > .el-button
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

.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
