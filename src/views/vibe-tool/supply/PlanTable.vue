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
      <el-select disabled style="width: 120px;" v-model="timeDimension" placeholder="Time">
        <el-option v-for="(item, key) in timeUnitEnum" :key="key" :label="item" :value="item" />
      </el-select>
    </el-form-item>
  </el-row>
  
  <el-row class="table">
    <template v-for="(monthItem, month) in planTableData" :key="month">
      <el-row class='month-row mgr-5 no-warp'>
        <div class="day-col f-col no-warp">
          <p class="header">{{monthAbbrEnum[month]}}</p>
          <p class="header">Sales</p>
          <p class="header">Inventory</p>
          <p class="header" style="line-height: 18px">Min. Inventory</p>
          <p class="header">ETA US</p>
          <p class="header">ETD CN</p>
          <p class="header">Production</p>
          <p class="header">Material</p>
        </div>
        <template v-for="(item, day) in monthItem" :key="item">
          <div class="f-col" >
            <p class="header">{{day}}</p>
            <p class="grey">{{item?.sales}}</p>
            <p class="light-grey">{{item?.inventory}}</p>
            <p class="grey">{{item?.minInventory}}</p>
            <p class="light-grey">{{item?.eta}}</p>
            <p class="grey">{{item?.etd}}</p>
            <p class="light-grey">{{item?.product}}</p>
            <p class="grey"></p>
          </div>
        </template>
      </el-row>
    </template>
  </el-row>
</template>

<script setup>
const props = defineProps({
  timeUnitEnum: {
    type: Object,
    required: true
  },
  planTableData: {
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
