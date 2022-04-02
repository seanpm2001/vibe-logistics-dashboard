<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>Serial</template>
      <el-row>
        <el-select
          v-model="unitItem.serial" filterable class="mgr-5"
        >
          <el-option v-for="serial in serialScopeArr" :label="serial" :value="serial" :key="serial" />
        </el-select>
        <el-button
          v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
          @click="updateSerial" type="danger" size="small"
        >
          Update
        </el-button>
      </el-row>

    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>If Check</template>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
        @click="checkUnit(true)" type="primary" size="small"
      >
        Check
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Package Box Condition</template>
      <el-select disabled v-model="unitItem.packageBoxCondition" placeholder=" ">
        <el-option v-for="(item, key) in packageConditionEnum" :key="item" :label="item" :value="key" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Shipment Damage</template>
      {{unitItem.shipmentDamage}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Unit Status</template>
      <el-tag>{{packageStatusEnum[unitItem.status]}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>Shipment Damage Note</template>
      {{unitItem.shipmentDamageNote}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { updatePackageUnitAPI } from '/@/api/logistic';
import { packageStatusEnum, packageConditionEnum } from '/@/enums/logistic';

const props = defineProps({
  serialScopeArr: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['fetchList']);

const unitItem = inject('unitItem');

const updateSerial = () => {
  const unit = unitItem.value;
  updatePackageUnitAPI(unit.packageId, unit.id, unit)
    .then(() => emit('fetchList'));
};

const checkUnit = isChecked => {
  ElMessageBox.confirm(
    'Check it?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          unitItem.checked = true;
          updateSerial();
        }
      },
    }
  );
};
</script>

<style lang="sass" scoped>

</style>
