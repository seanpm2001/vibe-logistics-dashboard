<template>
  <span class="step-title">
    Step 3 - Suggested ETA Plan
  </span>
  <el-table :data="step3" max-height="250">
    <el-table-column prop="eta" label="ETA" width="200px" />
    <el-table-column prop="amount" label="Amount" width="100px" />
    <el-table-column label="Leading Time 1" width="300px" align="center">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.leadTime1.num" placeholder="Num"></el-input>
        <el-select style="width: 120px;" v-model="row.leadTime1.timeOption" placeholder="Time">
          <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Leading Time 2">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.leadTime2.num" placeholder="Num"></el-input>
        <el-select style="width: 120px;" v-model="row.leadTime2.timeOption" placeholder="Time">
          <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Leading Time 3">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.leadTime3.num" placeholder="Num"></el-input>
        <el-select style="width: 120px;" v-model="row.leadTime3.timeOption" placeholder="Time">
          <el-option v-for="(item, key) in timeOptions" :key="key" :label="item" :value="item" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" width="120px">
      <template  v-slot="{ $index }">
        <el-button type="danger" size="small" @click.prevent="deleteRow($index)">
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <slot name="btn" />
</template>

<script setup>
const emit = defineEmits(['deleteRow']);
const props = defineProps({
  timeOptions: {
    type: Array,
    required: true
  }
});

const deleteRow = (idx) => {
  emit('deleteRow', idx);
};

const step3 = inject('step3');
</script>

<style lang="sass" scoped>

</style>
