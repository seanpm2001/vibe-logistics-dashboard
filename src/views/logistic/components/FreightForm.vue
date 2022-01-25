<template>
  <el-form
    ref="dataForm"
    :rules="rules"
    :model="freightItem"
    label-position="left"
    label-width="180px"
  >
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Destination Warehouse" prop="targetId">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.targetId" placeholder="Please select">
          <el-option v-for="(item, key) in warehouseEnum" :key="key" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="Batch number" prop="number">
        <el-input :disabled="isDialogPattern('view')" v-model="freightItem.number" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Status" prop="status">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.status" placeholder="Please select">
          <el-option v-for="(item, key) in freightStatusEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Ocean Freight Cost" prop="cost">
        <el-input :disabled="isDialogPattern('view')" v-model="freightItem.cost" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Mode" prop="mode">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.mode" placeholder="Please select">
          <el-option v-for="(item, key) in modeEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Ocean Forwarder" prop="oceanForwarder">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.oceanForwarder" placeholder="Please select">
          <el-option v-for="(item, key) in forwarderEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Origin Port" prop="oriPort">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.oriPort" placeholder="Please select">
          <el-option v-for="(item, key) in oriPortEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Destination Port" prop="destPort">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.destPort" placeholder="Please select">
          <el-option v-for="(item, key) in destPortEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Container Type" prop="container">
        <el-select :disabled="isDialogPattern('view')" v-model="freightItem.container" placeholder="Please select">
          <el-option v-for="(item, key) in containerEnum" :key="item" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="Pick Up" prop="pickup">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.pickup" type="date" placeholder="Please pick a date" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="ETD Origin Port" prop="etdOp">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.etdOp" type="date" placeholder="Please pick a date" />
      </el-form-item>
      <el-form-item label="ATD Origin Port" prop="atdOp">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.atdOp" type="date" placeholder="Please pick a date" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="ETA Destination Port" prop="etaDp">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.etaDp" type="date" placeholder="Please pick a date" />
      </el-form-item>
      <el-form-item label="ATA Destination Port" prop="ataDp">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.ataDp" type="date" placeholder="Please pick a date" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="ETA Warehouse" prop="etaWh">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.etaWh" type="date" placeholder="Please pick a date" />
      </el-form-item>
      <el-form-item label="ATA Warehouse" prop="ataWh">
        <el-date-picker :disabled="isDialogPattern('view')" v-model="freightItem.ataWh" type="date" placeholder="Please pick a date" />
      </el-form-item>
    </el-row>
    <el-row justify="space-between" :gutter="3">
      <el-form-item label="Transit Time">
        <el-input disabled v-model="transitTime" placeholder=""/>
      </el-form-item>
      <el-form-item label="Transit Enum">
        <el-select :default="1" :disabled="isDialogPattern('view')" v-model="transitTimeBase" placeholder="Please select">
          <el-option v-for="item in transitTimeEnum" :key="item" :label="item.key" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-row>
    <template v-if="!isDialogPattern('view')">
      <el-button v-if="isDialogPattern('create')" type="primary" @click="createFreight">
        Submit Freight
      </el-button>
      <el-button v-if="isDialogPattern('edit')" type="primary" @click="updateFreight">
        Update Freight
      </el-button>
    </template>

    <el-card v-if="batchArr.length > 0">
      <template v-for="(item, index) in batchArr" :key="index">
        <BatchForm
          :ref="`batch-${index}`"
          :freightId="freightItem.id"
          :batchIdx="index"
          :batchItem="item"
          :warehouseEnum="warehouseEnum"
          :dialogStatus="dialogStatus"
          @deleteBatch="removeBatch"
          @createBatch="submitBatch"
          @editBatch="updateBatch"
        />
      </template>
    </el-card>
    
    <div class="f-row controls">
      <el-button v-if="!isDialogPattern('view')" :disabled="disableNewBatch" type="primary" icon="el-icon-circle-plus" @click="handleAddBatch">
        Add Sub-Batch
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a freight part before 'Add new Sub-Batch'"
        placement="right"
      >
        <svg-icon icon-name="tips" />
      </el-tooltip>
    </div>
  </el-form>
</template>

<script setup>

import { ElMessage } from "element-plus";
import BatchForm from './BatchForm.vue';
import {
  queryFreightsAPI, createFreightAPI, findFreightAPI, updateFreightAPI, deleteFreightAPI,
  listWarehousesAPI, listBatchesAPI, deleteBatchAPI
} from "/@/api/logistic";
import { freightStatusEnum, forwarderEnum, modeEnum, containerEnum, oriPortEnum, destPortEnum} from '/@/enums/logistic';
import { parseTime } from '/@/utils/format';

// eslint-disable-next-line no-undef
const props = defineProps({
  emptyFreightForm: {
    type: Object,
    required: true
  },
  warehouseEnum: {
    type: Object,
    required: true
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['fetchList']);

/* Start data */
const freightItem = inject('freightItem');
const contrastData = inject('contrastData');
const batchArr = inject('batchArr');
const dialogStatus = inject('dialogStatus');

const { proxy } = getCurrentInstance();
const rules = ref({
  targetId: [{ required: true, message: 'destination is required', trigger: 'change' }],
  number: [{ required: true, message: 'batch number is required', trigger: 'change' }],
});

const disableNewBatch = computed(() => {
  const arr = batchArr.value;
  if (arr.length === 0) return false;
  return !arr[arr.length - 1]?.id;
});

const transitTimeEnum = [{key: 'day', value: 1}, {key: 'week', value: 7}];
const transitTimeBase = ref(1);
const transitTime = computed(() => {
  const data = freightItem.value;
  return Math.abs(+data.ataWh - +data.atdOp)/(86400*1000*transitTimeBase.value);
});

const datePropertyArr = ['ataDp', 'atdOp', 'etaDp', 'etdOp', 'pickup', 'ataWh', 'etaWh'];
/* End data */
const isDialogPattern = type => dialogStatus.value === type;

const formatDate = arr => {
  datePropertyArr.forEach(key => {
    arr[key] = parseTime(arr[key], '{y}-{m}-{d}');
  });
  return arr;
};

const createFreight = () => {
  proxy.$parent.validate((valid) => {
    if (valid) {
      const data = formatDate(freightItem.value);
      createFreightAPI(data).then(data => {
        freightItem.value = data;
        dialogStatus.value = 'edit';
        emit('fetchList');
      });
    }
  });
};

const updateFreight = () => {
  proxy.$parent.validate((valid) => {
    if (valid) {
      const updates = freightItem.value;
      updateFreightAPI(updates.id, updates).then(data => {
        freightItem.value = data;
        contrastData.value = null;
      });
    }
  });
};

const removeBatch = (idx, batchId) => {
  batchArr.value.splice(idx, 1);
  emit('fetchList');
};

const handleAddBatch = () => {
  if (!freightItem.value.id) {
    ElMessage.error('You need to "Submit Freight Section" before "Add Sub-Batch"', 3);
    return;
  }
  batchArr.value.push({costs: {}, sourceId: '', items: []});
};

const submitBatch = (batch, freightId, batchIdx) => {
  emit('fetchList');
};

const updateBatch = (data, batchIdx) => {
  emit('fetchList');
};

const resetForm = () => {
  proxy.$nextTick(() => {
    batchArr.value = [];
    freightItem.value = Object.assign({}, props.emptyFreightForm);
    proxy.$refs['dataForm'].clearValidate();
  });
};

// eslint-disable-next-line no-undef
defineExpose({
  resetForm
});
</script>

<style lang="sass" scoped>

</style>
