<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { scrollTo } from '/@/utils/scroll-to';

const { proxy } = getCurrentInstance();

const props = defineProps({
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50];
    },
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['pagination']);

const currentPage = computed((val) => props.page);
const pageSize = computed((val) => props.perPage);

const handleSizeChange = (val) => {
  emit('pagination', { page: props.page, perPage: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
const handleCurrentChange = (val) => {
  emit('pagination', { page: val, perPage: props.pageSize });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
</script>

<style lang="sass" scoped>
.pagination-container
  background: #fff
  padding: 32px 16px
.pagination-container.hidden
  display: none
</style>
