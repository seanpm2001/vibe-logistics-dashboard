<template>
  <el-card
    :class="tasksProductFulQty[task.id].error ? 'error-border-tip' : ''"
  >
    <CardDescriptions
      :task="task"
      :order-enum="orderEnum"
      :warehouse-enum="warehouseEnum"
      :role="role"
      @fetch-list="fetchList"
    />
    <div class="package-wrapper">
      <div class="col1 meta-data label w-380">
        Meta Data
      </div>
      <div class="col2 serial-label label">
        Package Serials
      </div>
      <div class="col3 label w-340">
        Package Tracking Number &
        Weight & Dimension & Unit System
      </div>
      <div class="col4 label w-180">
        Operation
      </div>

      <MetaData
        :task="task"
        :task-idx="taskIdx"
      />

      <div
        ref="taskPackageArr"
        class="col2 package-info"
      >
        <template
          v-for="(item, packageIdx) in task.packages"
          :key="item.id"
        >
          <div class="col2 serial-cell cell">
            <template
              v-for="(unit, index) in item.units"
              :key="unit.serial"
            >
              <div class="f-row col-center">
                <svg-icon
                  class="icon mgr-5"
                  icon-name="add"
                  @click="handleUnitChange(item, packageIdx, index, 'add', task, taskIdx, true)"
                />
                <el-select
                  v-model="unit.serial"
                  placeholder="Please select"
                  :class="'w-200' + (unit.hasError ? ' error-border-tip' : '')"
                  filterable
                  remote
                  :remote-method="(query) => debounce(remoteSerialMethod(query, task, item, taskIdx, packageIdx, unit), 500)"
                  @change="remoteSerialMethod(unit.serial, task, item, taskIdx, packageIdx, unit)"
                  @focus="event => handleInputFocus(event, taskIdx, packageIdx)"
                >
                  <el-option
                    v-for="unitOpt in unitList"
                    :key="unitOpt.serial"
                    :label="unitOpt.serial"
                    :value="unitOpt.serial"
                  />
                </el-select>
                <svg-icon
                  class="icon mgl-5"
                  :style="item.units.length <= 1 ? 'visibility: hidden;' : ''"
                  icon-name="minus"
                  @click="handleUnitChange(item, packageIdx, index, 'remove', task, taskIdx, true)"
                />
              </div>
            </template>
            <template
              v-for="accessory in item.accessories"
              :key="accessory.productCode"
            >
              <div
                v-if="!accessoryAllocationVisible || accessory.productCode != accessoryAllocation.productCode"
                class="f-row col-center"
                style="margin-top: 10px"
              >
                <el-tag size="small">
                  {{ codeNameEnum[accessory.productCode] || accessory.productCode }}
                </el-tag>
                <el-divider direction="vertical" />
                ful:
                <el-tag size="small">
                  {{ accessory.quantity }}
                </el-tag>
              </div>
            </template>
            <el-row
              v-if="accessoryAllocationVisible"
              :style="'margin-top: 10px;'"
            >
              <el-tag size="small">
                {{ codeNameEnum[accessoryAllocation.productCode] }}
              </el-tag>
              <el-select
                v-model="accessoryAllocation.quantities[packageIdx]"
                placeholder="Quantity"
                default-first-option
              >
                <el-option
                  v-for="(v, index) in ((accessoryAllocation.reqQuantity || 0) + 1)"
                  :key="index"
                  :label="index"
                  :value="index"
                />
              </el-select>
            </el-row>
            <div
              v-if="item.scannedSerials"
              class="mgt-10"
            >
              <el-tooltip
                effect="light"
              >
                <el-tag type="danger">
                  Mismatched Scanned Serials
                </el-tag>
                <template #content>
                  <template
                    v-for="(serial, idx) in item.scannedSerials.split(';')"
                    :key="idx"
                  >
                    <el-tag
                      type="danger"
                      closable
                      @close="removeScannedSerial(item, idx)"
                    >
                      {{ serial }}
                    </el-tag>
                  </template>
                </template>
              </el-tooltip>
            </div>
          </div>
          <div class="col3 cell w-340">
            <el-input
              v-model="item.trackingNumber"
              placeholder="Tracking Number"
              @input="(trackingNumber) => debounce(inputTrackingNumber(trackingNumber, item, task, packageIdx, taskIdx), 200)"
            />
            <PackageSize
              :task-idx="taskIdx"
              :package-idx="packageIdx"
              :unit-system-enum="unitSystemEnum"
            />
          </div>
          <div class="col4 cell w-180">
            <el-button
              v-if="item.id"
              class="mgr-5"
              type="primary"
              :disabled="disableUpdatePackage(item, packageIdx, taskIdx)"
              @click="handleSubmitPackage(item, task, packageIdx, taskIdx)"
            >
              Update
            </el-button>
            <el-button
              v-else
              :disabled="disableSubmitPackage(item, task)"
              class="mgr-5"
              type="primary"
              @click="handleSubmitPackage(item, task, packageIdx, taskIdx)"
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
                <el-button
                  :disabled="accessoryAllocationVisible"
                  type="danger"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
              v-else
              :disabled="accessoryAllocationVisible"
              type="danger"
              @click="onPackagesChange(null, task.packages, 'remove', packageIdx)"
            >
              Remove
            </el-button>
          </div>
        </template>
      </div>
    </div>
    <el-button
      :disabled="disableNewPackage(task.packages)"
      @click="onPackagesChange(task, task.packages, 'add')"
    >
      Add Package
    </el-button>
  </el-card>
