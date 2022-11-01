<template>
  <strong class="title">History Tasks:</strong>
  <div class="choice-wrapper">
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">
          tasks</span>to fulfill
      </span> 
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">
          tasks
        </span> need shipment info
      </span>
      
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">
          tasks
        </span> lack serials
      </span>
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice"
      @click="handleClickChoice('2')"
    >
      <span>
        <span class="red">
          return tasks
        </span> need to restock
      </span>
      <svg-icon icon-name="right-arrow" />
    </div>
  </div>

  <strong class="title">Today's new Tasks:</strong>
  <div class="choice-wrapper">
    <div
      class="choice"
      @click="handleClickChoice('3')"
    >
      <span>
        <span class="red">
          new tasks
        </span> to fulfill
      </span>
      
      <svg-icon icon-name="right-arrow" />
    </div>
  </div>
</template>

<script setup>
import { parseTime, jsonClone } from '@/utils';
import { queryTasksAPI } from '@/api';
const router = useRouter();

const props = defineProps({
  guidePageVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:guidePageVisible', 'fetchList']);

const listQuery = inject('listQuery');
const dateFilter = inject('dateFilter') ;

const handleClickChoice = (pattern) => {
  console.log('pattern: ', pattern);
  if (pattern === '1') {
    emit('fetchList');
  } else if (pattern === '2') {
    router.push('package');
  } else if (pattern === '3') {
    setTodayTaskParams();
    emit('fetchList');
  }
  emit('update:guidePageVisible', false);
};

function setTodayTaskParams() {
  listQuery.value.fulfilled = 'false';
  dateFilter.value = [
    parseTime(new Date().getTime() - 86400000 * 1, '{y}-{m}-{d}'),
    parseTime(new Date(), '{y}-{m}-{d}')
  ];
  const [start, end] = dateFilter.value;
  listQuery.value.start = 
    start.includes('T11:30:00') ? start : start + 'T11:30:00';
  listQuery.value.end = 
    end.includes('T11:30:00') ? end : end + 'T11:30:00';
}

const calRemainingTasks = () => {
  const historyParams = jsonClone(listQuery.value);
  historyParams.perPage = 99999; // 拉取所有数据
  queryTasksAPI(historyParams).then(data => {
    console.log('data: ', data);

  });

  setTodayTaskParams();
  const todayParams = jsonClone(listQuery.value);
  queryTasksAPI(todayParams).then(data => {
    console.log('data: ', data);

  });
};

onMounted(() => {
  calRemainingTasks();
})
</script>

<style lang="sass" scoped>
.choice-wrapper
  max-width: 500px
  margin: 1rem 0
  padding: .25rem .5rem
  background-color: #fff
  .choice
    display: flex
    justify-content: space-between
    align-items: center
    padding: .5rem 0
    border: 16px
    font-weight: 500
    cursor: pointer
    .red
      color: red
  .border-bottom
    border-bottom: 1px solid #dcdfe6

.svg-icon
  width: 12px
  height: 12px
</style>
