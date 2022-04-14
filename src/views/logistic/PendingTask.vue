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
              <div class="label w-380">Meta Data</div>
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
                      <template v-for="unit in item.units" :key="unit.serial">
                        <el-select
                          v-model="unit.serial"
                          ref="unitSelect"
                          placeholder="Please select"
                          filterable
                          remote
                          :remote-method="(query) => debounce(remoteMethod(query, task.products, item, unit), 500)"
                          @blur="handleInputBlur"
                        >
                          <el-option
                            v-for="unit in unitList"
                            :key="unit.serial"
                            :label="unit.serial"
                            :value="unit.serial"
                          />
                        </el-select>
                      </template>
                    </div>
                    <div class="cell w-260">
                      <el-input v-model="item.trackingNumber" placeholder="Tracking Number" />
                    </div>
                    <div class="cell w-260">
                      <el-button v-if="item.id" class="mgr-5" type="primary" @click="handleSubmitPackage(item)">Update</el-button>
                      <el-button v-else class="mgr-5" type="primary" @click="handleSubmitPackage(item)">Submit</el-button>
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
    let totalQty = 0;
    let totalUnitQty = 0;
    task.products.forEach(product => {
      const sku = product.sku;
      temp[sku] = (temp[sku] || 0) + product.quantity;
      totalQty += product.quantity || 0;
    });
    task.packages.forEach(item => {
      const units = item.units;
      totalUnitQty += item.units.length || 0;
    });
    if (totalUnitQty < totalQty) {
      task.packages.forEach(item => {
        item.units.push({ serial: null });
      });
    }
  });
  return temp;
});

const unitList = shallowRef(null);
const remoteMethod = (query, taskProducts, packageItem, unit) => {
  if (query) {
    query = query.replace(';', '');
    queryUnitsAPI({ serial: query }).then(data => {
      if (query && data.length === 1) { // 只有一个符合，直接submit
        const packageId = packageItem.id;
        unit.serial = query;
        handleSubmitPackage(packageItem);
        return;
      }

      unitList.value = data.filter(item => {
        for (const i in taskProducts) {
          if (item.sku === taskProducts[i].sku) return true;
        }
      });
    });
  } else {
    unitList.value = [];
  }
};

const handleInputBlur = el => {
  setTimeout(() => {
    const next = el.target.parentNode.parentNode.parentNode.nextElementSibling;
    next && next?.querySelector('input').click();
  }, 500);
};

const handleSubmitPackage = packageItem => {
  const packageId = packageItem.id;
  if (packageId)
    updatePackageAPI(packageId, packageItem).finally(() => fetchList());
  else
    createPackageAPI(packageItem.taskId, packageItem).finally(() => fetchList());
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
</style>
