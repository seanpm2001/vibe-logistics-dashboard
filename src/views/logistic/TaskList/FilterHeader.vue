<template>
  <div class="filter-container">
    <el-row>
      <el-select
        v-model="showTaskPattern"
        placeholder="Task type"
        style="width: 155px"
        disabled
        @change="handleFilter"
      >
        <el-option
          v-for="(item, key) in taskPatternEnum"
          :key="item"
          :label="item"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="typeArr"
        placeholder="Task Type"
        multiple
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
    </el-row>
    
    <div class="right-subcontainer">
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
import { taskTypeEnum } from '@/enums/logistic';
import { debounce } from '@/utils';

const listQuery = inject('listQuery') ;
const typeArr = inject('typeArr');
const multipleSelection = inject('multipleSelection') ;
const showTaskPattern = ref(null);

const taskPatternEnum = {
  'MY-ONLY': 'My task only',
  ALL: 'All tasks',
};

const emit = defineEmits(['fetchList']);
const fetchList = () => emit('fetchList');

const onTypeArrChange = (visible) => {
  if (!visible)
    fetchList();
};

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
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