</template>

<script lang="ts" setup>
import CardDescriptions from './CardDescriptions.vue';
import MetaData from './MetaData.vue';
import PackageSize from './PackageSize.vue';
import { ElMessage } from 'element-plus';
import { debounce, toNumber, getWarehouseUnitSystem, jsonClone } from '@/utils';
import { codeNameEnum, skuCodeEnum, unitSystemEnum, noSerialArr, packageErrorEnum, transportEnum } from '@/enums/logistic';
import { queryUnitsAPI, createPackageAPI, updatePackageAPI, deletePackageAPI } from '@/api';


const props = defineProps({
  task: {
    type: Object,
    default: () => {}
  },
  taskIdx: {
    type: Number,
    required: true
  },
  orderEnum: {
    type: Object,
    default: () => {}
  },
  warehouseEnum: {
    type: Object,
    default: () => {}
  },
  role: {
    type: String,
    required: true
  }
});

// const dataList = inject('dataList') as any;
const fetchList = inject('fetchList') as any;

/* Start Data */
const { proxy } = getCurrentInstance();

const savedTasks = inject('savedTasks');
const fulSerials = inject('fulSerials');
const specifiedSerials = inject('specifiedSerials');
const tasksProductFulQty = inject('tasksProductFulQty');


const accessoryAllocation = ref({
  taskIdx: null,
  productCode: null,
  reqQuantity: null,
  quantities: null
});

const accessoryAllocationVisible = ref(false);

provide('accessoryAllocationVisible', accessoryAllocationVisible);
provide('accessoryAllocation', accessoryAllocation);
/* End Data */

const inputTrackingNumber = (val, packageItem, task, packageIdx, taskIdx) => {
  if (val.endsWith(';')) {
    packageItem.trackingNumber = val.slice(0, -1);
    handleSubmitPackage(packageItem, task, packageIdx, taskIdx);
  }
};

const disableEditOutboundTask = computed(() => {
  return props.warehouseEnum[props.task.sourceId] === 'Lightning';
});

const currentTaskSpecifiedSerials = computed(() => {
  let serials = [];
  props.task.products?.forEach(product => {
    serials = serials.concat(product.serialNote);
  });
  serials = serials.concat(serials);

  return serials;
});

const allocateAccessory = (product) => {
  const quantities = props.task.packages.map((packageItem) => {
    const temp = packageItem.accessories?.find((accessory) => accessory.productCode === product.productCode);
    if (temp)
      return temp.quantity;
    else
      return 0;
  });
  accessoryAllocation.value = Object.assign({}, {
    taskIdx: props.taskIdx,
    productCode: product.productCode,
    reqQuantity: product.req,
    quantities: quantities
  });
  accessoryAllocationVisible.value = true;
};

