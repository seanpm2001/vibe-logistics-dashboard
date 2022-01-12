<template>
  <div class="page">
    <div class="filter-container">
      <el-row class="left" align="middle" :gutter="3">
        <el-input placeholder="Order ID" style="width: 120px;" />
        <el-button disabled v-wave type="primary" icon="el-icon-search">
          Search
        </el-button>
        <el-select placeholder="Assigned Order" v-model="isAssigned" style="width: 155px" @change="handleFilter">
          <el-option v-for="(item, key) in {'Assigned': true, 'Unassigned': false}" :key="item" :label="key" :value="item" />
        </el-select>
        <el-select disabled placeholder="Order From" v-model="listQuery.orderFrom" style="width: 130px" @change="handleFilter">
          <el-option v-for="item in ['AFN', 'Shopify', 'MFN']" :key="item" :label="item" :value="item" />
        </el-select>
      </el-row>
      <div v-if="!isAssigned">
        <el-button type="primary" @click="showAssignDialog('assignSelected')">
          Assign Selected
        </el-button>
        <el-button type="primary" @click="showAssignDialog('combineAndAssign')">
          Combine & Assign Selected
        </el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="unassignSelected()">
          Unassign Selected
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
      <el-table-column label="Order" width="240px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type">{{ row.id }}</span>
          </el-tag>
          <p>{{row.createdAt}}</p>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" width="300px" align="center">
        <template v-slot="{row}">
          <div class="ship" align="left">
            <el-tag size="small" v-if="row.shippingName">
              ATTN: {{row.shippingName}}
            </el-tag>
            <el-tag size="small" v-if="row.shippingCompany">{{row.shippingCompany}}</el-tag>
            <el-tag size="small" v-if="row.shippingAddress1">{{row.shippingAddress1}}</el-tag>
            <el-tag size="small" v-if="row.shippingAddress2">{{row.shippingAddress2}}</el-tag>
            
            <el-tag size="small" v-if="row.shippingCity || row.shippingState || row.shippingZip || row.shippingCountry">
              {{row.shippingCity}}, {{row.shippingState}}, {{row.shippingZip}}, {{row.shippingCountry}}
            </el-tag>
            <p style="visibility:hidden">placeholder</p>
            <el-tag size="small" v-if="row.shippingPhone">
              TEL: {{row.shippingPhone}}
            </el-tag>
            <a :href="'mailto:' + row.email" class="link" target="_blank">{{ row.email }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="WH Tasks & Units" width="210px" align="center">
        <template v-slot="{row}">
          <template v-for="(item, key) in row.items" :key="item">
            <div align="left">
              <svg-icon :icon-name="productIconMap[key]"  />
              <span class="mgl-5">{{productMap[key]}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ orderStatusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="200px" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button v-if="!isAssigned" type="primary" size="mini" @click="showAssignDialog('assign', row.id)">
            Assign & Add 1st WH Task
          </el-button>
          <el-button v-if="isAssigned" type="danger" size="mini" @click="unassignOrders(row.id)">
            unAssign
          </el-button>
          <el-button v-if="isAssigned" type="success" size="mini" @click="addWarehouseTask(row.id)">
            Add WH Task
          </el-button>
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

    <el-dialog width="32%" title="Assign Warehouse" v-model="dialogAssignVisible" :close-on-click-modal="false">
      <el-row align="middle">
        Target Warehouse: &ensp;
        <el-select v-model="targetId" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-row>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="assignOrders()">
            submit
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog width="90%" title="Common" v-model="dialogTaskVisible" :close-on-click-modal="false">
      <TaskForm
        :warehouseOptions="warehouseOptions"
        :taskForm="taskForm"
      />
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogTaskVisible = false">
            Close
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer
      v-model="drawerSerialVisible"
      title="Unit Info"
      size="50%"
      direction="ltr"
    >
      <unit-description
        :unitItem="unitItem"
      />
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/src/message-box.scss";
import Pagination from '/@/components/Pagination.vue';
import TaskForm from './components/TaskForm.vue';
import UnitDescription from './components/UnitDescription.vue';
import {
  queryOrdersAPI, queryAssignedOrdersAPI, assignOrdersAPI, unassignOrdersAPI,
  listWarehousesAPI, findUnitAPI
} from "/@/server/api/logistic";
import { parseTime } from '/@/assets/utils/format';
import { orderStatusOptions, productMap, productIconMap } from '/@/assets/enum/logistic';

const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
  orderFrom: null
});


