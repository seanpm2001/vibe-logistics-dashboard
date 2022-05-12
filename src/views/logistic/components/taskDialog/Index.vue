<template>
  <el-dialog
    v-model="dialogTaskVisible"
    width="90%"
    title="Warehouse Task"
    :close-on-click-modal="false"
    :before-close="beforeCloseDialog"
  >
    <template v-if="taskOrderItem">
      <OrderDescription
        :order-item="taskOrderItem"
      />
    </template>

    <el-card>
      <el-form
        ref="dataForm"
        :model="taskItem"
        label-position="left"
      >
        <el-row
          justify="space-between"
          :gutter="3"
        >
          <el-form-item label="Type">
            <el-select
              v-model="taskItem.taskType"
              :disabled="notCommonPermission"
              placeholder="Please select"
            >
              <el-option
                v-for="(item, key) in taskTypeEnum"
                :key="item"
                :label="item"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isReturnOrRepalce"
            label="Return/Replace reason"
          >
            <el-select
              v-model="taskItem.returnReason"
              :disabled="notCommonPermission"
              placeholder="Please select"
              filterable
              default-first-option
            >
              <el-option
                v-for="(item, key) in taskReasonEnum"
                :key="item"
                :label="item"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Source Warehouse">
            <el-select
              v-model="taskItem.sourceId"
              :disabled="notCommonPermission"
              placeholder="Please select"
            >
              <el-option
                v-for="(item, key) in warehouseEnum"
                :key="item"
                :label="item"
                :value="Number(key)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Target Warehouse">
            <el-select
              v-model="taskItem.targetId"
              :disabled="notCommonPermission"
              placeholder="Please select"
            >
              <el-option
                v-for="(item, key) in warehouseEnum"
                :key="item"
                :label="item"
                :value="Number(key)"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row
          justify="space-between"
          :gutter="3"
        >
          <el-form-item label="New Address">
            <el-input
              v-model="taskItem.newAddress"
              :disabled="notCommonPermission"
              placeholder="New Address"
            />
          </el-form-item>
          <el-form-item label="Note">
            <el-input
              v-model="taskItem.note"
              :disabled="notCommonPermission"
              placeholder="Note"
            />
          </el-form-item>
          <el-form-item label="On hold">
            <el-switch
              v-model="taskItem.onHold"
              :disabled="notCommonPermission"
            >
              On hold:
            </el-switch>
          </el-form-item>
        </el-row>
        
        <el-card>
          Product: 
          <el-form-item
            v-if="!notCommonPermission"
            label="Specify Serial"
          >
            <el-checkbox-group
              v-model="checkedSpecifySerial"
              :max="1"
            >
              <el-checkbox
                :key="true"
                :label="true"
              >
                true
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <template
            v-for="(product, index) in taskItem.products"
            :key="product.sku"
          >
            <el-row
              align="middle"
              class="add-minus-row"
            >
              <svg-icon
                class="icon"
                icon-name="add"
                @click="onProductChange(index, 'add')"
              />
              <svg-icon
                class="icon"
                :style="taskItem.products.length <=1 ? 'visibility: hidden;':''"
                icon-name="minus"
                @click="onProductChange(index, 'minus')"
              />
              <el-form-item label="*Product Name">
                <el-select
                  v-model="product.productCode"
                  :disabled="notCommonPermission"
                  placeholder="Please select"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="(item, key) in taskOrderItem.items"
                    :key="key"
                    :label="codeNameEnum[item.productCode]"
                    :value="item.productCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Sku">
                <el-select
                  v-model="product.sku"
                  :disabled="notCommonPermission"
                  placeholder="Please select"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="sku in codeSkuArrEnum[product.productCode]"
                    :key="sku"
                    :label="sku"
                    :value="sku"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="*Quantity">
                <el-input-number
                  v-model="product.quantity"
                  :min="1"
                  :disabled="notCommonPermission"
                  placeholder="Quantity"
                />
              </el-form-item>
              <el-form-item label="Condition">
                <el-select
                  v-model="product.condition"
                  :disabled="notCommonPermission"
                  placeholder="Please select"
                  clearable
                >
                  <el-option
                    v-for="(condition, key) in unitConditionEnum"
                    :key="condition"
                    :label="condition"
                    :value="key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Available">
                <el-input disabled>
                  999
                </el-input>
              </el-form-item>
              <el-form-item
                v-show="checkedSpecifySerial[0] || product.serialNote?.length"
                label="Serials"
              >
                <el-select
                  v-model="product.serialNote"
                  :disabled="notCommonPermission"
                  placeholder="Please select"
                  filterable
                  style="width: 260px"
                  multiple
                  :multiple-limit="product.quantity"
                  remote
                  :remote-method="query => debounce(remoteMethod(query), 500)"
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
          <el-button
            v-if="taskItem.id"
            type="primary"
            @click="handleWarehouseTask('update')"
          >
            Update Warehouse Task
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="handleWarehouseTask('create')"
          >
            Submit Warehouse Task
          </el-button>
        </template>

        <el-card>
          <ShipmentForm
            ref="shipmentForm"
            :task-id="taskItem?.id || 0"
            :order-id="taskItem?.orderId"
            :warehouse-enum="warehouseEnum"
            :dialog-status="dialogStatus"
            @fetchList="fetchList"
          />
        </el-card>
      </el-form>
    </el-card>
    
    <template #footer>
      <el-button @click="dialogTaskVisible = false">
        Close
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { debounce } from '@/utils';
import ShipmentForm from './ShipmentForm.vue';
import OrderDescription from '../OrderDescription.vue';
import { createTaskAPI, updateTaskAPI, queryUnitsAPI } from '@/api/logistic';
import {
  taskTypeEnum, taskReasonEnum, skuCodeEnum,
  unitConditionEnum, codeNameEnum, codeSkuArrEnum
} from '@/enums/logistic';
import { useUserStore } from '@/store';

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

