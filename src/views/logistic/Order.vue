<template>
  <div>
    <el-divider></el-divider>
    <span class="f-row header">
      Sub-Batch {{count}}: 
      <svg-icon class="icon close-icon" icon-name="close" @click="deleteSubBatch"></svg-icon>
    </span>
    <el-row justify="space-between" style="margin: 2rem 2rem 0;">
      <el-form-item label="Source">
        <el-select v-model="subBatch.source" class="filter-item" placeholder="Please select">
          <el-option v-for="item in warehouseOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Purchase cost">
        <el-input v-model="subBatch.sku" placeholder="Purchase cost"/>
      </el-form-item>
    </el-row>
    <div class="form-upload-row" style="margin: 0 2rem 1.5rem;">
      <el-divider />
      <el-row :gutter="80">
        <el-upload
          action=""
          class="upload-serial"
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
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>
        <el-col :span="12">
          <div v-for="(item, idx) in subBatch.skuArr" :key="item.key">
            <el-divider v-if="idx !== 0" />
            <el-form-item :label="'SKU'+(idx+1)">
              <el-input disabled v-model="item.sku" placeholder="SKU"/>
            </el-form-item>
            <el-form-item label="Quantity total count:">
              <el-input disabled v-model="totalQuantity" placeholder="Quantity total count"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/message.scss";

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
  skuArr: [
    { sku: 'abc-test' },
    { sku: 'bbb-test' },
    { sku: 'ccc-test' }
  ]
});

const xmlFileList = [
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
];

const handleSku = (idx, type) => {
  const skuArr = subBatch.value.skuArr;
  type === "add" ? skuArr.push({}) : skuArr.splice(idx, 1);
};

const deleteSubBatch = () => {
  emit('deleteSubBatch', props.subBatchIdx);
};

const handleUpdate = (file, fileList) => {
  console.log('fileList: ', fileList.indexOf(file));
  subBatch.value.skuArr.push({sku: 'new-test'});
};
const handlePreview = (file) => {
  console.log(file);
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
            resolve(action);
            ElMessage.success('Delete completed');
            // 删除文件成功同时删除对应的sku值
            subBatch.value.skuArr.splice(fileList.indexOf(file), 1);
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

.form-upload-row
  > .el-row
    justify-content: space-around
    margin-left: 0 !important
    :deep(.el-upload-dragger)
      width: 310px

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

.el-row
  align-items: center
  .el-form-item
    margin-bottom: 0

</style>
