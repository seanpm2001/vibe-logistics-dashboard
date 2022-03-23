<template>
  <div>
    <el-row class="header" justify="space-between" :gutter="3">
      <span>
        Shipment <span v-if="taskItem?.carrier"> [Database]</span>:
      </span> 
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item :rules="{ required: true, message: 'source number is required', trigger: 'change' }" label="Carrier">
        <el-select :disabled="notShipmentPermission" v-model="taskItem.carrier" placeholder="Please select">
          <el-option v-for="(item, key) in carrierEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" align="middle" :gutter="3">
      <el-form-item label="Delivery Cost">
        <el-input :disabled="notShipmentPermission" v-model="taskItem.deliveryCost" placeholder="Delivery Cost"/>
      </el-form-item>
      <el-form-item label="Liftgate Cost">
        <el-checkbox @change="handleCostChange('liftgateCost')">
          <el-input :disabled="notShipmentPermission" v-model="taskItem.liftgateCost" placeholder="Liftgate Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Limited Cost">
        <el-checkbox @change="handleCostChange('limitedAccessCost')">
          <el-input :disabled="notShipmentPermission" v-model="taskItem.limitedAccessCost" placeholder="Limited Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Residential Cost">
        <el-checkbox @change="handleCostChange('residentialCost')">
          <el-input :disabled="notShipmentPermission" v-model="taskItem.residentialCost" placeholder="Residential Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Inside Cost">
        <el-checkbox @change="handleCostChange('insideCost')">
          <el-input :disabled="notShipmentPermission" v-model="taskItem.insideCost" placeholder="Inside Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Insure Cost">
        <el-checkbox @change="handleCostChange('insureCost')">
          <el-input :disabled="notShipmentPermission" v-model="taskItem.insureCost" placeholder="Insure Cost"/>
        </el-checkbox>
      </el-form-item>
    </el-row>
    
    <template v-if="!notShipmentPermission">
      <el-button :disabled="!taskId" type="primary" @click="handleShipment('update')">
        Update Shipment Info
      </el-button>
    </template>

    <el-card v-if="packageArr.length > 0">
      <template v-for="(item, index) in packageArr" :key="index">
        <PackageForm
          :ref="`package-${index}`"
          :taskId="taskItem?.id"
          :packageIdx="index"
          :packageItem="item"
          :warehouseEnum="warehouseEnum"
          :dialogStatus="dialogStatus"
          @deletePackage="removePackage"
          @createPackage="submitPackage"
          @editPackage="updatePackage"
        />
      </template>
    </el-card>
    
    <el-button
      v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
      :disabled="disableNewPackage"
      type="primary"
      icon="el-icon-circle-plus"
      @click="addPackage"
    >
      Add Package
    </el-button>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import PackageForm from './PackageForm.vue';
import { updateTaskAPI, getTaskPackagesAPI } from '/@/api/logistic';
import { carrierEnum } from '/@/enums/logistic';

const props = defineProps({
  taskId: {
    type: Number,
    required: true
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
  dialogStatus: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['fetchList']);

/* Start Data */
const taskItem = inject('taskItem');
const packageArr = inject('packageArr');

const store = useStore();
const role = store.getters.role;
const notShipmentPermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE'].includes(role));

const emptyPackage = {
  trackingNumber: null,
  status: null,
  units: [{
    serial: null,
    status: null,
  }],
};
/* End Data */
watchEffect(() => {
  const taskId = props.taskId;
  taskId && getTaskPackagesAPI(taskId).then(_data => {
    packageArr.value = _data;
  });
});

const disableNewPackage = computed(() => {
  const arr = packageArr.value;
  if (arr.length === 0) return false;
  return !arr[arr.length - 1]?.id;
});

const addPackage = () => {
  packageArr.value.push(Object.assign({}, emptyPackage));
  console.log('packageArr.value: ', packageArr.value);
};

const handleCostChange = (key) => {
  taskItem.value[key] = taskItem.value[key] ? null : 50;
};

const handleShipment = (type) => {
  // for (const key in products.value) { // 更新costs
  //   taskItem.value.costs[key] = products.value[key].cost || 0;
  // }
  if (type === 'update') {
    updateTaskAPI(taskItem.value.id, taskItem.value).then(_data => {
      taskItem.value = _data;
      emit('fetchList');
    });
  }
};

const removePackage = (idx, shipmentId) => {
  packageArr.value.splice(idx, 1);
};
const submitPackage = (shipment, taskId, packageIdx) => {
  console.log('shipment, taskId, packageIdx: ', shipment, taskId, packageIdx);
};
const updatePackage = (data, shipmentIdx) => {
  console.log('shipmentIdx: ', shipmentIdx);
};

</script>

<style lang="sass" scoped>
.el-checkbox__label .el-form-item
  margin-bottom: 0

.icon
  margin-right: .25rem
  cursor: pointer
  .close-icon
    float: right
    width: 24px
    height: 24px

.el-row
  align-items: center
  padding: 0 2rem
  &.header
    padding: 0
    font-size: 16px
    font-weight: 500
</style>
