<template>
  <div class="page">
    <div class="statistics">
      <el-date-picker v-model="dateFilter" type="date" :shortcuts="shortcuts" placeholder="Please pick a date" />
      <span> before 11.30 am</span>
      <el-descriptions :column="2" border>
        <template v-for="(item, key) in skuQTY" :key="key">
          <el-descriptions-item label="SKU">{{ key }}</el-descriptions-item>
          <el-descriptions-item label="Req QTY">{{ item }}</el-descriptions-item>
          <!-- <el-descriptions-item label="Fulfilled QTY">0</el-descriptions-item> -->
        </template>
      </el-descriptions>
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
            <el-row>
              <div class="meta-data label w-380">Meta Data</div>
              <div class="label w-260">serials(by shipping package)</div>
              <div class="label w-260">Tracking Number</div>
              <div class="label w-260">Operation</div>
            </el-row>
            <div class="f-row">
              <div class="meta-data cell w-380">
                <template v-for="product in task.products" :key="product.sku">
                  <el-row align="middle">
                    sku: <el-tag size="small">{{product.sku}}</el-tag>
                    <el-divider direction="vertical" />
                    req: <el-tag size="small">{{product.quantity}} </el-tag>
                    <el-divider direction="vertical" />
                    ful: <el-tag size="small">0</el-tag>
                    <el-divider v-if="product.serialNote.length" direction="vertical" />
                    <el-tooltip v-if="product.serialNote.length" effect="light">
                      <el-button size="small">Serial Note:</el-button>
                      <template #content>
                        <el-tag size="small">
                          <template v-for="serial in product.serialNote" :key="serial">
                            {{ serial }};
                          </template>
                        </el-tag>
                      </template>
                    </el-tooltip>
                  </el-row>
                </template>
              </div>
              <div class="f-col">
                <template v-for="(item, idx) in task.packages" :key="item.trackingNumber">
                  <el-row>
                    <div class="cell w-260">
                      <template v-for="(unit, index) in item.units" :key="unit.serial">
                        <div class="f-row col-center">
                          <svg-icon
                            class="icon"
                            icon-name="add"
                            @click="handleUnitChange(item.units, index, 'add', task)"
                          />
                          <svg-icon
                            class="icon"
                            :style="item.units.length <= 1 ? 'visibility: hidden;' : ''"
                            icon-name="minus"
                            @click="handleUnitChange(item.units, index, 'minus', task)"
                          />
                          <el-select
                            v-model="unit.serial"
                            ref="unitSelect"
                            placeholder="Please select"
                            filterable
                            remote
                            :remote-method="(query) => debounce(remoteMethod(query, task, item, unit), 500)"
                            @blur="handleInputBlur"
                          >
                            <el-option
                              v-for="unit in unitList"
                              :key="unit.serial"
                              :label="unit.serial"
                              :value="unit.serial"
                            />
                          </el-select>
                        </div>
                      </template>
                    </div>
                    <div class="cell w-260">
                      <el-input v-model="item.trackingNumber" placeholder="Tracking Number" />
                    </div>
                    <div class="cell w-260">
                      <el-button v-if="item.id" class="mgr-5" type="primary" @click="handleSubmitPackage(item, task)">Update</el-button>
                      <el-button v-else class="mgr-5" type="primary" @click="handleSubmitPackage(item, task)">Submit</el-button>
                      <el-popconfirm
                          v-if="item?.id"
                          @confirm="handleDeletePackage(item?.id)"
                          confirm-button-text="OK"
                          cancel-button-text="No, Thanks"
                          icon-color="red"
                          title="Are you sure to delete this?"
                        >
                          <template #reference>
                            <el-button type="danger">Delete</el-button>
                          </template>
                      </el-popconfirm>
                      <el-button v-else type="danger" @click="onPackagesChange(null, task.packages, 'remove', idx)">Remove</el-button>
                    </div>
                  </el-row>
                </template>
              </div>
            </div>
            <el-button @click="onPackagesChange(task.id, task.packages, 'add')">Add Package</el-button>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { debounce } from '/@/utils';
import { queryTasksAPI, queryUnitsAPI, createPackageAPI, updatePackageAPI, deletePackageAPI } from '/@/api/logistic';
import { carrierEnum } from '/@/enums/logistic';
import { useUserStore, useLogisticStore } from '/@/stores';

