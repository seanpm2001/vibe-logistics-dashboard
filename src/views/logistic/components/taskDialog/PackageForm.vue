<template>
  <div>
    <el-row
      class="header"
      justify="space-between"
      :gutter="3"
    >
      <span> Package <span v-if="taskPackage?.id"> [Database]</span>: </span>
      <svg-icon
        v-if="!notPackagePermission"
        class="icon close-icon"
        icon-name="close"
        @click="handleDeletePackage"
      />
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item label="*Tracking Number">
        <el-input
          v-model="taskPackage.trackingNumber"
          :disabled="notPackagePermission"
          placeholder="Tracking Number"
        />
      </el-form-item>
      <el-form-item label="Weight">
        <el-input
          v-model="taskPackage.weight"
          :disabled="notPackagePermission"
          placeholder="Weight"
          @input="val => (taskPackage.weight = toNumber(val))"
        />
      </el-form-item>
      <el-form-item label="Length">
        <el-input
          v-model="taskPackage.length"
          :disabled="notPackagePermission"
          placeholder="Length"
          @input="val => (taskPackage.length = toNumber(val))"
        />
      </el-form-item>
      <el-form-item label="Width">
        <el-input
          v-model="taskPackage.width"
          :disabled="notPackagePermission"
          placeholder="Width"
          @input="val => (taskPackage.width = toNumber(val))"
        />
      </el-form-item>
      <el-form-item label="Height">
        <el-input
          v-model="taskPackage.height"
          :disabled="notPackagePermission"
          placeholder="Height"
          @input="val => (taskPackage.height = toNumber(val))"
        />
      </el-form-item>
      <el-form-item label="Unit">
        <el-select
          v-model="taskPackage.unitSystem"
          placeholder="Unit System"
          default-first-option
        >
          <el-option
            v-for="(unitSys, key) in unitSystemEnum"
            :key="key"
            :label="unitSys"
            :value="key"
          />
        </el-select>
      </el-form-item>
    </el-row>

    <template
      v-for="(item, index) in taskPackage.units"
      :key="index"
    >
      <el-row
        align="middle"
        class="add-minus-row"
      >
        <svg-icon
          v-if="!disableHandleUnit"
          class="icon"
          :style="taskPackage.units.length >= quantityNum ? 'visibility: hidden;' : ''"
          icon-name="add"
          @click="handleUnitChange(index, 'add')"
        />
        <svg-icon
          v-if="!disableHandleUnit"
          class="icon"
          icon-name="minus"
          @click="handleUnitChange(index, 'minus')"
        />

        <el-form-item label="Unit Serial">
          <el-select
            v-model="item.serial"
            :disabled="notPackagePermission || disableHandleUnit"
            style="width: 260px"
            placeholder="Please select"
            filterable
            remote
            :allow-create="taskItem.taskType === 'RETURN'"
            :remote-method="query => debounce(remoteMethod(query, taskItem.taskType), 500)"
          >
            <el-option
              v-for="unit in unitList"
              :key="unit.serial"
              :label="`${unit.serial}${unit.sku ? ' : ' + unit.sku : ''}`"
              :value="unit.serial"
            />
          </el-select>
        </el-form-item>
      </el-row>
    </template>

    <template
      v-for="(accessory, index) in taskPackage.accessories"
      :key="index"
    >
      <el-row
        align="middle"
        class="add-minus-row"
      >
        <svg-icon
          v-if="!disableHandleUnit"
          class="icon"
          :style="taskPackage.accessories.length >= taskAccessories.length ? 'visibility: hidden;' : ''"
          icon-name="add"
          @click="handleAccessoryChange(index, 'add')"
        />
        <svg-icon
          v-if="!disableHandleUnit"
          class="icon"
          icon-name="minus"
          @click="handleAccessoryChange(index, 'minus')"
        />

        <el-form-item label="Accessory">
          <el-select
            v-model="accessory.productCode"
            :disabled="notPackagePermission || disableHandleUnit"
            style="width: 260px"
            placeholder="Please select"
            filterable
            remote
            :allow-create="taskItem.taskType === 'RETURN'"
            :remote-method="query => debounce(remoteMethod(query, taskItem.taskType), 500)"
          >
            <el-option
              v-for="taskAaccessory in taskAccessories"
              :key="taskAaccessory.productCode"
              :label="codeNameEnum[taskAaccessory.productCode]"
              :value="taskAaccessory.productCode"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Quantity">
          <el-select
            v-model="accessory.quantity"
            :disabled="notPackagePermission || disableHandleUnit || !accessory.productCode"
            style="width: 50px"
            placeholder=" "
            filterable
            remote
            :allow-create="taskItem.taskType === 'RETURN'"
            :remote-method="query => debounce(remoteMethod(query, taskItem.taskType), 500)"
          >
            <el-option
              v-for="(v, index) in (taskAccessories.find(taskAaccessory => taskAaccessory.productCode === accessory.productCode)?.quantity || 0) + 1"
              :key="index"
              :label="index"
              :value="index"
            />
          </el-select>
        </el-form-item>
      </el-row>
    </template>

    <el-row style="margin-bottom: 20px">
      For return tasks, please select 'Specify Serial' in warehouse task field if neccessary, instead of adding unit in package here.
    </el-row>

    <div
      v-if="!notPackagePermission"
      class="f-row controls"
    >
      <el-button
        v-if="taskPackage?.id"
        :disabled="!taskId"
        type="primary"
        @click="handlePackage('update')"
      >
        Update Package
      </el-button>
      <el-button
        v-else
        :disabled="!taskId"
        type="primary"
        @click="handlePackage('create')"
      >
        Submit Package
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a 'Shipment' part before 'Submit Package'"
        placement="right"
      >
        <svg-icon
          class="mgl-5"
          icon-name="tips"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { debounce, toNumber } from '@/utils';
