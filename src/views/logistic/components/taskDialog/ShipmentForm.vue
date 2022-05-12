<template>
  <div>
    <el-row
      class="header"
      justify="space-between"
      :gutter="3"
    >
      <span>
        Shipment:
      </span> 
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item label="*Transport Mode">
        <el-select
          v-model="taskItem.transportMode"
          :disabled="notShipmentPermission"
          placeholder="Please select"
        >
          <el-option
            v-for="(transport, key) in transportEnum"
            :key="transport"
            :label="transport"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="taskItem.transportMode"
        label="*Carrier"
      >
        <el-select
          v-model="taskItem.carrier"
          :disabled="notShipmentPermission"
          placeholder="Please select"
        >
          <el-option
            v-for="(carrier, key) in transportCarrierEnum[taskItem.transportMode]"
            :key="carrier"
            :label="carrier"
            :value="key"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      align="middle"
      :gutter="3"
    >
      <el-form-item label="Delivery Cost">
        <el-input
          v-model="taskItem.deliveryCost"
          :disabled="notShipmentPermission"
          placeholder="Delivery Cost"
        />
      </el-form-item>
      <el-form-item label="Liftgate Cost">
        <el-checkbox @change="handleCostChange('liftgateCost')">
          <el-input
            v-model="taskItem.liftgateCost"
            :disabled="notShipmentPermission"
            placeholder="Liftgate Cost"
          />
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Limited Cost">
        <el-checkbox @change="handleCostChange('limitedCost')">
          <el-input
            v-model="taskItem.limitedCost"
            :disabled="notShipmentPermission"
            placeholder="Limited Cost"
          />
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Residential Cost">
        <el-checkbox @change="handleCostChange('residentialCost')">
          <el-input
            v-model="taskItem.residentialCost"
            :disabled="notShipmentPermission"
            placeholder="Residential Cost"
          />
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Inside Cost">
        <el-checkbox @change="handleCostChange('insideCost')">
          <el-input
            v-model="taskItem.insideCost"
            :disabled="notShipmentPermission"
            placeholder="Inside Cost"
          />
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Insure Cost">
        <el-checkbox @change="handleCostChange('insureCost')">
          <el-input
            v-model="taskItem.insureCost"
            :disabled="notShipmentPermission"
            placeholder="Insure Cost"
          />
        </el-checkbox>
      </el-form-item>
    </el-row>
    
    <template v-if="!notShipmentPermission">
      <el-button
        :disabled="!taskId"
        type="primary"
        @click="handleShipment('update')"
      >
        Update Shipment Info
      </el-button>
    </template>

    <el-card v-if="packageArr.length > 0">
      <template
        v-for="(item, index) in packageArr"
        :key="index"
      >
        <PackageForm
          :ref="`package-${index}`"
          :task-id="taskItem?.id"
          :package-idx="index"
          :package-item="item"
          :warehouse-enum="warehouseEnum"
          :dialog-status="dialogStatus"
          @deletePackage="removePackage"
          @createPackage="submitPackage"
          @editPackage="updatePackage"
        />
      </template>
    </el-card>
    
    <el-button
      v-if="taskItem.carrier"
      v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
      :disabled="disableNewPackage"
      type="primary"
      :icon="CirclePlus"
      @click="addPackage"
    >
      Add Package
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { CirclePlus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PackageForm from './PackageForm.vue';
import { updateTaskAPI, listTaskPackagesAPI } from '@/api/logistic';
import { transportEnum, transportCarrierEnum } from '@/enums/logistic';
import { useUserStore } from '@/store';

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

const { role } = storeToRefs(useUserStore());
const notShipmentPermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE'].includes(role.value));

const emptyPackage = {
  trackingNumber: null,
  unitSystem: null,
  units: [{
    serial: null,
    status: 'DELIVERING',
  }],
};
/* End Data */
watchEffect(() => {
  const taskId = props.taskId;
  taskId && listTaskPackagesAPI(taskId).then(data => {
    packageArr.value = data;
  });
});

const disableNewPackage = computed(() => {
  const arr = packageArr.value;
  if (arr.length === 0) return false;
  return !arr[arr.length - 1]?.id;
});

const addPackage = () => {
  const unitSystem = taskItem.targetId !== 6 ? 'SI' : 'BS';
  packageArr.value.push(Object.assign({}, emptyPackage, { unitSystem }));
};

const handleCostChange = (key) => {
  taskItem.value[key] = taskItem.value[key] ? null : 50;
};

const handleShipment = (type) => {
  // for (const key in products.value) { // 更新costs
  //   taskItem.value.costs[key] = products.value[key].cost || 0;
  // }
  if (type === 'update') {
    updateTaskAPI(taskItem.value.id, taskItem.value).then(data => {
      taskItem.value = data;
      emit('fetchList');
    });
  }
};

const removePackage = (idx, shipmentId) => {
  packageArr.value.splice(idx, 1);
};
const submitPackage = (data, taskId, packageIdx) => {
  packageArr.value[packageIdx] = data;
};
const updatePackage = (data, packageIdx) => {
  packageArr.value[packageIdx] = data;
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
