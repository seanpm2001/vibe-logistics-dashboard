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
          #<span class="link-type">{{ row.orderId }}-S1P2</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Tracking Num" prop="trackingNumber" align="center" width="120px" />
    <el-table-column label="Last Modified" width="130px" align="center">
      <template v-slot="{row}">
        {{ row.lastModified?.split('T')[0] }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="120px" align="center">
      <template v-slot="{row}">
        <el-tag>
          {{ orderStatusOptions[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column class-name="product-column" label="Content" width="200px">
      <template v-slot="{row}">
        <template v-for="(item, key) in row.content" :key="item">
          <div>
            <svg-icon :icon-name="productIconMap[key]"  />
            <span class="mgl-5">{{productMap[key]}}:<el-tag class="mgl-5" size="small">{{ item }}</el-tag></span>
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
    v-model="drawerUnitVisible"
    title="Unit Info"
    size="50%"
    direction="ltr"
  >
    <unit-description
      :unitItem="unitItem"
    />
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import UnitDescription from './UnitDescription.vue';
import { parseTime } from '/@/assets/utils/format';
import { queryShipmentsAPI, deleteShipmentAPI, listShipPackagesAPI, findUnitAPI } from "/@/server/api/logistic";
import { orderStatusOptions, whTypeOptions, productMap, productIconMap } from '/@/assets/enum/logistic';


// eslint-disable-next-line no-undef
const props = defineProps({
  packageList: {
    type: Array,
    required: true
  },
});

const drawerUnitVisible = ref(false);
const unitItem = ref({});
const ifCheckUnit = ref(null);

const viewItemSerial = unitId => {
  findUnitAPI(unitId).then(data => {
    unitItem.value = data;
    drawerUnitVisible.value = true;
  });
};

</script>

<style lang="sass" scoped>


.link
  color: #66c
  &:hover
    cursor: pointer
    text-decoration: underline
</style>
