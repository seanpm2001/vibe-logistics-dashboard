<template>
  <div
    class="shipment-info"
    align="left"
  >
    <el-tag
      v-if="orderItem?.shippingName"
      size="small"
    >
      ATTN: {{ orderItem.shippingName }}
    </el-tag>
    <el-tag
      v-if="orderItem?.shippingCompany"
      size="small"
    >
      {{ orderItem.shippingCompany }}
    </el-tag>
    <el-tag
      v-if="orderItem?.shippingAddress1"
      size="small"
    >
      {{ orderItem.shippingAddress1 }}
    </el-tag>
    <el-tag
      v-if="orderItem?.shippingAddress2"
      size="small"
    >
      {{ orderItem.shippingAddress2 }}
    </el-tag>
    <el-tag
      v-if="orderItem?.shippingCity || orderItem?.shippingState || orderItem?.shippingZip || orderItem?.shippingCountry"
      size="small"
    >
      {{ orderItem.shippingCity }}, {{ orderItem.shippingState }}, {{ orderItem.shippingZip }}, {{ orderItem.shippingCountry }}
    </el-tag>
    <p style="visibility:hidden">
      placeholder
    </p>
    <el-tag
      v-if="orderItem?.shippingPhone"
      size="small"
    >
      TEL: {{ orderItem?.shippingPhone }}
    </el-tag>
    <br>
    <a
      :href="'mailto:' + orderItem?.email"
      class="link"
      target="_blank"
    >{{ orderItem?.email }}</a>
  </div>
</template>

<script setup>
const props = defineProps({
  orderItem: {
    type: Object,
    required: true
  }
});
</script>

<style lang="sass" scoped>
.shipment-info
  .el-tag
    margin-right: 50%
</style>
