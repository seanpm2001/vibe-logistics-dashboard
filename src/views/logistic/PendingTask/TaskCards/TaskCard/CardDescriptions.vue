<template>
  <el-descriptions
    :column="4"
    direction="vertical"
    border
  >
    <el-descriptions-item
      width="300px"
      label="Create Date"
    >
      {{ formatVBDate(task.createdAt) }}
    </el-descriptions-item>
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
    <el-descriptions-item label="Transport & Carrier">
      {{ transportEnum[task.transportMode] }}
      <el-select
        v-if="task.transportMode"
        v-model="taskCarrier"
        placeholder="Please select"
        @change="onCarrierChange(task)"
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
  </el-descriptions>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import OrderShipmentInfo from '../../../components/OrderShipmentInfo.vue';
import { transportEnum, transportCarrierEnum } from '@/enums/logistic';
import { updateTaskAPI } from '@/api';
import { formatVBDate } from '@/utils/logistic';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  orderEnum: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(['fetchList']);
const taskCarrier = ref(props.task.carrier);

const onCarrierChange = (task) => {
  task.carrier = taskCarrier.value;
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm')
        updateTaskAPI(task.id, task).then(() => emit('fetchList'));
      else
        ElMessage.info('Update Canceled.');
    },
  });
};
</script>

<style lang="sass" scoped>

</style>
