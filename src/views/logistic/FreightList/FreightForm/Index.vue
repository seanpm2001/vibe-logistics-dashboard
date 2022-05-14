<template>
  <el-form
    ref="dataForm"
    :model="freightItem"
    label-position="left"
    label-width="180px"
  >
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item
        label="*Destination Warehouse"
        prop="targetId"
      >
        <el-select
          v-model="freightItem.targetId"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in warehouseEnum"
            :key="key"
            :label="item"
            :value="Number(key)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="*Batch number"
        prop="number"
      >
        <el-input
          v-model="freightItem.number"
          :disabled="isDialogPattern('view')"
        />
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item
        label="Status"
        prop="status"
      >
        <el-select
          v-model="freightItem.status"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in freightStatusEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Ocean Freight Cost"
        prop="cost"
      >
        <el-input
          v-model="freightItem.cost"
          :disabled="isDialogPattern('view')"
        />
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item
        label="Mode"
        prop="mode"
      >
        <el-select
          v-model="freightItem.mode"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in modeEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Ocean Forwarder"
        prop="oceanForwarder"
      >
        <el-select
          v-model="freightItem.oceanForwarder"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in forwarderEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item
        label="Origin Port"
        prop="oriPort"
      >
        <el-select
          v-model="freightItem.oriPort"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in oriPortEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Destination Port"
        prop="destPort"
      >
        <el-select
          v-model="freightItem.destPort"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in destPortEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item
        label="Container Type"
        prop="container"
      >
        <el-select
          v-model="freightItem.container"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="(item, key) in containerEnum"
            :key="item"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Pick Up"
        prop="pickup"
      >
        <el-date-picker
          v-model="freightItem.pickup"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
    </el-row>
    <el-row justify="space-between">
      <el-form-item
        label="ETD Origin Port"
        prop="etdOp"
      >
        <el-date-picker
          v-model="freightItem.etdOp"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
      <el-form-item
        label="ATD Origin Port"
        prop="atdOp"
      >
        <el-date-picker
          v-model="freightItem.atdOp"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
    </el-row>
    <el-row justify="space-between">
      <el-form-item
        label="ETA Destination Port"
        prop="etaDp"
      >
        <el-date-picker
          v-model="freightItem.etaDp"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
      <el-form-item
        label="ATA Destination Port"
        prop="ataDp"
      >
        <el-date-picker
          v-model="freightItem.ataDp"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
    </el-row>
    <el-row justify="space-between">
      <el-form-item
        label="ETA Warehouse"
        prop="etaWh"
      >
        <el-date-picker
          v-model="freightItem.etaWh"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
      <el-form-item
        label="ATA Warehouse"
        prop="ataWh"
      >
        <el-date-picker
          v-model="freightItem.ataWh"
          :disabled="isDialogPattern('view')"
          type="date"
          placeholder="Please pick a date"
        />
      </el-form-item>
    </el-row>
    <el-row
      justify="space-between"
      :gutter="3"
    >
      <el-form-item label="Transit Time">
        <el-input
          v-model="transitTime"
          disabled
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="Transit Enum">
        <el-select
          v-model="transitTimeBase"
          :default="1"
          :disabled="isDialogPattern('view')"
          placeholder="Please select"
        >
          <el-option
            v-for="item in transitTimeEnum"
            :key="item"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <template v-if="!isDialogPattern('view')">
      <el-button
        v-if="isDialogPattern('create')"
        type="primary"
        @click="createFreight"
      >
        Submit Freight
      </el-button>
      <el-button
        v-if="isDialogPattern('edit')"
        type="primary"
        @click="updateFreight"
      >
        Update Freight
      </el-button>
    </template>

    <el-card v-if="batchArr.length > 0">
      <template
        v-for="(item, index) in batchArr"
        :key="index"
      >
        <BatchForm
          :ref="`batch-${index}`"
          :freight-id="freightItem.id"
          :batch-idx="index"
          :batch-item="item"
          :warehouse-enum="warehouseEnum"
          :dialog-status="dialogStatus"
          @deleteBatch="removeBatch"
          @createBatch="submitBatch"
          @editBatch="updateBatch"
        />
      </template>
    </el-card>
    
    <div class="f-row controls">
      <el-button
        v-if="!isDialogPattern('view')"
        :disabled="disableNewBatch"
        type="primary"
        icon="el-icon-circle-plus"
        @click="handleAddBatch"
      >
        Add Sub-Batch
      </el-button>
      <el-tooltip
        class="tips"
        effect="light"
        content="You need to have/submit a freight part before 'Add new Sub-Batch'"
        placement="right"
      >
        <svg-icon
          class="mgl-5"
          icon-name="tips"
        />
      </el-tooltip>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, ElTooltip } from 'element-plus';
import BatchForm from './BatchForm.vue';
import { createFreightAPI, updateFreightAPI } from '@/api';
import { freightStatusEnum, forwarderEnum, modeEnum, containerEnum, oriPortEnum, destPortEnum } from '@/enums/logistic';
import { parseTime } from '@/utils/format';

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

const emit = defineEmits(['fetchList']);

/* Start data */
const freightItem = inject('freightItem');
const contrastData = inject('contrastData');
const batchArr = inject('batchArr');
const dialogStatus = inject('dialogStatus');

const { proxy } = getCurrentInstance();

const disableNewBatch = computed(() => {
  const arr = batchArr.value;
  if (arr.length === 0) return false;
  return !arr[arr.length - 1]?.id;
});

const transitTimeEnum = [{key: 'day', value: 1}, {key: 'week', value: 7}];
const transitTimeBase = ref(1);
const transitTime = computed(() => {
  const data = freightItem.value;
  return Math.ceil((new Date(data.pickup) - new Date(data.ataWh))/(86400*1000*transitTimeBase.value));
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
  proxy.$refs.dataForm.validate((valid) => {
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
  proxy.$refs.dataForm.validate((valid) => {
    if (valid) {
      const updates = freightItem.value;
      updateFreightAPI(updates.id, updates).then(data => {
        freightItem.value = data;
        contrastData.value = data;
        emit('fetchList');
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
    ElMessage.error('You need to "Submit Freight Section" before "Add Sub-Batch"');
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
  nextTick(() => {
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
:deep(.el-input--prefix .el-input__inner)
  padding-left: calc(5px + 14px + 12px) !important
</style>
