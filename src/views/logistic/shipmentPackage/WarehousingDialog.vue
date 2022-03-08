<template>
  <el-dialog
    width="90%"
    title="Warehousing Task"
    v-model="dialogHousingVisible"
    :close-on-click-modal="false"
    :before-close="beforeCloseDialog"
  >
    <el-form
      ref="dataForm"
      v-model="warehousingItem"
    >
      <el-form-item label="Target Warehouse">
        <el-select v-model="warehousingItem.targetId" :disabled="isDialogPattern('view')" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Origin Warehouse Task">
          <el-tag>#{{warehousingItem.taskId}}</el-tag>
        </el-form-item>
        <el-form-item label="Origin Warehouse Task Type">
          <el-select v-model="warehousingItem.taskType" :disabled="isDialogPattern('view')" placeholder="Please select">
            <el-option v-for="(item, key) in taskTypeEnum" :key="item" :label="item" :value="key" />
            </el-select>
        </el-form-item>
      </el-row>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Package ID">
          <el-tag>#{{warehousingItem.packageId}}</el-tag>
        </el-form-item>
        <el-form-item label="Package Status">
          <el-tag>computed value</el-tag>
        </el-form-item>
      </el-row>
      <el-divider />
    </el-form>
    
  </el-dialog>
</template>

<script setup>
import { taskTypeEnum } from '/@/enums/logistic';

const props = defineProps({
  emptyWarehousingItem: {
    type: Object,
    required: true
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
  dialogStatus: {
    type: String,
    required: true
  },
});

/* Start Data */
const warehousingItem = inject('warehousingItem');
const dialogHousingVisible = inject('dialogHousingVisible');

/* End Data */
const isDialogPattern = (type) => props.dialogStatus === type;

const beforeCloseDialog = done => {
  done();
};
</script>

<style lang="sass" scoped>

</style>
