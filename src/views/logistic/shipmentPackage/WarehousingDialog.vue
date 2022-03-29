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
        <el-tag>#{{warehouseEnum[warehousingItem.targetId]}}</el-tag>
      </el-form-item>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Origin Warehouse Task">
          <el-tag>#{{warehousingItem.taskId}}</el-tag>
        </el-form-item>
        <el-form-item label="Origin Warehouse Task Type">
          <el-tag>#{{taskTypeEnum[warehousingItem.taskType]}}</el-tag>
        </el-form-item>
      </el-row>
      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Package ID">
          <el-tag>#{{unitItem.packageId}}</el-tag>
        </el-form-item>
        <el-form-item label="Package Status">
          <el-tag>computed value</el-tag>
        </el-form-item>
        <el-form-item label="Unit Condition">
          <el-select v-model="unitItem.condition" placeholder="Please select" clearable>
            <el-option v-for="(item, key) in unitConditionEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
      </el-row>

      <el-divider />

      <el-row justify="space-between" :gutter="3">
        <el-form-item label="Serial">
          <el-tag>#{{unitItem.serial}}</el-tag>
        </el-form-item>
        <el-checkbox v-model="unitItem.shipmentDamage">
          Shipping Damaged
        </el-checkbox>
        <el-form-item label="Package Box Condition">
          <el-select v-model="unitItem.packageBoxCondition" placeholder="Please select" clearable>
            <el-option v-for="(item, key) in packageConditionEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Note(return reason)">
          <el-input v-model="unitItem.shipmentDamageNote" placeholder="Note"/>
        </el-form-item>
        <el-form-item label="Accessory Consumption">
          <el-select v-model="unitItem.accessories[0]" placeholder="Please select" clearable>
            <el-option v-for="(item, key) in {PACKAGE_BOX: 'Package Box'}" :key="item" :label="item" :value="key" />
          </el-select>
          <el-input-number  placeholder="0"/>
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
import { taskTypeEnum, unitConditionEnum, packageConditionEnum } from '/@/enums/logistic';
import { updatePackageUnitAPI } from '/@/api/logistic';

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
const unitItem = inject('unitItem');
const dialogHousingVisible = inject('dialogHousingVisible');

const isShippingDamaged = ref(null);
const nextStage = ref(null);
const bundleItem = ref({
  bundle: null,
  carema: null,
  stylus: null,
});

/* End Data */
const isDialogPattern = (type) => props.dialogStatus === type;

const beforeCloseDialog = done => {
  done();
};

const submitWarehousing = () => {
  const unit = unitItem.value;
  updatePackageUnitAPI(unit.packageId, unit.id, unit).then(_data => {
    console.log('_data: ', _data);
    unitItem.value = _data;
  });
};
</script>

<style lang="sass" scoped>

</style>
