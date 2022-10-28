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
        <el-tag
          :type="taskColorEnum[row.task.taskType] || ''" 
        >
          {{ taskTypeEnum[row.task.taskType] }}
        </el-tag>
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
              @click="viewUnitDescription(unit, row.task)"
            >{{ unit.serial }}</span>

            <el-select
              v-model="unit.status"
              v-permission="['ADMIN', 'VIBE_MANAGER', 'VIBE_OPERATOR', 'WAREHOUSE']"
              :disabled="disableUnitStatus(unit, role)"
              style="width: 210px; margin: 0 10px;"
              placeholder="Please select"
              @change="onUnitStatusChange(unit)"
            >
              <el-option
                v-for="(status, key) in filterPackageStatus(row.task.taskType, unit.status, 'unit')"
                :key="status"
                :label="status"
                :value="key"
              />
            </el-select>

            <el-button
              v-if="unit.checked || ifMeetWarehousingCondition(row.task.taskType, unit.status)"
              :disabled="unit.checked"
              size="small"
              :type="unit.checked ? 'success' : 'primary'"
              @click="viewUnitDescription(unit, row.task)"
            >
              {{ unit.checked ? 'Received' : 'Receive' }}
            </el-button>

            <el-button
              v-if="unit.checked || ifMeetWarehousingCondition(row.task.taskType, unit.status)"
              v-permission="['ADMIN', 'VIBE_MANAGER', 'WAREHOUSE']"
              :disabled="!unit.checked"
              size="small"
              :type="unit.restocked ? 'success' : 'primary'"
              @click="editWarehousingTask(unit, row.task)"
            >
              {{ unit.restocked ? 'Restocked' : 'Restock' }}
            </el-button>
          </el-row>
        </template>
        <template
          v-for="accessory in row.accessories"
          :key="accessory"
        >
          <el-row
            justify="start"
            align="middle"
          >
            <span class="link">
              {{ codeNameEnum[accessory.productCode] }}: {{ accessory.quantity }}
            </span>

            <el-select
              v-model="accessory.status"
              placeholder="Please select"
              style="width: 210px; margin: 0 10px;"
              @change="onAccessoryStatusChange(accessory, row)"
            >
              <el-option
                v-for="(status, key) in filterPackageStatus(row.task.taskType, accessory.status || 'DELIVERING', 'accessory')"
                :key="status"
                :label="status"
                :value="key"
              />
            </el-select>

            <el-button
              v-if="ifMeetWarehousingCondition(row.task.taskType, accessory.status) || showAccessoryReceived(row.task.taskType, accessory.status)"
              :disabled="['COMPLETE_WITH_DELIVERED', 'COMPLETE_WITH_RETURNED'].includes(accessory.status)"
              size="small"
              :type="['COMPLETE_WITH_DELIVERED', 'COMPLETE_WITH_RETURNED'].includes(accessory.status) ? 'success' : 'primary'"
              @click="receiveAccessory(accessory, row)"
            >
              {{ ['COMPLETE_WITH_DELIVERED', 'COMPLETE_WITH_RETURNED'].includes(accessory.status) ? 'Received' : 'Receive' }}
            </el-button>
          </el-row>
        </template>

        <el-row
          v-if="row.task.taskType === 'RETURN' || row.task.taskType === 'RETURN_TO_REPAIR'"
          style="margin-top: 10px"
        >
          <el-button
            size="small"
            type="primary"
            @click="receiveUnits(row)"
          >
            Receive new units
          </el-button>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column
      class-name="product-column"
      label="Content"
      width="220px"
    >
      <template #default="{ row }">
        <template
          v-for="product in calPackageProductsQuantity(row)"
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
      width="260px"
      align="center"
    >
      <template #default="{ row }">
        <el-date-picker
          v-model="row.createdAt"
          :disabled="notCommonPermission"
          type="date"
          placeholder="Please pick a date"
          value-format="YYYY-MM-DD"
          @change="onPackageItemDateChange(row)"
        />
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
          @change="onPackageItemDateChange(row)"
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

<script setup>
import { ElMessageBox } from 'element-plus';
import { AssignedOrderId } from '../../components';
import { updatePackageUnitAPI, updatePackageAPI, deletePackageAPI } from '@/api';
import { packageStatusEnum, taskTypeEnum, taskColorEnum, codeNameEnum, codeIconEnum, packageConditionEnum } from '@/enums/logistic';
import { useUserStore } from '@/store';
import { getUnitCode } from '@/utils';

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

