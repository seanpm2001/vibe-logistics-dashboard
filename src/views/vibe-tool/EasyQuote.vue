<template>
  <div class="page">
    <el-form
     label-position="left"
    >
      <el-form-item style="margin-right: 32px" label="55 Board Number(0-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="board55Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="55 Stand Number(0-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="stand55Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="75 Board Number(0-40)">
        <el-input @input="calculatePrice(cascaderArr)" v-model="board75Num" style="width: 100px" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 32px" label="75 Board Number(0-40)">
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
import { CACostEnum, USCostEnum } from '/@/enums/easy-quote';

const board55Num = ref(null);
const stand55Num = ref(null);
const board75Num = ref(null);
const stand75Num = ref(null);
const price = ref(null);
// US area
const westAreaArr = ['WA', 'OR', 'CA', 'NV', 'ID', 'UT', 'AZ', 'NM', 'CO', 'MT', 'WY'];
const middleAreaArr = ['AL', 'AR', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'MI', 'MN', 'MS', 'MO', 'NE', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX', 'WI'];
const eastAreaArr = ['CT', 'DE', 'FL', 'GA', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'NC', 'PA', 'RI', 'SC', 'VT', 'VA', 'WV'];
// const caAreaArr = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

const isWestUs = area => westAreaArr.includes(area);
const isMiddleUs = area => middleAreaArr.includes(area);
const isEastUs = area => eastAreaArr.includes(area);
const isUS = country => country === 'US';
const isCA = country => country === 'CANADA';
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
  if (b55num > 0 && s55num === 0) { // only 55 board
    total += calPrice(country, b55num, area, '55', 'BOARD', transport);
  } else if (b55num === 0 && s55num > 0) { // only 55 stand
    total += calPrice(country, s55num, area, '55', 'STAND', transport);
  } else if (b55num !==0 && s55num !==0) { // 55 board + stand
    const setNum = Math.min(b55num, s55num);
    if (b55num > s55num) { // 55 after 1 board
      total += calPrice(country, 1, area, '55', 'BOARD', transport);
    } else if (b55num < s55num) { // 55 after 1 stand
      total += calPrice(country, 1, area, '55', 'STAND', transport);
    }
    total += calPrice(country, setNum, area, '55', 'SET', transport);
  }
  
  if (b75num > 0 && s75num === 0) { // only 75 board
    total += calPrice(country, b75num, area, '75', 'BOARD', transport);
  } else if (b75num === 0 && s75num > 0) { // only 75 stand
    total += calPrice(country, s75num, area, '75', 'BOARD', transport);
  } else if (b75num !==0 && s75num !==0) { // 75 board + stand
    const setNum = Math.min(b75num, s75num);
    if (b75num > s75num) { // 75 after 1 board
      total += calPrice(country, 1, area, '75', 'BOARD', transport);
    } else if (b75num < s75num) { // 75 after 1 stand
      total += calPrice(country, 1, area, '75', 'STAND', transport);
    }
    total += calPrice(country, setNum, area, '75', 'SET', transport);
  }
  price.value = total === 0 ? 'TBA' : '$' + total;
};

const formatUSArea = area => {
  if (isWestUs(area)) return 'West';
  if (isMiddleUs(area)) return 'Middle';
  if (isEastUs(area)) return 'East';
  return area;
};

const calPrice = (country, num, area, product, unit, transport) => {
  let costEnum = null;
  if (isCA(country))
    costEnum = CACostEnum;
  if (isUS(country)) {
    area = formatUSArea(area);
    costEnum = USCostEnum;
  }
  return costEnum[area][product][unit][transport](num);
};

