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
      v-model="warehousingTaskInfo"
    >
      <el-form-item label="Target Warehouse">
        <el-tag>#{{warehouseEnum[warehousingTaskInfo.targetId]}}</el-tag>
      </el-form-item>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Origin Warehouse Task">
          <el-tag>#{{warehousingTaskInfo.taskId}}</el-tag>
        </el-form-item>
        <el-form-item label="Origin Warehouse Task Type">
          <el-tag>#{{taskTypeEnum[warehousingTaskInfo.taskType]}}</el-tag>
        </el-form-item>
      </el-row>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Package ID">
          <el-tag>#{{warehousingItem.packageId}}</el-tag>
        </el-form-item>
        <el-form-item label="Package Status">
          <el-tag>computed value</el-tag>
        </el-form-item>
        <el-form-item label="Unit Condition">
          <el-select
            v-model="unitItem.condition"
            placeholder="Please select"
            clearable
            @change="onUnitConditionChange"
          >
            <el-option v-for="(item, key) in unitConditionEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
      </el-row>

      <el-divider />

      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Serial">
          <el-tag>#{{warehousingItem.serial}}</el-tag>
        </el-form-item>
        <el-checkbox v-model="warehousingItem.shipmentDamage">
          Shipping Damaged
        </el-checkbox>
        <el-form-item label="Package Box Condition">
          <el-select v-model="warehousingItem.packageBoxCondition" placeholder="Please select" clearable>
            <el-option v-for="(item, key) in packageConditionEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Note(return reason)">
          <el-input v-model="warehousingItem.shipmentDamageNote" placeholder="Note"/>
        </el-form-item>
        <el-form-item label="Accessory Consumption">
          <el-select v-model="warehousingItem.accessories[0].productCode" placeholder="Please select" clearable>
            <el-option v-for="(item, key) in packageProductEnum" :key="item" :label="item" :value="key" />
          </el-select>
          <el-input-number placeholder="0" v-model="warehousingItem.accessories[0].quantity" />
        </el-form-item>
      </el-row>
      <el-card>
        <el-row justify="space-between">
          <el-form-item label="*Next Stage as a:">
            <el-select disabled v-model="nextStage" placeholder="Please select" clearable>
              <el-option v-for="(item, key) in { UNIT: 'Unit', BUNDLE: 'Bundle' }" :key="item" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="nextStage === 'BUNDLE'" label="New Stylus">
            <el-input v-model="bundleItem.stylus" placeholder="Serial" />
          </el-form-item>
          <el-form-item class="mgl-10" v-if="nextStage === 'BUNDLE'" label="New Carema">
            <el-input v-model="bundleItem.carema" placeholder="Serial" />
          </el-form-item>
        </el-row>
      </el-card>
    </el-form>

    <template v-slot:footer>
      <el-button @click="submitWarehousing">
        Submit
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { taskTypeEnum, unitConditionEnum, packageConditionEnum } from '@/enums/logistic';
import { updateUnitAPI, updatePackageUnitAPI } from '@/api/logistic';

const props = defineProps({
  warehouseEnum: {
    type: Object,
    required: true
  },
});

const emit = defineEmits(['findUnit']);

/* Start Data */
const warehousingTaskInfo = inject('warehousingTaskInfo');
const warehousingItem = inject('warehousingItem');
const unitItem = inject('unitItem');
const dialogHousingVisible = inject('dialogHousingVisible');

const isShippingDamaged = ref(null);
const nextStage = ref(null);
const bundleItem = ref({
  bundle: null,
  carema: null,
  stylus: null,
});

const packageProductEnum = {
  '55V1BPB': '55 V1 Package Box',
  '55S1BPB': '55 S1 Package Box',
  '75ProBPB': '75 Pro Package Box'
};

/* End Data */

const beforeCloseDialog = done => {
  done();
};

const onUnitConditionChange = () => {
  const unit = unitItem.value;
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        updateUnitAPI(unit.serial, unit);
      } else {
        emit('findUnit', unit.serial);
      }
    },
  });
};

const submitWarehousing = () => {
  const unit = warehousingItem.value;
  updatePackageUnitAPI(unit.packageId, unit.id, unit).then((data) => {
    warehousingItem.value = data || warehousingItem.value;
    warehousingItem.value.accessories[0] = { productCode: null, quantity: null };
  });
};
</script>

<style lang="sass" scoped>

</style>
