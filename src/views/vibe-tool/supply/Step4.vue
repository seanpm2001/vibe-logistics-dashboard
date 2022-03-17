<template>
  <span class="step-title">
    Step 4 - Real Production Plan
  </span>
  <el-table :data="step4" max-height="250">
    <el-table-column label="ETD" width="200px">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.etd" placeholder="Num"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="amount" label="Amount" width="100px">
      <template v-slot="{ row }">
        <el-input style="width: 70px;" v-model="row.amount" placeholder="Num"></el-input>
      </template>
    </el-table-column>
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
        <el-input disabled style="width: 70px;" v-model="row.leadTime3.num" placeholder="Num"></el-input>
        <el-select disabled style="width: 120px;" v-model="row.leadTime3.timeOption" placeholder="Time">
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

const step4 = inject('step4');
</script>

<style lang="sass" scoped>

</style>
