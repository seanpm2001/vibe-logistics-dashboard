<template>
  <template
    v-for="(task, taskIdx) in dataList"
    :key="task.id"
  >
    <el-card>
      <el-descriptions
        :column="4"
        direction="vertical"
        border
      >
        <el-descriptions-item
          width="300px"
          label="Create Date"
        >
          {{ formatDate(task.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="Order ID">
          {{ orderEnum[task.orderId]?.id }}
          <template
            v-for="order in orderEnum[task.orderId]?.rawOrders"
            :key="order.id"
          >
            <el-tag size="small">
              {{ order?.id }}
            </el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="Task ID">
          {{ task.id }}
        </el-descriptions-item>
        <el-descriptions-item label="TaskType">
          {{ task.taskType }}
        </el-descriptions-item>
        <el-descriptions-item label="Carrier">
          <el-select
            v-model="task.carrier"
            placeholder="Please select"
          >
            <el-option
              v-for="(item, key) in carrierEnum"
              :key="item"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="Shipment Info">
          <OrderShipmentInfo :order-item="orderEnum[task.orderId] || {}" />
        </el-descriptions-item>
      </el-descriptions>
      <div class="package-operation">
        <el-row>
          <div class="meta-data label w-380">
            Meta Data
          </div>
          <div class="serial-label label">
            Package Serials
          </div>
          <div class="label w-200">
            Package Tracking Number
            Weight(kg) & Dimension(cm)
          </div>
          <div class="label w-180">
            Operation
          </div>
        </el-row>
        <div class="f-row">
          <div class="meta-data cell w-380">
            <template
              v-for="(product, idx) in task.products"
              :key="product.sku"
            >
              <div class="mgb-5">
                product name:
                <el-tag size="small">
                  {{ codeNameEnum[product.productCode] || product.productCode }}
                </el-tag>
              </div>
              <el-row
                style="margin-left: 16px"
              >
                sku: <el-tag size="small">
                  {{ product.sku }}
                </el-tag>
                <el-divider direction="vertical" />
                req: <el-tag size="small">
                  {{ product.quantity }}
                </el-tag>
                <el-divider direction="vertical" />
                ful: 
                <el-tag
                  v-if="product.sku"
                  size="small"
                  :type="product.quantity === calTaskFulQty('sku', task.packages)[product.sku] ? '' : 'danger'"
                >
                  {{ calTaskFulQty('sku', task.packages)[product.sku] || 0 }}
                </el-tag>
                <el-tag
                  v-else
                  size="small"
                  :type="product.quantity === calTaskFulQty('code', task.packages)[product.productCode] ? '' : 'danger'"
                >
                  {{ calTaskFulQty('code', task.packages)[product.productCode] || 0 }}
                </el-tag>
                <el-divider
                  v-if="product.serialNote?.length"
                  direction="vertical"
                />
                <el-tooltip
                  v-if="product.serialNote?.length"
                  effect="light"
                >
                  <el-button size="small">
                    Specify Serial:
                  </el-button>
                  <template #content>
                    <el-tag size="small">
                      <template
                        v-for="serial in product.serialNote"
                        :key="serial"
                      >
                        {{ serial }};
                      </template>
                    </el-tag>
                  </template>
                </el-tooltip>
              </el-row>
              <el-divider v-if="idx !== (task.products.length - 1)" />
            </template>
          </div>
          <div
            ref="taskPackageArr"
            class="f-col"
          >
            <template
              v-for="(item, packageIdx) in task.packages"
              :key="item.id"
            >
              <el-row class="package-row">
                <div class="serial-cell cell">
                  <template
                    v-for="(unit, index) in item.units"
                    :key="unit.serial"
                  >
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
                        class="w-200"
                        filterable
                        remote
                        :remote-method="(query) => debounce(remoteMethod(query, task, item, unit), 500)"
                        @focus="event => handleInputFocus(event, taskIdx, packageIdx)"
                      >
                        <el-option
                          v-for="unitOpt in unitList"
                          :key="unitOpt.serial"
                          :label="unitOpt.serial"
                          :value="unitOpt.serial"
                        />
                      </el-select>
                    </div>
                  </template>
                </div>
                <div :class="'cell w-200' + (item.trackingNumber ? '' : ' error-border-tip')">
                  <el-input
                    v-model="item.trackingNumber"
                    placeholder="Tracking Number"
                  />
                  <el-row class="dimension">
                    <el-input
                      v-model="item.weight"
                      placeholder="Weight"
                      @input="val => (item.weight = toNumber(val))"
                    />
                    <el-input
                      v-model="item.length"
                      placeholder="Length"
                      @input="val => (item.length = toNumber(val))"
                    />
                    <el-input
                      v-model="item.width"
                      placeholder="Width"
                      @input="val => (item.width = toNumber(val))"
                    />
                    <el-input
                      v-model="item.height"
                      placeholder="Height"
                      @input="val => (item.height = toNumber(val))"
                    />
                  </el-row>
                </div>
                <div class="cell w-180">
                  <el-button
                    v-if="item.id"
                    class="mgr-5"
                    type="primary"
                    :disabled="diableUpdatePackage(item, packageIdx, taskIdx)"
                    @click="handleSubmitPackage(item, task)"
                  >
                    Update
                  </el-button>
                  <el-button
                    v-else
                    :disabled="!item.trackingNumber"
                    class="mgr-5"
                    type="primary"
                    @click="handleSubmitPackage(item, task)"
                  >
                    Submit
                  </el-button>
                  <el-popconfirm
                    v-if="item?.id"
                    confirm-button-text="OK"
                    cancel-button-text="No, Thanks"
                    icon-color="red"
                    title="Are you sure to delete this?"
                    @confirm="handleDeletePackage(item?.id)"
                  >
                    <template #reference>
                      <el-button type="danger">
                        Delete
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    v-else
                    type="danger"
                    @click="onPackagesChange(null, task.packages, 'remove', packageIdx)"
                  >
                    Remove
                  </el-button>
                </div>
              </el-row>
            </template>
          </div>
        </div>
        <el-button
          :disabled="disableNewPackage(task.packages)"
          @click="onPackagesChange(task, task.packages, 'add')"
        >
          Add Package
        </el-button>
      </div>
    </el-card>
  </template>
</template>

<script lang="ts" setup>
import OrderShipmentInfo from '../components/OrderShipmentInfo.vue';
import { ElMessage } from 'element-plus';
import { debounce, toNumber } from '@/utils';
import { carrierEnum, codeNameEnum, skuCodeEnum } from '@/enums/logistic';
import { queryUnitsAPI, createPackageAPI, updatePackageAPI, deletePackageAPI } from '@/api/logistic';

const emit = defineEmits(['fetchList']);
/* Start Data */
const { proxy } = getCurrentInstance();

const dataList = inject('dataList');
const orderEnum = inject('orderEnum');
const contrastTask = inject('contrastTask');


/* End Data */

const calTaskFulQty = (type, packageArr) => {
  const temp = {};
  packageArr.forEach(packageItem => {
    packageItem.units.forEach(unit => {
      const sku = unit.item?.sku;
      if (type === 'sku')
        temp[sku] = (temp[sku] || 0) + 1;
      else 
        temp[skuCodeEnum[sku]] = (temp[skuCodeEnum[sku]] || 0) + 1;
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

const disableNewPackage = packageArr => {
  if (packageArr.length === 0 || packageArr[packageArr.length - 1]?.id)
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
      ElMessage.error('Exceed quantity limit');
      return;
    }
    unitArr.push({ serial: null });
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
        ElMessage.error('Serial can\'t be found.');
        return;
      }
      if (checkIfRepeated(packageItem, query)) {
        ElMessage.error('Repeated Serial.');
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
        for (const idx in taskProducts)
          if (item.sku === taskProducts[idx].sku || skuCodeEnum[item.sku] === taskProducts[idx].productCode)
            return true;
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
  // 删除serial为空的unit
  const units = packageItem.units;
  for (let idx = units.length - 1; idx >= 0; idx--) {
    !units[idx].serial && units[idx].splice(idx, 1);
  }

  if (packageItem.units.length === 0) {
    ElMessage.error('Empty Serials!');
    packageItem.units.push({ serial: null, status: 'DELIVERING' }); // 填充1个unit给被清空的units双向绑定数据
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
      ElMessage.error('Exceed quantity limit');
      return;
    }
    packages.push({id: null, taskId: task.id, trackingNumber: null, units: [{serial: null, status: 'DELIVERING'}]});
  }
};

const formatDate = date => date.replace('T', ' ').replace(/\.\d+/, '');

const handleDeletePackage = (packageId) => {
  packageId && deletePackageAPI(packageId).then(() => {
    emit('fetchList');
  });
};
</script>

<style lang="sass" scoped>
.package-operation
  .serial-cell, .serial-label
    width: 220px
  .w-180
    width: 180px
  .w-200
    width: 240px
  .w-380
    width: 350px
    @media (max-width: 1420px)
      width: 200px
  .el-input
    max-width: 240px
  .label, .cell
    maging: 0
    padding: 16px
    min-height: calc(74px - 32px)
    border: 1px solid rgb(235, 238, 245)
  .label
    background-color: rgb(250, 250, 250)
  .meta-data
    background-color: rgb(250, 250, 250)

.dimension
  .el-input
    width: 60px
</style>
