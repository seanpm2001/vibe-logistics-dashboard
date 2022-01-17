<template>
  <div>
    <el-row class="header" justify="space-between" :gutter="3">
      <span>
        Shipment <span v-if="shipment?.id">{{shipment?.id}} [Database]</span>:
      </span> 
      <svg-icon class="icon close-icon" icon-name="close" @click="handleDeleteShipment"></svg-icon>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item :rules="{ required: true, message: 'source number is required', trigger: 'change' }" label="Carrier">
        <el-select :disabled="isDialogPattern('view')" v-model="shipment.carrier" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" align="middle" :gutter="3">
      <el-form-item label="Delivery Cost">
        <el-input v-model="shipment.deliveryCost" placeholder="Delivery Cost"/>
      </el-form-item>
      <el-form-item label="Liftgate Cost">
        <el-checkbox @change="handleCostChange('liftgateCost')">
          <el-input v-model="shipment.liftgateCost" placeholder="Liftgate Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Limited Cost">
        <el-checkbox @change="handleCostChange('limitedAccessCost')">
          <el-input v-model="shipment.limitedAccessCost" placeholder="Limited Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Residential Cost">
        <el-checkbox @change="handleCostChange('residentialCost')">
          <el-input v-model="shipment.residentialCost" placeholder="Residential Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Inside Cost">
        <el-checkbox @change="handleCostChange('insideCost')">
          <el-input v-model="shipment.insideCost" placeholder="Inside Cost"/>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="Insure Cost">
        <el-checkbox @change="handleCostChange('insureCost')">
          <el-input v-model="shipment.insureCost" placeholder="Insure Cost"/>
        </el-checkbox>
      </el-form-item>
    </el-row>
    
    <div class="f-row controls" v-if="!isDialogPattern('view')">
      <el-button v-if="shipment.id" type="primary" @click="handleShipment('update')">
        Update Shipment
      </el-button>
      <el-button v-else type="primary" @click="handleShipment('create')">
        Submit Shipment
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a common part before 'Add new Package'"
        placement="right"
      >
        <svg-icon icon-name="tips" />
      </el-tooltip>
    </div>

    <el-card v-if="packageArr.length > 0">
      <template v-for="(item, index) in packageArr" :key="index">
        <PackageForm
          :ref="`package-${index}`"
          :shipmentId=shipment.id
          :packageIdx=index
          :packageItem=item
          :warehouseOptions=warehouseOptions
          :dialogStatus=dialogStatus
          @deletePackage="removePackage"
          @createPackage="submitPackage"
          @editPackage="updatePackage"
        />
      </template>
    </el-card>
    
    <el-button :disabled="disableNewPackage" type="primary" icon="el-icon-circle-plus" @click="addPackage">
      Add Package
    </el-button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import PackageForm from './PackageForm.vue';
import { createShipmentAPI, deleteShipmentAPI, updateShipmentAPI } from '/@/server/api/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  shipmentIdx: {
    type: Number,
    required: true
  },
  shipmentItem: {
    type: Object,
    required: true
  },
  warehouseOptions: {
    type: Object,
    required: true
  },
  dialogStatus: {
    type: String,
    required: true
  }
});

const shipment = ref(props.shipmentItem);
const previewExcelArr = [].concat(shipment.value?.items);

// eslint-disable-next-line no-undef
const emit = defineEmits(['removeShipment', 'submitShipment', 'editShipment']);

const packageArr = ref([]);
const emptyPackage = {
  trackingNumber: null,
  status: null,
  newAddress: null,
  serialArr: [],
};

const isDialogPattern = type => props.dialogStatus === type;

const disableNewPackage = ref(false);
const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const addPackage = () => {
  // if (!formData.value.id) {
  //   ElMessage.error('You need to "Submit Common Section" before "Add Shipment"', 3);
  //   return;
  // }
  packageArr.value.push(Object.assign({}, emptyPackage));
  console.log('packageArr.value: ', packageArr.value);
  disableNewPackage.value = true;
};

const handleCostChange = (key) => {
  shipment.value[key] = shipment.value[key] ? null : 50;
};

const handleDeleteShipment = () => {
  const shipmentId = shipment.value?.id;
  if (shipmentId) { // 删除数据库中的shipment
    ElMessageBox.confirm(
      `Remove the shipment (ID:${shipmentId})?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        callback: (action) => {
          if (action === "confirm") {
            deleteShipmentAPI(shipmentId).then(() => {
              emit('removeShipment', props.shipmentIdx);
            });
          } else if (action === "cancel") {
            ElMessage.info('Delete canceled');
          }
        },
      }
    );
    return;
  }
  emit('removeShipment', props.shipmentIdx); // 删除新创建还未提交的shipment
};

const handleShipment = (type) => {
  // for (const key in products.value) { // 更新costs
  //   shipment.value.costs[key] = products.value[key].cost || 0;
  // }
  if (type === "create") {
    createShipmentAPI(props.orderId, shipment.value).then(data => {
      shipment.value = data;
      emit('submitShipment', data, props.orderId ,props.shipmentIdx);
    });
  } else {
    updateShipmentAPI(shipment.value.id, shipment.value).then(data => {
      shipment.value = data;
      emit('updateShipment', data, props.shipmentIdx);
    });
    emit('editShipment', shipment.value?.id);
  }
};

const removePackage = (idx, shipmentId) => {
  packageArr.value.splice(idx, 1);
  disableNewPackage.value = false;
};
const submitPackage = (shipment, freightId, shipmentIdx) => {
  disableNewPackage.value = false;
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
