<template>
  <span class="step-title">
    Step 3 - Suggested ETA Plan
  </span>
  <el-table :data="step3" max-height="250">
    <el-table-column prop="eta" label="ETA" width="200px" />
    <el-table-column prop="amount" label="Amount" width="100px" />
    <el-table-column label="*ETA -> ETD" width="300px" align="center">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.leadTime1.num" placeholder="Num"></el-input>
        <el-select style="width: 120px;" v-model="row.leadTime1.timeUnit" placeholder="Time">
          <el-option v-for="(item, key) in timeUnitEnum" :key="key" :label="key" :value="item" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="*ETD -> Production">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.leadTime2.num" placeholder="Num"></el-input>
        <el-select style="width: 120px;" v-model="row.leadTime2.timeUnit" placeholder="Time">
          <el-option v-for="(item, key) in timeUnitEnum" :key="key" :label="key" :value="item" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Leading Time 3">
      <template v-slot="{ row }">
        <el-input disabled style="width: 70px;" v-model="row.leadTime3.num" placeholder="Num"></el-input>
        <el-select disabled style="width: 120px;" v-model="row.leadTime3.timeUnit" placeholder="Time">
          <el-option v-for="(item, key) in timeUnitEnum" :key="key" :label="key" :value="item" />
        </el-select>
      </template>
    </el-table-column>
  </el-table>
  <slot name="btn" />
</template>

<script setup>
const props = defineProps({
  timeUnitEnum: {
    type: Object,
    required: true
  }
});

const step3 = inject('step3');
</script>

<style lang="sass" scoped>

</style>
