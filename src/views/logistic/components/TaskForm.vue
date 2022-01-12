<template>
  <el-form ref="dataForm" :model="formData" label-position="left" label-width="140px">
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Source Warehouse">
        <el-select v-model="formData.sourceId" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="Target Warehouse">
        <el-select v-model="formData.targetId" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="Type">
        <el-select v-model="formData.type" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseOptions" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Task Status">
        <el-input disabled v-model="formData.status" placeholder="Task Status" style="width: 120px;" />
      </el-form-item>
      <el-form-item label="On hold">
        <el-switch v-model="isOnHold" @click="onHoldTask">
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
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['fetchList']);

const formData = ref(props.taskForm);
const shipArr = ref([]);

const isOnHold = ref(false);
const disableNewShip = ref(false);

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
