<template>
  <div class="page">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-wave class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-wave :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const listQuery = ref({
  page: 1,
  limit: 20,
  importance: undefined,
  title: undefined,
  type: undefined,
  sort: '+id'
});

const tableKey = ref(0);
const list = ref(null);
const total = ref(0);
const listLoading = ref(true);

const getList = () => {
  listLoading.value = true;
  // fetchList(listQuery.value).then(response => {
  //   list.value = response.data.items
  //   total.value = response.data.total

  //   // Just to simulate the time of the request
  //   setTimeout(() => {
  //     listLoading.value = false
  //   }, 1.5 * 1000)
  // })
};

const handleFilter = () => {
  listQuery.value.page = 1;
  getList();
};
</script>

<style lang="sass" scoped>
.page
  padding: 16px
  background-color: #e3e3e3
  min-height: calc(100vh - 118px)
</style>
