<template>
  <div>
    <el-row class="header" justify="space-between" :gutter="3">
      <span> Package <span v-if="taskPackage?.id"> [Database]</span>: </span>
      <svg-icon
        v-if="!notPackagePermission"
        class="icon close-icon"
        icon-name="close"
        @click="handleDeletePackage"
      ></svg-icon>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="*Tracking Number">
        <el-input
          :disabled="notPackagePermission"
          v-model="taskPackage.trackingNumber"
          placeholder="Tracking Number"
        />
      </el-form-item>
    </el-row>

    <template v-for="(item, index) in taskPackage.units" :key="index">
      <el-row align="middle" class="add-minus-row">
        <svg-icon
          class="icon"
          :style="taskPackage.units.length >= quantityNum ? 'visibility: hidden;' : ''"
          icon-name="add"
          @click="handleUnitChange(index, 'add')"
        />
        <svg-icon
          class="icon"
          :style="taskPackage.units.length <= 1 ? 'visibility: hidden;' : ''"
          icon-name="minus"
          @click="handleUnitChange(index, 'minus')"
        />

        <el-form-item label="Unit Serial">
          <el-select
            v-model="item.serial"
            :disabled="notPackagePermission"
            style="width: 260px"
            placeholder="Please select"
            filterable
            remote
            :remote-method="query => debounce(remoteMethod(query), 500)"
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

    <div class="f-row controls" v-if="!notPackagePermission">
      <el-button
        :disabled="!taskId"
        v-if="taskPackage?.id"
        type="primary"
        @click="handlePackage('update')"
      >
        Update Package
      </el-button>
      <el-button
        :disabled="!taskId"
        v-else
        type="primary"
        @click="handlePackage('create')"
      >
        Submit Package
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a 'Shipment' part before 'Submit Package'"
        placement="right"
      >
        <svg-icon class="mgl-5" icon-name="tips" />123
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { debounce } from '@/utils';
import { ElMessage, ElMessageBox, ElTooltip } from 'element-plus';
import {
  createPackageAPI,
  deletePackageAPI,
  updatePackageAPI,
  queryUnitsAPI,
} from '@/api/logistic';
import { packageStatusEnum } from '@/enums/logistic';
import { useUserStore } from '@/store';

// eslint-disable-next-line no-undef
const props = defineProps({
  taskId: {
    type: Number,
    required: true,
  },
  packageIdx: {
    type: Number,
    required: true,
  },
  packageItem: {
    type: Object,
    required: true,
  },
  dialogStatus: {
    type: String,
    required: true,
  },
});

/* Start Data */
const taskItem = inject('taskItem');

const { role } = storeToRefs(useUserStore());
const notPackagePermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE'].includes(role.value));

const taskProducts = Object.assign({}, taskItem.value.products);
const taskPackage = ref(props.packageItem);
const previewExcelArr = [].concat(taskPackage.value?.items);

const quantityNum = computed(() => {
  let sum=0;
  for (const i in taskProducts) {
    sum += taskProducts[i].quantity;
  }
  return sum;
});
/* End Data */

const emit = defineEmits(['deletePackage', 'createPackage', 'editPackage']);

const unitList = shallowRef(null);
const remoteMethod = query => {
  const taskProducts = taskItem.value.products;
  if (query) {
    queryUnitsAPI({ serial: query }).then(data => {
      unitList.value = data.filter(item => {
        for (const i in taskProducts) {
          if (item.sku === taskProducts[i].sku) return true;
        }
      });
    });
  } else {
    unitList.value = [];
  }
};

const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const handleUnitChange = (idx, type) => {
  const unitArr = taskPackage.value.units;
  type === 'add'
    ? unitArr.push({ serial: null, status: 'DELIVERING' })
    : unitArr.splice(idx--, 1);
};

const handleDeletePackage = () => {
  const packageId = taskPackage.value?.id;
  if (packageId) {
    // 删除数据库中的package
    ElMessageBox.confirm(`Remove the package (ID:${packageId})?`, 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === 'confirm') {
          deletePackageAPI(packageId).then(() => {
            emit('deletePackage', props.packageIdx);
          });
        } else if (action === 'cancel') {
          ElMessage.info('Delete canceled');
        }
      },
    });
    return;
  }
  emit('deletePackage', props.packageIdx); // 删除新创建还未提交的package
};

const handlePackage = (type) => {
  if (type === 'create') {
    createPackageAPI(props.taskId, taskPackage.value).then((data) => {
      taskPackage.value = data;
      emit('createPackage', data, props.taskId, props.packageIdx);
    });
  } else {
    updatePackageAPI(taskPackage.value.id, taskPackage.value).then((data) => {
      taskPackage.value = data;
      emit('updatePackage', data, props.packageIdx);
    });
    emit('editPackage', taskPackage.value?.id);
  }
};
// const handlePackage = (type) => {
//   // for (const key in products.value) { // 更新costs
//   //   taskPackage.value.costs[key] = products.value[key].cost || 0;
//   // }
//   if (type === "create") {
//     createPackageAPI(props.orderId, taskPackage.value).then(data => {
//       taskPackage.value = data;
//       emit('createPackage', data, props.orderId ,props.packageIdx);
//     });
//   } else {
//     updatePackageAPI(taskPackage.value.id, taskPackage.value).then(data => {
//       taskPackage.value = data;
//       emit('updatePackage', data, props.packageIdx);
//     });
//     emit('editPackage', taskPackage.value?.id);
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
