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
          <svg-icon :icon-name="productIconMap[product.productCode] || 'product-other'" />
          <span class="mgl-5">
            {{ productMap[product.productCode] || product.sku }}:
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
      <div class="shipment-info" align="left">
        <el-tag size="small" v-if="orderItem?.shippingName">
          ATTN: {{orderItem.shippingName}}
        </el-tag>
        <el-tag size="small" v-if="orderItem?.shippingCompany">{{orderItem.shippingCompany}}</el-tag>
        <el-tag size="small" v-if="orderItem?.shippingAddress1">{{orderItem.shippingAddress1}}</el-tag>
        <el-tag size="small" v-if="orderItem?.shippingAddress2">{{orderItem.shippingAddress2}}</el-tag>
        <el-tag size="small" v-if="orderItem?.shippingCity || orderItem?.shippingState || orderItem?.shippingZip || orderItem?.shippingCountry">
          {{orderItem.shippingCity}}, {{orderItem.shippingState}}, {{orderItem.shippingZip}}, {{orderItem.shippingCountry}}
        </el-tag>
        <p style="visibility:hidden">placeholder</p>
        <el-tag size="small" v-if="orderItem?.shippingPhone">
          TEL: {{orderItem?.shippingPhone}}
        </el-tag>
        <br>
        <a :href="'mailto:' + orderItem?.email" class="link" target="_blank">{{ orderItem?.email }}</a>
      </div>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>History Task</template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { packageStatusEnum } from '/@/enums/logistic';
import { productMap, productIconMap, skuProdcutEnum } from '/@/enums/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  orderItem: {
    type: Object,
    required: true
  },
});

console.log(props.orderItem);
</script>

<style lang="sass" scoped>
.shipment-info
  .el-tag
    margin-right: 50%
</style>
