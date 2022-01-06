<template>
  <el-table
    :data="packageList"
    border
    fit
    highlight-current-row
    style="width: 100%;"
    height="auto"
    max-height="50vh"
  >
    <el-table-column label="ID" width="120px" align="center">
      <template v-slot="{row}">
        <el-tag>
          #<span class="link-type">{{ row.order_id }}-S1P2</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Tracking Num" prop="tracking_number" align="center" width="120px" />
    <el-table-column label="Last Modified" width="130px" align="center">
      <template v-slot="{row}">
        {{ row.last_modified?.split('T')[0] }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="120px" align="center">
      <template v-slot="{row}">
        <el-tag>
          {{ statusOptions[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column class-name="content-column" label="Content" width="200px">
      <template v-slot="{row}">
        <template v-for="(item, key) in row.content" :key="item">
          <div>
            <svg-icon :icon-name="productIconMap[key]" class="content-icon" />
            <span>{{productMap[key]}}:<span class="count">{{ item }}</span></span>
          </div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="Units's Serials" width="150px">
      <template v-slot="{row}">
        <template v-for="item in row.serials" :key="item">
          <p class="link" @click="viewItemSerial(item.id)">{{item.serial}}</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Actions" align="center" min-width="100px" class-name="small-padding fixed-width">
      <template v-slot="{row,$index}">
        <el-popconfirm @confirm="deleteShipment(row,$index)" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
          <template #reference>
            <el-button size="mini" type="danger">
              Delete
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer
    v-model="drawerSerialVisible"
    title="Unit Info"
    size="50%"
    direction="ltr"
    :close-on-click-modal="false"
  >
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item>
        <template #label>Serial</template>
        {{unitItem.serial}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>Used Age</template>
        {{unitItem.used_age}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>SKU</template>
        {{unitItem.sku}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>If Check</template>
        <el-button size="small" @click="checkUnit(true)">Yes</el-button>
        <el-button size="small" type="danger" @click="checkUnit(false)">No</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>Produced Date</template>
        {{unitItem.produced_date}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>Condition</template>
        {{unitItem.condition}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>Owner ID</template>
        {{unitItem.owner_id}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>Item Status</template>
        {{statusOptions[unitItem.status]}}
      </el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { parseTime } from '/@/assets/utils/format';
import { queryShipmentsAPI, deleteShipmentAPI, listShipPackagesAPI, findUnitAPI } from "/@/server/api/logistic";
import { statusOptions, whTypeOptions } from '../enum/shipment';
import { productMap, productIconMap } from '../enum/product';
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/message-box.scss";

// eslint-disable-next-line no-undef
const props = defineProps({
  packageList: {
    type: Array,
    required: true
  },
});

const drawerSerialVisible = ref(false);
const unitItem = ref({});
const ifCheckUnit = ref(null);

const viewItemSerial = unitId => {
  findUnitAPI(unitId).then(data => {
    unitItem.value = data;
    drawerSerialVisible.value = true;
  });
};

const checkUnit = isChecked => {
  ElMessageBox.confirm(
    isChecked? 'Check it?' : 'Don\'t check it?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      callback: (action) => {
        if (action === "confirm") {
          console.log('Checked: '+isChecked);
        }
      },
    }
  );
};

</script>

<style lang="sass" scoped>
.content-column
  .count
    vertical-align: baseline
    padding: 1px 8px
    font-size: 75%
    font-weight: 700
    line-height: 1
    text-align: center
    white-space: nowrap
    color: #212529
    border-radius: 0.25rem
    background-color: #f8f9fa
  .content-icon
    margin-right: .25rem

.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
