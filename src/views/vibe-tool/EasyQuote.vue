<template>
  <div class="page">
    <el-form
     label-position="left"
    >
      <el-row>
        <el-form-item style="margin-right: 32px" label="Number(1-40)">
          <el-input @input="calculatePrice(cascaderArr)" v-model="number" style="width: 100px" placeholder="1"></el-input>
        </el-form-item>
        <el-form-item label="Country/Area/Product/Transport/Unit:">
          <el-cascader
            placeholder="Country/Area/Product/Transport/Unit"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            clearable
            filterable
            @change="onCascaderArrChange"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <div>Price: {{price || 'TBA'}}</div>
  </div>
</template>

<script setup>
const number = ref(null);
const price = ref(null);
const westAreaArr = ['WA', 'OR', 'CA', 'NV', 'ID', 'UT', 'AZ', 'NM', 'CO', 'MT', 'WY'];
const middleAreaArr = ['AL', 'AR', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'MI', 'MN', 'MS', 'MO', 'NE', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX', 'WI'];
const eastAreaArr = ['CT', 'DE', 'FL', 'GA', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'NC', 'PA', 'RI', 'SC', 'VT', 'VA', 'WV'];
const isWestUs = area => westAreaArr.includes(area);
const isMiddleUs = area => westAreaArr.includes(area);
const isEastUs = area => westAreaArr.includes(area);

const cascaderArr = ref([]);
const onCascaderArrChange = arr => {
  cascaderArr.value = arr;
  calculatePrice(arr);
};

const calculatePrice = arr => { 
  const num = number.value || 1;
  if (arr.length === 0 || num > 40) {
    price.value = 'TBA';
    return;
  }
  const [country, area, product, transport, unit] = arr;
  // West US
  if (isWestUs(area)) {
    if (transport === 'GLS') {
      if (1 < num <= 10) {
        price.value = '$' + (num * 100 + 70);
      } else if (10 < num <= 40) {
        price.value = '$' + (num * 60 + 1070);
      } else {
        price.value = 'TBA';
      }
    } else if (transport === 'TRUCK') {
      if (1 < num <= 10) {
        price.value = '$' + (num * 90 + 260);
      } else if (10 < num <= 40) {
        price.value = '$' + (num * 60 + 1160);
      } else {
        price.value = 'TBA';
      }
    }
  // Middle US
  } else if (isMiddleUs(area)) {
    if (1 < num <= 10) {
      price.value = '$' + (num * 100 + 300);
    } else if (10 < num <= 40) {
      price.value = '$' + (num * 70 + 1300);
    }
  // East US
  } else if (isEastUs(area)) {
    if (1 < num <= 10) {
      price.value = '$' + (num * 110 + 340);
    } else if (10 < num <= 40) {
      price.value = '$' + (num * 80 + 1440);
    }
  // Other
  } else {
    price.value = 'TBA';
  }
};

const unitOpiton = { value: 'UNIT', label: 'Unit(s)' };
const boardOption = { value: 'BOARD', label: 'Board(s)' };
const setOption = { value: 'SET', label: 'Set(s)' };

const  USGlsChildren = [
  { value: '55', label: '55', children: [
    { value: 'GLS', label: 'GLS', children: [unitOpiton]},
    { value: 'TRUCK', label: 'Truck', children: [unitOpiton]},
  ]},
  {value: '75', label: '75', children: [
    { value: 'TRUCK', label: 'Truck', children: [unitOpiton]},
  ]}
];
const USTruckChildren = [
  { value: '55', label: '55', children: [
    { value: 'TRUCK', label: 'Truck', children: [unitOpiton]},
  ]},
  {value: '75', label: '75', children: [
    { value: 'TRUCK', label: 'Truck', children: [unitOpiton]},
  ]}
];
const CAChildren = [
  { value: '55', label: '55', children: [
    { value: 'TRUCK', label: 'Truck', children: [boardOption, setOption]},
    { value: 'FEDEX', label: 'FedEx-Amazon', children: [boardOption, setOption]}
  ]},
  {value: '75', label: '75', children: [
    { value: 'TRUCK', label: 'Truck', children: [boardOption, setOption]},
  ]}
];
const options = [
  { // country
    value: 'CANADA',
    label: 'CANADA',
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
        { value: '55', label: '55', children: [
          { value: 'PARCEL', label: 'Parcel', children: [unitOpiton]},
        ]},
        {value: '75', label: '75', children: [
          { value: 'TRUCK', label: 'Truck', children: [unitOpiton]},
        ]}
      ] },
    ]
  }
];
</script>

<style lang="sass" scoped>
.page
  padding: 32px

:deep(.el-cascader)
  width: 500px
</style>
