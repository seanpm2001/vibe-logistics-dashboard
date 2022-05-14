<template>
  <div class="filter-container">
    <el-select
      v-model="showTaskPattern"
      placeholder="Task type"
      style="width: 155px"
      @change="handleFilter"
    >
      <el-option
        v-for="(item, key) in taskPatternEnum"
        :key="item"
        :label="item"
        :value="key"
      />
    </el-select>
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
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue';
import { deleteTaskAPI } from '@/api';

const listQuery = inject('listQuery') as any;
const multipleSelection = inject('multipleSelection') as any;
const showTaskPattern = ref(null);

const taskPatternEnum = {
  'MY-ONLY': 'My task only',
  ALL: 'All tasks',
};

const emit = defineEmits(['fetchList']);
const fetchList = () => emit('fetchList');

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
