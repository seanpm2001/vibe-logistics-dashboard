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
        :task-id="taskItem.id"
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
          <el-form-item label="*Type">
            <el-select
              v-model="taskItem.taskType"
              disabled
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
            label="Return/Replace Reason Category"
          >
            <el-select
              v-model="taskItem.returnReason"
              :disabled="notCommonPermission"
              placeholder="Please select"
              clearable
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
          <el-form-item
            v-if="isReturnOrRepalce"
            label="Return/Replace Reason Detail"
          >
            <el-select
              v-model="taskItem.returnDetails"
              :disabled="notCommonPermission"
              placeholder="Please select category"
              clearable
              filterable
              default-first-option
            >
              <el-option
                v-for="(item) in taskReasonDetailEnum[taskItem.returnReason]"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="*Source Warehouse">
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
          <el-form-item label="*Target Warehouse">
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
          align="middle"
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
              type="textarea"
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

        <el-row
          justify="space-between"
          align="middle"
          :gutter="1"
        >
          <el-form-item label="Tracking Number Note">
            <el-input
              v-model="taskItem.trackingNumberNote"
              type="textarea"
              :disabled="notCommonPermission"
              placeholder="Tracking Number Note"
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="showUploadFileDialog"
          >
            Upload Shipping Labels
          </el-button>
          <el-button
            v-if="taskItem.files?.length"
            type="primary"
            @click="downloadAllFiles"
          >
            Download All Shipping Labels
          </el-button>
        </el-row>
        <div class="download-file-list">
          <strong>Files:</strong>
          <template
            v-for="file in taskItem?.files"
            :key="file.fileId"
          >
            <div>
              <el-tag
                class="cursor-pointer"
                @click="downloadFile(file)"
              >
                {{ file.fileName }}
              </el-tag>
              <svg-icon
                class="icon close-icon mgl-5"
                icon-name="close"
                @click="handleDeleteFile(file)"
              />
            </div>
          </template>
        </div>

        <el-row
          v-if="associatedTaskVisible"
          align="middle"
        >
          Associated
          {{ taskItem.taskType === "REPLACE" ? "return task" : "replace task" }}:
          <el-tag
            v-if="taskItem.refTaskId"
            class="cursor-pointer mgr-5"
            :type="taskItem.taskType === 'REPLACE' ? 'danger' : 'warning'"
            style="margin-left: 10px"
            @click="showAssociatedTask"
          >
            {{ taskItem.refTaskId }}
          </el-tag>
          <el-button
            v-if="!taskItem.refTaskId"
            type="danger"
            size="small"
            style="margin-left: 10px"
            @click="addAssociatedReturnTask"
          >
            add
          </el-button>
        </el-row>

        <ProductCard
          :not-common-permission="notCommonPermission"
          :warehouse-enum="warehouseEnum"
        />

        <template v-if="!notCommonPermission">
          <el-button
            v-if="taskItem.id"
            type="primary"
            :disabled="checkLightingTaskWrong || disableUnchangedTask"
            @click="handleWarehouseTask('update')"
          >
            Update Warehouse Task
          </el-button>
          <el-button
            v-else
            type="primary"
            :disabled="checkLightingTaskWrong"
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

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import ShipmentForm from './ShipmentForm.vue';
import ProductCard from './ProductCard.vue';
import OrderDescription from '../OrderDescription.vue';
import { createTaskAPI, updateTaskAPI, findTaskAPI, findTaskFileAPI, deleteTaskFileAPI, } from '@/api';
import {
  taskTypeEnum,
  taskReasonEnum,
  taskReasonDetailEnum,
  noSerialArr,
} from '@/enums/logistic';
import { useUserStore } from '@/store';

