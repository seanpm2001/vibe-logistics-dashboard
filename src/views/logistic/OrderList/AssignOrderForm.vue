<template>
  <el-row
    class="mgb-5"
    align="middle"
  >
    Please select Warehouse:  &ensp;*
    <el-select
      v-model="sourceId"
      placeholder="Please select"
    >
      <el-option
        v-for="(item, key) in warehouseEnum"
        :key="item"
        :label="item"
        :value="Number(key)"
      />
    </el-select>
  </el-row>
  <el-row
    class="mgb-5"
    align="middle"
  >
    Please select Transport: &ensp;*
    <el-select
      v-model="taskTransport"
      placeholder="Please select"
    >
      <el-option
        v-for="(transport, key) in transportEnum"
        :key="key"
        :label="transport"
        :value="key"
      />
    </el-select>
  </el-row>
  <el-row
    v-if="taskTransport"
    align="middle"
  >
    Please select Carrier: &ensp;
    <el-select
      v-model="taskCarrier"
      placeholder="Please select"
      clearable
    >
      <el-option
        v-for="(carrier, key) in transportCarrierEnum[taskTransport]"
        :key="key"
        :label="carrier"
        :value="key"
      />
    </el-select>
  </el-row>
</template>

<script setup>
import { transportEnum, transportCarrierEnum } from '@/enums';
defineProps({
  showAssignedOrder: {
    type: Boolean,
    required: true,
  }
});

const sourceId = inject('sourceId') ;
const taskCarrier = inject('taskCarrier') ;
const taskTransport = inject('taskTransport') ;
</script>

<style lang="sass" scoped>

</style>
