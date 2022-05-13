<template>
  <div class="filter-container">
    <el-input
      v-model="listQuery.search"
      placeholder="Package Info"
      style="width: 220px"
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
    <el-button
      v-wave
      disabled
      type="primary"
      :icon="Filter"
      @click="handleFilter"
    >
      Filter Warehousing List
    </el-button>
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
import { deletePackageAPI } from '@/api/logistic';

const multipleSelection = inject('multipleSelection');

const listQuery = inject('listQuery');

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
</script>

<style lang="sass" scoped>
.filter-container
  margin-bottom: .5rem
  > .el-button
    margin-left: .5rem
  .el-icon
    width: 1em
    height: 1em
</style>
