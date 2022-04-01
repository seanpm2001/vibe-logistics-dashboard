<template>
  <el-dialog
    width="90%"
    title="Warehouse Task"
    v-model="dialogTaskVisible"
    :close-on-click-modal="false"
    :before-close="beforeCloseDialog"
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
      >
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="Type">
            <el-select v-model="taskItem.taskType" :disabled="notCommonPermission" placeholder="Please select">
              <el-option v-for="(item, key) in taskTypeEnum" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isReturnOrRepalce" label="Return/Replace reason">
            <el-select
              v-model="taskItem.returnReason" :disabled="notCommonPermission" placeholder="Please select"
              filterable allow-create default-first-option
            >
              <el-option v-for="(item, key) in taskReasonEnum" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Source Warehouse">
            <el-select v-model="taskItem.sourceId" :disabled="notCommonPermission" placeholder="Please select">
              <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
            </el-select>
          </el-form-item>
          <el-form-item label="Target Warehouse">
            <el-select v-model="taskItem.targetId" :disabled="notCommonPermission" placeholder="Please select">
              <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row justify="space-between" :gutter="3">
          <el-form-item label="New Address">
            <el-input :disabled="notCommonPermission" v-model="taskItem.newAddress" placeholder="New Address"/>
          </el-form-item>
          <el-form-item label="Note">
            <el-input :disabled="notCommonPermission" v-model="taskItem.note" placeholder="Note"/>
          </el-form-item>
          <el-form-item label="On hold">
            <el-switch :disabled="notCommonPermission" v-model="isOnHold" @click="onHoldTask">
              On hold:
            </el-switch>
          </el-form-item>
        </el-row>
        
        <el-card>
          Product: 
          <el-form-item v-if="!notCommonPermission" label="Specify Serial">
            <el-checkbox-group v-model="checkedSpecifySerial" :max="1">
              <el-checkbox :key="true" :label="true">true</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <template v-for="(item, index) in taskItem.products" :key="item.sku">
            <el-row align="middle" class="add-minus-row">
              <svg-icon class="icon" icon-name="add" @click="onProductChange(index, 'add')" />
              <svg-icon class="icon" :style="taskItem.products.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="onProductChange(index, 'minus')" />
              <el-form-item label="Sku" :rules="{ required: true, message: 'Product sku is required', trigger: 'change' }">
                <el-select
                  v-model="item.sku" :disabled="notCommonPermission" placeholder="Please select"
                  filterable allow-create default-first-option
                >
                  <el-option v-for="(item, key) in skuProdcutEnum" :key="key" :label="key" :value="key" />
                </el-select>
              </el-form-item>
              <el-form-item label="Quantity" :rules="{ required: true, message: 'Product quantity is required', trigger: 'change' }">
                <el-input :disabled="notCommonPermission" v-model="item.quantity" placeholder="Quantity" />
              </el-form-item>
              <el-form-item label="Condition">
                <el-select :disabled="notCommonPermission" v-model="item.condition" placeholder="Please select" clearable>
                  <el-option v-for="(item, key) in unitConditionEnum" :key="item" :label="item" :value="key" />
                </el-select>
              </el-form-item>
              <el-form-item label="Available">
                <el-input disabled>999</el-input>
              </el-form-item>
              <el-form-item v-show="checkedSpecifySerial[0] || item.serialNote?.length" label="Serials">
                <el-select
                  v-model="item.serialNote" :disabled="notCommonPermission" placeholder="Please select"
                  filterable allow-create default-first-option multiple style="width: 260px"
                >
                  <el-option
                    v-for="unit in unitList"
                    :key="unit.serial"
                    :label="unit.serial + ' : ' + unit.sku"
                    :value="unit.serial"
                  />
                </el-select>
              </el-form-item>
            </el-row>
          </template>
        </el-card>
        

        <template v-if="!notCommonPermission">
          <el-button v-if="taskItem.id" type="primary" @click="handleWarehouseTask('update')">
            Update Warehouse Task
          </el-button>
          <el-button v-else type="primary" @click="handleWarehouseTask('create')">
            Submit Warehouse Task
          </el-button>
        </template>

        <el-card>
          <ShipmentForm
            ref="shipmentForm"
            :taskId="taskItem?.id || 0"
            :orderId="taskItem?.orderId"
            :warehouseEnum="warehouseEnum"
            :dialogStatus="dialogStatus"
            @fetchList="fetchList"
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
import { ElMessage, ElTooltip } from 'element-plus';
import { throttle, debounce } from '/@/utils';
import ShipmentForm from './ShipmentForm.vue';
import OrderDescription from '../OrderDescription.vue';
import { createTaskAPI, updateTaskAPI } from '/@/api/logistic';
import {
  taskTypeEnum, taskReasonEnum, taskStatusEnum, skuProdcutEnum,
  unitConditionEnum
} from '/@/enums/logistic';

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

