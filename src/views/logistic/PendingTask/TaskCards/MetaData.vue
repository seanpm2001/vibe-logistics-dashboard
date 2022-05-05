<template>
  <div class="col1 meta-data cell w-380">
    <template
      v-for="(product, idx) in task.products"
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
          {{ product.quantity }}
        </el-tag>
        <el-divider direction="vertical" />
        ful: 
        <el-tag
          v-if="product.sku"
          size="small"
          :type="product.quantity === calTaskFulQty('sku', task.packages)[product.sku] ? '' : 'danger'"
        >
          {{ calTaskFulQty('sku', task.packages)[product.sku] || 0 }}
        </el-tag>
        <el-tag
          v-else
          size="small"
          :type="product.quantity === calTaskFulQty('code', task.packages)[product.productCode] ? '' : 'danger'"
        >
          {{ calTaskFulQty('code', task.packages)[product.productCode] || 0 }}
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
      <el-divider v-if="idx !== (task.products.length - 1)" />
    </template>
  </div>
</template>

<script setup>
import { codeNameEnum, skuCodeEnum } from '@/enums/logistic';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const calTaskFulQty = (type, packageArr) => {
  const temp = {};
  packageArr.forEach(packageItem => {
    packageItem.units.forEach(unit => {
      const sku = unit.item?.sku;
      if (type === 'sku')
        temp[sku] = (temp[sku] || 0) + 1;
      else 
        temp[skuCodeEnum[sku]] = (temp[skuCodeEnum[sku]] || 0) + 1;
    });
  });
  return temp;
};


</script>

<style lang="sass" scoped>

</style>