const { proxy } = getCurrentInstance();
const { role } = storeToRefs(useUserStore());
const notCommonPermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR'].includes(role.value));

const unitList = shallowRef(null);

const remoteMethod = query => {
  const taskProducts = taskItem.value.products;
  if (query) {
    queryUnitsAPI({ serial: query }).then(data => {
      unitList.value = data.filter(item => {
        for (const idx in taskProducts) {
          if (item.sku === taskProducts[idx].sku || skuCodeEnum[item.sku] === taskProducts[idx].productCode)
            return true;
        }
      });
    });
  } else {
    unitList.value = [];
  }
};

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

function removeEmptyTask (products) {
  for (let idx = products.length - 1; idx >= 0; idx--) {
    const code = products[idx].productCode;
    if (!code)
      products[idx].splice(idx, 1);
  }
}

const handleWarehouseTask = type => {
  removeEmptyTask(taskItem.value.products);
  console.log('taskItem.value: ', taskItem.value);
  if (type === 'create') {
    createTaskAPI(taskItem.value).then(data => {
      taskItem.value = data;
      fetchList();
    });
  } else {
    updateTaskAPI(taskItem.value.id, taskItem.value).then(data => {
      taskItem.value = data || taskItem.value;
      fetchList();
    });
  }
};

const onSpecifySerialChange = (idx, type) => {
  const serialArr = specifySerailArr.value;
  type === 'add' ? serialArr.push({serial: null}) : serialArr.splice(idx--, 1);
};

const onProductChange = (idx, type) => {
  const products = taskItem.value.products;
  type === 'add'
    ? products.push({sku: null, condition: null, quantity: null})
    : products.splice(idx--, 1);
};

const resetForm = () => {
  nextTick(() => {
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
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          resetForm();
          done();
        }
      },
    });
};

</script>

<style lang="sass" scoped>
.el-form .el-row
  padding: 0 1rem

</style>