const onAccessoryAllocationChange = (taskIdx) => {
  accessoryAllocationVisible.value = false;
  const productCode = accessoryAllocation.value.productCode;
  props.task.packages.forEach((packageItem, packageIdx) => {
    const accessory = packageItem.accessories.find((accessory) => accessory.productCode === productCode);
    if (accessory) {
      accessory.quantity = accessoryAllocation.value.quantities[packageIdx];
    } else {
      packageItem.accessories.push({
        productCode: productCode,
        quantity: accessoryAllocation.value.quantities[packageIdx],
        status: 'DELIVERING'
      });
    }
    packageItem.accessories = packageItem.accessories.filter((accessory) => accessory.quantity > 0);
    if (checkPackageChanged(packageItem, packageIdx, accessoryAllocation.value.taskIdx)) {
      handleSubmitPackage(packageItem, props.task, packageIdx, taskIdx, false);
    }
  });
};

const updateSavedTasks = (packageItem, packageIdx, taskIdx) => {
  savedTasks.value[taskIdx].packages[packageIdx] = Object.assign({}, jsonClone(packageItem));
};

function compareIfEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const checkPackageChanged = (packageItem, packageIdx, taskIdx) => {
  const tempPackage = jsonClone(packageItem);
  removeEmptyUnit(tempPackage);
  removeUnitErrorStatus(tempPackage);

  return !compareIfEqual(tempPackage, savedTasks.value[taskIdx].packages[packageIdx]);
};

const disableUpdatePackage = (packageItem, packageIdx, taskIdx) => {
  if (accessoryAllocationVisible.value)
    return true;
  return !checkPackageChanged(packageItem, packageIdx, taskIdx);
};

const disableSubmitPackage = (packageItem, task) => {
  if (accessoryAllocationVisible.value)
    return true;
};

const disableNewPackage = packageArr => {
  if (!packageArr || packageArr.length === 0 || packageArr[packageArr.length - 1]?.id)
    return false;
  return true;
};

function checkAddable (task, type) {
  let productQty = 0; // Lisa指定的总数
  let fulQty = 0; // package中已有unit的总数

  tasksProductFulQty.value[task.id]?.productsQty.forEach(product => {
    if (type === 'unit' && !noSerialArr.includes(product.productCode)) {
      productQty += product.req;
      fulQty += Math.min(product.fulSpec + product.fulExclSpec);
    } else if (type === 'accessory' && noSerialArr.includes(product.productCode)) {
      productQty += product.req;
      fulQty += Math.min(product.fulSpec + product.fulExclSpec);
    } else if (type === 'package') {
      productQty += product.req;
      fulQty += Math.min(product.fulSpec + product.fulExclSpec);
    }
  });

  return fulQty < productQty;
}

const handleUnitChange = (packageItem, packageIdx, unitIdx, type, task, taskIdx, warning=false) => {
  let hasChanged = true;
  const unitArr = packageItem.units;
  if (type === 'remove') {
    unitArr.splice(unitIdx, 1);
    handleSubmitPackage(packageItem, task, packageIdx, taskIdx);
  } else {
    if (!checkAddable(task, 'unit') && packageItem.units.length > 0) {
      warning && ElMessage.error('Exceed quantity limit');
      hasChanged = false;
    } else {
      unitArr.push({ serial: null, status: 'DELIVERING' });
    }
  }
  return hasChanged;
};

function checkIfRepeated (query) {
  let repeated = false;
  fulSerials.value[query] > 1 && (repeated = true);
  return repeated;
}

function checkIfSpecifiedElseWhere (query) {
  let specified = false;
  specifiedSerials.value.includes(query) && !currentTaskSpecifiedSerials.value.includes(query) && (specified = true);
  return specified;
}

function filterUnitList (unitList, task) {
  const taskProducts = task.products;

  return unitList.filter(item => {
    for (const idx in taskProducts) {
      if (skuCodeEnum[item.sku] === taskProducts[idx].productCode) {
        if (taskProducts[idx].sku && item.sku !== taskProducts[idx].sku)
          return false;
        if (item.condition && item.condition !== 'GOOD' && !currentTaskSpecifiedSerials.value.includes(item.serial))
          return false;
        return true;
      }
    }
    return false;
  });
}

