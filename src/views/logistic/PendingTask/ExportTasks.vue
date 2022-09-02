<template>
  <el-dialog
    v-model="dialogExportTasksVisible"
    title="Export Tasks"
    width="500px"
    :before-close="beforeCloseDialog"
  >
    <el-form
      ref="dataForm"
      v-model="exportConfig"
      label-position="top"
    >
      <el-form-item label="Export">
        <el-radio-group
          v-model="exportConfig.scope"
        >
          <template
            v-for="(scope, key) in exportScopesEnum"
            :key="key"
          >
            <el-radio :label="scope">
              {{ scope }}
            </el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        class="mgr-10"
        @click="() => { dialogExportTasksVisible = false; } "
      >
        Cancel
      </el-button>
      <el-button
        type="primary"
        @click="exportTasks"
      >
        Export tasks
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { taskTypeEnum, exportScopesEnum, codeNameEnum } from '@/enums/logistic';
import { updateUnitAPI, updatePackageUnitAPI } from '@/api';

/* Start Data */
const savedTasks = inject('savedTasks');
const orderEnum = inject('orderEnum');
const dialogExportTasksVisible = inject('dialogExportTasksVisible');
const tasksProductFulQty = inject('tasksProductFulQty');
const exportConfig = ref({
  scope: exportScopesEnum.CURRENT
});

/* End Data */

const beforeCloseDialog = done => {
  done();
};

const getPackageTrackingNumber = (task, packageIdx) => task.packages[packageIdx]?.trackingNumber;

const getPackageItems = (task, packageIdx) => {
  const packageItem = task.packages[packageIdx];
  if (!packageItem) return null;
  const items = packageItem.units.map(unit => unit.serial);
  packageItem.accessories.forEach(accessory => {
    items.push(`${accessory.quantity} * ${codeNameEnum[accessory.productCode]}`);
  });
  return items.join(';');
};

const getPackageDim = (task, packageIdx) => {
  const packageItem = task.packages[packageIdx];
  if (!packageItem) return null;
  const length = packageItem.length;
  const width = packageItem.width;
  const height = packageItem.height;
  if (!length && !width && !height) return null;
  return `${length || 'NULL'}*${width || 'NULL'}*${height || 'NULL'}`;
};

const getPackageWeight = (task, packageIdx) => task.packages[packageIdx]?.weight;

const exportTasks = () => {
  const headerMapping = {
    'Task Id':
      (order, task) => task.id,
    'Status':
      (order, task) => tasksProductFulQty.value[task.id]?.error ? 'Incomplete' : 'Complete',
    'Order#':
      (order, task) => order.rawOrders.map(o => o.id).join(' & '),
    'Item':
      (order, task) => task.products.map(p => `${p.quantity} * ${codeNameEnum[p.productCode]}`).join(', '),
    'Transport Method':
      (order, task) => task.transportMode,
    'Carrier':
      (order, task) => task.carrier,
    'Pallet Count':
      (order, task) => null,
    'Piece Count':
      (order, task) => null,

    'Email':
      (order, task) => order.email,
    'Phone':
      (order, task) => order.shippingPhone,
    'Company':
      (order, task) => order.shippingCompany,
    'Contact':
      (order, task) => order.shippingName,
    'Address':
      (order, task) => order.shippingAddress1 + (order.shippingAddress2 ? ` ${order.shippingAddress2}` : ''),
    'City':
      (order, task) => order.shippingCity,
    'State':
      (order, task) => order.shippingState,
    'Zipcode':
      (order, task) => order.shippingZip,
    'Country':
      (order, task) => order.shippingCountry,

    // Only truck needs dim and weight and there is only one package
    'P1 Dim':
      (order, task) => getPackageDim(task, 0),
    'P1 Weight':
      (order, task) => getPackageWeight(task, 0),

    'P1 Tracking#':
      (order, task) => getPackageTrackingNumber(task, 0),
    'P1 Items':
      (order, task) => getPackageItems(task, 0),

    'P2 Tracking#':
      (order, task) => getPackageTrackingNumber(task, 1),
    'P2 Items':
      (order, task) => getPackageItems(task, 1),

    'P3 Tracking#':
      (order, task) => getPackageTrackingNumber(task, 2),
    'P3 Items':
      (order, task) => getPackageItems(task, 2),

    'P4 Tracking#':
      (order, task) => getPackageTrackingNumber(task, 3),
    'P4 Items':
      (order, task) => getPackageItems(task, 3),
  };
  import('@/utils/excel').then(excel => {
    const data = savedTasks.value.map(
      task => Object.keys(headerMapping).map(key => headerMapping[key](orderEnum.value[task.orderId], task))
    );
    excel.export_json_to_excel({
      header: Object.keys(headerMapping),
      data,
      filename: 'tasks_export'
    });
    setTimeout(() => {
      dialogExportTasksVisible.value = false;
    }, 200);
  });
};

</script>

<style lang="sass" scoped>

</style>
