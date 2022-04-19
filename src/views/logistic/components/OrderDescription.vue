<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>Order Id</template>
      {{orderItem?.id}}
      <template v-for="order in orderItem.rawOrders" :key="order.id">
        <el-tag>{{order.id}}</el-tag>
      </template>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Order from</template>
      {{(orderItem?.orderFrom)}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Products</template>
      <template v-for="product in orderItem.items" :key="product.sku">
        <div>
          <svg-icon :icon-name="codeIconEnum[product.productCode] || 'product-other'" />
          <span class="mgl-5">
            {{ codeNameEnum[product.productCode] || product.productCode }}:
            <el-tag class="mgl-5" size="small">{{ product.quantity }}</el-tag>
          </span>
        </div>
      </template>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Marketplace</template>
      {{(orderItem?.marketplace)}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Created At</template>
      {{(orderItem?.createdAt)}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Shipment Info</template>
      <OrderShipmentInfo :orderItem="orderItem" />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>History Task</template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import OrderShipmentInfo from './OrderShipmentInfo.vue';
import { ElMessageBox } from 'element-plus';
import { packageStatusEnum } from '/@/enums/logistic';
import { codeNameEnum, codeIconEnum, skuCodeEnum } from '/@/enums/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
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
