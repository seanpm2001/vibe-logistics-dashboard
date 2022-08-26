<template>
  <template
    v-for="(size, idx) in sizeArr"
    :key="idx"
  >
    <el-row
      class="dimension"
      style="margin-top: 20px"
      align="middle"
    >
      <svg-icon
        class="icon mgr-5"
        icon-name="add"
        @click="handleSizeArrChange('add', idx)"
      />
      <el-form-item label="Length/Width/Height/Weight/Unit System">
        <el-input
          v-model="size.length"
          placeholder="Length"
          @input="val => (size.length = toNumber(val) || null)"
          @change="syncSizes"
        />
      
        <el-input
          v-model="size.width"
          placeholder="Width"
          @input="val => (size.width = toNumber(val) || null)"
          @change="syncSizes"
        />
      
      
        <el-input
          v-model="size.height"
          placeholder="Height"
          @input="val => (size.height = toNumber(val) || null)"
          @change="syncSizes"
        />
        <el-input
          v-model="size.weight"
          placeholder="Weight"
          @input="val => (size.weight = toNumber(val) || null)"
          @change="syncSizes"
        />
        <el-select
          v-model="size.unitSystem"
          placeholder="Unit System"
          default-first-option
          :disabled="true"
          @change="syncSizes"
        >
          <el-option
            v-for="(unitSys, key) in unitSystemEnum"
            :key="key"
            :label="unitSys"
            :value="key"
          />
        </el-select>
      </el-form-item>
        
      <svg-icon
        class="icon mgl-5"
        :style="sizeArr.length <= 1 ? 'visibility: hidden;' : ''"
        icon-name="minus"
        @click="handleSizeArrChange('remove', idx)"
      />
    </el-row>
  </template>
</template>

<script setup>
import { toNumber, debounce } from '@/utils';
const props = defineProps({
  packageItem: {
    type: Object,
    required: true,
  },
  unitSystemEnum: {
    type: Object,
    required: true,
  }
});
const packageItem = props.packageItem;
const taskPackage = inject('taskPackage') ;

const sizeArr = ref([{
  length: packageItem.length || null,
  width: packageItem.width || null,
  height: packageItem.height || null,
  weight: packageItem.weight || null,
  unitSystem: packageItem.unitSystem || null,
}]);

const handleSizeArrChange = (type, sizeIdx) => {
  if (type === 'remove') {
    sizeArr.value.splice(sizeIdx, 1);
  } else {
    sizeArr.value.push({ length: null, width: null, height: null, weight: null, unitSystem: 'BS' });
  }
};

const syncSizes = () => {
  taskPackage.value.sizes = JSON.stringify(sizeArr.value);
};

const initSizes = () => {
  const sizes = JSON.parse(packageItem.sizes || '[]');
  if (sizes.length > 1) {
    sizeArr.value = sizes;
  }
};

onBeforeMount(() => {
  initSizes();
});
</script>

<style lang="sass" scoped>
.dimension
  .el-form-item
    margin-bottom: 0
  .el-input
    width: 70px
  .el-select
    width: 120px
    .el-input
      width: 120px
</style>
