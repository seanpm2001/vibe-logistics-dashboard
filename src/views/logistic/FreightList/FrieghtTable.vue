<template>
  <el-table
    :key="tableKey"
    :data="dataList"
    border
    fit
    highlight-current-row
    style="width: 100%"
    height="68vh"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="50"
      height="40"
      align="center"
    />
    <el-table-column
      label="ID"
      prop="id"
      sortable="custom"
      align="center"
      width="80"
      :class-name="getSortClass('id')"
    />
    <el-table-column
      label="Batch Number"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <el-tag>
          #<span
            class="link-type"
            @click="handleDetailRow(row, 'view')"
          >{{
            row.number
          }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Target"
      width="110px"
      align="center"
    >
      <template #default="{ row }">
        <el-tag>{{ warehouseEnum[row.targetId] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Status"
      width="100"
      align="center"
    >
      <template #default="{ row }">
        <el-tag :type="statusTypeDict[row.status]">
          {{ freightStatusEnum[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="ETA WH"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <span>{{ row.etaWh?.split("T")[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="ATA WH"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <span>{{ row.ataWh?.split("T")[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="ETA DP"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <span>{{ row.etaDp?.split("T")[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Pickup"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <span>{{ row.pickup?.split("T")[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Content"
      width="240px"
    >
      <template #default="{ row }">
        <template
          v-for="(item, key) in row.content"
          :key="item"
        >
          <div>
            <svg-icon :icon-name="codeIconEnum[key]" />
            <span class="mgl-5">{{ codeNameEnum[key] }}:<el-tag
              class="mgl-5"
              size="small"
            >{{
              item
            }}</el-tag></span>
          </div>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Actions"
      align="center"
      min-width="300px"
      class-name="small-padding fixed-width"
    >
      <template #default="{ row }">
        <el-button
          v-permission="['ADMIN','VIBE_MANAGER']"
          type="primary"
          size="small"
          @click="handleDetailRow(row, 'edit')"
        >
          Edit
        </el-button>
        <el-button
          type="success"
          size="small"
          @click="handleDetailRow(row, 'view')"
        >
          View detail
        </el-button>
        <el-popconfirm
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="red"
          title="Are you sure to delete this?"
          @confirm="handleDetailRow(row, 'remove')"
        >
          <template #reference>
            <el-button
              v-if="row.status != 'deleted'"
              v-permission="['ADMIN','VIBE_MANAGER']"
              size="small"
              type="danger"
            >
              Delete
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { freightStatusEnum, codeNameEnum, codeIconEnum } from '@/enums/logistic';
defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
});

const listQuery = inject('listQuery') as any;
const multipleSelection = inject('multipleSelection') as any;

const statusTypeDict = {
  'Picked Up': 'success',
  'In Transit': 'info',
  Delivered: 'info',
  Cancelled: 'danger',
};

const tableKey = ref(0);
const emit = defineEmits(['fetchList', 'handleDetailRow']);
const fetchList = () => emit('fetchList');
const handleDetailRow = (freight, type) => emit('handleDetailRow', freight, type);


const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};
const getSortClass = (_key) => {
  const sort = listQuery.value.sort;
  return sort === `+${_key}` ? 'ascending' : 'descending';
};

const sortChange = (data) => {
  const { prop, order } = data;
  if (prop === 'id') {
    sortByID(order);
  }
};

const sortByID = (_order) => {
  if (_order === 'ascending') {
    listQuery.value.sort = '+id';
  } else {
    listQuery.value.sort = '-id';
  }
  handleFilter();
};

const handleSelectionChange = (selectedArr) => {
  multipleSelection.value = selectedArr.sort((pre, next) => next.id - pre.id);
};
</script>
