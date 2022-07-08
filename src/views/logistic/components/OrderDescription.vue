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
      :min-width="280"
    >
      <template #label>
        External ID
      </template>
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
    <el-descriptions-item :min-width="200">
      <template #label>
        Order from
      </template>
      {{ (orderItem?.orderFrom) }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Marketplace
      </template>
      {{ (orderItem?.marketplace) }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Created At
      </template>
      {{ formatVBDate(orderItem?.createdAt) }}
    </el-descriptions-item>
    <el-descriptions-item :min-width="200">
      <template #label>
        Products
      </template>
      <template
        v-for="(quantity, code) in orderItem.productsQty"
        :key="code"
      >
        <div>
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
    <el-descriptions-item>
      <template #label>
        Shipment Info
      </template>
      <OrderShipmentInfo :order-item="orderItem" />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        History Task
      </template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
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
