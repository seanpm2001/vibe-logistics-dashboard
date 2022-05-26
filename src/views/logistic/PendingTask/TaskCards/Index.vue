<template>
  <template
    v-for="(task, taskIdx) in dataList"
    :key="task.id"
  >
    <TaskCard
      :task="task"
      :task-idx="taskIdx"
      :order-enum="orderEnum"
    />
  </template>
</template>

<script lang="ts" setup>
import TaskCard from './TaskCard/Index.vue';

const props = defineProps({
  orderEnum: {
    type: Object,
    default: () => {}
  }
});

const dataList = inject('dataList') as any;

</script>

<style lang="sass">

</style>
