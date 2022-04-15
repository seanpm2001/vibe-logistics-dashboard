<template>
  <div class="page">
    <div class="statistics">
      <el-date-picker
        v-model="dateFilter" :shortcuts="shortcuts"
        type="daterange" value-format="YYYY-MM-DD" placeholder="Please pick a date"
      />
      <span> before 11.30 am</span>
      <el-descriptions :column="3" border>
        <template v-for="(item, key) in skuQTY" :key="key">
          <el-descriptions-item label="SKU">{{ key }}</el-descriptions-item>
          <el-descriptions-item label="Req QTY">{{ item.req }}</el-descriptions-item>
          <el-descriptions-item
            label="Fulfilled QTY" :class-name="item.req === item.ful ? '' : 'error-border-tip'"
          >
            {{ item.ful || 0 }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
    <el-divider />
    <div class="task-list">
      <template v-for="(task, taskIdx) in dataList" :key="task.id">
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
              <div class="serial-label label">serials(by shipping package)</div>
              <div class="label w-200">Tracking Number</div>
              <div class="label w-200">Operation</div>
            </el-row>
            <div class="f-row">
              <div class="meta-data cell w-380">
                <template v-for="product in task.products" :key="product.sku">
                  <el-row align="middle">
                    sku: <el-tag size="small">{{ product.sku }}</el-tag>
                    <el-divider direction="vertical" />
                    req: <el-tag size="small">{{ product.quantity }} </el-tag>
                    <el-divider direction="vertical" />
                    ful: 
                    <el-tag
                      size="small"
                      :type="product.quantity === calTaskFulQTy(task.packages)[product.sku] ? '' : 'danger'"
                    >
                      {{ calTaskFulQTy(task.packages)[product.sku] || 0 }}
                    </el-tag>
                    <el-divider v-if="product.serialNote.length" direction="vertical" />
                    <el-tooltip v-if="product.serialNote.length" effect="light">
                      <el-button size="small">Specify Serial:</el-button>
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
              <div ref="taskPackageArr" class="f-col">
                <template v-for="(item, packageIdx) in task.packages" :key="item.id">
                  <el-row class="package-row">
                    <div class="serial-cell cell">
                      <template v-for="(unit, index) in item.units" :key="unit.serial">
                        <div class="f-row col-center">
                          <svg-icon
                            class="icon mgr-5"
                            icon-name="add"
                            @click="handleUnitChange(item.units, index, 'add', task)"
                          />
                          <svg-icon
                            class="icon mgr-5"
                            :style="item.units.length <= 1 ? 'visibility: hidden;' : ''"
                            icon-name="minus"
                            @click="handleUnitChange(item.units, index, 'remove', task)"
                          />
                          <el-select
                            v-model="unit.serial"
                            placeholder="Please select"
                            filterable
                            remote
                            :remote-method="(query) => debounce(remoteMethod(query, task, item, unit), 500)"
                            @focus="event => handleInputFocus(event, taskIdx, packageIdx)"
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
                    <div :class="'cell w-200' + (item.trackingNumber ? '' : ' error-border-tip')">
                      <el-input v-model="item.trackingNumber" placeholder="Tracking Number" />
                    </div>
                    <div class="cell w-200">
                      <el-button
                        v-if="item.id" class="mgr-5" type="primary" @click="handleSubmitPackage(item, task)"
                        :disabled="diableUpdatePackage(item, packageIdx, taskIdx)"
                      >
                        Update
                      </el-button>
                      <el-button
                        v-else :disabled="!item.trackingNumber"
                        class="mgr-5" type="primary" @click="handleSubmitPackage(item, task)"
                      >
                        Submit
                      </el-button>
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
                      <el-button v-else type="danger" @click="onPackagesChange(null, task.packages, 'remove', packageIdx)">Remove</el-button>
                    </div>
                  </el-row>
                </template>
              </div>
            </div>
            <el-button :disabled="disableNewPackage(task.packages)" @click="onPackagesChange(task, task.packages, 'add')">Add Package</el-button>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { debounce, parseTime } from '/@/utils';
import { queryTasksAPI, queryUnitsAPI, createPackageAPI, updatePackageAPI, deletePackageAPI } from '/@/api/logistic';
import { carrierEnum } from '/@/enums/logistic';
import { useUserStore, useLogisticStore } from '/@/stores';

// const { role } = storeToRefs(useUserStore());
const logisticStore = useLogisticStore();
const { proxy } = getCurrentInstance();

const dateFilter = ref(null);
const listQuery = ref({
  page: 1,
  perPage: 10,
  start: null,
  end: null
});

const contrastTask = ref(null);
const fetchList = () => {
  if (listQuery.value.end) {
    const params = new URLSearchParams(listQuery.value);
    params.append('task_type', 'FULFILLMENT');
    params.append('task_type', 'REPLACE');
    queryTasksAPI(params).then((data) => {
      dataList.value = data.items;
      total.value = data.total;
      contrastTask.value = JSON.parse(JSON.stringify(dataList.value));
    });
  }
};

watchEffect(() => {
  if (dateFilter.value) {
    listQuery.value.start = dateFilter.value[0] + 'T11:30:00';
    listQuery.value.end = dateFilter.value[1] + 'T11:30:00';
    fetchList();
  }
});

const total = ref(0);
const dataList = ref(null);

const shortcuts = [
  {
    text: 'Today',
    value: () => ['2022-04-01', new Date()],
  },
  {
    text: 'Tomorrow',
    value: () => ['2022-04-01', new Date().getTime() + 86400 * 1000],
  },
];

const skuQTY = computed(() => { // SKU Quantity Statistics
  const temp = {};
  dataList.value?.forEach(task => {
    task.products.forEach(product => {
      const sku = product.sku;
      temp[sku] = temp[sku] || {};
      temp[sku]['req'] = (temp[sku]['req'] || 0) + product.quantity;
    });
    task.packages.forEach(packageItem => {
      packageItem.units.forEach(unit => {
        const sku = unit.item?.sku;
        if (sku) {
          temp[sku] = temp[sku] || {};
          temp[sku]['ful'] = (temp[sku]['ful'] || 0) + 1;
        }
      });
    });
  });
  return temp;
});

const calTaskFulQTy = (packageArr) => {
  const temp = {};
  packageArr.forEach(packageItem => {
    packageItem.units.forEach(unit => {
      const sku = unit.item?.sku;
      if (sku) {
        temp[sku] = (temp[sku] || 0) + 1;
      }
    });
  });
  return temp;
};

function compareIfEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
const diableUpdatePackage = (packageItem, packageIdx, taskIdx) => {
  if (!packageItem.trackingNumber || compareIfEqual(packageItem, contrastTask.value[taskIdx].packages[packageIdx]))
    return true;
  return false;
};

const disableNewPackage = packages => {
  if (packages.length === 0 || packages[packages.length - 1]?.id)
    return false;
  return true;
};

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
  if (type === 'remove')
    unitArr.splice(idx, 1);
  else {
    if (!checkAddAble(task)) {
      ElMessage.error('Exceed quantity limit', 3);
      return;
    }
    unitArr.push({ serial: null, status: 'DELIVERING' });
  }
};

