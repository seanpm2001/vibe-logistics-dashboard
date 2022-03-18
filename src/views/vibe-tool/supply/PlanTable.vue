<template>
  <span class="step-title">
    Product Plan Table
  </span>
  <el-row>
    <!-- <el-form-item label="From:">
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
    </el-form-item> -->
    <el-form-item label="Time Dimension:">
      <el-select style="width: 120px;" v-model="timeDimension" disabled placeholder="Time">
        <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
      </el-select>
    </el-form-item>
  </el-row>
  
  <el-row class="table">
    <template v-for="(monthItem, month) in planTableEnum" :key="month">
      <el-row class='month-row mgr-5 no-warp'>
        <div class="day-col f-col no-warp">
          <p class="header">{{monthAbbrEnum[month]}}</p>
          <p>Sales</p>
          <p>Inventory</p>
          <p style="line-height: 18px">Min. Inventory</p>
          <p>ETA US</p>
          <p>ETD CN</p>
          <p>Production</p>
          <p>Material</p>
        </div>
        <template v-for="(item, day) in monthItem" :key="item">
          <div class="f-col" >
            <p class="header">{{day}}</p>
            <p>{{item?.sales}}</p>
            <p>{{item?.inventory}}</p>
            <p>{{item?.minInventory}}</p>
            <p>{{item?.eta}}</p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </template>
      </el-row>
    </template>
  </el-row>
  <slot name="btn" />
</template>

<script setup>
const props = defineProps({
  timeOptions: {
    type: Array,
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
const planFrom = inject('planFrom');
const planTo = inject('planTo');
const timeDimension = ref('day');



/* End Data */
</script>

<style lang="sass" scoped>

</style>
