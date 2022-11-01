<template>
  <div class="filter-container">
    <div>
      <el-input
        v-model="listQuery.search"
        placeholder="Package Info"
        style="width: 220px"
        @keyup.enter="handleFilter"
      >
        <template #append>
          <el-button
            class="mgl-5"
            type="primary"
            :icon="Search"
            @click="handleFilter"
          />
        </template>
      </el-input>

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
      <span style="color: #606266">
        Only Need Restock Packages: <el-switch
          v-model="listQuery.onlyRestock"
          @change="fetchList"
        />
      </span>
    </div>
    
    <el-button
      v-permission="['ADMIN', 'VIBE_MANAGER']"
      v-wave
      :disabled="!multipleSelection?.length"
      style="float: right"
      type="danger"
      :icon="Delete"
      @click="handleDelSelected"
    >
      Delete Selected Item
    </el-button>
  </div>
</template>

<script setup>
import { Delete, Search, Filter } from '@element-plus/icons-vue';
import { deletePackageAPI } from '@/api';
import { taskTypeEnum } from '@/enums';

const multipleSelection = inject('multipleSelection');

const listQuery = inject('listQuery');
const typeArr = inject('typeArr');

const emit = defineEmits(['fetchList', 'handleDelSelected']);
const fetchList = () => emit('fetchList');

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const handleDelSelected = () => {
  multipleSelection.value.forEach((item) => {
    const packageId = item.id;
    deletePackageAPI(packageId);
  });
  multipleSelection.value = [];
  fetchList();
};

const onTypeArrChange = (visible) => {
  if (!visible)
    fetchList();
};
</script>

<style lang="sass" scoped>
.filter-container
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem
  .el-icon
    width: 1em
    height: 1em
</style>
