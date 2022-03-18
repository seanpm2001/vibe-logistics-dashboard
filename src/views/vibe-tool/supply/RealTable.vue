<template>
  <el-divider />
    <span class="step-title">
      Final Outcomes Table
    </span>
    <el-row>
      <!-- <el-form-item label="From - To:">
        <el-date-picker
          v-model="realFrom"
          type="datetimerange"
          format="YYYY/MM/DD"
          value-format="x"
        />
      </el-form-item> -->
      <el-form-item label="Time Dimension:">
        <el-select style="width: 120px;" v-model="timeDimension" disabled placeholder="Time">
          <el-option v-for="(item, key) in timeUnitEnum" :key="key" :label="item" :value="item" />
        </el-select>
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
const props = defineProps({
  timeUnitEnum: {
    type: Object,
    required: true
  },
  planTableEnum: {
    type: [Object, null],
    required: true,
  },
  monthAbbrEnum: {
    type: [Object, null],
    required: true,
  },
});

/* Start Data */
const realFrom = inject('realFrom');

const timeDimension = ref('day');

/* End Data */
</script>

<style lang="sass" scoped>

</style>