// const { role } = storeToRefs(useUserStore());
const logisticStore = useLogisticStore();
const { proxy } = getCurrentInstance();

const dateFilter = ref('null');
const listQuery = ref({
  page: 1,
  perPage: 10,
  search: ''
});

const total = ref(0);
const dataList = ref(null);

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Tomorrow',
    value: () => new Date(new Date().getTime() + 86400 * 1000),
  },
];

const skuQTY = computed(() => { // SKU Quantity Statistics
  const temp = {};
  dataList.value?.forEach(task => {
    task.products.forEach(product => {
      const sku = product.sku;
      temp[sku] = (temp[sku] || 0) + product.quantity;
    });  });
  return temp;
});

function checkAddAble (task) {
  let productQty = 0; // Lisa指定的总数
  let unitQty = 0; // package中已有unit的总数
  task.products.forEach(product => {
    productQty += product.quantity || 0;
  });
  task.packages.forEach(packageItem => {
    unitQty += packageItem.units?.length || 0;
  });
  return unitQty < productQty;
}

const handleUnitChange = (unitArr, idx, type, task) => {
  if (!checkAddAble(task)) {
    ElMessage.error('Exceed quantity limit', 3);
    return;
  }
  type === 'add'
    ? unitArr.push({ serial: null, status: 'DELIVERING' })
    : unitArr.splice(idx, 1);
};

const unitList = shallowRef(null);
const remoteMethod = (query, task, packageItem, unit) => {
  if (query) {
    query = query.replace(';', '');
    queryUnitsAPI({ serial: query }).then(data => {
      if (query && data.length === 1) { // 只有一个符合，直接submit
        const packageId = packageItem.id;
        unit.serial = query;
        handleSubmitPackage(packageItem, task);
        return;
      }

      const taskProducts = task.products;
      unitList.value = data.filter(item => {
        for (const i in taskProducts)
          if (item.sku === taskProducts[i].sku) return true;
      });
    });
  } else {
    unitList.value = [];
  }
};

let curUnitInput = null;
const handleInputBlur = el => {
  curUnitInput = el.target.parentNode.parentNode.parentNode.parentNode;
  unitList.value = [];
  clickNextUnitInput();
};

function clickNextUnitInput () {
  setTimeout(() => {
    const nextUnitInput = curUnitInput.nextElementSibling;
    nextUnitInput && nextUnitInput?.querySelector('input').click();
  }, 1000);
}
const handleSubmitPackage = (packageItem, task) => {
  const packageId = packageItem.id;
  packageItem.units.forEach((unit, idx, arr) => { // 删除serial为空的unit
    !unit.serial && arr.splice(idx, 1);
  });
  if (packageId)
    updatePackageAPI(packageId, packageItem)
      .then(data => Object.assign(packageItem, data))
      .finally(() => {
        handleUnitChange(packageItem.units, null, 'add', task);
        // clickNextUnitInput();
      });
  else
    createPackageAPI(packageItem.taskId, packageItem)
      .then(data => Object.assign(packageItem, data))
      .finally(() => {
        handleUnitChange(packageItem.units, null, 'add', task);
        // clickNextUnitInput();
      });
};

const onPackagesChange = (taskId, packages, type, idx) => {
  type === 'add'
    ? packages.push({id: null, taskId, trackingNumber: null, units: [{serial: null}]})
    : packages.splice(idx, 1);
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

const handleDeletePackage = (packageId) => {
  packageId && deletePackageAPI(packageId).then(() => {
    fetchList();
  });
};

onMounted(() => {
  fetchList();
});

</script>

<style lang="sass" scoped>
.page
  padding: 16px
  min-height: calc(100vh - 91px - 32px)

.statistics
  .el-descriptions
    width: 300px

.package-operation
  .w-260
    width: 200px
  .w-380
    width: 380px
  .el-input
    max-width: 200px
  .label, .cell
    maging: 0
    padding: 16px
    min-height: calc(74px - 32px)
    border: 1px solid rgb(235, 238, 245)
  .label
    background-color: rgb(250, 250, 250)
  .meta-data
    background-color: rgb(250, 250, 250)
</style>
