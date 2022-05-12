<template>
  <el-table
    :key="tableKey"
    :data="dataList"
    border
    fit
    highlight-current-row
    style="width: 100%"
    height="68vh"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="50"
      height="40"
      align="center"
    />
    <el-table-column
      label="Package ID"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        <el-tag>
          #<span class="link-type">{{ row.id }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Order ID"
      width="220px"
      align="center"
    >
      <template #default="{ row }">
        <AssignedOrderId
          :order="orderEnum[row.task.orderId]"
          @show-order-drawer="showOrderDrawer(orderEnum[row.task.orderId])"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="Tracking Num"
      align="center"
      width="200px"
    >
      <template #default="{ row }">
        <a
          :href="getTrackingUrl(row.task.carrier, row.trackingNumber)"
          target="_blank"
        >
          {{ row.trackingNumber }}
        </a>
      </template>
    </el-table-column>
    <el-table-column
      label="Carrier"
      width="160px"
      align="center"
    >
      <template #default="{ row }">
        {{ row.task.carrier }}
      </template>
    </el-table-column>
    <el-table-column
      label="Task Type"
      width="120px"
      align="center"
    >
      <template #default="{ row }">
        {{ taskTypeEnum[row.task.taskType] }}
      </template>
    </el-table-column>
    <el-table-column
      label="Units's Serials: Status"
      width="560px"
    >
      <template #default="{ row }">
        <template
          v-for="unit in row.units"
          :key="unit"
        >
          <el-row
            justify="start"
            align="middle"
          >
            <span
              class="link"
              @click="viewUnitDescription(unit, row.task.products)"
            >{{ unit.serial }}</span>
            <el-button
              :disabled="unit.checked || !ifMeetHousingCondtion(row.task.taskType, unit.status)"
              size="small"
              :type="unit.checked ? 'success' : 'primary'"
              @click="viewUnitDescription(unit, row.task.products)"
            >
              Check
            </el-button>
            <el-select
              v-model="unit.status"
              v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
              style="width: 210px; margin: 0 10px;"
              placeholder="Please select"
              @change="onUnitStatusChange(unit)"
            >
              <el-option
                v-for="(status, key) in packageStatusEnum"
                :key="status"
                :label="status"
                :value="key"
              />
            </el-select>
            
            <el-button
              v-if="ifMeetHousingCondtion(row.task.taskType, unit.status)"
              v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
              :disabled="!unit.checked"
              size="small"
              type="primary"
              @click="editHousingTask(unit, row.task)"
            >
              Warehousing
            </el-button>
          </el-row>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      class-name="product-column"
      label="Content"
      width="220px"
    >
      <template #default="{ row }">
        <template
          v-for="product in row.task.products"
          :key="product.productCode"
        >
          <div>
            <svg-icon :icon-name="codeIconEnum[product.productCode] || 'product-other'" />
            <span class="mgl-5">
              {{ codeNameEnum[product.productCode] || product.productCode }}:
              <el-tag
                class="mgl-5"
                size="small"
              >{{ product.quantity }}</el-tag>
            </span>
          </div>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      label="Fulfilled At"
      width="180px"
      align="center"
    >
      <template #default="{ row }">
        {{ formatVBDate(row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column
      label="Delivered At"
      width="260px"
      align="center"
    >
      <template #default="{ row }">
        <el-date-picker
          v-model="row.deliveredAt"
          :disabled="notCommonPermission"
          type="date"
          placeholder="Please pick a date"
          value-format="YYYY-MM-DD"
          @change="onDeliveredAtChange(row)"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="Last Modified"
      width="160px"
      align="center"
    >
      <template #default="{ row }">
        {{ row.lastModified }}
      </template>
    </el-table-column>
    <el-table-column
      v-permission="['ADMIN', 'VIBE_MANAGER']"
      fixed="right"
      label="Actions"
      align="center"
      min-width="240px"
      class-name="small-padding fixed-width"
    >
      <template #default="{ row }">
        <el-popconfirm
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="red"
          title="Are you sure to delete this?"
          @confirm="deletePackage(row.id)"
        >
          <template #reference>
            <el-button
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
import { ElMessageBox } from 'element-plus';
import { AssignedOrderId } from '../../components';
import { updatePackageUnitAPI, updatePackageAPI } from '@/api/logistic';
import { packageStatusEnum, taskTypeEnum, codeNameEnum, codeIconEnum } from '@/enums/logistic';
import { useUserStore } from '@/store';
import { formatVBDate } from '@/utils';

defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  orderEnum: {
    type: Object,
    default: () => {}
  }
});

const { role } = storeToRefs(useUserStore());
const notCommonPermission = computed(() => !['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE'].includes(role.value));

const multipleSelection = inject('multipleSelection');

const tableKey = ref(0);

const emit = defineEmits(['fetchList', 'showOrderDrawer', 'viewUnitDescription', 'editHousingTask']);
const fetchList = () => emit('fetchList');

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.id - pre.id);
};

