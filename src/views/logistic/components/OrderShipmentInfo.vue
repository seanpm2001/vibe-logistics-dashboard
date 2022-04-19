<template>
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
</template>

<script setup>
const props = defineProps({
  orderItem: {
    type: Object,
  }
});
</script>

<style lang="sass" scoped>
.shipment-info
  .el-tag
    margin-right: 50%
</style>
