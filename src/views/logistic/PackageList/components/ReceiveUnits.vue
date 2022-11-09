<template>
  <template
    v-for="(unit, unitIdx) in packageReceived.units"
    :key="unit"
  >
    <el-descriptions
      class="description-card"
      :column="2"
      border
    >
      <el-descriptions-item>
        <template #label>
          Serial
        </template>
        <el-select
          v-model="unit.serial"
          filterable
          class="mgr-5"
        >
          <el-option
            v-for="taskUnit in availableTaskSerials"
            :key="taskUnit.serial"
            :label="taskUnit.serial"
            :value="taskUnit.serial"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Unit Status
        </template>
        <el-tag>{{ packageStatusEnum[unit.status] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Product
        </template>
        {{ codeNameEnum[getUnitCode(findTaskUnit(unit.serial))] }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          SKU
        </template>
        {{ findTaskUnit(unit.serial)?.sku }}
      </el-descriptions-item>
      <el-descriptions-item>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Delete
        </template>
        <el-popconfirm
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="red"
          title="Are you sure to delete this?"
          @confirm="deleteUnit(unitIdx)"
        >
          <template #reference>
            <el-button
              type="danger"
            >
              Delete
            </el-button>
          </template>
        </el-popconfirm>
      </el-descriptions-item>
    </el-descriptions>
  </template>
  <div class="add-button add-unit">
    <el-button
      type="primary"
      :disabled="availableTaskSerials.length === 0"
      @click="addUnit"
    >
      {{ availableTaskSerials.length > 0 ? 'Add unit with serial' : 'No more units could be added' }}
    </el-button>
  </div>

  <template
    v-for="(accessory, accessoryIdx) in packageReceived.accessories"
    :key="accessory"
  >
    <el-descriptions
      class="description-card"
      :column="2"
      border
    >
      <el-descriptions-item>
        <template #label>
          Accessory
        </template>
        <el-select
          v-model="accessory.productCode"
          filterable
          class="mgr-5"
        >
          <el-option
            v-for="productCode in availableTaskAccessoriesCode"
            :key="productCode"
            :label="codeNameEnum[productCode]"
            :value="productCode"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Unit Status
        </template>
        <el-tag>{{ packageStatusEnum[accessory?.status || 'DELIVERING'] }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Quantity
        </template>
        <el-input
          v-model="accessory.quantity"
          style="max-width: 100px"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          Delete
        </template>
        <el-popconfirm
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="red"
          title="Are you sure to delete this?"
          @confirm="deleteAccessory(accessoryIdx)"
        >
          <template #reference>
            <el-button
              type="danger"
            >
              Delete
            </el-button>
          </template>
        </el-popconfirm>
      </el-descriptions-item>
    </el-descriptions>
  </template>

  <div class="add-button add-accessory">
    <el-button
      type="primary"
      :disabled="availableTaskAccessoriesCode.length === 0"
      @click="addAccessory"
    >
      {{ availableTaskAccessoriesCode.length > 0 ? 'Add accessory' : 'No more accessory could be added' }}
    </el-button>
  </div>

  <el-row
    class="add-button add-accessory"
    justify="end"
  >
    <el-button
      type="primary"
      size="large"
      @click="updatePackage"
    >
      Submit package
    </el-button>
  </el-row>
</template>

<script setup>
import { getUnitCode } from '@/utils';
import { updatePackageAPI } from '@/api';
import { packageStatusEnum, codeNameEnum } from '@/enums/logistic';

const emit = defineEmits(['fetchList']);

const packageReceived = inject('packageReceived') ;
const taskSerialsAndSkus = inject('taskSerialsAndSkus') ;
const taskAccessoriesCode = inject('taskAccessoriesCode') ;

const availableTaskSerials = computed(() => (
  taskSerialsAndSkus.value.filter((taskUnit) => !packageReceived.value.units.find(unit => unit.serial === taskUnit.serial))
));

const availableTaskAccessoriesCode = computed(() => (
  taskAccessoriesCode.value.filter((taskAccessoryCode) => !packageReceived.value.accessories.find(accessory => taskAccessoryCode === accessory.productCode))
));

console.log('packageReceived', packageReceived.value);
console.log('taskSerialsAndSkus', taskSerialsAndSkus.value);
console.log('taskAccessoriesCode', taskAccessoriesCode.value);

const addUnit = () => {
  packageReceived.value.units.push({ serial: null, status: 'DELIVERING' });
};

const deleteUnit = (unitIdx) => {
  packageReceived.value.units.splice(unitIdx, 1);
};

const addAccessory = () => {
  packageReceived.value.accessories.push({ productCode: null, quantity: 0 });
};

const deleteAccessory = (accessoryIdx) => {
  packageReceived.value.accessories.splice(accessoryIdx, 1);
};

const findTaskUnit = (serial) => (taskSerialsAndSkus.value.find((taskUnit) => (taskUnit.serial === serial)));

const updatePackage = () => {
  const packageItem = packageReceived.value;
  const packageId = packageItem.id;
  // set unit.checked and status
  const units = packageItem.units;
  units.forEach(unit => {
    unit.checked = true;
    if (unit.status !== 'COMPLETE_WITH_DELIVERED') {
      unit.status = 'DELIVERED_BUT_UNCHECKED';
    }
  });
  const accessories = packageItem.accessories;
  accessories.forEach(accessory => {
    accessory.status = 'COMPLETE_WITH_DELIVERED';
  });

  // 删除serial为空的unit
  for (let idx = units.length - 1; idx >= 0; idx--) {
    !units[idx].serial && units.splice(idx, 1);
  }
  // 删除为空的accessory
  for (let idx = accessories.length - 1; idx >= 0; idx--) {
    (!accessories[idx].productCode || !accessories[idx].quantity) && accessories.splice(idx, 1);
  }

  // if (isAccessoriesPackage(packageItem, task.orderId)) {
  //   // TODO: isAccessoriesPackage
  // }

  updatePackageAPI(packageId, packageItem)
    .then(() => emit('fetchList'));
};

</script>

<style lang="sass" scoped>
.description-card:not(:first-child)
  margin-top: 20px

.add-button
  margin-top: 20px
</style>
