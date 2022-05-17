<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item>
      <template #label>
        Serial
      </template>
      <el-select
        v-model="unitItem.serial"
        filterable
        class="mgr-5"
      >
        <el-option
          v-for="serial in serialScopeArr"
          :key="serial"
          :label="serial"
          :value="serial"
        />
      </el-select>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
        type="danger"
        @click="updateSerial"
      >
        Update
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        If Check
      </template>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
        :disabled="unitItem.checked"
        :type="unitItem.checked ? 'success' : 'primary'"
        @click="checkUnit()"
      >
        Check it
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Package Box Condition
      </template>
      <el-select
        v-model="unitItem.packageBoxCondition"
        disabled
        placeholder=" "
      >
        <el-option
          v-for="(item, key) in packageConditionEnum"
          :key="item"
          :label="item"
          :value="key"
        />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Shipment Damage
      </template>
      {{ unitItem.shipmentDamage }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Unit Status
      </template>
      <el-tag>{{ packageStatusEnum[unitItem.status] }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        Shipment Damage Note
      </template>
      {{ unitItem.shipmentDamageNote }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
import { updatePackageUnitAPI } from '@/api';
import { packageStatusEnum, packageConditionEnum } from '@/enums/logistic';

defineProps({
  serialScopeArr: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['fetchList']);

const unitItem = inject('unitItem') as any;

const updateSerial = () => {
  const unit = unitItem.value;
  updatePackageUnitAPI(unit.packageId, unit.id, unit)
    .then(() => emit('fetchList'));
};

const checkUnit = () => {
  ElMessageBox.confirm('Check it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        unitItem.value.checked = true;
        updateSerial();
      }
    },
  });
};
</script>

<style lang="sass" scoped>

</style>
