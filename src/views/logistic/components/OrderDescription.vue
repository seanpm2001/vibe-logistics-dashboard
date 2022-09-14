<template>
  <el-descriptions
    class="mgb-5"
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>
        <strong v-if="orderItem?.rawOrders">Assigned </strong>
        <strong v-else>Origin </strong>
        Order Id
      </template>
      {{ orderItem?.id }}
      <template
        v-for="order in orderItem.rawOrders"
        :key="order.id"
      >
        <el-tag>{{ order.id }}</el-tag>
      </template>
    </el-descriptions-item>
    <el-descriptions-item
      v-if="taskId"
      label="External ID"
      :min-width="280"
    >
      <template
        v-for="item in orderItem.rawOrders"
        :key="item.id"
      >
        <el-tag
          class="cursor-pointer"
          @click="copy(getExternalId(item.id, taskId))"
        >
          {{ getExternalId(item.id, taskId) }}
        </el-tag>
      </template>
    </el-descriptions-item>
    <el-descriptions-item
      label="Order from"
      :min-width="200"
    >
      {{ (orderItem?.orderFrom) }}
    </el-descriptions-item>
    <el-descriptions-item label="Marketplace">
      {{ (orderItem?.marketplace) }}
    </el-descriptions-item>
    <el-descriptions-item label="Created At">
      {{ formatVBDate(orderItem?.createdAt) }}
    </el-descriptions-item>
    <el-descriptions-item
      label="Products"
      :min-width="200"
    >
      <template
        v-for="(quantity, code) in orderItem?.productsQty"
        :key="code"
      >
        <div v-if="quantity">
          <svg-icon :icon-name="codeIconEnum[code] || 'product-other'" />
          <span class="mgl-5">
            {{ codeNameEnum[code] || code }}:
            <el-tag
              class="mgl-5"
              size="small"
            >{{ quantity }}</el-tag>
          </span>
        </div>
      </template>
    </el-descriptions-item>
    <el-descriptions-item label="Shipment Info">
      <OrderShipmentInfo :order-item="orderItem" />
    </el-descriptions-item>
    <el-descriptions-item label="History Task">
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import OrderShipmentInfo from './OrderShipmentInfo.vue';
import { formatVBDate, getExternalId, copy } from '@/utils/logistic';
import { codeNameEnum, codeIconEnum, skuCodeEnum } from '@/enums/logistic';

defineProps({
  taskId: {
    type: Number,
    default: 0
  },
  orderItem: {
    type: Object,
    required: true
  },
});
</script>

<style lang="sass" scoped>
.shipment-info
  .el-tag
    margin-right: 50%
</style>