function checkIfRepeated (packageItem, query) {
  let repeated = false;
  packageItem.units.forEach(unit => {
    unit.serial === query && (repeated = true);
  });
  return repeated;
}

const unitList = shallowRef(null);
const remoteMethod = (query, task, packageItem, unit) => {
  if (query) {
    query = query.replace(';', '');
    queryUnitsAPI({ serial: query }).then(data => {
      if (data.length === 0) {
        ElMessage.error('Serial can\'t be found.', 3);
        return;
      }
      if (checkIfRepeated(packageItem, query)) {
        ElMessage.error('Repeated Serial.', 3);
        return;
      }
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

let focusStorage = null;
const handleInputFocus = (el, taskIdx, packageIdx) => {
  focusStorage = { taskIdx, packageIdx };
};

function clickNextUnitInput () {
  const { taskIdx, packageIdx } = focusStorage;
  proxy.$nextTick(() => {
    const serialCell = proxy.$refs['taskPackageArr'][taskIdx].querySelectorAll('.package-row')[packageIdx].querySelector('.serial-cell');
    setTimeout(() => {
      const lastUnitInput = serialCell.lastElementChild.querySelector('.el-input__inner');
      lastUnitInput.click();
    }, 500);
  });
}

function removeUnitItem (packageItem) {
  const temp = JSON.parse(JSON.stringify(packageItem));
  temp.units.forEach((unit, idx, arr) => {
    delete arr[idx]['item'];
  });
  return temp;
}

const handleSubmitPackage = (packageItem, task) => {
  const packageId = packageItem.id;
  packageItem.units.forEach((unit, idx, arr) => { // 删除serial为空的unit
    !unit.serial && arr.splice(idx, 1);
  });
  if (packageItem.units.length === 0) {
    ElMessage.error('Empty Serials!', 3);
    packageItem.units.push({ serial: null }); // 填充1个unit给被清空的units双向绑定数据
    return;
  }
  const packageData = removeUnitItem(packageItem);
  if (packageId)
    updatePackageAPI(packageId, packageData)
      .then(data => Object.assign(packageItem, data))
      .finally(() => {
        handleUnitChange(packageItem.units, null, 'add', task);
        clickNextUnitInput();
      });
  else
    createPackageAPI(packageItem.taskId, packageData)
      .then(data => Object.assign(packageItem, data))
      .finally(() => {
        handleUnitChange(packageItem.units, null, 'add', task);
        clickNextUnitInput();
      });
  unitList.value = [];
};

function removeEmptyUnit (packageItem) {
  packageItem && packageItem.units.forEach((unit, idx, arr) => {
    if (!unit.serial)
      arr.splice(idx--, 1);
  });
}

const onPackagesChange = (task, packages, type, idx) => {
  if (type === 'remove')
    packages.splice(idx, 1);
  else {
    removeEmptyUnit(packages[packages.length - 1]);
    if (!checkAddAble(task)) {
      ElMessage.error('Exceed quantity limit', 3);
      return;
    }
    packages.push({id: null, taskId: task.id, trackingNumber: null, units: [{serial: null}]});
  }
};

const formatDate = date => date.replace('T', ' ').replace(/\.\d+/, '');

const handleDeletePackage = (packageId) => {
  packageId && deletePackageAPI(packageId).then(() => {
    fetchList();
  });
};

function initDateFilter () {
  dateFilter.value = ['2022-04-01', parseTime(new Date(), '{y}-{m}-{d}')];
}

onMounted(() => {
  initDateFilter();
  fetchList();
});

</script>

<style lang="sass" scoped>
.page
  padding: 16px
  min-height: calc(100vh - 91px - 32px)

.statistics
  .el-descriptions
    width: 420px

.package-operation
  .serial-cell, .serial-label
    width: 220px
  .w-200
    width: 200px
  .w-380
    width: 380px
    @media (max-width: 1420px)
      width: 200px
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
:deep(.error-border-tip)
  border: 2px solid red !important
</style>