const props = defineProps({
  emptyTaskItem: {
    type: Object,
    required: true,
  },
  warehouseEnum: {
    type: Object,
    required: true,
  },
  dialogStatus: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['fetchList', 'updateTaskItem']);
const fetchList = () => emit('fetchList');

/* Start data */
const dialogTaskVisible = inject('dialogTaskVisible');
const dialogUploadVisible = inject('dialogUploadVisible');
const taskItem = inject('taskItem') ;
const disableUnchangedTask = inject('disableUnchangedTask');
const taskOrderItem = inject('taskOrderItem') ;


const { proxy } = getCurrentInstance();
const { role } = storeToRefs(useUserStore());
const notCommonPermission = computed(
  () => !['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR'].includes(role.value)
);


const getCustomerId = () =>
  Number(
    Object.keys(props.warehouseEnum).find(
      (key) => props.warehouseEnum[key] === 'Customer'
    )
  );

watchEffect(() => {
  const customerId = getCustomerId();
  if (
    customerId &&
    taskItem.value.sourceId !== customerId &&
    taskItem.value.taskType === 'RETURN'
  ) {
    taskItem.value.sourceId = customerId;
    ElMessage.warning('Source has been set to Customer!');
  }
});

const showUploadFileDialog = () => {
  dialogUploadVisible.value = true;
};
const downloadAllFiles = () => {
  const files = taskItem.value.files || [];
  const promiseArr = [];
  files.forEach(file => {
    promiseArr.push(downloadFile(file));
  });
  Promise.allSettled(promiseArr);
};

const packageArr = ref([]);

const returnReplaceArr = ['REPLACE', 'RETURN', 'RETURN_TO_REPAIR'];
// const returnMoveArr = ['MOVE', 'RETURN', 'RETURN_TO_REPAIR'];
const isReturnOrRepalce = computed(() =>
  returnReplaceArr.includes(taskItem.value.taskType)
);
// const isMoveOrReturn = computed(() => returnMoveArr.includes(taskItem.value.taskType));

provide('packageArr', packageArr);
provide('taskItem', taskItem);
/* End data */

const downloadFile = file => {
  const taskId = file.fileName.split('#')[1];
  findTaskFileAPI(taskId, file.fileId).then(data => {
    window.open(data.downloadUrl);
  });
};

const checkLightingTaskWrong = computed(() => {
  const sourceId = taskItem.value.sourceId;
  const source = props.warehouseEnum[sourceId];
  if (source !== 'Lightning') return false;

  let flag = false;
  const products = taskItem.value.products;
  flag = products.some(
    (product) => !product.sku || noSerialArr.includes(product.productCode)
  );
  if (flag)
    ElMessage.error('Lightning Task Products can\'t be accessories and must have SKU.');

  return flag;
});

function removeEmptyTask(products) {
  console.log('products: ', products);
  for (let idx = products.length - 1; idx >= 0; idx--) {
    const code = products[idx].productCode;
    if (!code && idx !== 0) products.splice(idx, 1);
  }
}

const handleWarehouseTask = (type) => {
  if (!checkRequiredFilled())
    return;
  removeEmptyTask(taskItem.value.products);
  if (type === 'create') {
    createTaskAPI(taskItem.value).then((data) => {
      taskItem.value = data;
      fetchList();
    });
  } else {
    updateTaskAPI(taskItem.value.id, taskItem.value).then((data) => {
      taskItem.value = data || taskItem.value;
      fetchList();
    });
  }
};

function checkRequiredFilled () {
  const task = taskItem.value;
  if (!task.sourceId || !task.targetId) {
    ElMessage.error('Please fill all required data!');
    return false;
  }
  return true;
}

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

const associatedTaskVisible = computed(() => {
  const task = taskItem.value;
  if (task.taskType === 'REPLACE') {
    return true;
  } else if (['RETURN', 'RETURN_TO_REPAIR'].includes(task.taskType) && task.refTaskId) {
    return true;
  }
  return false;
});

const addAssociatedReturnTask = () => {
  // TODO: need to check if there is any unsaved changes for current replace task
  ElMessageBox.confirm(
    'Are you sure to add a return associated return task? Please make sure save current task first.',
    'Warning',
    {
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          initializeAssociatedReturnTask();
        }
      },
    }
  );
};

const initializeAssociatedReturnTask = () => {
  const refTaskId = taskItem.value.id;
  const orderId = taskItem.value.orderId;
  const products = taskItem.value.products.map((product) => ({
    productCode: product.productCode,
    sku: product.sku,
    quantity: product.quantity,
  }));
  resetForm();
  setTimeout(() => {
    taskItem.value.refTaskId = refTaskId;
    taskItem.value.taskType = 'RETURN';
    taskItem.value.products = products;
    taskItem.value.orderId = orderId;
  }, 0);
};

const showAssociatedTask = () => {
  ElMessageBox.confirm(
    'Are you sure to go to associated task? Please make sure save current task first.',
    'Warning',
    {
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          const taskId = taskItem.value.refTaskId;
          resetForm();
          findTaskAPI(taskId).then((data) => {
            taskItem.value = data;
          });
        }
      },
    }
  );
};

const handleDeleteFile = (file) => {
  const fileName = file.fileName;
  ElMessageBox.confirm(`Delete the file of ${fileName} ?`, 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        const taskId = fileName.split('#')[1];
        deleteTaskFileAPI(taskId, file.fileId).then(() => {
          emit('updateTaskItem');
        });
      } else if (action === 'cancel') {
        ElMessage.info('Delete canceled');
      }
    },
  });
};
</script>

<style lang="sass" scoped>
.el-form
  .el-form-item
    margin-bottom: 0
  .el-row
    padding: 0 1rem 1rem
</style>
