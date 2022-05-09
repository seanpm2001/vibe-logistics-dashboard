<template>
  <template
    v-for="(task, taskIdx) in dataList"
    :key="task.id"
  >
    <el-card>
      <CardDescriptions
        :task="task"
        @fetch-list="fetchList"
      />
      <div class="package-wrapper">
        <div class="col1 meta-data label w-380">
          Meta Data
        </div>
        <div class="col2 serial-label label">
          Package Serials
        </div>
        <div class="col3 label w-200">
          Package Tracking Number
          Weight(kg) & Dimension(cm)
        </div>
        <div class="col4 label w-180">
          Operation
        </div>

        <MetaData :task="task" />

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
            <div :class="'col3 cell w-200' + (item.trackingNumber ? '' : ' error-border-tip')">
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
            <div class="col4 cell w-180">
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
</template>

<script lang="ts" setup>
import CardDescriptions from './CardDescriptions.vue';
import MetaData from './MetaData.vue';
import { ElMessage } from 'element-plus';
import { debounce, toNumber } from '@/utils';
import { skuCodeEnum } from '@/enums/logistic';
import { queryUnitsAPI, createPackageAPI, updatePackageAPI, deletePackageAPI } from '@/api/logistic';

const emit = defineEmits(['fetchList']);
/* Start Data */
const { proxy } = getCurrentInstance();

const dataList = inject('dataList');
const contrastTask = inject('contrastTask');


/* End Data */

const fetchList = () => emit('fetchList');

function compareIfEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
const diableUpdatePackage = (packageItem, packageIdx, taskIdx) => {
  if (!packageItem.trackingNumber || compareIfEqual(packageItem, contrastTask.value[taskIdx].packages[packageIdx]))
    return true;
  return false;
};

const disableNewPackage = packageArr => {
  if (!packageArr || packageArr.length === 0 || packageArr[packageArr.length - 1]?.id)
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

let focusStorage = {};
const handleInputFocus = (el, taskIdx, packageIdx) => {
  focusStorage = { taskIdx, packageIdx };
};

function clickNextUnitInput () {
  const { taskIdx, packageIdx } = focusStorage;
  if (taskIdx)
    nextTick(() => {
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

const handleDeletePackage = (packageId) => {
  packageId && deletePackageAPI(packageId).then(() => {
    fetchList();
  });
};
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
    width: 220px
  .w-180
    width: 185px
  .w-200
    width: 240px
  .w-380
    width: 350px
    @media (max-width: 1420px)
      width: 200px
  .el-input
    max-width: 240px
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
</style>
