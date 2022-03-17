<template>
  <span class="step-title">
    Step 2 - Sales Forecast
  </span>
  <template v-for="(item, idx) in step2" :key="idx">
    <el-row class="add-minus-row" align="middle">
      <svg-icon class="icon" icon-name="add" @click="onStep2Change(index, 'add')" />
      <svg-icon class="icon" :style="step2.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="onStep2Change(index, 'minus')" />
      <el-form-item label="From:">
        <el-date-picker
          v-model="item.dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="With amount of ">
        <el-input v-model="item.amount" placeholder="Amount" />
      </el-form-item>
      <el-form-item label="Ruled by">
        <el-select v-model="item.rule" placeholder="Rule">
          <el-option v-for="item in ruleOptions" :key="item" :label="item" :value="item" /> 
        </el-select>
      </el-form-item>
    </el-row>
  </template>
</template>

<script setup>
const step2 = inject('step2');

const emit = defineEmits(['onStep2Change']);

const ruleOptions = ['day Average', 'day ASCE', 'day DESC'];

const onStep2Change = (idx, type) => {
  emit('onStep2Change', idx, type);
}
</script>

<style lang="sass" scoped>

</style>