const viewUnitDescription = (unit, products) => {
  emit('viewUnitDescription', unit, products);
};

const editHousingTask = (_unit, _task) => {
  emit('editHousingTask', _unit, _task);
};

const ifMeetHousingCondtion = (taskType, unitStatus) => {
  if (unitStatus === 'RETURNED_BUT_UNCHECKED') {
    const meetTaskArr = ['FULFILLMENT', 'REPLACE', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  } else if (unitStatus === 'DELIVERED_BUT_UNCHECKED') {
    const meetTaskArr = ['RETURN', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  }
  return false;
};

const showOrderDrawer = (order) => {
  emit('showOrderDrawer', order);
};

const onUnitStatusChange = (unit) => {
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm')
        updatePackageUnitAPI(unit.packageId, unit.id, unit);
      else
        fetchList();
    },
  });
};

const carrierUrlEnum = {
  UPS: (trackNum: string) => `https://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${trackNum}&requester=ST/trackdetails`,
  GLS: (trackNum: string) => `https://www.gso.com/Trackshipment?TrackingNumbers=${trackNum}`,
  DAYLIGHT: (trackNum: string) => `https://mydaylight.dylt.com/external/shipment?probill=${trackNum}`,
  USPS: (trackNum: string) => `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackNum}`,
  TNT: (trackNum: string) => `https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=${trackNum}`,
  R_AND_L: (trackNum: string) => `https://www2.rlcarriers.com/freight/shipping/shipment-tracing?pro=${trackNum}&docType=PRO&source=web`,
  DAYANDROSS: (trackNum: string) => `https://dayross.com/view-shipment-tracking?division=Sameday&probillNumber=${trackNum}`,
  KUEHNE_NAGEL: (trackNum: string) => `https://onlineservices.kuehne-nagel.com/public-tracking/shipments?query=${trackNum}`,
  SAIA: (trackNum: string) => `https://www.saia.com/track/details;pro=${trackNum}`,
  FASTFRATE: (trackNum: string) => `https://www.fastfrate.com/fastnet/fastnet.aspx?ProbillNo=${trackNum}`,
  SF: (trackNum: string) => `https://www.sf-express.com/cn/en/dynamic_function/waybill/#search/bill-number/${trackNum}`,
  ESTES: (trackNum: string) => `https://www.estes-express.com/myestes/shipment-tracking/?type=PRO&query=${trackNum}`,
  ABF: (trackNum: string) => `https://arcb.com/tools/tracking.html#/${trackNum}`,
  FEDEX: (trackNum: string) => `https://www.fedex.com/fedextrack/?trknbr=${trackNum}`,
  XPO: (trackNum: string) => `https://track.xpoweb.com/ltl-shipment/${trackNum}/`,
  TOLL: (trackNum: string) => `https://www.mytoll.com/?externalSearchQuery=${trackNum}&op=Search`,
  ROSENAU: (trackNum: string) => `https://www.rosenau.ca/track-shipment/?probillNumber=${trackNum}`,
  RRTS: (trackNum: string) => `https://tools.rrts.com/LTLTrack/?searchValues=${trackNum}`,
  KINDERSLEY: (trackNum: string) => `https://tnt.kindersleytransport.com/tnt.php?SEARCH_CRITERIA=${trackNum}`,
  PILOT: (trackNum: string) => `https://www.pilotdelivers.com/pilot-shipment-detail/?Pro=${trackNum}`,
  AUK: '',
  CAP_TRANS: '',
};

const getTrackingUrl = (carrier, trackingNumber) => {
  if (carrierUrlEnum[carrier])
    return carrierUrlEnum[carrier](trackingNumber);
  return '#/logistic/package';
};

const onDeliveredAtChange = (packageItem) => {
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm')
        updatePackageAPI(packageItem.id, packageItem);
      else
        fetchList();
    },
  });
};
</script>

<style lang="sass" scoped>

</style>