const unitList = shallowRef(null);
const remoteSerialMethod = (query, task, packageItem, taskIdx, packageIdx, unit) => {
  if (query) {
    const isScanned = !!~query.indexOf(';');
    query = query.replace(';', '').toUpperCase();
    queryUnitsAPI({ serial: query }).then(data => {
      if (isScanned) {
        if (data.length !== 1) {
          const scannedSerials = packageItem.scannedSerials;
          packageItem.scannedSerials = scannedSerials
            ? `${scannedSerials};${query}`
            : `${query}`;
          ElMessage.error('Mismatched Scanned Serials: ' + query);
          handleSubmitPackage(packageItem, task, packageIdx, taskIdx);
          return;
        }
      } else {
        if (data.length === 0) {
          ElMessage.error('Serial can\'t be found.');
          return;
        }
        unitList.value = filterUnitList(data, task);
        if (unitList.value.length === 0) {
          ElMessage.error('Serial can\'t match specified product & sku & condition requirement.');
          return;
        }
      }

      if (query && data.length === 1 && unitList.value.length === 1) { // 只有一个符合
        const uniqueSerial = data[0].serial;
        if (query === uniqueSerial) {
          unit.serial = uniqueSerial;
        } else {
          if (isScanned) {
            const scannedSerials = packageItem.scannedSerials;
            packageItem.scannedSerials = scannedSerials
              ? `${scannedSerials};${query}`
              : `${query}`;
            ElMessage.error('Mismatched Scanned Serials: ' + query);
          }
        }
        handleSubmitPackage(packageItem, task, packageIdx, taskIdx);
        return;
      }
    });
  } else {
    unitList.value = [];
  }
};

const removeScannedSerial = (packageItem, removedIdx) => {
  let scannedSerialsArr = packageItem.scannedSerials.split(';');
  if (scannedSerialsArr.length === 1)
    scannedSerialsArr = [];
  else
    scannedSerialsArr = scannedSerialsArr.splice(removedIdx, 1);

  const newPackage = Object.assign({}, packageItem, { scannedSerials: scannedSerialsArr.join(';') });
  updatePackageAPI(newPackage.id, newPackage).then(() => fetchList());
};

let focusStorage = {} as { taskIdx: number, packageIdx: number };
const handleInputFocus = (el, taskIdx, packageIdx) => {
  focusStorage = { taskIdx, packageIdx };
};

function clickNextUnitInput () {
  const { taskIdx, packageIdx } = focusStorage;
  if (!isNaN(taskIdx)) // taskIdx can be 0, do not use: if (taskIdx)
    nextTick(() => {
      const serialCell = proxy.$refs['taskPackageArr'].querySelectorAll('.serial-cell')[packageIdx];
      setTimeout(() => {
        const lastUnitInput = serialCell.lastElementChild.querySelector('.el-input__inner');
        lastUnitInput.click();
      }, 500);
    });
}

const isAccessory = (unit) => (noSerialArr.includes(unit.productCode));

function reportUnitError (unit) {
  const serial = unit.serial;
  const condition = unit.condition;
  let hasError = false;
  if (!serial) {
    ElMessage.error('Please delete empty unit.'); // This actually should not be reached. Make sure empty units are removed in code before submit/update package.
    hasError = true;
  }
  if (checkIfRepeated(serial)) {
    ElMessage.error('Repeated Serial.');
    hasError = true;
  }
  if (checkIfSpecifiedElseWhere(serial)) {
    ElMessage.error('The serial is specified in other task.');
    hasError = true;
  }
  return hasError;
}

function reportPackageError (packageItem) {
  // clean up hasError status and report the first error encountered
  if (disableEditOutboundTask.value) {
    ElMessage.error('You can\'t edit outbound task');
    return packageErrorEnum.EDITING_OUTBOUND_TASK;
  }
  let unitError = false;
  packageItem.units.forEach(unit => {
    unit.hasError = false;
  });
  for (const unitIdx in packageItem.units) {
    const unit = packageItem.units[unitIdx];
    if (reportUnitError(unit)) {
      unit.hasError = true;
      unitError = true;
      break;
    }
  }
  return unitError ? packageErrorEnum.UNIT_ERROR : null;
}

