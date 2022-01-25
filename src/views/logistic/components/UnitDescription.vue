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
      <el-select v-model="unitItem.usedAge" placeholder="Please select">
        <el-option v-for="(item, key) in usedAgeEnum" :key="item" :label="item" :value="key" />
      </el-select>
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
      <el-select v-model="unitItem.condition" placeholder="Please select">
        <el-option v-for="(item, key) in conditionEnum" :key="item" :label="item" :value="key" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Owner ID</template>
      {{unitItem.ownerId}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Item Status</template>
      {{packageStatusEnum[unitItem.status]}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>

import { ElMessageBox } from "element-plus";
import { packageStatusEnum, usedAgeEnum, conditionEnum } from '/@/enums/logistic';

const unitItem = inject('unitItem');

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
