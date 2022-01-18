<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>Order Id</template>
      {{orderItem?.id}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Order from</template>
      {{(orderItem?.orderFrom)}}
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
        <el-tag size="small" v-if="orderItem.shippingName">
          ATTN: {{orderItem.shippingName}}
        </el-tag>
        <el-tag size="small" v-if="orderItem.shippingCompany">{{orderItem.shippingCompany}}</el-tag>
        <el-tag size="small" v-if="orderItem.shippingAddress1">{{orderItem.shippingAddress1}}</el-tag>
        <el-tag size="small" v-if="orderItem.shippingAddress2">{{orderItem.shippingAddress2}}</el-tag>
        <el-tag size="small" v-if="orderItem.shippingCity || orderItem.shippingState || orderItem.shippingZip || orderItem.shippingCountry">
          {{orderItem.shippingCity}}, {{orderItem.shippingState}}, {{orderItem.shippingZip}}, {{orderItem.shippingCountry}}
        </el-tag>
        <p style="visibility:hidden">placeholder</p>
        <el-tag size="small" v-if="orderItem.shippingPhone">
          TEL: {{orderItem.shippingPhone}}
        </el-tag>
        <br>
        <a :href="'mailto:' + orderItem.email" class="link" target="_blank">{{ orderItem.email }}</a>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { packageStatusOptions } from '/@/assets/enum/logistic';

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
