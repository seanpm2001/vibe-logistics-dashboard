<template>
  <el-card>
    Product:
    <el-form-item
      v-if="!notCommonPermission"
      label="Specify Serial"
    >
      <el-checkbox-group
        v-model="checkedSpecifySerial"
        :max="1"
      >
        <el-checkbox
          :key="true"
          :label="true"
        >
          true
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <template
      v-for="(product, productIdx) in taskItem.products"
      :key="product.sku"
    >
      <el-row
        align="middle"
        class="add-minus-row"
      >
        <svg-icon
          class="icon"
          icon-name="add"
          @click="onProductChange(productIdx, 'add')"
        />
        <svg-icon
          class="icon"
          :style="taskItem.products.length <= 1 ? 'visibility: hidden;' : ''"
          icon-name="minus"
          @click="onProductChange(productIdx, 'minus')"
        />
        <el-form-item label="*Product Name">
          <el-select
            v-model="product.productCode"
            :disabled="notCommonPermission"
            placeholder="Please select"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="(item, key) in productNameScope"
              :key="key"
              :label="codeNameEnum[item.productCode]"
              :value="item.productCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Sku"
          :prop="'products.' + productIdx + '.sku'"
          :rules="[
            {
              required: warehouseEnum[taskItem.sourceId] === 'Lightning',
              trigger: 'blur',
              message: 'Sku required for Lightning',
            },
          ]"
        >
          <el-select
            v-model="product.sku"
            :disabled="notCommonPermission"
            placeholder="Please select"
            clearable
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="sku in codeSkuArrEnum[product.productCode]"
              :key="sku"
              :label="sku"
              :value="sku"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="*Quantity"
          :prop="'products.' + productIdx + '.quantity'"
        >
          <el-input-number
            v-model="product.quantity"
            :min="1"
            :max="isLightningExpressTask ? 1 : 99"
            :disabled="notCommonPermission"
            placeholder="Quantity"
          />
        </el-form-item>
        <el-form-item label="Condition">
          <el-select
            v-model="product.condition"
            :disabled="notCommonPermission"
            placeholder="Please select"
            clearable
            @change="onProductConditionChange(product)"
          >
            <el-option
              v-for="(condition, key) in unitConditionEnum"
              :key="condition"
              :label="condition"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Available">
          <el-input disabled>
            999
          </el-input>
        </el-form-item>
        <el-form-item
          v-show="
            (checkedSpecifySerial[0] || product.serialNote?.length) &&
              !noSerialArr.includes(product.productCode)
          "
          label="Serials"
        >
          <el-select
            v-model="product.serialNote"
            :disabled="notCommonPermission"
            placeholder="Please select"
            filterable
            style="width: 335px"
            multiple
            :multiple-limit="product.quantity"
            remote
            :allow-create="taskItem.taskType === 'RETURN'"
            :remote-method="(query) => debounce(remoteMethod(query, product), 500)"
          >
            <el-option
              v-for="unit in unitList"
              :key="unit.serial"
              :label="unit.serial + ' : ' + unit.sku"
              :value="unit.serial"
            />
          </el-select>
        </el-form-item>
      </el-row>
    </template>
  </el-card>
</template>

<script setup>
import { debounce, getUnitCode } from '@/utils';
import { noSerialArr, unitConditionEnum, codeNameEnum, codeSkuArrEnum } from '@/enums/logistic';
import { queryUnitsAPI } from '@/api';

const props = defineProps({
  notCommonPermission: {
    type: Boolean,
    required: true
  },
  warehouseEnum: {
    type: Object,
    required: true
  }
});

const taskItem = inject('taskItem') ;
const taskOrderItem = inject('taskOrderItem') ;

const checkedSpecifySerial = ref([]);
const unitList = shallowRef(null);

const isLightningExpressTask = computed(() => {
  const sourceId = taskItem.value.sourceId;
  const source = props.warehouseEnum[sourceId];
  return source === 'Lightning' && taskItem.value.transportMode === 'EXPRESS';
});

const productNameScope = computed(() => {
  const type = taskItem.value.taskType;
  if (type === 'FULFILLMENT') { // 返回order里所有products
    return taskOrderItem.value.items?.map(item => {
      if (item.productCode === '55V1B') { // 55V1B废弃统一改成55V1UB
        item.productCode = '55V1UB';
      }
      return item;
    });
  } else if (type === 'REPLACE') { // 返回所有product code
    return Object.keys(codeNameEnum).map(code => {
      return { productCode: code };
    });
  } else if (type === 'RETURN' || type === 'RETURN_TO_REPAIR') { // 返回order下所有task的历史所有products
    const set = new Set();
    taskOrderItem.value.tasks.forEach(task => {
      task.products.forEach(product => set.add(product.productCode));
    });
    return Array.from(set).map(code => {
      return { productCode: code };
    });
  }
});

const remoteMethod = (query, product) => {
  if (query) {
    queryUnitsAPI({ serial: query }).then((data) => {
      unitList.value = data.filter((item) => {
        if (getUnitCode(item) !== product.productCode) return false;
        if (product.sku && item.sku !== product.sku) return false;
        if (
          (!product.condition || product.condition === 'GOOD') &&
          item.condition &&
          item.condition !== 'GOOD'
        )
          return false; // brand new (null) or almost brand new (GOOD)
        if (
          product.condition &&
          product.condition !== 'GOOD' &&
          item.condition !== product.condition
        )
          return false; // used
        return true;
      });
    });
  } else {
    unitList.value = [];
  }
};

const onProductChange = (idx, type) => {
  const products = taskItem.value.products;
  type === 'add'
    ? products.push({ sku: null, condition: null, quantity: null })
    : products.splice(idx--, 1);
};

const onProductConditionChange = (product) => {
  product.serialNote = null;
};
</script>

<style lang="sass" scoped>

</style>
