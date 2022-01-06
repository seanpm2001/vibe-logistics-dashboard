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
    <el-table-column label="Items & Serials" width="150px">
      <template v-slot="{row}">
        <template v-for="item in row.serials" :key="item">
          <p class="link" @click="viewSerialDetail(item.id)">{{item.serial}}</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Actions" align="center" min-width="100px" class-name="small-padding fixed-width">
      <template v-slot="{row,$index}">
        <el-popconfirm @confirm="deleteShipment(row,$index)" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="red" title="Are you sure to delete this?">
          <template #reference>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger">
              Delete
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from "vue";
import { parseTime } from '/@/assets/utils/format';
import { queryShipmentsAPI, deleteShipmentAPI, listShipPackagesAPI } from "/@/server/api/logistic";
import { statusOptions, whTypeOptions } from '../enum/shipment';
import { productMap, productIconMap } from '../enum/product';

// eslint-disable-next-line no-undef
const props = defineProps({
  packageList: {
    type: Array,
    required: true
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['getItemSerialId']);

const viewSerialDetail = itemId => {
  emit('getItemSerialId', itemId);
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
