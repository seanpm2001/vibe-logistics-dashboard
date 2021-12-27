<template>
  <div>
    <el-divider></el-divider>
    <span class="f-row header">
      Sub-Batch {{count}}: 
      <svg-icon class="icon close-icon" icon-name="close" @click="deleteBatch"></svg-icon>
    </span>
    <el-row justify="space-between" style="margin: 2rem 2rem 0;">
      <el-form-item label="Source">
        <el-select v-model="batch.source" class="filter-item" placeholder="Please select">
          <el-option v-for="item in warehouseOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-row>
        Total Purchase Cost:
        <el-input style="width: 80px; margin-left: 1rem;" disabled v-model="totalPurchaseCost" placeholder=""/>
      </el-row>
    </el-row>
    <div class="form-upload-row" style="margin: 0 2rem 1.5rem;">
      <el-divider />
      <el-row :gutter="40">
        <el-upload
          action=""
          class="upload-serial"
          accept=".xlsx, .xls"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-change="handleUpdate"
          :before-remove="beforeRemove"
          drag
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="xmlFileList"
        >
          <el-icon class="el-icon-upload"></el-icon>
          <div class="el-upload__text">
            Drag xls/xlsx files here or <em>click to upload</em>
          </div>
        </el-upload>
        <el-col :span="11">
          <div class="freight-product-box" v-for="(item, key) in batch.products" :key="key">
            <el-divider />
            <el-form-item :label="'SKU'">
              <el-input disabled v-model="item.sku" placeholder="SKU"/>
            </el-form-item>
            <el-form-item label="Quantity Count:">
              <el-input disabled v-model="item.quantityCount" placeholder="Quantity Count"/>
            </el-form-item>
            <el-form-item label="Purchase Cost">
              <el-input v-model="item.purchaseCost" placeholder="Purchase Cost"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogExcelVisible" :before-close="closePreviewDialog">
      <div class="dialog-header">Excel Preview</div>
      <el-table :data="previewExcelTable" border fit highlight-current-row style="width: 80%; margin: 0 auto;">
        <el-table-column type="index" width="100" />
        <el-table-column prop="SKU" label="SKU" />
        <el-table-column prop="Serial Number" label="Serial Number" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { file2Xcel } from '/@/assets/utils/excel';
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/message.scss";

// eslint-disable-next-line no-undef
const props = defineProps({
  batchIdx: {
    type: Number,
    required: true
  },
  warehouseOptions: {
    type: Object,
    required: true
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['deleteBatch']);

const count = ref(props.batchIdx + 1);
const totalQuantityCount = computed(() => {
  let total = 0;
  for (const key in batch.value.products) {
    total += batch.value.products[key].quantityCount;
  }
  return total;
});
const totalPurchaseCost = computed(() => {
  let total = 0;
  for (const key in batch.value.products) {
    total += +batch.value.products[key].purchaseCost;
  }
  return total;
});
const previewExcelTable = ref([]);
const dialogExcelVisible = ref(false);
const batch = ref({
  source: "",
  products: {}
});

const xmlFileList = ref([]);

const closePreviewDialog = (done) => {
  previewExcelTable.value = [];
  done();
};
const deleteBatch = () => {
  emit('deleteBatch', props.batchIdx);
};

const updateBatchProducts = (type, file) => {
  file2Xcel(file).then(dataArr => {
    if (dataArr && dataArr.length > 0) {
      dataArr.forEach(item => {
        const sku = item.sheetName;
        if (type === "add") {
          batch.value.products[sku] ? 
            batch.value.products[sku].quantityCount += item.sheet.length :
            batch.value.products[sku] = {sku, quantityCount: item.sheet.length, purchaseCost: ""};
        } else {
          batch.value.products[sku].quantityCount -= item.sheet.length;
          batch.value.products[sku].quantityCount <= 0 && delete batch.value.products[sku];
        }
      });
    }
  });
};

const handleUpdate = (file, fileList) => {
  updateBatchProducts("add", file);
};
const handlePreview = (file) => {
  file2Xcel(file).then(dataArr => {
    dataArr.forEach(item => {
      previewExcelTable.value = previewExcelTable.value.concat(item.sheet);
    });
    dialogExcelVisible.value = true;
  });
};
const handleExceed = (files, fileList) => {
  ElMessage.warning(
    `The limit is 3, you selected ${
      files.length
    } files this time, add up to ${files.length + fileList.length} totally`
  );
};
const beforeRemove = (file, fileList) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      `Remove the file of ${file.name} ?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        callback: (action) => {
          if (action === "confirm") {
            // 移除文件时重置sub batch products
            updateBatchProducts('remove', file);
            resolve(action);
            ElMessage.success('Delete completed');
          } else if (action === "cancel") {
            reject();
            ElMessage.info('Delete canceled');
          }
        },
      }
    );
  });
};
</script>

<style lang="sass" scoped>
@import "/@/assets/css/_response.sass"
.f-row.header
  justify-content: space-between
  font-size: 16px
  font-weight: 500

.dialog-header
  margin-left: 2rem
  margin-bottom: 2rem
  font-size: 18px
  font-weight: 500

.form-upload-row
  > .el-row
    justify-content: space-around
    margin-left: 0 !important
    :deep(.el-upload-dragger)
      width: 310px

:deep(.el-upload-list__item)
  cursor: pointer

.icon
  margin-right: .25rem
  cursor: pointer
  .close-icon
    float: right
    width: 24px
    height: 24px

.freight-product-box
  &:first-child .el-divider
    display: none

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

.el-row
  align-items: center
  .el-form-item
    margin-bottom: 0

</style>
