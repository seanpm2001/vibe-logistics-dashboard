<template>
  <span class="step-title">
    Step 1 - Basic Info
  </span>
  <el-row>
    <el-form-item label="Vendor:">
      <el-select
        v-model="step1.vendor"
        placeholder="Please select"
      >
        <el-option
          v-for="(item, key) in fixedWarehouseEnum"
          :key="item"
          :label="item"
          :value="Number(key)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Warehouse:">
      <el-select
        v-model="step1.warehouse"
        placeholder="Please select"
      >
        <el-option
          v-for="(item, key) in fixedWarehouseEnum"
          :key="item"
          :label="item"
          :value="Number(key)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SKU:">
      <el-select
        v-model="step1.sku"
        placeholder="Please select"
      >
        <el-option
          v-for="(item, key) in skuCodeEnum"
          :key="key"
          :label="key"
          :value="key"
        />
      </el-select>
    </el-form-item>
  </el-row>  
  <el-row>
    <el-form-item label="*Initial Inventory:">
      <el-input-number
        v-model="step1.initialInventory"
        :min="0"
        placeholder="Initial Inventory:"
      />
    </el-form-item>
    <el-form-item label="*Min. Inventory:">
      <el-input
        v-model="step1.minInventoryPercent"
        style="width: 145px"
        placeholder="50"
      />
      % of +/- 2 weeks’ sales
    </el-form-item>
  </el-row>  
</template>

<script setup>
import { skuCodeEnum, fixedWarehouseEnum } from '@/enums/logistic';
/* Start Data */
const step1 = inject('step1');
/* End Data */
</script>

<style lang="sass" scoped>

</style>
