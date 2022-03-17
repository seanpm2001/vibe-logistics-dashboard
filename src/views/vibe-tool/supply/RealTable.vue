<template>
  <el-divider />
    <span class="step-title">
      Final Outcomes Table
    </span>
    <el-row>
      <el-form-item label="From - To:">
        <el-date-picker
          v-model="realFrom"
          type="datetimerange"
          format="YYYY/MM/DD"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="Time Dimension:">
        
      </el-form-item>
    </el-row>

    <el-row class="table">
      <el-col class="table">
        <p class="header">Apr.</p>
        <p>Inventory</p>
        <p>Min. Reserved Inventory</p>
        <p>ETA US</p>
        <p>ETD CN</p>
        <p>Production</p>
        <p>Material</p>
      </el-col>
    </el-row>
    <slot name="footer" />
</template>

<script setup>

/* Start Data*/
const realFrom = inject('realFrom');

/* End Data*/
</script>

<style lang="sass" scoped>

</style>
