<template>
  <div>
    <el-row class="header" justify="space-between" :gutter="3">
      <span>
        Package <span v-if="taskPackage?.id"> [Database]</span>:
      </span> 
      <svg-icon class="icon close-icon" icon-name="close" @click="handleDeletePackage"></svg-icon>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="*Tracking Number">
        <el-input v-model="taskPackage.trackingNumber" placeholder="Tracking Number"/>
      </el-form-item>
      <el-form-item label="Default Unit Status">
        <el-select :disabled="isDialogPattern('view')" v-model="defaultUnitStatus" placeholder="Please select">
          <el-option v-for="(item, key) in packageStatusEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
    </el-row>

    <template v-for="(item, index) in taskPackage.units" :key="index">
      <el-row align="middle" class="add-minus-row">
        <svg-icon class="icon" icon-name="add" @click="handleUnitChange(index, 'add')" />
        <svg-icon class="icon" :style="taskPackage.units.length <=1 ? 'visibility: hidden;':''" icon-name="minus" @click="handleUnitChange(index, 'minus')" />
        <el-form-item label="Unit Status">
          <el-select :disabled="isDialogPattern('view')" v-model="item.status" placeholder="Please select">
            <el-option v-for="(item, key) in packageStatusEnum" :key="item" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Unit Serial">
          <el-select
            v-model="item.serial" :disabled="isDialogPattern('view')" placeholder="Please select"
            @change="filterUnitArr(item)" filterable allow-create default-first-option
          >
            <el-option v-for="(item, index) in unitList" :key="index" :label="item.serial" :value="item.serial" />
          </el-select>
        </el-form-item>
      </el-row>
    </template>
    
    <div class="f-row controls" v-if="!isDialogPattern('view')">
      <el-button :disabled="!taskId" v-if="taskPackage?.id" type="primary" @click="handlePackage('update')">
        Update Package
      </el-button>
      <el-button :disabled="!taskId" v-else type="primary" @click="handlePackage('create')">
        Submit Package
      </el-button>
      <el-popover
        class="tips"
        trigger="hover"
        content="You need to have/submit a 'Shipment' part before 'Submit Package'"
        placement="right"
      >
        <template #reference>
          <svg-icon class="mgl-5" icon-name="tips" />123
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { debounce } from '/@/utils';
import { ElMessage, ElMessageBox, ElTooltip, ElPopover } from 'element-plus';
import { createPackageAPI, deletePackageAPI, updatePackageAPI, queryUnitsAPI } from '/@/api/logistic';
import { packageStatusEnum } from '/@/enums/logistic';

// eslint-disable-next-line no-undef
const props = defineProps({
  taskId: {
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

const store = useStore();

const defaultUnitStatus = ref(null);
const taskPackage = ref(props.packageItem);
const previewExcelArr = [].concat(taskPackage.value?.items);

const unitList = computed(() => store.getters['unitList']);
const filterUnitArr = filterObj => {
  console.log('filterObj: ', filterObj);
  // debounce(() => {
  //   queryUnitsAPI({ search: filterObj.serial }).then(_data => {
  //     console.log('_data: ', _data);
  //     unitList.value = _data;
  //   });
  // }, 500, 1000);
}; 

// eslint-disable-next-line no-undef
const emit = defineEmits(['deletePackage', 'createPackage', 'editPackage']);

const isDialogPattern = type => props.dialogStatus === type;

const dialogExcelVisible = ref(false);

const xmlFileList = ref([]);

const handleUnitChange = (idx, type) => {
  const unitArr = taskPackage.value.units;
  type === 'add' ? unitArr.push({serial: null, status: defaultUnitStatus.value}) : unitArr.splice(idx, 1);
};

const handleDeletePackage = () => {
  const packageId = taskPackage.value?.id;
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
          if (action === 'confirm') {
            deletePackageAPI(packageId).then(() => {
              emit('deletePackage', props.packageIdx);
            });
          } else if (action === 'cancel') {
            ElMessage.info('Delete canceled');
          }
        },
      }
    );
    return;
  }
  emit('deletePackage', props.packageIdx); // 删除新创建还未提交的package
};

const handlePackage = _type => {
  if (_type === 'create') {
    createPackageAPI(props.taskId, taskPackage.value).then(_data => {
      taskPackage.value = _data;
      emit('createPackage', _data, props.taskId ,props.packageIdx);
    });
  } else {
    updatePackageAPI(taskPackage.value.id, taskPackage.value).then(_data => {
      taskPackage.value = _data;
      emit('updatePackage', _data, props.packageIdx);
    });
    emit('editPackage', taskPackage.value?.id);
  }
};
// const handlePackage = (type) => {
//   // for (const key in products.value) { // 更新costs
//   //   taskPackage.value.costs[key] = products.value[key].cost || 0;
//   // }
//   if (type === "create") {
//     createPackageAPI(props.orderId, taskPackage.value).then(_data => {
//       taskPackage.value = _data;
//       emit('createPackage', _data, props.orderId ,props.packageIdx);
//     });
//   } else {
//     updatePackageAPI(taskPackage.value.id, taskPackage.value).then(_data => {
//       taskPackage.value = _data;
//       emit('updatePackage', _data, props.packageIdx);
//     });
//     emit('editPackage', taskPackage.value?.id);
//   }
// };
function initGlobalData() {
  if (unitList.value.length === 0) // init unitList:[]
    store.dispatch('logistic/setUnitList');
}

onMounted(() => {
  initGlobalData();
});
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