const emit = defineEmits(['fetchList', 'showOrderDrawer', 'viewUnitDescription', 'editWarehousingTask', 'receiveUnits']);
const fetchList = () => emit('fetchList');
const viewUnitDescription = (unit, task) => emit('viewUnitDescription', unit, task);
const editWarehousingTask = (_unit, _task) => emit('editWarehousingTask', _unit, _task);
const showOrderDrawer = (order) => emit('showOrderDrawer', order);
const receiveUnits = (packageItem) => emit('receiveUnits', packageItem);

const handleSelectionChange = (_selectedArr) => {
  multipleSelection.value = _selectedArr.sort((pre, next) => next.id - pre.id);
};


const filterPackageStatus = (taskType, unitStatus, productType) => {
  const packageStatusEnumCopy = JSON.parse(JSON.stringify(packageStatusEnum));
  if (['FULFILLMENT', 'REPLACE'].includes(taskType)) {
    if (!['RETURNED_BUT_UNCHECKED', 'COMPLETE_WITH_RETURNED'].includes(unitStatus)) {
      delete packageStatusEnumCopy['RETURNED_BUT_UNCHECKED'];
      delete packageStatusEnumCopy['COMPLETE_WITH_RETURNED'];
    }
    delete packageStatusEnumCopy['DELIVERED_BUT_UNCHECKED'];
    productType === 'accessory' && delete packageStatusEnumCopy['RETURNED_BUT_UNCHECKED'];
  }
  if (['RETURN', 'RETURN_TO_REPAIR'].includes(taskType)) {
    if (!['DELIVERED_BUT_UNCHECKED', 'COMPLETE_WITH_DELIVERED'].includes(unitStatus)) {
      delete packageStatusEnumCopy['DELIVERED_BUT_UNCHECKED'];
      delete packageStatusEnumCopy['COMPLETE_WITH_DELIVERED'];
    }
    productType === 'accessory' && delete packageStatusEnumCopy['DELIVERED_BUT_UNCHECKED'];
    delete packageStatusEnumCopy['RETURNED_BUT_UNCHECKED'];
  }
  if (['MOVE'].includes(taskType)) {
    if (!['RETURNED_BUT_UNCHECKED', 'COMPLETE_WITH_RETURNED'].includes(unitStatus)) {
      delete packageStatusEnumCopy['RETURNED_BUT_UNCHECKED'];
      delete packageStatusEnumCopy['COMPLETE_WITH_RETURNED'];
    }
    if (!['DELIVERED_BUT_UNCHECKED', 'COMPLETE_WITH_DELIVERED'].includes(unitStatus)) {
      delete packageStatusEnumCopy['DELIVERED_BUT_UNCHECKED'];
      delete packageStatusEnumCopy['COMPLETE_WITH_DELIVERED'];
    }
  }
  return packageStatusEnumCopy;
};

const disableUnitStatus = (unit, role) => {
  return unit.checked && role === 'WAREHOUSE';
};

const ifMeetWarehousingCondition = (taskType, unitStatus) => {
  if (unitStatus === 'RETURNING') {
    const meetTaskArr = ['FULFILLMENT', 'REPLACE', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  } else if (unitStatus === 'DELIVERING') {
    const meetTaskArr = ['RETURN', 'MOVE', 'RETURN_TO_REPAIR'];
    if (meetTaskArr.includes(taskType))
      return true;
  }
  return false;
};

const onUnitStatusChange = (unit) => {
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        if (!['COMPLETE_WITH_DELIVERED', 'COMPLETE_WITH_RETURNED'].includes(unit.status)) {
          unit.checked = false;
          unit.restocked = false;
        }
        updatePackageUnitAPI(unit.packageId, unit.id, unit);
      } else {
        fetchList();
      }
    },
  });
};

const showAccessoryReceived = (taskType, unitStatus) => {
  if (['RETURN', 'RETURN_TO_REPAIR', 'MOVE'].includes(taskType) && unitStatus === 'COMPLETE_WITH_DELIVERED') {
    return true;
  }
  if (['FULFILLMENT', 'REPLACE', 'MOVE'].includes(taskType) && unitStatus === 'COMPLETE_WITH_RETURNED') {
    return true;
  }
};

const receiveAccessory = (accessory, packageItem) => {
  if (!['COMPLETE_WITH_DELIVERED', 'COMPLETE_WITH_RETURNED'].includes(accessory.status)) {
    if (accessory.status === 'RETURNING') {
      accessory.status = 'COMPLETE_WITH_RETURNED';
    } else if (accessory.status === 'DELIVERING') {
      accessory.status = 'COMPLETE_WITH_COMPLETE';
    }
  }
  onAccessoryStatusChange(accessory, packageItem);
};

