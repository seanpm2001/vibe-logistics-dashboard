<template>
  <el-dialog
    width="90%"
    title="Warehouse Task"
    v-model="dialogTaskVisible"
    :close-on-click-modal="false"
  >
    <template v-if="taskOrderItem">
      <OrderDescription
        :orderItem="taskOrderItem"
      />
    </template>

    <el-card>
      <el-form
        ref="dataForm"
        :model="taskItem"
        label-position="left"
        label-width="170px"
      >
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Type">
            <el-select v-model="taskItem.type" :disabled="isDialogPattern('view')" placeholder="Please select">
              <el-option v-for="(item, key) in taskTypeEnum" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isReturnOrRepalce" label="Return/Replace reason">
            <el-select
              v-model="taskItem.reason" :disabled="isDialogPattern('view')" placeholder="Please select"
              filterable allow-create default-first-option
            >
              <el-option v-for="(item, key) in taskReasonEnum" :key="item" :label="item" :value="key" />
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
        </el-row>

        <template v-if="isMoveOrReturn">
          <el-row>
            <el-form-item label="Specify Serial">
              <el-checkbox-group  v-model="checkedSpecifySerial" :max="1">
                <el-checkbox :key="true" :label="true">true</el-checkbox>
                <el-checkbox :key="false" :label="false">false</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <template v-if="checkedSpecifySerial[0]">
            <template v-for="(item, index) in taskItem.specifySerailArr" :key="index">
              <el-row align="middle" class="add-minus-row">
                <svg-icon class="icon" icon-name="add" @click="onSpecifySerialChange(index, 'add')" />
                <svg-icon class="icon" :style="taskItem.specifySerailArr.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="onSpecifySerialChange(index, 'minus')" />
                <el-form-item label="Unit Serial">
                  <el-select
                    v-model="item.serial" :disabled="isDialogPattern('view')" placeholder="Please select"
                    filterable allow-create default-first-option
                  >
                    <el-option v-for="(item, index) in unitList" :key="index" :label="item.serial" :value="item.serial" />
                  </el-select>
                </el-form-item>
              </el-row>
            </template>
          </template>
        </template>

        <el-row align="middle">
          <el-checkbox v-model="showUsedUnits">
            Show Used Units
          </el-checkbox>
          <el-tooltip
            class="tips"
            effect="light"
            content="For performance reasons, there is a 1-second delay in updating the unit selection list. If you operate both units within 1 second, the data will be empty. Click refresh list again."
            placement="right"
          >
            <svg-icon class="mgl-5" icon-name="tips" />
          </el-tooltip>
        </el-row>
        <template v-if="showUsedUnits">
          <template v-for="(item, index) in taskItem.usedUnitArr" :key="index">
            <el-row justify="space-between" align="middle" class="add-minus-row">
              <svg-icon class="icon" icon-name="add" @click="onUsedUnitChange(index, 'add')" />
              <svg-icon class="icon" :style="taskItem.usedUnitArr.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="onUsedUnitChange(index, 'minus')" />
              <el-form-item label="Used Age">
                <el-select v-model="item.usedAge" placeholder="Please select" clearable>
                  <el-option v-for="(item, key) in usedAgeEnum" :key="item" :label="item" :value="key" />
                </el-select>
              </el-form-item>
              <el-form-item label="Condition">
                <el-select v-model="item.condition" placeholder="Please select" clearable>
                  <el-option v-for="(item, key) in conditionEnum" :key="item" :label="item" :value="key" />
                </el-select>
              </el-form-item>
              <el-form-item label="Unit Serial">
                <el-select
                  v-model="item.serial" :disabled="isDialogPattern('view')" placeholder="Please select"
                  @focus="filterUnitArr(item)" filterable allow-create default-first-option
                >
                  <el-option v-for="(item, index) in filteredUnitArr" :key="index" :label="item.serial" :value="item.serial" />
                </el-select>
              </el-form-item>
            </el-row>
          </template>
        </template>

        <template v-if="!isDialogPattern('view')">
          <el-button v-if="taskItem.id" type="primary" @click="handleWarehouseTask('update')">
            Update Warehouse Task
          </el-button>
          <el-button v-else type="primary" @click="handleWarehouseTask('create')">
            Submit Warehouse Task
          </el-button>
        </template>

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
    </el-card>
    
    <template v-slot:footer>
      <el-button @click="dialogTaskVisible = false">
        Close
      </el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import { useStore } from 'vuex';
import { ElMessage } from "element-plus";
import { throttle } from "/@/utils";
import ShipmentForm from './ShipmentForm.vue';
import OrderDescription from './OrderDescription.vue';
import {
  taskTypeEnum, taskReasonEnum, taskStatusEnum,
  usedAgeEnum, reversedUsedAgeEnum, conditionEnum, reversedConditionEnum
} from '/@/enums/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  emptyTaskItem: {
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
const taskOrderItem = inject('taskOrderItem');

const store = useStore();
const { proxy } = getCurrentInstance();

const unitList = computed(() => store.getters.unitList);
const filteredUnitArr = shallowRef(null);
const filterUnitArr = filterObj => {
  console.log('filterObj: ', filterObj);
  filteredUnitArr.value = unitList.value.filter(unit => {
    console.log('unit: ', unit);
    if (!filterObj.usedAge && !filterObj.condition) return true;
    if (!filterObj.usedAge && (filterObj.condition === unit.condition)) return true;
    if (!filterObj.condition && (filterObj.usedAge === unit.usedAge)) return true;
    if (filterObj.condition === unit.condition && (filterObj.usedAge === unit.usedAge)) return true;
    return false;
  });
};

const isOnHold = ref(false);
const showUsedUnits = ref(false);
const checkedSpecifySerial = ref([]);
const showSpecifySerails = ref(false);
const disableNewShipment = ref(false);

const returnReplaceArr = ['REPLACE', 'RETURN', 'RETURN_TO_REPAIR'];
const returnMoveArr = ['MOVE', 'RETURN', 'RETURN_TO_REPAIR'];
const isReturnOrRepalce = computed(() => returnReplaceArr.includes(taskItem.value.type));
const isMoveOrReturn = computed(() => returnMoveArr.includes(taskItem.value.type));
/* End data */

// watchEffect(() => {
//   if (isReturnOrRepalce.value) {
//     console.log('isReturnOrRepalce: ', isReturnOrRepalce);
//   }
// });

const isDialogPattern = type => props.dialogStatus === type;

const handleWarehouseTask = type => {
  console.log('type: ', type);

};

const onUsedUnitChange = (idx, type) => {
  const unitArr = taskItem.value.usedUnitArr;
  type === "add" ? unitArr.push({serial: null, condition: null, usedAge: null}) : unitArr.splice(idx, 1);
};

const onSpecifySerialChange = (idx, type) => {
  const serialArr = taskItem.value.specifySerailArr;
  type === "add" ? serialArr.push({serial: null}) : serialArr.splice(idx, 1);
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

function initGlobalData() {
  if (unitList.value.length === 0) // init unitList:[]
    store.dispatch('logistic/setUnitList');
}

onMounted(() => {
  initGlobalData();
});
</script>

<style lang="sass" scoped>
.el-form .el-row
  padding: 0 1rem

</style>