const USGlsChildren = computed(() => {
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
      { value: 'AB', label: 'Alberta', children: CAChildren },
      { value: 'BC', label: 'British Columbia', children: CAChildren },
      { value: 'MB', label: 'Manitoba', children: CAChildren },
      { value: 'NB', label: 'New Brunswick', children: CAChildren },
      { value: 'NL', label: 'Newfoundland and Labrador', children: CAChildren },
      { value: 'NS', label: 'Nova Scotia', children: CAChildren },
      { value: 'NT', label: 'Northwest Territories', children: CAChildren },
      { value: 'NU', label: 'Nunavut', children: CAChildren },
      { value: 'ON', label: 'Ontario', children: CAChildren },
      { value: 'PE', label: 'Prince Edward Island', children: CAChildren },
      { value: 'QC', label: 'Quebec', children: CAChildren },
      { value: 'SK', label: 'Saskatchewan', children: CAChildren },
      { value: 'YT', label: 'Yukon', children: CAChildren },
    ],
  },
  { // country
    value: 'US',
    label: 'US',
    children: [ // state
      // West coast by GLS
      { value: 'AZ', label: 'Arizona', children:  USGlsChildren },
      { value: 'CA', label: 'California', children:  USGlsChildren },
      { value: 'ID', label: 'Idaho', children:  USGlsChildren },
      { value: 'NM', label: 'New Mexico', children:  USGlsChildren },
      { value: 'NV', label: 'Nevada', children:  USGlsChildren },
      { value: 'OR', label: 'Oregon', children:  USGlsChildren },
      { value: 'UT', label: 'Utah', children:  USGlsChildren },
      { value: 'WA', label: 'Washington', children:  USGlsChildren },
      // West coast by other trucks
      { value: 'CO', label: 'Colorado', children: USTruckChildren },
      { value: 'MT', label: 'Montana', children: USTruckChildren },
      { value: 'WY', label: 'Wyoming', children: USTruckChildren },
      // Middle region by other trucks
      { value: 'AL', label: 'Alabama', children: USTruckChildren },
      { value: 'AR', label: 'Arkansas', children: USTruckChildren },
      { value: 'IL', label: 'Illinois', children: USTruckChildren },
      { value: 'IN', label: 'Indiana', children: USTruckChildren },
      { value: 'IA', label: 'Iowa', children: USTruckChildren },
      { value: 'KS', label: 'Kansas', children: USTruckChildren },
      { value: 'KY', label: 'Kentucky', children: USTruckChildren },
      { value: 'LA', label: 'Louisiana', children: USTruckChildren },
      { value: 'MI', label: 'Michigan', children: USTruckChildren },
      { value: 'MN', label: 'Minnesota', children: USTruckChildren },
      { value: 'MO', label: 'Missouri', children: USTruckChildren },
      { value: 'MS', label: 'Mississippi', children: USTruckChildren },
      { value: 'NE', label: 'Nebraska', children: USTruckChildren },
      { value: 'ND', label: 'North Dakota', children: USTruckChildren },
      { value: 'OH', label: 'Ohio', children: USTruckChildren },
      { value: 'OK', label: 'Oklahoma', children: USTruckChildren },
      { value: 'SD', label: 'South Dakota', children: USTruckChildren },
      { value: 'TN', label: 'Tennessee', children: USTruckChildren },
      { value: 'TX', label: 'Texas', children: USTruckChildren },
      { value: 'WI', label: 'Wisconsin', children: USTruckChildren },
      // East coast by other trucks
      { value: 'CT', label: 'Connecticut', children: USTruckChildren },
      { value: 'DE', label: 'Delaware', children: USTruckChildren },
      { value: 'FL', label: 'Florida', children: USTruckChildren },
      { value: 'GA', label: 'Georgia', children: USTruckChildren },
      { value: 'MA', label: 'Massachusetts', children: USTruckChildren },
      { value: 'MD', label: 'Maryland', children: USTruckChildren },
      { value: 'ME', label: 'Maine', children: USTruckChildren },
      { value: 'NC', label: 'North Carolina', children: USTruckChildren },
      { value: 'NH', label: 'New Hampshire', children: USTruckChildren },
      { value: 'NJ', label: 'New Jersey', children: USTruckChildren },
      { value: 'NY', label: 'New York', children: USTruckChildren },
      { value: 'PA', label: 'Pennsylvania', children: USTruckChildren },
      { value: 'RI', label: 'Rhode Island', children: USTruckChildren },
      { value: 'SC', label: 'South Carolina', children: USTruckChildren },
      { value: 'VA', label: 'Virginia', children: USTruckChildren },
      { value: 'VT', label: 'Vermont', children: USTruckChildren },
      { value: 'WV', label: 'West Virginia', children: USTruckChildren },
      // AK, HI, PR
      { value: 'AK', label: 'Alaska', children: USTruckChildren },
      { value: 'HI', label: 'Hawaii', children: USTruckChildren },
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
