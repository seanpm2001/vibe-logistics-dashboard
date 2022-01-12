<template>
  <div class="page">
    <div class="filter-container">
      <el-button v-wave class="filter-item" type="primary" icon="el-icon-search">
        Search
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
    >
      <el-table-column type="selection" width="50" height="40" align="center" />
      <el-table-column label="ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            #<span class="link-type" @click="handleDetailRow(row, 'view')">{{ row.id }}-S1</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Order ID" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>#<span class="link-type">{{ row.id }}</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Source" width="110px" align="center">
        <template v-slot="{row}">
          {{ warehouseOptions[row.sourceId] }}
        </template>
      </el-table-column>
      <el-table-column label="Target" width="110px" align="center">
        <template v-slot="{row}">
          {{ warehouseOptions[row.targetId] }}
        </template>
      </el-table-column>
      <el-table-column label="WT Type" width="110px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ whTypeOptions[row.warehouseTaskType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Modified" width="130px" align="center">
        <template v-slot="{row}">
          {{ row.lastModified?.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120px" align="center">
        <template v-slot="{row}">
          <el-tag>
            {{ orderStatusOptions[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="product-column" label="Content" width="200px">
        <template v-slot="{row}">
          <template v-for="(item, key) in row.content" :key="item">
            <div>
              <svg-icon :icon-name="productIconMap[key]"  />
              <span class="mgl-5">{{productMap[key]}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" min-width="200px" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="success" size="mini" @click="handleDetailRow(row, 'view')">
            See Unit Serials
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

    <el-dialog title="Shipment Package" v-model="dialogTableVisible" :close-on-click-modal="false">
      <ShipPackage
        :packageList="packageList"
        @fetchList="fetchList"
      />
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">
            Close
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, getCurrentInstance, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from '/@/components/Pagination.vue';
import { queryTasksAPI, listWarehousesAPI } from "/@/server/api/logistic";
import { orderStatusOptions, whTypeOptions, productMap, productIconMap } from '/@/assets/enum/logistic';


const store = useStore();
const { proxy } = getCurrentInstance();
const listQuery = ref({
  page: 1,
  perPage: 10,
});

const tableKey = ref(0);
const dataList = ref(null);
const packageList = ref([]);
const total = ref(0);
const listLoading = ref(true);
const dialogStatus = ref('');
const multipleSelection = ref([]);
const downloadLoading = ref(false);

const warehouseOptions = ref([]);

const fetchList = () => {
  listLoading.value = true;
  queryTasksAPI(listQuery.value).then(data => {
    dataList.value = data.items;
    total.value = data.total;
    listLoading.value = false;
  });
};

const handlePagination = config => {
  listQuery.value = Object.assign(listQuery.value, config);
  fetchList();
};

const handleCloseDrawer = done => {
  done();
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

.dialog-header
  margin-left: 1rem
  margin-bottom: 1rem
  font-size: 18px
  font-weight: 500

.filter-container
  margin-bottom: .5rem
  > .el-button
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


</style>
