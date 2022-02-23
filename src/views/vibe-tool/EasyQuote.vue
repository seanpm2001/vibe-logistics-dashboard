<template>
  <div class="page">
    <el-form
     label-position="left"
    >
      <el-form-item style="margin-right: 32px" label="55 Board Number(1-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="board55Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="55 Stand Number(1-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="stand55Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="75 Board Number(1-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="board75Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="75 Board Number(1-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="stand75Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item label="Country/Area/Transport:">
        <el-cascader
          :disabled="!hasProduct()"
          placeholder="Country/Area/Transport"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          clearable
          filterable
          @change="onCascaderArrChange"
        />
      </el-form-item>
    </el-form>
    <div>Price: {{price || 'TBA'}}</div>
  </div>
</template>

<script setup>
import { CATruckAreaCostEnum, CAFedexAreaCostEnum } from '/@/enums/easy-quote';

const board55Num = ref(null);
const stand55Num = ref(null);
const board75Num = ref(null);
const stand75Num = ref(null);
const price = ref(null);
const westAreaArr = ['WA', 'OR', 'CA', 'NV', 'ID', 'UT', 'AZ', 'NM', 'CO', 'MT', 'WY'];
const middleAreaArr = ['AL', 'AR', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'MI', 'MN', 'MS', 'MO', 'NE', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX', 'WI'];
const eastAreaArr = ['CT', 'DE', 'FL', 'GA', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'NC', 'PA', 'RI', 'SC', 'VT', 'VA', 'WV'];
const isWestUs = area => westAreaArr.includes(area);
const isMiddleUs = area => middleAreaArr.includes(area);
const isEastUs = area => eastAreaArr.includes(area);
const hasProduct55 = () => board55Num.value > 0 || stand55Num.value > 0;
const hasProduct75 = () => board75Num.value > 0 || stand75Num.value > 0;
const hasProduct = () => hasProduct55() || hasProduct75();

const cascaderArr = ref([]);
const onCascaderArrChange = arr => {
  cascaderArr.value = arr;
  calculatePrice(arr);
};

const calculatePrice = arr => { 
  if (!arr || arr.length === 0) {
    price.value = 'TBA';
    return;
  }
  let total = 0;
  const [country, area, transport] = arr;
  const b55num = board55Num.value || 0;
  const s55num = stand55Num.value || 0;
  const b75num = board55Num.value || 0;
  const s75num = stand55Num.value || 0;

  // product 55 price
  if (b55num > 0 && s55num === 0) { // only 55 stand
    if(area === 'AK') {
      if (num <= 10) {
        total = (num * 150 + 450);
      }
      total = 0;
    }
    if(area === 'HI') {
      if (num <= 10) {
        total = num * 200 + 600;
      }
      total = 0;
    }
    // West US
    if (isWestUs(area)) {
      if (transport === 'GLS') {
        if (num <= 10) {
          total = (num * 100 + 70);
        } else if (num <= 40) {
          total = (60 * (num-10) + 1070);
        }
      } else if (transport === 'TRUCK') {
        if (num <= 10) {
          total = (num * 90 + 260);
        } else if (num <= 40) {
          total = (60 * (num-10) + 1160);
        }
      }
    // Middle US
    } else if (isMiddleUs(area)) {
      if (num <= 10) {
        total = (num * 100 + 300);
      } else if (10 < num) {
        total = (70 * (num-10) + 1300);
      }
    // East US
    } else if (isEastUs(area)) {
      if (num <= 10) {
        total = (num * 110 + 340);
      } else if (10 < num) {
        total = (80 * (num-10) + 1440);
      }
    // Other
    } else {
      total = 0;
    }
  } else if (b55num === 0 && s55num > 0) { // only 55 stand
    // TODO: 
  } else if (b55num !==0 && s55num !==0) { // 55 board + stand
    const setNum = Math.min(b55num, s55num);
    if (country === 'CANADA') {
      if (transport==='TRUCK') {
        if (b55num > s55num) { // 55 after 1 board

        } else if (b55num < s55num) { // 55 after 1 stand

        }
        count += setNum * CATruckAreaCostEnum[area];
      } else if (transport==='FEDEX') {
        if (b55num > s55num) { // 55 after 1 board

        } else if (b55num < s55num) { // 55 after 1 stand

        }
        count += setNum * CAFedexAreaCostEnum[area];
      }
    } else if (area === 'US') {
      console.log();
    }
    price.value = total === 0 ? 'TBA' : '$' + total;
  }
  

  if (b75num > 0 && s75num === 0) { // only 75 stand

  } else if (b75num === 0 && s75num > 0) { // only 75 stand

  } else if (b75num === s75num) { // 75 set(s)

  } else if (b75num > s75num) { // 75 after 1 board

  } else if (b75num < s75num) { // 75 after 1 stand

  }

};

// const unitOpiton = { value: 'UNIT', label: 'Unit(s)' };
// const boardOption = { value: 'BOARD', label: 'Board(s)' };
// const setOption = { value: 'SET', label: 'Set(s)' };

const  USGlsChildren = computed(() => {
  if (hasProduct75())
    return [{ value: 'TRUCK', label: 'Truck' }];
  return [
    { value: 'GLS', label: 'GLS' },
    { value: 'TRUCK', label: 'Truck' },
  ];
});
const USTruckChildren = [
  { value: 'TRUCK', label: 'Truck' },
];
const CAChildren = computed(() => {
  if (hasProduct75())
    return [{ value: 'TRUCK', label: 'Truck' }];
  return [
    { value: 'TRUCK', label: 'Truck' },
    { value: 'FEDEX', label: 'FedEx-Amazon'},
  ];
});
const options = ref([
  { // country
    value: 'CANADA',
    label: 'Canada(TBA)',
    children: [ // province
      // nationwide
      { value: 'AB', label: 'AB', children: CAChildren },
      { value: 'BC', label: 'BC', children: CAChildren },
      { value: 'MB', label: 'MB', children: CAChildren },
      { value: 'NB', label: 'NB', children: CAChildren },
      { value: 'NL', label: 'NL', children: CAChildren },
      { value: 'NS', label: 'NS', children: CAChildren },
      { value: 'NT', label: 'NT', children: CAChildren },
      { value: 'NU', label: 'NU', children: CAChildren },
      { value: 'ON', label: 'ON', children: CAChildren },
      { value: 'PE', label: 'PE', children: CAChildren },
      { value: 'QC', label: 'QC', children: CAChildren },
      { value: 'SK', label: 'SK', children: CAChildren },
      { value: 'YT', label: 'YT', children: CAChildren },
    ],
  },
  { // country
    value: 'US',
    label: 'US',
    children: [ // state
      // West coast by GLS
      { value: 'AZ', label: 'AZ', children:  USGlsChildren },
      { value: 'CA', label: 'CA', children:  USGlsChildren },
      { value: 'ID', label: 'ID', children:  USGlsChildren },
      { value: 'NM', label: 'NM', children:  USGlsChildren },
      { value: 'NV', label: 'NV', children:  USGlsChildren },
      { value: 'OR', label: 'OR', children:  USGlsChildren },
      { value: 'UT', label: 'UT', children:  USGlsChildren },
      { value: 'WA', label: 'WA', children:  USGlsChildren },
      // West coast by other trucks
      { value: 'CO', label: 'CO', children: USTruckChildren },
      { value: 'MT', label: 'MT', children: USTruckChildren },
      { value: 'WY', label: 'WY', children: USTruckChildren },
      // Middle region by other trucks
      { value: 'AL', label: 'AL', children: USTruckChildren },
      { value: 'AR', label: 'AR', children: USTruckChildren },
      { value: 'IL', label: 'IL', children: USTruckChildren },
      { value: 'IN', label: 'IN', children: USTruckChildren },
      { value: 'IA', label: 'IA', children: USTruckChildren },
      { value: 'KS', label: 'KS', children: USTruckChildren },
      { value: 'KY', label: 'KY', children: USTruckChildren },
      { value: 'LA', label: 'LA', children: USTruckChildren },
      { value: 'MI', label: 'MI', children: USTruckChildren },
      { value: 'MN', label: 'MN', children: USTruckChildren },
      { value: 'MO', label: 'MO', children: USTruckChildren },
      { value: 'MS', label: 'MS', children: USTruckChildren },
      { value: 'NE', label: 'NE', children: USTruckChildren },
      { value: 'ND', label: 'ND', children: USTruckChildren },
      { value: 'OH', label: 'OH', children: USTruckChildren },
      { value: 'OK', label: 'OK', children: USTruckChildren },
      { value: 'SD', label: 'SD', children: USTruckChildren },
      { value: 'TN', label: 'TN', children: USTruckChildren },
      { value: 'TX', label: 'TX', children: USTruckChildren },
      { value: 'WI', label: 'WI', children: USTruckChildren },
      // East coast by other trucks
      { value: 'CT', label: 'CT', children: USTruckChildren },
      { value: 'DE', label: 'DE', children: USTruckChildren },
      { value: 'FL', label: 'FL', children: USTruckChildren },
      { value: 'GA', label: 'GA', children: USTruckChildren },
      { value: 'MA', label: 'MA', children: USTruckChildren },
      { value: 'MD', label: 'MD', children: USTruckChildren },
      { value: 'ME', label: 'ME', children: USTruckChildren },
      { value: 'NC', label: 'NC', children: USTruckChildren },
      { value: 'NH', label: 'NH', children: USTruckChildren },
      { value: 'NJ', label: 'NJ', children: USTruckChildren },
      { value: 'NY', label: 'NY', children: USTruckChildren },
      { value: 'PA', label: 'PA', children: USTruckChildren },
      { value: 'RI', label: 'RI', children: USTruckChildren },
      { value: 'SC', label: 'SC', children: USTruckChildren },
      { value: 'VA', label: 'VA', children: USTruckChildren },
      { value: 'VT', label: 'VT', children: USTruckChildren },
      { value: 'WV', label: 'WV', children: USTruckChildren },
      // AK, HI, PR
      { value: 'AK', label: 'AK', children: USTruckChildren },
      { value: 'HI', label: 'HI', children: USTruckChildren },
      { value: 'PR', label: 'PR', children: [
        { value: 'PARCEL', label: 'Parcel' },
        { value: 'TRUCK', label: 'Truck' },
      ]},
    ]
  }
]);
</script>

<style lang="sass" scoped>
.page
  padding: 32px

:deep(.el-cascader)
  width: 300px
</style>
