<template>
  <div class="page">
    <el-card>
      <el-form
      label-position="left"
      >
        <strong style="font-size: 20px; color: #000">General Transports (Recommended)</strong>
        <el-divider />
        <el-form-item style="margin-right: 32px" label="55 Board Number(0-40)">
          &nbsp;<el-input-number :min="0" :max="40" @input="calculatePrice(cascaderArr)" v-model="board55Num" placeholder="0"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-right: 32px" label="55 Stand Number(0-40)">
          &nbsp;<el-input-number :min="0" :max="40" @input="calculatePrice(cascaderArr)" v-model="stand55Num" placeholder="0"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-right: 32px" label="75 Board Number(0-40)">
          &nbsp;<el-input-number :disabled="disable75Input" :min="0" :max="40" @input="calculatePrice(cascaderArr)" v-model="board75Num" placeholder="0"></el-input-number>
        </el-form-item>
        <el-form-item style="margin-right: 32px" label="75 Stand Number(0-40)">
          &nbsp;<el-input-number :disabled="disable75Input" :min="0" :max="40" @input="calculatePrice(cascaderArr)" v-model="stand75Num" placeholder="0"></el-input-number>
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
      <div>Country/Area/Transport: <span class="cascader-font">{{cascaderArr?.join(' / ') || ''}}</span></div>
      <div>
        <strong class="price">Price: {{price || 'TBA'}}</strong>
      </div>
      <el-button type="danger" @click="resetFunc" class="resetButton">RESET</el-button>
      <el-divider />
      <div class="note">
        <strong>Note:</strong>
        <br><br>
        1. If you want to mix 55 & 75 product together in this calculator, we advise you to click "Reset" button first and refill the number & C/A/T, because 55 & 75 may have different available transport and system will judge this by the number you fill.
        <br>
        <br>
        2. Because of COVID pandemic, inside delivery (white gloves services) will not be provided in Canada. If customers really need this service, we need to contact carrier and ask the price case by case.
        <br>
        <br>  
        3. The price calculated here does not contain any inside delivery service fee. Some truck carriers in US may afford this service. If customers in US need this service, they should note this need when making the order. Each order will charge $75-100 additional fee.
        <br>
        <br>
        4. UPS expedite shipping quote procedure link⬇.
        <a target="_blank" href="https://www.notion.so/vibeus/How-to-quote-expedite-shipping-via-UPS-a76cd9e386e24742b2ee430939ee0bd3">https://www.notion.so/vibeus/How-to-quote-expedite-shipping-via-UPS-a76cd9e386e24742b2ee430939ee0bd3</a>
      </div>
    </el-card>
    
    <div>
      <el-card class="specify-price-card">
        <strong style="font-size: 20px; color: #000">UPS Truck (for US 55 products only)</strong>
        <el-divider />
        <strong>For Alaska, Hawaii, Puerto Rico: $375 per box:</strong>
        <el-row align="middle">
          Unit Number:
          <el-input-number :min="0" v-model="prUPSNum"></el-input-number>
        </el-row>
        
        <strong class="price">Price: ${{prUPSNum * 375}}</strong>
        <el-divider />
        <strong>For US other states (max 4 boxes): </strong>
        <el-row align="middle">
          55 Board Number($175/box):
          <el-input-number :min="0" :max="ups55BoardNum + ups55StandNum >= 4 ? ups55BoardNum : 4" v-model="ups55BoardNum"></el-input-number>
        </el-row>
        <el-row align="middle">
          55 Stand Number($80/box):&nbsp;
          <el-input-number :min="0" :max="ups55BoardNum + ups55StandNum >= 4 ? ups55StandNum : 4" v-model="ups55StandNum"></el-input-number>
        </el-row>
        <strong class="price">Price: ${{upsPrice}}</strong>
        <el-divider />
        <div class="note">
          <strong>Note:</strong>
          <br><br>
          1. For orders over 5 boxes (units), we advise to use the general tranports in the left, though UPS truck price seems cheaper. Because for shipping an express parcel, UPS will not use pallet to protect our product, which is not safe enough for high volume.
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { calCostFn } from '/@/enums/easy-quote';
/* Start 单独拎出来的数据 */
const prUPSNum = ref(0);
const ups55BoardNum = ref(0);
const ups55StandNum = ref(0);
const upsPrice = computed(() => {
  return ups55BoardNum.value * 175 + ups55StandNum.value * 80;
});

/* End */
const board55Num = ref(0);  
const stand55Num = ref(0);
const board75Num = ref(0);
const stand75Num = ref(0);
const price = ref(null);
let total = 0;

const hasProduct55 = () => board55Num.value > 0 || stand55Num.value > 0;
const hasProduct75 = () => board75Num.value > 0 || stand75Num.value > 0;
const hasProduct = () => hasProduct55() || hasProduct75();

const cascaderArr = ref([]);

