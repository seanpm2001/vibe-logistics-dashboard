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
      <el-select
        v-model="timeDimension"
        disabled
        style="width: 120px;"
        placeholder="Time"
      >
        <el-option
          v-for="(item, key) in timeUnitEnum"
          :key="key"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
  </el-row>

  <el-row class="table">
    <template
      v-for="(monthItem, month) in realTableData"
      :key="month"
    >
      <template v-if="ifShowThisMonth(monthItem)">
        <el-row class="month-row mgr-5 no-warp">
          <div class="day-col f-col no-warp">
            <p class="header">
              {{ monthAbbrEnum[month] }}
            </p>
            <p>Sales</p>
            <p>Inventory</p>
            <p style="line-height: 18px">
              Min. Inventory
            </p>
            <p>ETA US</p>
            <p>ETD CN</p>
            <p>Production</p>
            <p>Material</p>
          </div>
          <template
            v-for="(item, day) in monthItem"
            :key="item"
          >
            <div class="f-col">
              <p class="header">
                {{ day }}
              </p>
              <p>{{ item?.sales }}</p>
              <p>{{ item?.inventory }}</p>
              <p>{{ item?.minInventory }}</p>
              <p>{{ item?.eta }}</p>
              <p>{{ item?.etd }}</p>
              <p>{{ item?.production }}</p>
              <p />
            </div>
          </template>
        </el-row>
      </template>
    </template>
  </el-row>
</template>

<script setup>
const props = defineProps({
  timeUnitEnum: {
    type: Object,
    required: true
  },
  realTableData: {
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
const ifShowThisMonth = monthItem => {
  for (const day in monthItem) {
    if (JSON.stringify(monthItem[day]) !== '{}')
      return true;
  }
  return false;
};
</script>

<style lang="sass" scoped>

</style>
