<template>
  <el-row
    justify="space-between"
    class="filter-container"
  >
    <el-row>
      <el-input
        v-model="listQuery.search"
        placeholder="Order Info"
        style="width: 150px"
        @keyup.enter="handleFilter"
      >
        <template #append>
          <el-button
            v-wave
            type="primary"
            :icon="Search"
            @click="handleFilter"
          />
        </template>
      </el-input>
      <el-select
        v-model="listQuery.showAssignedOrder"
        placeholder="Assigned Order"
        style="width: 175px"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, key) in { 'Assigned Orders': true, 'Unassigned Orders': false }"
          :key="item"
          :label="key"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.orderFrom"
        disabled
        placeholder="Order From"
        style="width: 130px"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in ['AFN', 'Shopify', 'MFN']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-row>
    <div v-if="!listQuery.showAssignedOrder">
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
        :disabled="!multipleSelection?.length || disableAssign"
        type="primary"
        @click="showAssignDialog('assignSelected')"
      >
        Assign Selected
      </el-button>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
        :disabled="!multipleSelection?.length || disableAssign"
        type="primary"
        @click="showAssignDialog('combineAndAssign')"
      >
        Combine & Assign Selected
      </el-button>
    </div>
    <div v-else>
      <el-button
        v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR']"
        :disabled="!multipleSelection?.length"
        type="primary"
        :icon="Delete"
        @click="unassignSelected()"
      >
        Unassign Selected
      </el-button>
    </div>
  </el-row>
</template>

<script setup>
import { Search, Delete } from '@element-plus/icons-vue';

const listQuery = inject('listQuery');
const multipleSelection = inject('multipleSelection');
const disableAssign = inject('disableAssign');

const emit = defineEmits(['fetchList', 'showAssignDialog', 'unassignOrders']);
const fetchList = () => emit('fetchList');
const showAssignDialog = (type, orderId) => emit('showAssignDialog', type, orderId);
const unassignOrders = order => emit('unassignOrders', order);

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};


const unassignSelected = () => {
  multipleSelection.value.forEach((item) => {
    unassignOrders(item);
  });
  multipleSelection.value = [];
  fetchList();
};
</script>
