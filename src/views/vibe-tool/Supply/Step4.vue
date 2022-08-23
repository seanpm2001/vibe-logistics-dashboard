<template>
  <span class="step-title">
    Step 4 - Real Production Plan
  </span>
  <el-table
    :data="step4"
    max-height="250"
  >
    <el-table-column
      label="Production"
      width="280px"
    >
      <template #default="{ row }">
        <el-date-picker
          v-model="row.production"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      label="Amount"
      width="100px"
    >
      <template #default="{ row }">
        <el-input
          v-model="row.amount"
          style="width: 70px;"
          placeholder="Num"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="*Production -> ETD"
      width="300px"
      align="center"
    >
      <template #default="{ row }">
        <el-input
          v-model="row.leadTime1.num"
          style="width: 70px;"
          placeholder="Num"
        />
        <el-select
          v-model="row.leadTime1.timeUnit"
          style="width: 120px;"
          placeholder="Time"
        >
          <el-option
            v-for="(item, key) in timeUnitEnum"
            :key="key"
            :label="key"
            :value="item"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="*ETD -> ETA">
      <template #default="{ row }">
        <el-input
          v-model="row.leadTime2.num"
          style="width: 70px;"
          placeholder="Num"
        />
        <el-select
          v-model="row.leadTime2.timeUnit"
          style="width: 120px;"
          placeholder="Time"
        >
          <el-option
            v-for="(item, key) in timeUnitEnum"
            :key="key"
            :label="key"
            :value="item"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Leading Time 3">
      <template #default="{ row }">
        <el-input
          v-model="row.leadTime3.num"
          disabled
          style="width: 70px;"
          placeholder="Num"
        />
        <el-select
          v-model="row.leadTime3.timeUnit"
          disabled
          style="width: 120px;"
          placeholder="Time"
        >
          <el-option
            v-for="(item, key) in timeUnitEnum"
            :key="key"
            :label="key"
            :value="item"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Operations"
      width="120px"
    >
      <template #default="{ $index }">
        <el-button
          type="danger"
          size="small"
          @click.prevent="deleteRow($index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <slot name="btn" />
</template>

<script setup>
const emit = defineEmits(['onStep4Change']);
const props = defineProps({
  timeUnitEnum: {
    type: Object,
    required: true
  }
});

const deleteRow = (idx)=> {
  emit('onStep4Change', idx, 'remove');
};

const step4 = inject('step4');
</script>

<style lang="sass" scoped>

</style>