const tableKey = ref(0);
const dataList = ref(null);
const total = ref(0);
const isAssigned = ref(null);
const listLoading = ref(true);
const dialogAssignVisible = ref(false);
const dialogTaskVisible = ref(false);
const drawerSerialVisible = ref(false);
const multipleSelection = ref([]);
const warehouseOptions = ref({});
const showAssignedTable = ref(false);
const assignPattern = ref('');
const assignOrderId = ref(null);
const targetId = ref(null);

const taskForm = ref({});
const unitItem = ref(null);

const fetchList = () => {
  listLoading.value = true;
  (isAssigned.value ?
    queryAssignedOrdersAPI(listQuery.value) : queryOrdersAPI(listQuery.value)
  ).then(data => {
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const viewItemSerial = unitId => {
  findUnitAPI(unitId).then(data => {
    unitItem.value = data;
    drawerSerialVisible.value = true;
  });
};

const showAssignDialog = (type, orderId) => {
  assignPattern.value = type;
  assignOrderId.value = orderId || null;
  dialogAssignVisible.value = true;
};

function assignSelectedOrders(targetWHId, selectedArr) {
  if (!selectedArr.length) {
    ElMessage.error('Please at least select an order!', 3);
    return;
  }
  multipleSelection.value.forEach(item => {
    assignOrdersAPI(targetWHId, [item.id]);
  });
}

const assignOrders = () => {
  const targetWHId = targetId.value;
  const selectedArr = multipleSelection.value;
  if (!targetWHId) {
    ElMessage.error('Please select a target warehouse!', 3);
    return;
  }
  const pattern = assignPattern.value; // ['assign', 'assignSelected', 'combineAndAssign']
  const orderArr = [];
  if (pattern === 'assignSelected') { // 单独处理assign多个，不展示warehouse task dialog
    assignSelectedOrders(targetWHId, selectedArr);
    dialogAssignVisible.value = false;
    return;
  } else if (pattern === 'combineAndAssign') { // 批量assign
    multipleSelection.value.forEach(item => {
      orderArr.push(item.id);
    });
  } else { // assign单个
    orderArr.push(assignOrderId.value);
  }
  // 调用assign orders API
  assignOrdersAPI(targetWHId, orderArr).then(data => {
    dialogAssignVisible.value = false;
    dialogTaskVisible.value = true;
  }).catch(() => {
    dialogAssignVisible.value = false;
    dialogTaskVisible.value = true;
  }).finally(() => {
    fetchList();
  });
};

const unassignOrders = orderId => {
  unassignOrdersAPI(orderId).then(data => {
    console.log('data: ', data);
  });
};

const unassignSelected = () => {
  multipleSelection.value.forEach(item => {
    unassignOrders(item.id);
  });
  multipleSelection.value = [];
  fetchList();
};

const addWarehouseTask = orderId => {
  dialogTaskVisible.value = true;
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.orderId > pre.orderId);
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

const init = () => {
  listWarehousesAPI().then(data => {
    fetchList(); // fetch list
    data.forEach(item => {
      warehouseOptions.value[item.id] = item.name;
    });
  });
};

onMounted(() => {
  init();
});

</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)


.filter-container
  display: flex
  justify-content: space-between
  margin-bottom: .5rem
  .left > :not(:first-child)
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

.el-form-item__content div
  width: 100%



.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
