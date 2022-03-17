<template>
  <span class="step-title">
    Product Plan Table
  </span>
  <el-row>
    <el-form-item label="From:">
      <el-date-picker
        v-model="planFrom"
        type="datetime"
        format="YYYY/MM/DD"
        value-format="x"
      />
    </el-form-item>
    <el-form-item label="To:">
      <el-date-picker
        v-model="planTo"
        type="datetime"
        format="YYYY/MM/DD"
        value-format="x"
      />
    </el-form-item>
    <el-form-item label="Time Dimension:">
      
    </el-form-item>
  </el-row>
  
  <el-row class="table">
    <template v-for="(monthItem, month) in planTableEnum" :key="month">
      <el-row>
        <div class="f-col">
          <p class="header">{{monthAbbrEnum[month]}}</p>
          <p>Sales</p>
          <p>Inventory</p>
          <p>Min. Reserved Inventory</p>
          <p>ETA US</p>
          <p>ETD CN</p>
          <p>Production</p>
          <p>Material</p>
        </div>
        <template v-for="(item, day) in monthItem" :key="item">
          <div class="f-col" >
            <p class="header">{{day}}</p>
            <p>{{item?.sales || ''}}</p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </template>
      </el-row>
    </template>
  </el-row>
  <slot name="footer" />
</template>

<script setup>

/* Start Data */
const planFrom = inject('planFrom');
const planTo = inject('planTo');

const props = defineProps({
  planTableEnum: {
    type: [Object, null],
    required: true,
  },
  monthAbbrEnum: {
    type: [Object, null],
    required: true,
  },
});

/* End Data */
</script>

<style lang="sass" scoped>

</style>
