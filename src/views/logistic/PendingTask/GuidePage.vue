<template>
  <strong class="title">Past 15 days' History Tasks:</strong>
  <div class="choice-wrapper">
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">{{ taskFulfilmentErrorCount.historyFulfillCount }} tasks</span> to fulfill
      </span> 
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">
          {{ taskFulfilmentErrorCount.historyShipmentCount }} tasks
        </span> lack shipment info
      </span>
      
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice border-bottom"
      @click="handleClickChoice('1')"
    >
      <span>
        <span class="red">
          {{ taskFulfilmentErrorCount.historyLackSerialCount }} tasks
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
          {{ historyRestockCount }} return tasks
        </span> need to restock
      </span>
      <svg-icon icon-name="right-arrow" />
    </div>
    <div
      class="choice"
      @click="handleClickChoice('3')"
    >
      <span>
        <span class="red">
          {{ historyReceiveCount }} return tasks
        </span> haven't received
      </span>
      <svg-icon icon-name="right-arrow" />
    </div>
  </div>

  <strong class="title">Today's new Tasks:</strong>
  <div class="choice-wrapper">
    <div
      class="choice"
      @click="handleClickChoice('4')"
    >
      <span>
        <span class="red">
          {{ todayFulfillCount }} new tasks
        </span> to fulfill
      </span>
      
      <svg-icon icon-name="right-arrow" />
    </div>
  </div>
  <strong class="title">Future 2 months' On-hold Tasks:</strong>
  <div class="choice-wrapper">
    <div
      class="choice"
      @click="handleClickChoice('5')"
    >
      <span>
        <span class="red">
          {{ historyOnHoldCount }} tasks
        </span> are on-hold
      </span>
      
      <svg-icon icon-name="right-arrow" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { parseTime, jsonClone } from '@/utils';
import { queryTasksAPI } from '@/api';
import { useLogisticStore } from '@/store';

const logisticStore = useLogisticStore();
const router = useRouter();

const props = defineProps({
  guidePageVisible: {
    type: Boolean,
    required: true
  },
  statisticalDataList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:guidePageVisible', 'fetchList', 'fetchStatisticalList']);

const listQuery = inject('listQuery');
const dateFilter = inject('dateFilter') ;
const tasksProductFulQty = inject('tasksProductFulQty');

const todayFulfillCount = ref(0);
const historyRestockCount = ref(0);
const historyReceiveCount = ref(0);
const historyOnHoldCount = ref(0);

const taskFulfilmentErrorCount = computed(() => {
  const historyFulfillCount = props.statisticalDataList.filter(task => !task.fulfilledAt).length;
  let historyShipmentCount = 0;
  let historyLackSerialCount = 0;
  for (const taskId in tasksProductFulQty.value) {
    const error = tasksProductFulQty.value[taskId]?.error;
    if (_includes(error, ['Missing tracking number', 'Missing carrier']))
      historyShipmentCount++;
    if (_includes(error, ['Specified serial unfulfilled', 'Quantity mismatch', 'Unwantted product', 'Extra product', 'Missing product']))
      historyLackSerialCount++;
    
  }

  return {
    historyFulfillCount,
    historyShipmentCount,
    historyLackSerialCount,
  };
});

function _includes(str, targetArr) {
  return targetArr.some(target => !!~str.indexOf(target));
}

const handleClickChoice = (pattern) => {
  switch (pattern) {
  case '1':
    setTaskParams(15);
    emit('fetchStatisticalList');
    emit('fetchList');
    ElMessage.warning('Default show past 15 days\' tasks!');
    break;
  case '2':
    setPackagePageListQuery('restock');
    router.push('package');
    break;
  case '3':
    setPackagePageListQuery('receive');
    router.push('package');
    break;
  case '4':
    setTaskParams(1);
    emit('fetchList');
    break;
  case '5':
    setOnHoldTaskParams(0);
    listQuery.value.onHold = true;
    emit('fetchList');
    break;
  default:
    ElMessage.error('Unkown error! Default show today\'s new task.');
    setTaskParams(1);
    emit('fetchList');
  }
 
  setTimeout(() => emit('update:guidePageVisible', false), 1000);
};

function setTaskParams(dayWindow) {
  listQuery.value.fulfilled = 'false';
  dateFilter.value = [
    parseTime(new Date().getTime() - 86400000 * dayWindow, '{y}-{m}-{d}'),
    parseTime(new Date(), '{y}-{m}-{d}')
  ];
  const [start, end] = dateFilter.value;
  listQuery.value.start = 
    start.includes('T11:30:00') ? start : start + 'T11:30:00';
  listQuery.value.end = 
    end.includes('T11:30:00') ? end : end + 'T11:30:00';
}

function setOnHoldTaskParams(dayWindow) {
  listQuery.value.fulfilled = 'false';
  dateFilter.value = [
    parseTime(new Date().getTime() - 86400000 * dayWindow, '{y}-{m}-{d}'),
    parseTime(new Date().getTime() + 86400000 * 60, '{y}-{m}-{d}')
  ];
  const [start, end] = dateFilter.value;
  listQuery.value.start = 
    start.includes('T11:30:00') ? start : start + 'T11:30:00';
  listQuery.value.end = end.includes('T11:30:00') ? end : end + 'T11:30:00';
}

const getQueryStartEnd = (dayWindow) => {
  return parseTime(new Date().getTime() - 86400000 * dayWindow, '{y}-{m}-{d}') + 'T11:30:00';
};

const calRemainingTasks = () => {
  const historyParams = jsonClone(listQuery.value);
  historyParams.start = getQueryStartEnd(15);
  historyParams.end = getQueryStartEnd(0);
  historyParams.perPage = 99999; // 拉取所有数据
  emit('fetchStatisticalList', historyParams);

  // query return tasks
  historyParams.taskType = 'RETURN';
  queryTasksAPI(historyParams).then(data => {
    const tasks = data?.items || [];
    historyRestockCount.value = tasks.filter(task => {
      return task.packages.some(packageItem => {
        return packageItem.units.some(unit => !unit.restocked);
      });
    }).length;
    historyReceiveCount.value = tasks.filter(task => {
      return task.packages.some(packageItem => {
        return !packageItem.units.length;
      });
    }).length;
  });

  setTaskParams(1);
  const todayParams = new URLSearchParams(jsonClone(listQuery.value));
  todayParams.append('taskType', 'FULFILLMENT');
  todayParams.append('taskType', 'REPLACE');
  queryTasksAPI(todayParams).then(data => {
    const tasks = data?.items || [];
    todayFulfillCount.value = tasks.filter(task => !task.fulfilledAt).length;
  });

  setOnHoldTaskParams(0);
  let onHoldParams = jsonClone(listQuery.value);
  onHoldParams.onHold = true;
  onHoldParams = new URLSearchParams(onHoldParams);
  onHoldParams.append('taskType', 'FULFILLMENT');
  onHoldParams.append('taskType', 'REPLACE');

  queryTasksAPI(onHoldParams).then(data => {
    const tasks = data?.items || [];
    historyOnHoldCount.value = tasks.length;
  });
};

function setPackagePageListQuery (type) {
  logisticStore.setListQuery({
    query: {
      page: 1,
      perPage: 10,
      search: '',
      onlyShowReturnTask: true,
      onlyNeedRestock: type === 'restock',
      onlyNeedReceive: type === 'receive'
    },
    pageName: 'package',
  });
}

onMounted(() => {
  calRemainingTasks();
});
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