function resetFunc (){
  board55Num.value = 0;
  stand55Num.value = 0;
  board75Num.value = 0;
  stand75Num.value = 0;
  cascaderArr.value = [];
  price.value = 'TBA';
}

const onCascaderArrChange = arr => {
  cascaderArr.value = arr;
  calculatePrice(arr);
};

const disable75Input = computed(() => {
  const arr = cascaderArr.value;
  if (!arr || arr.length === 0) return false;
  const transport = cascaderArr.value[2];
  const disabledArr = ['FEDEX'];
  if (disabledArr.includes(transport))
    return true;
});

const multPrice = () => {
  board55Num.value *= 1.5;
  stand55Num.value *= 1.5;
  board75Num.value *= 1.5;
  stand75Num.value *= 1.5;
};

const calculatePrice = arr => { 
  if (!arr || arr.length === 0) {
    price.value = 'TBA';
    return;
  }
  const [country, area] = arr;
  const transport = arr[2];
  // eslint-disable prefer-const
  const b55num = board55Num.value || 0;
  const s55num = stand55Num.value || 0;
  const b75num = board75Num.value || 0;
  const s75num = stand75Num.value || 0;

  if (transport === 'AIR') {
    const sum = b55num + s55num + b75num + s75num;
    if (!hasProduct75()) {
      if (sum < 5) {
        price.value = 'For 1-4 units of UPS Air price, see UPS expedite shipping quote procedure in Note 4 below';
        return;
      }
    }
  }

  // product 55 price
  if (b55num > 0 && (s55num === 0)) { // only 55 board
    total += calCostFn(country, b55num, area, 'B55', transport);
  } else if (b55num === 0 && (s55num > 0)) { // only 55 stand
    total += calCostFn(country, s55num, area, 'S55', transport);
  } else if (b55num !==0 && (s55num !==0)) { // 55 board + stand
    const setNum = Math.min(b55num, s55num);
    const unitNum = Math.abs(b55num - s55num);
    if (b55num > s55num) { // 55 after 1 board
      total += calCostFn(country, unitNum, area, 'B55', transport);
    } else if (b55num < s55num) { // 55 after 1 stand
      total += calCostFn(country, unitNum, area, 'S55', transport);
    }
    total += calCostFn(country, setNum, area, 'BS55', transport);
  }
  
  if (b75num > 0 && (s75num === 0)) { // only 75 board
    total += calCostFn(country, b75num, area, 'B75', transport);
  } else if (b75num === 0 && (s75num > 0)) { // only 75 stand
    total += calCostFn(country, s75num, area, 'S75', transport);
  } else if (b75num !==0 && (s75num !==0)) { // 75 board + stand
    const setNum = Math.min(b75num, s75num);
    const unitNum = Math.abs(b75num - s75num);
    if (b75num > s75num) { // 75 after 1 board
      total += calCostFn(country, unitNum, area, 'B75', transport);
    } else if (b75num < s75num) { // 75 after 1 stand
      total += calCostFn(country, unitNum, area, 'B55', transport); // Price Stand 75 === Borad 55
    }
    total += calCostFn(country, setNum, area, 'BS75', transport);
  }

  price.value = total === 0 ? 'TBA' : '$' + total;
  total = 0;
};

const USGlsChildren = computed(() => {
  return [
    { value: 'TRUCK', label: 'Truck' },
    { value: 'AIR', label: 'Air' },
    { value: 'GLS', label: 'GLS' },
  ];
});
const USTruckChildren = [
  { value: 'TRUCK', label: 'Truck' },
  { value: 'AIR', label: 'Air' },
];
const CAChildren = computed(() => {
  if (hasProduct75())
    return [
      { value: 'TRUCK', label: 'Truck' },
      { value: 'AIR', label: 'Air' },
    ];
  return [
    { value: 'TRUCK', label: 'Truck' },
    { value: 'AIR', label: 'Air' },
    { value: 'FEDEX', label: 'FedEx-Amazon'},
  ];
});
const options = ref([
  { // country
    value: 'CANADA',
    label: 'Canada',
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
      { value: 'HI', label: 'HI-Hawaii', children: [
        { value: 'AIR', label: 'Air' },
        { value: 'LCL', label: 'LCL' },
      ] },
      { value: 'PR', label: 'PR', children: [
        { value: 'TRUCK', label: 'Truck' },
      ]},
    ]
  }
]);
</script>

<style lang="sass" scoped>
.page
  padding-top: 32px
  display: flex
  justify-content: space-around
  flex-wrap: wrap

:deep(.el-card)
  width: 620px
  &.specify-price-card
    .el-input-number
      margin: 0 16px
    .el-row
      margin-top: 8px
:deep(.el-cascader)
  width: 300px

.cascader-font
  font-size: 14px
  color: rgb(96, 98, 102)
.resetButton
  margin-top: 10px
.note
  margin-top: 10px

strong
  margin-bottom: 5px
  font-size: 18px
  color: rgb(96, 98, 102)
  &.price
    font-size: 16px
    color: #000
</style>
