<template>
  <div class="page">
    <div class="filter-container">
      <el-row class="left" align="middle" :gutter="3">
        <el-input v-model="listQuery.search" placeholder="Order Info" style="width: 120px;" />
        <el-button @click="handleFilter" v-wave type="primary" icon="el-icon-search">
          Search
        </el-button>
        <el-select :disabled="listLoading" placeholder="Assigned Order" v-model="isAssigned" style="width: 155px" @change="handleFilter">
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
      <el-table-column class-name="order-info" label="Order" width="240px" align="center">
        <template v-slot="{row}">
          <el-tag @click="showOrderDrawer(row)">
            #<span class="link-type">{{ row.id }}</span>
          </el-tag>
          <div v-if="row.rawOrders">
            <template v-for="item in row.rawOrders" :key="item.id">
              <el-tag @click="showOrderDrawer(item)">#{{ item.id }}</el-tag>
              <br>
            </template>
          </div>
          <p>{{row.createdAt}}</p>
        </template>
      </el-table-column>
      <el-table-column label="Shipment Info" width="300px" align="center">
        <template v-slot="{row}">
          <div class="shipment-info" align="left">
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
            <br>
            <a :href="'mailto:' + row.email" class="link" target="_blank">{{ row.email }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="WH Tasks & Units" width="240px" align="center">
        <template v-slot="{row}">
          <template v-if="isAssigned">
            <template v-for="(item, key) in row.products" :key="key">
              <div align="left">
                <svg-icon :icon-name="productIconMap[key] || 'other'"  />
                <span class="mgl-5">{{productMap[key] || key}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
              </div>
            </template>
          </template>
          <template v-else>
            <template v-for="item in row.items" :key="item.productCode">
              <div align="left">
                <svg-icon :icon-name="productIconMap[item.productCode] || 'other'"  />
                <span class="mgl-5">{{productMap[item.productCode] || item.productCode}}:<el-tag class="mgl-5" size="small">{{ item.quantity }}</el-tag></span>
              </div>
            </template>
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
        <el-button type="primary" @click="assignOrders()">
          submit
        </el-button>
      </template>
    </el-dialog>
    <el-dialog width="90%" title="Common" v-model="dialogTaskVisible" :close-on-click-modal="false">
      <TaskForm
        :warehouseOptions="warehouseOptions"
        :taskForm="taskForm"
        :dialogStatus="dialogStatus"
      />
      <template v-slot:footer>
        <el-button @click="dialogTaskVisible = false">
          Close
        </el-button>
      </template>
    </el-dialog>

    <el-drawer
      v-model="drawerOrderVisible"
      title="Order Info"
      size="60%"
      direction="ltr"
    >
      <OrderDescription
        :orderItem="orderItem"
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
import OrderDescription from './components/OrderDescription.vue';
import {
  queryOrdersAPI, queryAssignedOrdersAPI, assignOrdersAPI, unassignOrdersAPI, findUnitAPI
} from "/@/server/api/logistic";
import { parseTime } from '/@/assets/utils/format';
import { orderStatusOptions, productMap, productIconMap } from '/@/assets/enum/logistic';

const store = useStore();
const warehouseOptions = computed(() => store.getters.warehouseOptions);

const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
  search: null,
  orderFrom: null
});

const tableKey = ref(0);
const dataList = ref(null);
const total = ref(0);
const listLoading = ref(true);
const dialogAssignVisible = ref(false);
const dialogTaskVisible = ref(false);
const drawerOrderVisible = ref(false);

const isAssigned = ref(null);
const assignPattern = ref('');
const assignOrderId = ref(null);
const targetId = ref(null);
const dialogStatus = ref(null);

const multipleSelection = ref([]);
const orderItem = ref(null);
const taskForm = ref({
  id: null,
  orderId: null,
  sourceId: null,
  targetId: null,
  type: null,
  status: null,
});
const contrastData = ref(null);

// 合并products array为一个{productCode: totalQuantity}的对象
const combineSameProductQuantity = (arr => {
  const result = {};
  const productArr = [];
  arr.forEach(item => {
    const code = item.productCode;
    result[code] = (result[code] + item.quantity) || item.quantity;
  });
  return result;
});

const formatAssignedOrderItem = orderItem => {
  const raws = orderItem.rawOrders;
  const originId = orderItem.id;
  let productsArr = [];
  raws.forEach(item => {
    productsArr = productsArr.concat(item.items); // products array [{product_code: 'ABC', quantity: 1}]
  });
  orderItem = Object.assign(orderItem, raws[0]);
  orderItem.id = originId;
  orderItem.products = combineSameProductQuantity(productsArr); // {productCode: totalQuantity}
};

const fetchList = () => {
  listLoading.value = true;
  (isAssigned.value ?
    queryAssignedOrdersAPI(listQuery.value) : queryOrdersAPI(listQuery.value)
  ).then(data => {
    dataList.value = data.items;
    if (isAssigned.value) {
      dataList.value.forEach(item => {
        formatAssignedOrderItem(item);
      });
    }
    total.value = data.total;
    listLoading.value = false;
  });
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const showOrderDrawer = orderRaw => {
  console.log('raw: ', orderRaw);
  orderItem.value = orderRaw;
  drawerOrderVisible.value = true;
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
    console.log('data: ', data);
    dialogAssignVisible.value = false;
    addWarehouseTask(data.id);
  }).finally(() => {
    dialogAssignVisible.value = false;
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
  taskForm.value.orderId = orderId;
  taskForm.value.type = 'FULFILLMENT';
  dialogTaskVisible.value = true;
};

const handleSelectionChange = selectedArr => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.orderId > pre.orderId);
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

.order-info
  .el-tag
    margin-right: 50%
    cursor: pointer

.shipment-info
  .el-tag
    margin-right: 50%

.el-form-item__content div
  width: 100%

.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