import { ElMessage, ElMessageBox, ElTooltip } from 'element-plus';
import {
  createPackageAPI,
  deletePackageAPI,
  updatePackageAPI,
  queryUnitsAPI,
} from '@/api';
import { noSerialArr, skuCodeEnum, unitSystemEnum, codeNameEnum } from '@/enums/logistic';
import { useUserStore } from '@/store';

// eslint-disable-next-line no-undef
const props = defineProps({
  taskId: {
    type: Number,
    required: true,
  },
  packageIdx: {
    type: Number,
    required: true,
  },
  packageItem: {
    type: Object,
    required: true,
  },
  dialogStatus: {
    type: String,
    required: true,
  },
});

/* Start Data */
const taskItem = inject('taskItem') as any;
const taskOrderItem = inject('taskOrderItem') as any;

const { role } = storeToRefs(useUserStore());
const notPackagePermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE'].includes(role.value));

const taskPackage = ref(props.packageItem);

const quantityNum = computed(() => {
  const taskProducts = taskItem.value.products;
  let sum=0;
  for (const i in taskProducts) {
    sum += taskProducts[i].quantity;
  }
  return sum;
});
/* End Data */

const emit = defineEmits(['deletePackage', 'createPackage', 'editPackage']);

const unitList = shallowRef([]);
const remoteMethod = (query, taskType) => {
  const taskProducts = taskItem.value.products;
  if (query) {
    queryUnitsAPI({ serial: query }).then(data => {
      unitList.value = data.filter(item => {
        for (const idx in taskProducts) {
          if (item.sku === taskProducts[idx].sku || skuCodeEnum[item.sku] === taskProducts[idx].productCode)
            return true;
        }
      });

      if (taskType === 'RETURN') // return task append所有task中的serial
        taskOrderItem.value.tasks?.forEach(task => {
          task.packages.forEach(item => {
            item.units?.forEach(unit => {
              unit.serial && unitList.value.push(unit);
            });
          });
        });
    });
  } else {
    unitList.value = [];
  }
};

const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const taskAccessories = computed(() => {
  const arr = [];
  const accessoriesQuantity = {};
  taskItem.value.products?.forEach(product => {
    if (noSerialArr.includes(product.productCode)) {
      accessoriesQuantity[product.productCode] = (accessoriesQuantity[product.productCode] || 0) + product.quantity;
    }
  });
  for (const productCode in accessoriesQuantity) {
    arr.push({
      productCode,
      quantity: accessoriesQuantity[productCode]
    });
  }
  return arr;
});

const disableHandleUnit = computed(() => (['RETURN', 'RETURN_TO_REPAIR'].includes(taskItem.value.taskType)));

const handleAccessoryChange = (idx, type) => {
  const acessoryArr = taskPackage.value.accessories;
  type === 'add'
    ? acessoryArr.push({ productCode: null, quantity: null, status: 'DELIVERING' })
    : acessoryArr.splice(idx--, 1);
  acessoryArr.length === 0 && acessoryArr.push({ productCode: null, quantity: null, status: 'DELIVERING' });
};

const handleUnitChange = (idx, type) => {
  const unitArr = taskPackage.value.units;
  type === 'add'
    ? unitArr.push({ serial: null, status: 'DELIVERING' })
    : unitArr.splice(idx--, 1);
  unitArr.length === 0 && unitArr.push({ serial: null, status: 'DELIVERING' });
};

const handleDeletePackage = () => {
  const packageId = taskPackage.value?.id;
  if (packageId) {
    // 删除数据库中的package
    ElMessageBox.confirm(`Remove the package (ID:${packageId})?`, 'Warning', {
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          deletePackageAPI(packageId).then(() => {
            emit('deletePackage', props.packageIdx);
          });
        } else if (action === 'cancel') {
          ElMessage.info('Delete canceled');
        }
      },
    });
    return;
  }
  emit('deletePackage', props.packageIdx); // 删除新创建还未提交的package
};

const handlePackage = (type) => {
  if (type === 'create') {
    createPackageAPI(props.taskId, taskPackage.value).then((data) => {
      taskPackage.value = data;
      emit('createPackage', data, props.taskId, props.packageIdx);
    });
  } else {
    updatePackageAPI(taskPackage.value.id, taskPackage.value).then((data) => {
      taskPackage.value = data;
      emit('editPackage', data, props.packageIdx);
    });
    emit('editPackage', taskPackage.value?.id);
  }
};

watchEffect(() => {
  taskPackage.value && taskPackage.value.units?.length === 0 && handleUnitChange(null, 'add');
  taskPackage.value && taskPackage.value.accessories?.length === 0 && taskAccessories.value.length > 0 && handleAccessoryChange(null, 'add');
});
</script>

<style lang="sass" scoped>
.el-checkbox__label .el-form-item
  margin-bottom: 0

.el-row
  align-items: center
  padding: 0 2rem
  &.header
    padding: 0
    padding-left: 16px
    font-size: 16px
    font-weight: 500
</style>
