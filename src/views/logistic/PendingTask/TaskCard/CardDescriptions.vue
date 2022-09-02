<template>
  <el-descriptions
    :column="3"
    direction="vertical"
    border
  >
    <el-descriptions-item label="Order ID">
      {{ orderEnum[task.orderId]?.id }}
      <template
        v-for="order in orderEnum[task.orderId]?.rawOrders"
        :key="order.id"
      >
        <el-tag size="small">
          {{ order?.id }}
        </el-tag>
      </template>
    </el-descriptions-item>
    <el-descriptions-item label="Task ID">
      {{ task.id }}
    </el-descriptions-item>
    <el-descriptions-item label="TaskType">
      {{ task.taskType }}
    </el-descriptions-item>
    <el-descriptions-item
      width="30%"
      label="Create Date"
    >
      {{ formatVBDate(task.createdAt) }}
    </el-descriptions-item>
    <el-descriptions-item
      width="30%"
      label="Fulfilled Date"
    >
      <span v-if="task.fulfilledAt">
        {{ formatVBDate(task.fulfilledAt) }}
      </span>
      <span v-else></span>
    </el-descriptions-item>
    <el-descriptions-item
      label="Status & Action"
      width="40%"
    >
      <el-tooltip
        v-if="tasksProductFulQty[task.id]?.error"
        effect="light"
      >
        <el-button
          type="danger"
          size="default"
        >
          Incomplete
        </el-button>
        <template #content>
          <el-tag
            size="large"
            type="danger"
            style="font-size: 14px"
          >
            {{ tasksProductFulQty[task.id]?.error }}
          </el-tag>
        </template>
      </el-tooltip>
      <el-button
        v-if="!tasksProductFulQty[task.id]?.error"
        type="primary"
      >
        Complete
      </el-button>
      <el-button
        :type="task.fulfilledAt ? 'warning' : 'success'"
        :disabled="!!tasksProductFulQty[task.id]?.error"
        @click="updateTaskFulfillTime"
      >
        {{ isFulfilled ? 'Fulfilled' : 'Fulfill' }}
      </el-button>
      <el-button
        type="success"
        :disabled="!isFulfilled"
        @click="sendEmailAPI(task.id)"
      >
        Send Email
      </el-button>
      <el-button
        v-if="warehouseEnum[task.sourceId] === 'Lightning'"
        type="success"
        :disabled="notHighPermission"
        @click="syncLightning(task.id)"
      >
        Sync Lightning
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="Transport & Carrier">
      {{ transportEnum[task.transportMode] }}
      <el-select
        v-if="task.transportMode"
        v-model="task.carrier"
        placeholder="Please select"
        clearable
        @change="onCarrierChange()"
      >
        <el-option
          v-for="(item, key) in transportCarrierEnum[task.transportMode]"
          :key="item"
          :label="item"
          :value="key"
        />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="Shipment Info">
      <OrderShipmentInfo :order-item="orderEnum[task.orderId] || {}" />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          Note
          <el-button
            :type="isEditTaskNote ? 'success' : 'primary'"
            @click="editTaskNote"
          >
            {{ isEditTaskNote ? 'save' : 'edit' }}
          </el-button>
        </div>
      </template>
      <el-input
        v-model="task.note"
        type="textarea"
        :autosize="{ minRows: 4 }"
        :disabled="!isEditTaskNote"
      ></el-input>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import OrderShipmentInfo from '../../components/OrderShipmentInfo.vue';
import { transportEnum, transportCarrierEnum } from '@/enums/logistic';
import { updateTaskAPI, sendEmailAPI, syncLightningAPI } from '@/api';
import { formatVBDate } from '@/utils/logistic';

const props = defineProps({
  taskIdx: {
    type: Number,
    required: true
  },
  orderEnum: {
    type: Object,
    default: () => {}
  },
  warehouseEnum: {
    type: Object,
    default: () => {}
  },
  role: {
    type: String,
    required: true
  }
});

const notHighPermission = computed(() => !['ADMIN', 'VIBE_MANAGER'].includes(props.role));

const isFulfilled = ref(false);
const isEditTaskNote = ref(false);
const tasksProductFulQty = inject('tasksProductFulQty');
const dataList = inject('dataList');
const task = ref(dataList.value[props.taskIdx]);

watch(
  () => dataList.value,
  () => {
    setTimeout(() => { // 防止task突变引起的undefined err
      task.value = dataList.value[props.taskIdx];
    }, 300);
  }
);


const emit = defineEmits(['fetchList']);

const onCarrierChange = () => {
  const taskItem = task.value;
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm')
        updateTaskAPI(taskItem.id, taskItem, { syncLightning: false }).then(() => emit('fetchList'));
      else {
        ElMessage.info('Update Canceled.');
        emit('fetchList');
      }
    },
  });
};

const updateTaskFulfillTime = () => {
  const taskItem = task.value;
  taskItem.fulfilledAt = new Date();
  updateTaskAPI(taskItem.id, taskItem, { syncLightning: false }).then(() => {
    isFulfilled.value = true;
  });
};

const editTaskNote = () => {
  if (isEditTaskNote.value) {
    const taskItem = task.value;
    updateTaskAPI(taskItem.id, taskItem, { syncLightning: false }).then(() => {
      isEditTaskNote.value = false;
      emit('fetchList');
    });
  } else {
    isEditTaskNote.value = true;
  }
};

const syncLightning = (taskId) => {
  syncLightningAPI(taskId).then(() => emit('fetchList'));
};
</script>

<style lang="sass" scoped>
.cell-item
  display: flex
  justify-content: space-between
  align-items: center
.el-textarea
  display: block
</style>
