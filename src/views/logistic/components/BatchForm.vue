<template>
  <div>
    <el-row justify="space-between" class="header">
      <span>
        Sub-Batch <span v-if="batch?.id">{{batch?.id}} [Database]</span>:
      </span> 
      <svg-icon class="icon close-icon" icon-name="close" @click="handleDeleteBatch"></svg-icon>
    </el-row>
    <el-row justify="space-between">
      <el-form-item :rules="{ required: true, message: 'source number is required', trigger: 'change' }" label="Source">
        <el-select :disabled="isDialogPattern('view')" v-model="batch.sourceId" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseEnum" :key="item" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-row>
        Total Purchase Cost:
        <el-input v-if="batch.id" style="width: 80px; margin-left: 1rem;" disabled v-model="totalCost" placeholder=""/>
        <el-input v-else style="width: 80px; margin-left: 1rem;" disabled v-model="totalCostNew" placeholder=""/>
      </el-row>
    </el-row>
    <div class="form-upload-row">
      <el-row :gutter="40">
        <el-col :span="11">
          <el-upload
            action=""
            class="upload-serial"
            accept=".xlsx, .xls"
            drag
            multiple
            v-if="isDialogPattern('edit')"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-change="handleUpdate"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="xmlFileList"
          >
            <el-icon class="el-icon-upload"></el-icon>
            <div class="el-upload__text">
              Drag xls/xlsx files here or <em>click to upload</em>
            </div>
          </el-upload>
          <el-row style="margin: .75rem 0 0 -1rem">
            <el-button v-if="!batch?.id && isDialogPattern('edit')" type="primary" @click="handleBatch('create')">
              Submit Sub-Batch
            </el-button>
            <el-button v-if="batch?.id && isDialogPattern('edit')" type="primary" @click="handleBatch('update')">
              Update Sub-Batch
            </el-button>
            <el-button v-if="batch?.id" type="success" @click="dialogExcelVisible=true">
              Show Serial Excel
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="11">
          <div class="freight-product-box" v-for="(item, key) in products" :key="key">
            <el-divider />
            <el-form-item :label="'SKU'">
              <el-input disabled v-model="item.sku" placeholder="SKU"/>
            </el-form-item>
            <el-form-item label="Quantity Count:">
              <el-input disabled v-model="item.quantityCount" placeholder="Quantity Count"/>
            </el-form-item>
            <el-form-item label="Purchase Cost">
              <el-input v-model="item.cost" placeholder="Purchase Cost"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="Excel Preview" v-model="dialogExcelVisible" :before-close="closePreviewDialog">
      <el-table :data="previewExcelArr" border fit highlight-current-row style="width: 80%; margin: 0 auto;">
        <el-table-column type="index" width="100" />
        <el-table-column prop="sku" label="SKU" />
        <el-table-column prop="serial" label="Serial Number" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>

import { ElMessage, ElMessageBox } from 'element-plus';
import { file2Xcel } from '/@/utils/excel';
import { createBatchAPI, deleteBatchAPI, updateBatchAPI } from '/@/api/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  freightId: {
    type: Number,
    required: true
  },
  batchIdx: {
    type: Number,
    required: true
  },
  batchItem: {
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
  }
});

const batch = ref(props.batchItem);
console.log('batch: ', batch);
const previewExcelArr = [].concat(batch.value?.items);

// eslint-disable-next-line no-undef
const emit = defineEmits(['removeBatch', 'submitBatch', 'editBatch']);

const products = ref({});

const isDialogPattern = type => props.dialogStatus === type;

const fetchProducts = () => {
  const costs = batch.value?.costs;
  if (costs) {
    for (const key in costs) {
      const quantity = batch.value?.items.filter(item => item.sku === key).length;
      const temp = { sku: key, quantityCount: quantity, cost: costs[key]};
      products.value[key] = products.value[key] ? Object.assign(products.value[key], temp) : temp;
    }
    delete batch.value.items;
  }
};

batch.value?.id && fetchProducts(); // 若为数据库中的batch，加载products信息

const totalCost = computed(() => {
  let total = 0;
  const costs = batch.value?.costs;
  if (costs) {
    for (const key in costs) {
      total += +costs[key];
    }
  } 
  return total;
});
const totalCostNew = computed(() => {
  let total = 0;
  for (const key in products.value) {
    total += +products.value[key].cost;
  }
  return total;
});
const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const closePreviewDialog = (done) => {
  done();
};
const handleDeleteBatch = () => {
  const batchId = batch.value?.id;
  if (batchId) { // 删除数据库中的batch
    ElMessageBox.confirm(
      `Remove the batch (ID:${batchId})?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        callback: (action) => {
          if (action === 'confirm') {
            deleteBatchAPI(batchId).then(() => {
              emit('removeBatch', props.batchIdx);
            });
          } else if (action === 'cancel') {
            ElMessage.info('Delete canceled');
          }
        },
      }
    );
    return;
  }
  emit('removeBatch', props.batchIdx); // 删除新创建还未提交的batch
};

const updateBatchProducts = (type, file) => {
  file2Xcel(file).then(dataArr => {
    if (dataArr && dataArr.length > 0) {
      let tempArr= [];
      products.value = {};
      dataArr.forEach(item => {
        const sku = item.sheetName;
        // 文件max limit暂时为1
        if (type === 'add') {
          tempArr = tempArr.concat(item.sheet);
          item.sheet.length && (products.value[sku] ? 
            products.value[sku].quantityCount += item.sheet.length :
            products.value[sku] = {sku, quantityCount: item.sheet.length, cost: ''});
        } else {
          products.value[sku].quantityCount -= item.sheet.length;
          products.value[sku].quantityCount <= 0 && delete products.value[sku];
        }
      });
      tempArr.forEach(item => {
        batch.value.items.push({serial: item['Serial Number'], sku: item['SKU']});
      });
    }
  });
};

const handleBatch = (type) => {
  for (const key in products.value) { // 更新costs
    batch.value.costs[key] = products.value[key].cost || 0;
  }
  if (type === 'create') {
    createBatchAPI(props.freightId, batch.value).then(_data => {
      batch.value = _data;
      emit('submitBatch', _data, props.freightId ,props.batchIdx);
    });
  } else {
    updateBatchAPI(batch.value.id, batch.value).then(_data => {
      batch.value = _data;
      emit('updateBatch', _data, props.batchIdx);
    });
    emit('editBatch', batch.value?.id);
  }
};

const handleUpdate = (file, fileList) => {
  updateBatchProducts('add', file);
};
const handlePreview = file => {
  dialogExcelVisible.value = true;
};
const handleExceed = (files, fileList) => {
  ElMessage.warning(
    `The limit is 1, you selected ${files.length} files this time, we will raise the limit in the future.`
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
          if (action === 'confirm') {
            // 移除文件时重置sub batch products
            updateBatchProducts('remove', file);
            resolve(action);
          } else if (action === 'cancel') {
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
.viewPattern
  .upload-serial
    display: none
  .submit-btn
    display: none

.header
  margin: 0 1rem
  font-size: 16px
  font-weight: 500
  & + .el-row
    margin: 0 2rem 2rem

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

.mgl-10
  margin-left: 10px

</style>
