<template>
  <div class="page">
    <div class="statistics">
      <el-date-picker v-model="dateFilter" type="date" placeholder="Please pick a date" />
      <span> before 11.30 am</span>
    </div>
    <el-divider />
    <div class="task-list">
      <template v-for="task in dataList" :key="task.id">
        <el-card>
          <el-descriptions :column="4" direction="vertical" border>
            <el-descriptions-item width="300px" label="Create Date">{{ formatDate(task.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="Task ID">{{ task.id }}</el-descriptions-item>
            <el-descriptions-item label="TaskType">{{ task.taskType }}</el-descriptions-item>
            <el-descriptions-item label="Carrier">{{ carrierEnum[task.carrier] }}</el-descriptions-item>
          </el-descriptions>
          <div class="package-operation">
            <div class="f-row">
              <div class="label w-260">serials(by shipping package)</div>
              <div class="label w-260">Tracking Number</div>
              <div class="label w-260">Operation</div>
              <div class="label w-360">Meta Data</div>
            </div>
            <div class="f-row">
              <div class="f-col">
                <template v-for="item in task.packages" :key="item.trackingNumber">
                  <div class="f-row">
                    <div class="cell w-260">
                      <template v-for="unit in item.units" :key="unit.serial">
                        <el-input v-model="unit.serial" placeholder="Serial" />
                      </template>
                    </div>
                    <div class="cell w-260">
                      <el-input v-model="item.trackingNumber" placeholder="Tracking Number" />
                    </div>
                    <div class="cell w-260">
                      <el-button class="mgr-5" type="primary">Submit</el-button>
                      <el-button  type="danger">Delete</el-button>
                    </div>
                  </div>
                </template>
              </div>
              <div class="cell w-360">
                <template v-for="product in task.products" :key="product.sku">
                  <div class="f-row col-center">
                    sku: <el-tag size="small">{{product.sku}}</el-tag>
                    <el-divider direction="vertical" />
                    req: <el-tag size="small">{{product.quantity}} </el-tag>
                    <el-divider direction="vertical" />
                    ful: <el-tag size="small">0</el-tag>
                    <el-divider direction="vertical" />
                    <el-tooltip effect="light">
                      <el-button size="small">Serial Note:</el-button>
                      <template #content>
                        <template v-for="serial in product.serialNote" :key="serial">
                          <el-tag size="small">{{ serial }}</el-tag>&nbsp;
                        </template>
                      </template>
                    </el-tooltip>
                  </div>
                </template>
              </div>
            </div>
            <el-button @click="onPackagesChange(task, 'add')">Add Package</el-button>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { queryTasksAPI } from '/@/api/logistic';
import { carrierEnum } from '/@/enums/logistic';

const dateFilter = ref('null');
const listQuery = ref({
  page: 1,
  perPage: 10,
  search: ''
});

const total = ref(0);
const dataList = shallowRef(null); 

const onPackagesChange = (task, type, idx) => {
  type === 'add'
    ? task.packages.push({id: null, trackingNumber: null, units: []})
    : task.packages.splice(idx, 1);
};

const fetchList = () => {
  queryTasksAPI(listQuery.value).then((_data) => {
    dataList.value = _data.items;
    total.value = _data.total;
  });
};

const formatDate = date => {
  return date.replace('T', ' ').replace(/\.\d+/, '');
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  // background-color: #e3e3e3
  min-height: calc(100vh - 91px - 32px)

.package-operation
  .w-260
    width: 200px
  .w-360
    width: 360px
  .el-input
    max-width: 200px
  .label, .cell
    maging: 0
    padding: 16px
    border: 1px solid rgb(235, 238, 245)
</style>
