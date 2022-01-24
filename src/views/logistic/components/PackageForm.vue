<template>
  <div>
    <el-row class="header" justify="space-between" :gutter="3">
      <span>
        Package <span v-if="shipPackage?.id">{{shipPackage?.id}} [Database]</span>:
      </span> 
      <svg-icon class="icon close-icon" icon-name="close" @click="handleDeletePackage"></svg-icon>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Tracking Number">
        <el-input v-model="shipPackage.trackingNumber" placeholder="Tracking Number"/>
      </el-form-item>
      <el-form-item label="New Address">
        <el-input v-model="shipPackage.newAddress" placeholder="New Address"/>
      </el-form-item>
      <el-form-item :rules="{ required: true, message: 'shipment package status is required', trigger: 'change' }" label="Status">
        <el-select :disabled="isDialogPattern('view')" v-model="shipPackage.status" placeholder="Please select">
          <el-option v-for="(item, key) in packageStatusEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
    </el-row>

    <template v-for="(item, index) in shipPackage.unitArr" :key="index">
      <el-row align="middle" class="add-minus-row">
        <svg-icon class="icon" icon-name="add" @click="handleUnitChange(index, 'add')" />
        <svg-icon class="icon" :style="shipPackage.unitArr.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="handleUnitChange(index, 'minus')" />
        <el-form-item label="Unit Serial">
          <el-input v-model="item.serial" placeholder="Unit Serial"/>
        </el-form-item>
        <el-form-item label="Unit Status">
          <el-input v-model="item.status" placeholder="Unit Status"/>
        </el-form-item>
      </el-row>
    </template>
    
    <div class="f-row controls" v-if="!isDialogPattern('view')">
      <el-button :disabled="!shipmentId" v-if="shipPackage?.id" type="primary" @click="handlePackage('update')">
        Update Package
      </el-button>
      <el-button :disabled="!shipmentId" v-else type="primary" @click="handlePackage('create')">
        Submit Package
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit current package before 'Add new Package'"
        placement="right"
      >
        <svg-icon icon-name="tips" />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>

import { ElMessage, ElMessageBox } from "element-plus";
import { createPackageAPI, deletePackageAPI, updatePackageAPI } from '/@/api/logistic';
import { packageStatusEnum } from '/@/assets/enum/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  shipmentId: {
    type: Number,
    required: true
  },
  packageIdx: {
    type: Number,
    required: true
  },
  packageItem: {
    type: Object,
    required: true
  },
  dialogStatus: {
    type: String,
    required: true
  }
});

const shipPackage = ref(props.packageItem);
const previewExcelArr = [].concat(shipPackage.value?.items);

// eslint-disable-next-line no-undef
const emit = defineEmits(['removePackage', 'submitPackage', 'editPackage']);

const isDialogPattern = type => props.dialogStatus === type;

const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const handleUnitChange = (idx, type) => {
  const unitArr = shipPackage.value.unitArr;
  type === "add" ? unitArr.push({serial: null, status: shipPackage.value.status}) : unitArr.splice(idx, 1);
};

const handleDeletePackage = () => {
  const packageId = shipPackage.value?.id;
  console.log('packageId: ', packageId);
  if (packageId) { // 删除数据库中的package
    ElMessageBox.confirm(
      `Remove the package (ID:${packageId})?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        callback: (action) => {
          if (action === "confirm") {
            deletePackageAPI(packageId).then(() => {
              emit('removePackage', props.packageIdx);
            });
          } else if (action === "cancel") {
            ElMessage.info('Delete canceled');
          }
        },
      }
    );
    return;
  }
  emit('removePackage', props.packageIdx); // 删除新创建还未提交的package
};

const handlePackage = type => {
  console.log('type: ', type);

};
// const handlePackage = (type) => {
//   // for (const key in products.value) { // 更新costs
//   //   shipPackage.value.costs[key] = products.value[key].cost || 0;
//   // }
//   if (type === "create") {
//     createPackageAPI(props.orderId, shipPackage.value).then(data => {
//       shipPackage.value = data;
//       emit('submitPackage', data, props.orderId ,props.packageIdx);
//     });
//   } else {
//     updatePackageAPI(shipPackage.value.id, shipPackage.value).then(data => {
//       shipPackage.value = data;
//       emit('updatePackage', data, props.packageIdx);
//     });
//     emit('editPackage', shipPackage.value?.id);
//   }
// };

</script>

<style lang="sass" scoped>
.el-checkbox__label .el-form-item
  margin-bottom: 0

.el-row
  align-items: center
  padding: 0 2rem
  &.header
    padding: 0
    padding-left: 16px
    font-size: 16px
    font-weight: 500

</style>
