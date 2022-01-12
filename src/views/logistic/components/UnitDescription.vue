<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>Serial</template>
      {{unitItem.serial}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Used Age</template>
      {{(unitItem.usedAge).replaceAll('_', ' ')}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>SKU</template>
      {{unitItem.sku}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>If Check</template>
      <el-button size="small" @click="checkUnit(true)">Yes</el-button>
      <el-button size="small" type="danger" @click="checkUnit(false)">No</el-button>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Produced Date</template>
      {{unitItem.producedDate}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Condition</template>
      {{unitItem.condition}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Owner ID</template>
      {{unitItem.ownerId}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Item Status</template>
      {{orderStatusOptions[unitItem.status]}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { orderStatusOptions } from '/@/assets/enum/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  unitItem: {
    type: Object,
    required: true
  },
});

const checkUnit = isChecked => {
  ElMessageBox.confirm(
    isChecked? 'Check it?' : 'Don\'t check it?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === "confirm") {
          console.log('Checked: '+isChecked);
        }
      },
    }
  );
};
</script>

<style lang="sass" scoped>

</style>
