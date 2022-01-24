<template>
  <el-dialog
    width="90%"
    title="Warehouse Task"
    v-model="dialogTaskVisible"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataForm"
      :model="taskItem"
      label-position="left"
      label-width="140px"
    >
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Type">
          <el-select v-model="taskItem.type" :disabled="isDialogPattern('view')" placeholder="Please select">
            <el-option v-for="(item, key) in taskTypeEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Source Warehouse">
          <el-select v-model="taskItem.sourceId" :disabled="isDialogPattern('view')" placeholder="Please select">
            <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="Target Warehouse">
          <el-select v-model="taskItem.targetId" :disabled="isDialogPattern('view')" placeholder="Please select">
            <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Order ID">
          <el-input disabled v-model="taskItem.orderId" placeholder="Order Id" />
        </el-form-item>
        <el-form-item label="Task Status">
          <el-select v-model="taskItem.status" :disabled="isDialogPattern('view')" placeholder="Please select">
            <el-option v-for="(item, key) in taskStatusEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="On hold">
          <el-switch v-model="isOnHold" :disabled="isDialogPattern('view')" @click="onHoldTask">
            On hold:
          </el-switch>
        </el-form-item>
        <el-checkbox v-model="showUsedUnits">
          Show Used Units
        </el-checkbox>
      </el-row>
      <template v-if="showUsedUnits">
        <template v-for="(item, index) in taskItem.usedUnitArr" :key="index">
          <el-row justify="space-between" align="middle" class="add-minus-row">
            <svg-icon class="icon" icon-name="add" @click="handleUnitChange(index, 'add')" />
            <svg-icon class="icon" :style="taskItem.usedUnitArr.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="handleUnitChange(index, 'minus')" />
            <el-form-item label="Used Age">
              <el-select v-model="item.usedAge" placeholder="Please select">
                <el-option v-for="(item, key) in usedAgeEnum" :key="item" :label="item" :value="key" />
              </el-select>
            </el-form-item>
            <el-form-item label="Condition">
              <el-select v-model="item.condition" placeholder="Please select">
                <el-option v-for="(item, key) in conditionEnum" :key="item" :label="item" :value="key" />
              </el-select>
            </el-form-item>
            <el-form-item label="Unit Serial">
              <el-input v-model="item.serial" placeholder="Unit Serial"/>
            </el-form-item>
          </el-row>
        </template>
      </template>
      

      <div class="f-row controls" v-if="!isDialogPattern('view')">
        <el-button v-if="taskItem.id" type="primary" @click="handleWarehouseTask('update')">
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

      <el-card>
        <ShipmentForm
          :ref="`shipmentForm`"
          :taskId="taskItem.id"
          :orderId="taskItem.orderId"
          :warehouseEnum="warehouseEnum"
          :dialogStatus="dialogStatus"
        />
      </el-card>
    </el-form>

    <template v-slot:footer>
      <el-button @click="dialogTaskVisible = false">
        Close
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>

import { ElMessage } from "element-plus";
import ShipmentForm from './ShipmentForm.vue';
import { taskTypeEnum, taskStatusEnum, usedAgeEnum, conditionEnum } from '/@/assets/enum/logistic';
// eslint-disable-next-line no-undef
const props = defineProps({
  emptyTaskForm: {
    type: Object,
    required: true
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
  dialogStatus: {
    type: String,
    required: true
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['fetchList']);

/* Start data */
const dialogTaskVisible = inject('dialogTaskVisible');
const taskItem = inject('taskItem');

const { proxy } = getCurrentInstance();

const isOnHold = ref(false);
const showUsedUnits = ref(false);
const disableNewShipment = ref(false);
/* End data */

const isDialogPattern = type => props.dialogStatus === type;

const handleWarehouseTask = type => {
  console.log('type: ', type);

};

const handleUnitChange = (idx, type) => {
  const unitArr = taskItem.value.usedUnitArr;
  type === "add" ? unitArr.push({serial: null, condition: null, usedAge: null}) : unitArr.splice(idx, 1);
};

const onHoldTask = () => {
  console.log("onHoldTask");
};

const resetForm = () => {
  proxy.$nextTick(() => {
    taskItem.value = Object.assign({}, props.emptyFreightForm);
    proxy.$refs['dataForm'].clearValidate();
  });
};
</script>

<style lang="sass" scoped>
.el-form .el-row
  padding: 0 1rem

</style>
