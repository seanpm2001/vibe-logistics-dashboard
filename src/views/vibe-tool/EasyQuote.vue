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
  const [country, area, transport] = arr;

  if(board55Num.value > 0) {
    const num = board55Num.value || 0;
    if(area === 'AK') {
      if (num <= 10) {
        price.value = '$' + (num * 150 + 450);
      }
      price.value = 'TBA';
      return;
    }
    if(area === 'HI') {
      if (num <= 10) {
        price.value = '$' + (num * 200 + 600);
      }
      price.value = 'TBA';
      return;
    }
    // West US
    if (isWestUs(area)) {
      if (transport === 'GLS') {
        if (num <= 10) {
          price.value = '$' + (num * 100 + 70);
        } else if (num <= 40) {
          price.value = '$' + (60 * (num-10) + 1070);
        }
      } else if (transport === 'TRUCK') {
        if (num <= 10) {
          price.value = '$' + (num * 90 + 260);
        } else if (num <= 40) {
          price.value = '$' + (60 * (num-10) + 1160);
        }
      }
    // Middle US
    } else if (isMiddleUs(area)) {
      if (num <= 10) {
        price.value = '$' + (num * 100 + 300);
      } else if (10 < num) {
        price.value = '$' + (70 * (num-10) + 1300);
      }
    // East US
    } else if (isEastUs(area)) {
      if (num <= 10) {
        price.value = '$' + (num * 110 + 340);
      } else if (10 < num) {
        price.value = '$' + (80 * (num-10) + 1440);
      }
    // Other
    } else {
      price.value = 'TBA';
    }
  }
  if (board75Num.value > 0) {
    price.value = 'TBA';
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
      { value: 'AB', label: 'AB-Alberta', children: CAChildren },
      { value: 'BC', label: 'BC-British Columbia', children: CAChildren },
      { value: 'MB', label: 'MB-Manitoba', children: CAChildren },
      { value: 'NB', label: 'NB-New Brunswick', children: CAChildren },
      { value: 'NL', label: 'NL-Newfoundland and Labrador', children: CAChildren },
      { value: 'NS', label: 'NS-Nova Scotia', children: CAChildren },
      { value: 'NT', label: 'NT-Northwest Territories', children: CAChildren },
      { value: 'NU', label: 'NU-Nunavut', children: CAChildren },
      { value: 'ON', label: 'ON-Ontario', children: CAChildren },
      { value: 'PE', label: 'PE-Prince Edward Island', children: CAChildren },
      { value: 'QC', label: 'QC-Quebec', children: CAChildren },
      { value: 'SK', label: 'SK-Saskatchewan', children: CAChildren },
      { value: 'YT', label: 'YT-Yukon', children: CAChildren },
    ],
  },
  { // country
    value: 'US',
    label: 'US',
    children: [ // state
      // West coast by GLS
      { value: 'AZ', label: 'AZ-Arizona', children:  USGlsChildren },
      { value: 'CA', label: 'CA-California', children:  USGlsChildren },
      { value: 'ID', label: 'ID-Idaho', children:  USGlsChildren },
      { value: 'NM', label: 'NM-New Mexico', children:  USGlsChildren },
      { value: 'NV', label: 'NV-Nevada', children:  USGlsChildren },
      { value: 'OR', label: 'OR-Oregon', children:  USGlsChildren },
      { value: 'UT', label: 'UT-Utah', children:  USGlsChildren },
      { value: 'WA', label: 'WA-Washington', children:  USGlsChildren },
      // West coast by other trucks
      { value: 'CO', label: 'CO-Colorado', children: USTruckChildren },
      { value: 'MT', label: 'MT-Montana', children: USTruckChildren },
      { value: 'WY', label: 'WY-Wyoming', children: USTruckChildren },
      // Middle region by other trucks
      { value: 'AL', label: 'AL-Alabama', children: USTruckChildren },
      { value: 'AR', label: 'AR-Arkansas', children: USTruckChildren },
      { value: 'IL', label: 'IL-Illinois', children: USTruckChildren },
      { value: 'IN', label: 'IN-Indiana', children: USTruckChildren },
      { value: 'IA', label: 'IA-Iowa', children: USTruckChildren },
      { value: 'KS', label: 'KS-Kansas', children: USTruckChildren },
      { value: 'KY', label: 'KY-Kentucky', children: USTruckChildren },
      { value: 'LA', label: 'LA-Louisiana', children: USTruckChildren },
      { value: 'MI', label: 'MI-Michigan', children: USTruckChildren },
      { value: 'MN', label: 'MN-Minnesota', children: USTruckChildren },
      { value: 'MO', label: 'MO-Missouri', children: USTruckChildren },
      { value: 'MS', label: 'MS-Mississippi', children: USTruckChildren },
      { value: 'NE', label: 'NE-Nebraska', children: USTruckChildren },
      { value: 'ND', label: 'ND-North Dakota', children: USTruckChildren },
      { value: 'OH', label: 'OH-Ohio', children: USTruckChildren },
      { value: 'OK', label: 'OK-Oklahoma', children: USTruckChildren },
      { value: 'SD', label: 'SD-South Dakota', children: USTruckChildren },
      { value: 'TN', label: 'TN-Tennessee', children: USTruckChildren },
      { value: 'TX', label: 'TX-Texas', children: USTruckChildren },
      { value: 'WI', label: 'WI-Wisconsin', children: USTruckChildren },
      // East coast by other trucks
      { value: 'CT', label: 'CT-Connecticut', children: USTruckChildren },
      { value: 'DE', label: 'DE-Delaware', children: USTruckChildren },
      { value: 'FL', label: 'FL-Florida', children: USTruckChildren },
      { value: 'GA', label: 'GA-Georgia', children: USTruckChildren },
      { value: 'MA', label: 'MA-Massachusetts', children: USTruckChildren },
      { value: 'MD', label: 'MD-Maryland', children: USTruckChildren },
      { value: 'ME', label: 'ME-Maine', children: USTruckChildren },
      { value: 'NC', label: 'NC-North Carolina', children: USTruckChildren },
      { value: 'NH', label: 'NH-New Hampshire', children: USTruckChildren },
      { value: 'NJ', label: 'NJ-New Jersey', children: USTruckChildren },
      { value: 'NY', label: 'NY-New York', children: USTruckChildren },
      { value: 'PA', label: 'PA-Pennsylvania', children: USTruckChildren },
      { value: 'RI', label: 'RI-Rhode Island', children: USTruckChildren },
      { value: 'SC', label: 'SC-South Carolina', children: USTruckChildren },
      { value: 'VA', label: 'VA-Virginia', children: USTruckChildren },
      { value: 'VT', label: 'VT-Vermont', children: USTruckChildren },
      { value: 'WV', label: 'WV-West Virginia', children: USTruckChildren },
      // AK, HI, PR
      { value: 'AK', label: 'AK-Alaska', children: USTruckChildren },
      { value: 'HI', label: 'HI-Hawaii', children: USTruckChildren },
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