const handleSubmitPackage = (packageItem, task, packageIdx, taskIdx, createNewUnit=true) => {
  handleInputFocus(null, taskIdx, packageIdx);
  const packageItemForSubmission = jsonClone(packageItem);
  const savedTask = jsonClone(savedTasks.value[taskIdx]);
  removeEmptyUnit(packageItemForSubmission);

  const packageError = reportPackageError(packageItemForSubmission);
  if (packageError === packageErrorEnum.EDITING_OUTBOUND_TASK) {
    Object.assign(task, savedTask);
    return;
  } else if (packageError === packageErrorEnum.UNIT_ERROR) {
    Object.assign(packageItem, packageItemForSubmission);
    return;
  }

  const packageId = packageItem.id;

  if (packageId) {
    if (disableUpdatePackage(packageItemForSubmission, packageIdx, taskIdx)) return;
    updatePackageAPI(packageId, packageItemForSubmission)
      .then(data => {
        Object.assign(packageItem, data);
        updateSavedTasks(packageItem, packageIdx, taskIdx);
        if (packageItem.units.length === 0) {
          createNewUnit = true;
        }
        if (createNewUnit) {
          handleUnitChange(packageItem, packageIdx, null, 'add', task, taskIdx) && clickNextUnitInput();
        }
      });
  }
  else {
    if (disableSubmitPackage(packageItemForSubmission, packageIdx)) return;
    createPackageAPI(packageItem.taskId, packageItemForSubmission)
      .then(data => {
        Object.assign(packageItem, data);
        updateSavedTasks(packageItem, packageIdx, taskIdx);
        if (packageItem.units.length === 0) {
          createNewUnit = true;
        }
        if (createNewUnit) {
          handleUnitChange(packageItem, packageIdx, null, 'add', task, taskIdx) && clickNextUnitInput();
        }
      });
  }
  unitList.value = [];
};

function removeEmptyUnit (packageItem) {
  if (packageItem) {
    for (let idx = packageItem.units.length - 1; idx >= 0; idx--) {
      if (!packageItem.units[idx].serial) {
        packageItem.units.splice(idx, 1);
      }
    }
  }
}

function removeUnitErrorStatus (packageItem) {
  packageItem.units.forEach(unit => {
    delete unit['hasError'];
  });
}

const onPackagesChange = (task, packages, type, packageIdx?) => {
  if (type === 'remove')
    packages.splice(packageIdx, 1);
  else {
    removeEmptyUnit(packages[packages.length - 1]);
    if (packages[packages.length - 1] && !packages[packages.length - 1].units.length) {
      packages[packages.length - 1].units.push({ serial: null, status: 'DELIVERING'});
    }
    if (!checkAddable(task, 'package')) {
      ElMessage.error('Exceed quantity limit');
      return;
    }
    const unitSystem = getWarehouseUnitSystem(task.sourceId);
    packages.push({
      id: null,
      taskId: task.id,
      trackingNumber: '',
      length: null,
      width: null,
      height: null,
      weight: null,
      unitSystem,
      units: [{serial: null, status: 'DELIVERING'}],
      accessories: []
    });
    handleInputFocus(null, props.taskIdx, packages.length - 1);
    clickNextUnitInput();
  }
};

const handleDeletePackage = (packageId) => {
  if (disableEditOutboundTask.value) {
    ElMessage.error('You can\'t edit outbound task');
    return;
  }
  packageId && deletePackageAPI(packageId).then(() => {
    fetchList();
  });
};

/* Provide functions */
provide('allocateAccessory', allocateAccessory);
provide('onAccessoryAllocationChange', onAccessoryAllocationChange);
/* End of provide functions */

</script>

<style lang="sass">
.package-wrapper
  display: grid
  grid-gap: 0
  max-width: 1130px
  .col1
    grid-column-start: 1
  .col2
    grid-column-start: 2
  .col3
    grid-column-start: 3
  .col4
    grid-column-start: 4
  .col2.package-info
    display: grid
    grid-gap: 0
    grid-column-end: 5

  .serial-cell, .serial-label
    width: 290px
  .w-180
    width: 185px
  .w-200
    width: 240px
  .w-340
    width: 405px
  .w-380
    width: 350px
    @media (max-width: 1420px)
      width: 220px
  .el-input
    max-width: 360px
  .label, .cell
    margin: 0
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
  .el-select
    width: 120px
    .el-input
      width: 120px

.el-card
  overflow: scroll
</style>
