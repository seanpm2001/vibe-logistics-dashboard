<template>
  <div class="filter-container">
    <el-row align="middle">
      <el-select
        v-model="typeArr"
        placeholder="Task Type"
        multiple
        collapse-tags
        collapse-tags-tooltip
        clearable
        @visible-change="onTypeArrChange"
        @remove-tag="fetchList"
      >
        <el-option
          v-for="(type, key) in taskTypeEnum"
          :key="key"
          :label="type"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="listQuery.transportMode"
        placeholder="Transport"
        style="width: 120px"
        clearable
        @change="handleTransportChange"
      >
        <el-option
          v-for="(transport, key) in transportEnum"
          :key="key"
          :label="transport"
          :value="key"
        />
      </el-select>
      <el-select
        v-if="listQuery.transportMode"
        v-model="listQuery.carrier"
        placeholder="Carrier"
        style="width: 120px"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="(carrier, key) in addNullOptionInEnumObject(transportCarrierEnum[listQuery.transportMode])"
          :key="key"
          :label="carrier"
          :value="key"
        />
      </el-select>
    </el-row>
    
    
    <div class="right-subcontainer">
      <el-button
        type="primary"
        @click="showUploadFileDialog"
      >
        Upload Shipping Labels
      </el-button>
      <el-button
        v-if="false"
        v-permission="['ADMIN', 'VIBE_MANAGER']"
        type="primary"
      >
        Sync Recent UPS Labels
      </el-button>

      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER']"
        :disabled="!multipleSelection?.length"
        type="primary"
        :icon="Delete"
        @click="delSelectedTask()"
      >
        Delete Selected
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue';
import { deleteTaskAPI } from '@/api';
import { taskTypeEnum, transportEnum, transportCarrierEnum } from '@/enums/logistic';
import { addNullOptionInEnumObject } from '@/utils';

const listQuery = inject('listQuery') ;
const typeArr = inject('typeArr');
const multipleSelection = inject('multipleSelection') ;
const dialogUploadVisible = inject('dialogUploadVisible') ;

const showTaskPattern = ref(null);

const taskPatternEnum = {
  'MY-ONLY': 'My task only',
  ALL: 'All tasks',
};

const emit = defineEmits('fetchList');
const fetchList = () => emit('fetchList');

const showUploadFileDialog = () => {
  dialogUploadVisible.value = true;
};

const onTypeArrChange = (visible) => {
  if (!visible)
    fetchList();
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handleTransportChange = () => {
  listQuery.value.carrier = '';
  handleFilter();
};

const delSelectedTask = () => {
  const promiseArr = [];
  multipleSelection.value.forEach((item) => {
    promiseArr.push(deleteTaskAPI(item.id));
  });
  Promise.allSettled(promiseArr).then(() => {
    fetchList();
    multipleSelection.value = [];
  });
};

</script>

<style lang="sass" scoped>
.filter-container
  display: flex
  justify-content: space-between
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem
</style>
