<template>
  <div class="col1 meta-data cell w-380">
    <template
      v-for="(product, idx) in tasksProductFulQty[task.id].productsQty"
      :key="product.sku"
    >
      <div class="mgb-5">
        product name:
        <el-tag size="small">
          {{ codeNameEnum[product.productCode] || product.productCode }}
        </el-tag>
      </div>
      <el-row
        style="margin-left: 16px"
      >
        sku: <el-tag size="small">
          {{ product.sku }}
        </el-tag>
        <el-divider direction="vertical" />
        req: <el-tag size="small">
          {{ product.req }}
        </el-tag>
        <el-divider direction="vertical" />
        ful:
        <el-tag
          size="small"
          :type="productFulfilled(product) ? '' : 'danger'"
        >
          {{ product.fulSpec + product.fulExclSpec }}
        </el-tag>
        <el-divider
          v-if="product.serialNote?.length"
          direction="vertical"
        />
        <el-tooltip
          v-if="product.serialNote?.length"
          effect="light"
        >
          <el-button size="small">
            Specify Serial:
          </el-button>
          <template #content>
            <el-tag size="small">
              <template
                v-for="serial in product.serialNote"
                :key="serial"
              >
                {{ serial }};
              </template>
            </el-tag>
          </template>
        </el-tooltip>
      </el-row>
      <el-row
        v-if="noSerialArr.includes(product.productCode)"
        style="margin-top: 10px"
      >
        <el-button
          :disabled="disableAccessoryAllocation(product)"
          :type="updateAccessoryAllocation(product) ? 'primary' : 'plain'"
          @click="onAccessoryAllocationButtonClick(product)"
        >
          {{ updateAccessoryAllocation(product) ? 'Update allocation' : 'Add accesory into existing package' }}
        </el-button>
      </el-row>
      <el-divider v-if="idx !== (task.products.length - 1)" />
    </template>
  </div>
</template>

<script setup>
import { codeNameEnum, skuCodeEnum, noSerialArr } from '@/enums/logistic';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  taskIdx: {
    type: Number,
    required: true
  }
});

const accessoryAllocation = inject('accessoryAllocation');
const accessoryAllocationVisible = inject('accessoryAllocationVisible');
const allocateAccessory = inject('allocateAccessory');
const onAccessoryAllocationChange = inject('onAccessoryAllocationChange');
const tasksProductFulQty = inject('tasksProductFulQty');

watchEffect(() => {
  if (tasksProductFulQty) {
    console.log(tasksProductFulQty.value);
  }
});

const productFulfilled = product => product.fulExclSpec + product.fulSpec === product.req;

const disableAccessoryAllocation = (product) => ((accessoryAllocationVisible.value && product.productCode !== accessoryAllocation.value.productCode) || props.task.packages.length === 0);
const updateAccessoryAllocation = (product) => (accessoryAllocationVisible.value && product.productCode === accessoryAllocation.value?.productCode);

const onAccessoryAllocationButtonClick = (product) => {
  if (accessoryAllocationVisible.value)
    onAccessoryAllocationChange(props.taskIdx);
  else
    allocateAccessory(product);
};

const calTaskFulQty = (type, packageArr) => {
  // Important: for a single product (unique product code) in a task, either specify sku or not.
  // It is not allowed for both.
  const temp = {};
  packageArr?.forEach(packageItem => {
    packageItem.units.forEach(unit => {
      const sku = unit.item?.sku;
      if (type === 'sku')
        temp[sku] = (temp[sku] || 0) + 1;
      else
        temp[skuCodeEnum[sku]] = (temp[skuCodeEnum[sku]] || 0) + 1;
    });
    if (type === 'code') {
      packageItem.accessories.forEach(accessory => {
        temp[accessory.productCode] = (temp[accessory.productCode] || 0) + accessory.quantity;
      });
    }
  });
  return temp;
};

</script>

<style lang="sass" scoped>

</style>
