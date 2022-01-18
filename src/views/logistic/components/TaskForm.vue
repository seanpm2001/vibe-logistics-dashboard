<template>
  <el-form ref="dataForm" :model="formData" label-position="left" label-width="140px">
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Type">
        <el-select v-model="formData.type" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in taskTypeOptions" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Source Warehouse">
        <el-select v-model="formData.sourceId" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="Target Warehouse">
        <el-select v-model="formData.targetId" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Order ID">
        <el-input disabled v-model="formData.orderId" placeholder="Order Id" />
      </el-form-item>
      <el-form-item label="Task Status">
        <el-select v-model="formData.status" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in taskStatusOptions" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="On hold">
        <el-switch v-model="isOnHold" :disabled="isDialogPattern('view')" @click="onHoldTask">
          On hold:
        </el-switch>
      </el-form-item>
    </el-row>

    <div class="f-row controls" v-if="!isDialogPattern('view')">
      <el-button v-if="formData.id" type="primary" @click="handleWarehouseTask('update')">
        Update Common Section
      </el-button>
      <el-button v-else type="primary" @click="handleWarehouseTask('create')">
        Submit Common Section
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a common part before 'Add new Sub-Batch'"
        placement="right"
      >
        <svg-icon icon-name="tips" />
      </el-tooltip>
    </div>

    <el-card v-if="shipmentArr.length > 0">
      <template v-for="(item, index) in shipmentArr" :key="index">
        <ShipmentForm
          :ref="`shipment-${index}`"
          :orderId=formData.orderId
          :shipmentIdx=index
          :shipmentItem=item
          :warehouseOptions=warehouseOptions
          :dialogStatus=dialogStatus
          @deleteShipment="removeShipment"
          @createShipment="submitShipment"
          @editShipment="updateShipment"
        />
      </template>
    </el-card>
    
    <el-button :disabled="disableNewShipment" type="primary" icon="el-icon-circle-plus" @click="addShipment">
      Add Shipmentment
    </el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import ShipmentForm from './ShipmentForm.vue';
import { taskTypeOptions, taskStatusOptions } from '/@/assets/enum/logistic';
// eslint-disable-next-line no-undef
const props = defineProps({
  taskForm: {
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

// eslint-disable-next-line no-undef
const emit = defineEmits(['fetchList']);

const formData = ref(props.taskForm);
const shipmentArr = ref([]);
const emptyShipment = {
  carrier: null,
  deliveryCost: null,
  packageArr: [],
};

const isOnHold = ref(false);
const disableNewShipment = ref(false);
const isDialogPattern = type => props.dialogStatus === type;

const handleWarehouseTask = type => {
  console.log('type: ', type);

};

let count = 1; // test
const addShipment = () => {
  // if (!formData.value.id) {
  //   ElMessage.error('You need to "Submit Common Section" before "Add Shipment"', 3);
  //   return;
  // }
  shipmentArr.value.push(Object.assign({id: count++}, emptyShipment));
  disableNewShipment.value = true;
};

const removeShipment = (idx, shipmentId) => {
  shipmentArr.value.splice(idx, 1);
  disableNewShipment.value = false;
};
const submitShipment = (shipment, freightId, shipmentIdx) => {
  disableNewShipment.value = false;
};
const updateShipment = (data, shipmentIdx) => {
  console.log('shipmentIdx: ', shipmentIdx);
};

const onHoldTask = () => {
  console.log("onHoldTask");
};
</script>

<style lang="sass" scoped>
.el-form .el-row
  padding: 0 1rem

</style>
