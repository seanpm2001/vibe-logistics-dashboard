<template>
  <div
    :class="{ hidden: hidden }"
    class="pagination-container"
  >
    <el-pagination
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.perPage"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="onQueryChange"
      @current-change="onQueryChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { scrollTo } from '@/utils/scroll-to';

const listQuery = inject('listQuery') as any;

const props = defineProps({
  total: {
    required: true,
    type: Number,
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

const emit = defineEmits(['fetchList']);

const onQueryChange = (val) => {
  emit('fetchList');
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
