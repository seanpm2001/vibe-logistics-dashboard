<template>
  <el-form ref="dataForm" :model="formData" label-position="left" label-width="140px">
    <el-row justify="space-between" :gutter="3">
        <el-form-item label="Type">
        <el-select v-model="formData.type" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in whTypeOptions" :key="item" :label="item" :value="key" />
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
        <el-input v-model="formData.orderId" :disabled="isDialogPattern('view')" placeholder="Order Id" />
      </el-form-item>
      <el-form-item label="Task Status">
        <el-input v-model="formData.status" :disabled="isDialogPattern('view')" placeholder="Task Status"  />
      </el-form-item>
      <el-form-item label="On hold">
        <el-switch v-model="isOnHold" :disabled="isDialogPattern('view')" @click="onHoldTask">
          On hold:
        </el-switch>
      </el-form-item>
    </el-row>

    <template v-for="(item, index) in shipArr" :key="index">
      <ShipForm
        :ref="`ship-${index}`"
        :freightId=freightForm.id
        :shipIdx=index
        :shipItem=item
        :warehouseOptions=warehouseOptions
        :dialogStatus=dialogStatus
        @deleteShip="removeShip"
        @createShip="submitShip"
        @editShip="updateShip"
      />
    </template>

    <el-button :disabled="disableNewShip" type="primary" icon="el-icon-circle-plus" @click="addShip">
      Add Shipment
    </el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import ShipForm from './ShipForm.vue';
import { whTypeOptions } from '/@/assets/enum/logistic';
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
const shipArr = ref([]);

const isOnHold = ref(false);
const disableNewShip = ref(false);
const isDialogPattern = type => props.dialogStatus === type;

const removeShip = (idx, shipId) => {
  shipArr.value.splice(idx, 1);
  disableNewShip.value = false;
  emit('fetchList');
};

const addShip = () => {
  if (!formData.value.id) {
    ElMessage.error('You need to "Submit Common Section" before "Add Sub-Ship"', 3);
    return;
  }
  shipArr.value.push({costs: {}, sourceId: '', items: []});
  disableNewShip.value = true;
};

const submitShip = (ship, freightId, shipIdx) => {
  disableNewShip.value = false;
  emit('fetchList');
};

const updateShip = (data, shipIdx) => {
  emit('fetchList');
};

const onHoldTask = () => {
  console.log("onHoldTask");
};
</script>

<style lang="sass" scoped>

</style>