const onAccessoryStatusChange = ((accessory, packageItem) => {
  ElMessageBox.confirm('Update it?', 'Warning', {
    type: 'warning',
    callback: (action) => {
      if (action === 'confirm') {
        updatePackageAPI(packageItem.id, packageItem);
      } else {
        fetchList();
      }
    },
  });
});

const deletePackage = (packageId) => {
  deletePackageAPI(packageId)
    .then(() =>  fetchList());
};

const carrierUrlEnum = {
  UPS: (trackNum) => `https://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${trackNum}&requester=ST/trackdetails`,
  GLS: (trackNum) => `https://www.gso.com/Trackshipment?TrackingNumbers=${trackNum}`,
  DAYLIGHT: (trackNum) => `https://mydaylight.dylt.com/external/shipment?probill=${trackNum}`,
  USPS: (trackNum) => `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackNum}`,
  TNT: (trackNum) => `https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=${trackNum}`,
  RL: (trackNum) => `https://www2.rlcarriers.com/freight/shipping/shipment-tracing?pro=${trackNum}&docType=PRO&source=web`,
  DAYANDROSS: (trackNum) => `https://dayross.com/view-shipment-tracking?division=Sameday&probillNumber=${trackNum}`,
  KUEHNE_NAGEL: (trackNum) => `https://onlineservices.kuehne-nagel.com/public-tracking/shipments?query=${trackNum}`,
  SAIA: (trackNum) => `https://www.saia.com/track/details;pro=${trackNum}`,
  FASTFRATE: (trackNum) => `https://www.fastfrate.com/fastnet/fastnet.aspx?ProbillNo=${trackNum}`,
  SF: (trackNum) => `https://www.sf-express.com/cn/en/dynamic_function/waybill/#search/bill-number/${trackNum}`,
  ESTES: (trackNum) => `https://www.estes-express.com/myestes/shipment-tracking/?type=PRO&query=${trackNum}`,
  ABF: (trackNum) => `https://arcb.com/tools/tracking.html#/${trackNum}`,
  FEDEX: (trackNum) => `https://www.fedex.com/fedextrack/?trknbr=${trackNum}`,
  XPO: (trackNum) => `https://track.xpoweb.com/ltl-shipment/${trackNum}/`,
  TOLL: (trackNum) => `https://www.mytoll.com/?externalSearchQuery=${trackNum}&op=Search`,
  ROSENAU: (trackNum) => `https://www.rosenau.ca/track-shipment/?probillNumber=${trackNum}`,
  RRTS: (trackNum) => `https://tools.rrts.com/LTLTrack/?searchValues=${trackNum}`,
  KINDERSLEY: (trackNum) => `https://tnt.kindersleytransport.com/tnt.php?SEARCH_CRITERIA=${trackNum}`,
  PILOT: (trackNum) => `https://www.pilotdelivers.com/pilot-shipment-detail/?Pro=${trackNum}`,
  AUK: '',
  CAP_TRANS: '',
  'C.H.ROBINSON': (trackNum) => `https://www.freightquote.com/track-shipment/?bol=${trackNum}`,
  DAY_ROSS: (trackNum) => `https://dayross.com/view-shipment-tracking?division=Sameday&probillNumber=${trackNum}`,
  DHL: (trackNum) => `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackNum}`,
  YRC_FREIGHT: (trackNum) => `https://my.yrc.com/tools/track/shipments?referenceNumber=${trackNum}`
};

const getTrackingUrl = (carrier, trackingNumber) => {
  if (carrierUrlEnum[carrier])
    return carrierUrlEnum[carrier](trackingNumber);
  return '#/logistic/package';
};

const onPackageItemDateChange = (packageItem) => {
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

const calPackageProductsQuantity = (packageItem) => {
  const productsQuantity = {};
  const products = [];
  packageItem.units?.forEach((unit) => {
    if (unit.item?.serial) {
      const productCode = getUnitCode(unit.item);
      productsQuantity[productCode] = (productsQuantity[productCode] || 0) + 1;
    }
  });
  packageItem.accessories?.forEach((accessory) => {
    const productCode = accessory.productCode;
    if (productCode) {
      productsQuantity[productCode] = (productsQuantity[productCode] || 0) + accessory.quantity;
    }
  });
  for (const productCode in productsQuantity) {
    products.push({
      productCode: productCode,
      quantity: productsQuantity[productCode]
    });
  }
  return products;
};
</script>

<style lang="sass" scoped>
.link
  margin-right: 15px
  color: #66c
  cursor: pointer
  &:hover
    text-decoration: underline
</style>