const emit = defineEmits(['fetchList']);
const fetchList = () => emit['fetchList'];

/* Start data */
const dialogTaskVisible = inject('dialogTaskVisible');
const taskItem = inject('taskItem');
const specifySerailArr = inject('specifySerailArr');
const taskOrderItem = inject('taskOrderItem');

const store = useStore();
const { proxy } = getCurrentInstance();
const role = store.getters.role;
const notCommonPermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR'].includes(role));

const unitList = computed(() => {
  const taskProducts = taskItem.value.products;
  return store.getters['unitList'].filter(item => {
    for (const i in taskProducts) {
      if (item.sku === taskProducts[i].sku) return true;
    }
  });
});

const packageArr = ref([]);
const isOnHold = ref(false);
const showUsedUnits = ref(false);
const checkedSpecifySerial = ref([]);
const disableNewShipment = ref(false);

const returnReplaceArr = ['REPLACE', 'RETURN', 'RETURN_TO_REPAIR'];
const returnMoveArr = ['MOVE', 'RETURN', 'RETURN_TO_REPAIR'];
const isReturnOrRepalce = computed(() => returnReplaceArr.includes(taskItem.value.taskType));
// const isMoveOrReturn = computed(() => returnMoveArr.includes(taskItem.value.taskType));

provide('packageArr', packageArr);
provide('taskItem', taskItem);
/* End data */

const handleWarehouseTask = _type => {
  if (_type === 'create') {
    createTaskAPI(taskItem.value).then(_data => {
      taskItem.value = _data;
      emit('fetchList');
    });
  } else {
    updateTaskAPI(taskItem.value.id, taskItem.value).then(_data => {
      taskItem.value = _data || taskItem.value;
    });
  }
};

const onSpecifySerialChange = (_idx, _type) => {
  const serialArr = specifySerailArr.value;
  _type === 'add' ? serialArr.push({serial: null}) : serialArr.splice(_idx--, 1);
};

const onProductChange = (_idx, _type) => {
  const products = taskItem.value.products;
  _type === 'add'
    ? products.push({sku: null, condition: null, quantity: null})
    : products.splice(_idx--, 1);
};

const onHoldTask = () => { // TODO: onHoldTask
  console.log('onHoldTask');
};

const resetForm = () => {
  proxy.$nextTick(() => {
    packageArr.value = [];
    taskItem.value = Object.assign({}, props.emptyTaskItem);
    proxy.$refs['dataForm'].clearValidate();
  });
};

const beforeCloseDialog = (done) => {
  if (props.dialogStatus !== 'edit') {
    resetForm();
    done();
    return;
  }

  const isChanged = JSON.stringify(contrastData.value) !== JSON.stringify(taskItem.value);
  if (!isChanged) {
    resetForm();
    done();
  }
  isChanged &&
    ElMessageBox.confirm('Unsaved changes, are you sure to leave?', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          resetForm();
          done();
        }
      },
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
