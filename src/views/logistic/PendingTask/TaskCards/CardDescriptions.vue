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
      {{ formatDate(task.createdAt) }}
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
    <el-descriptions-item label="Carrier & Transport">
      {{ carrierEnum[task.carrier] }}


      <el-select
        v-if="task.carrier === 'TRUCK'"
        placeholder="Please select"
      >
        <el-option
          v-for="(item, key) in transportEnum"
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

<script setup>
import OrderShipmentInfo from '../../components/OrderShipmentInfo.vue';
import { carrierEnum, transportEnum } from '@/enums/logistic';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const orderEnum = inject('orderEnum');

const formatDate = date => date.replace('T', ' ').replace(/\.\d+/, '');
</script>

<style lang="sass" scoped>

</style>
