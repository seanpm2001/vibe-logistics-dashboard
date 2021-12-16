<template>
  <div>
    <el-divider></el-divider>
    <span class="f-row header">
      Sub-Batch {{count}}: 
      <svg-icon class="icon close-icon" icon-name="close" @click="deleteSubBatch"></svg-icon>
    </span>
    <el-form-item style="margin-left: 2rem;" label="Source">
      <el-select v-model="subBatch.source" class="filter-item" placeholder="Please select">
        <el-option v-for="item in warehouseOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
    <div style="margin: 0 2rem 1.5rem;" v-for="(item, idx) in subBatch.skuArr" :key="item.key">
      <el-divider />
      <el-row style="width: 100%; margin-bottom: .5rem;">
        <svg-icon class="icon" icon-name="add" @click="handleSku(idx, 'add')"></svg-icon>
        <svg-icon class="icon" icon-name="minus" :class="{'visible-hidden': (subBatch.skuArr.length <= 1) }" @click="handleSku(idx, 'remove')"></svg-icon>
        <el-row class="sku-row">
          <el-form-item label="SKU">
            <el-select v-model="subBatch.source" class="filter-item" placeholder="Please select">
              <el-option v-for="item in warehouseOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Purchase cost">
            <el-input v-model="subBatch.sku" placeholder="Purchase cost"/>
          </el-form-item>
        </el-row>
      </el-row>
      <el-row >
        <el-upload
          class="upload-serial"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          drag
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="item.fileList"
        >
          <el-icon class="el-icon-upload"></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
        <el-row class="quantity-count">
          <p>Quantity total count: </p><el-input disabled v-model="totalQuantity" placeholder="Quantity total count"/>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  subBatchIdx: {
    type: Number,
    required: true
  },
  warehouseOptions: {
    type: Object,
    required: true
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['deleteSubBatch']);

const count = ref(props.subBatchIdx + 1);
const totalQuantity = ref(0);
const subBatch = ref({
  source: "",
  skuArr: [{
    fileList: [
      {
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      },
      {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      },
    ]
  }]
});

const handleSku = (idx, type) => {
  const skuArr = subBatch.value.skuArr;
  type === "add" ? skuArr.push({}) : skuArr.splice(idx, 1);
  console.log('skuArr: ', skuArr);
};

const deleteSubBatch = () => {
  emit('deleteSubBatch', props.subBatchIdx);
};

</script>

<style lang="sass" scoped>
.f-row.header
  justify-content: space-between
  font-size: 16px
  font-weight: 500
.icon
  margin-right: .25rem
  cursor: pointer
  .close-icon
    float: right
    width: 24px
    height: 24px

.visible-hidden
  visibility: hidden

.sku-row
  justify-content: space-around
  width: calc(100% - 72px)
  margin-left: 1.25rem
  .el-form-item
    width: 50%
    :deep(.el-form-item__label)
      width: 120px !important

.upload-serial
  display: flex
  margin-top: 1.25rem

.quantity-count
  width: 47%
  margin-left: 1rem
  p
    min-width: 150px

.el-row
  align-items: center
  .el-form-item
    margin-bottom: 0
</style>
