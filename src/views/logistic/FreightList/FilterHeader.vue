<template>
  <el-row
    justify="space-between"
    class="filter-container"
  >
    <el-row>
      <el-input
        v-model="listQuery.title"
        :disabled="isDialogPattern('view')"
        placeholder="Batch Num"
        style="width: 120px"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.sort"
        :disabled="isDialogPattern('view') || true"
        style="width: 150px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortEnum"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-wave
        disabled
        type="primary"
        :icon="Search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        type="primary"
        :icon="Edit"
        :disabled="notCommonPermission"
        @click="showCreateDialog"
      >
        Add
      </el-button>
      <el-button
        v-wave
        disabled
        type="primary"
        :icon="Download"
      >
        Export
      </el-button>
    </el-row>
    <el-button
      v-wave
      style="float: right"
      type="danger"
      :icon="Delete"
      :disabled="!multipleSelection?.length || notCommonPermission"
      @click="handleDelSelected"
    >
      Delete Selected Item
    </el-button>
  </el-row>
</template>

<script lang="ts" setup>
import { Delete, Download, Edit, Search } from '@element-plus/icons-vue';
import { deleteFreightAPI } from '@/api';
// import { parseTime } from '@/utils/format';
import { useUserStore } from '@/store';
const { role } = storeToRefs(useUserStore());

const notCommonPermission = computed(() => !['ADMIN', 'VIBE_MANAGER'].includes(role.value));

const props = defineProps({
  dialogStatus: {
    type: Array,
    default: null
  },
});

const listQuery = inject('listQuery') as any;
const multipleSelection = inject('multipleSelection') as any;

const sortEnum = [
  { label: 'ID Ascending', key: '+id' },
  { label: 'ID Descending', key: '-id' },
];

const emit = defineEmits(['fetchList', 'showCreateDialog']);
const fetchList = () => emit('fetchList');
const showCreateDialog = () => emit('showCreateDialog');

const handleFilter = () => {
  listQuery.value.page = 1;
  fetchList();
};

const isDialogPattern = (type) => props.dialogStatus === type;

const handleDelSelected = () => {
  multipleSelection.value.forEach((_item) => {
    const freightId = _item.id;
    deleteFreightAPI(freightId);
  });
  multipleSelection.value = [];
  fetchList();
};

// const formatJson = (_filterVal) => {
//   return dataList.value.map((v) =>
//     _filterVal.map((j) => {
//       if (j === 'timestamp') {
//         return parseTime(v[j]);
//       } else {
//         return v[j];
//       }
//     })
//   );
// };

// const handleDownload = () => {
//   downloadLoading.value = true;
//   import('@/utils/excel').then((excel) => {
//     const tHeader = ['title', 'type', 'status'];
//     const filterVal = ['title', 'type', 'status'];
//     const data = formatJson(filterVal);
//     excel.export_json_to_excel({
//       header: tHeader,
//       data,
//       filename: 'table-list',
//     });
//     downloadLoading.value = false;
//   });
// };

</script>
