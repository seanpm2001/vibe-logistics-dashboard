export enum freightStatusEnum {
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Canceled',
  PICKED_UP = 'Picked Up'
}
export enum forwarderEnum {
  FPL = 'Full Power Logistics',
  FLEXPORT = 'FLEXPORT',
  LIGHTNING = 'LIGHTNING',
  AGL = 'AGL',
  SF = 'SF',
  DHL = 'DHL'
}
export enum modeEnum {
  OCEAN = 'Ocean',
  AIR = 'Air',
  TRUCK = 'Truck'
}
export enum containerEnum {
  GP20 = '20GP',
  GP40 = '40GP',
  HQ40 = '40HQ',
  HQ45 = '45HQ',
  LCL = 'LCL'
}
export enum oriPortEnum {
  CALGARY = 'Calgary',
  CALIFORNIA = 'California',
  FUZHOU = 'Fuzhou',
  HAMBURG = 'Hamburg',
  XIAMEN = 'Xiamen',
  YANTIAN = 'Yantian'
}
export enum destPortEnum {
  CALGARY = 'Calgary',
  FELIXTOWE = 'Felixtowe',
  FUZHOU = 'Fuzhou',
  HAMBURG = 'Hamburg',
  LA_LB = 'LA/LB',
  MELBOURNE = 'Melbourne',
  BALTIMORE = 'Baltimore',
  NEW_YORK = 'New York'
}
export enum unitSystemEnum {
  SI = 'SI(kg/cm)',
  BS = 'BS(lbs/inch)'
}
export enum packageStatusEnum {
  DELIVERING = 'Fulfilling',
  DELIVERED_BUT_UNCHECKED = 'Delivered but not restocked',
  COMPLETE_WITH_DELIVERED = 'Complete with delivered',
  COMPLETE_WITH_RETURNED = 'Complete with rerouting back',
  RETURNING = 'Rerouting back',
  RETURNED_BUT_UNCHECKED = 'Returned but unchecked',
  LOST = 'Lost'
}
export enum taskStatusEnum {
  UNFULFILLED = 'Unfulfilled',
  FULFILLED_AND_DELIVERING = 'Fulfilled and delivering',
  FAILED = 'Failed',
  COMPLETE = 'Complete',
  ONHOLD = 'Onhold',
  CANCELLED = 'Cancelled'
}
export const taskColorEnum = {
  FULFILLMENT: '', // primary color
  REPLACE:'warning',
  RETURN: 'danger',
  RETURN_TO_REPAIR: 'danger',
};
export const taskTypeEnum = {
  FULFILLMENT: 'Fulfillment',
  REPLACE:'Replace',
  RETURN: 'Return',
  RETURN_TO_REPAIR: 'Return to Repair',
};
export const inventoryTaskTypeEnum = {
  MOVE: 'Move'
};
export const dailyPendingTaskTypeEnum = {
  FULFILLMENT: 'Fulfillment',
  REPLACE:'Replace'
};
export const allTaskTypeEnum = Object.assign({}, taskTypeEnum, inventoryTaskTypeEnum);
export enum taskReasonEnum {
  BOARD_HARDWARE_DEFECT = 'Board hardware defect',
  STAND_HARDWARE_DEFECT = 'Stand hardware defect',
  STYLUS_HARDWARE_DEFECT = 'Stylus hardware defect',
  CAREMA_HARDWARE_DEFECT = 'Camera hardware defect',
  TAB_HARDWARE_DEFECT = 'Tab hardware defect',
  SOFTWARE_DEFECT = 'Software defect',
  SHIPPING_DELIVERY_ISSUE = 'Shipping/delivery issue',
  UNKNOWN = 'Unknown',
}
export const taskReasonDetailEnum = {
  BOARD_HARDWARE_DEFECT: [
    'Not turn on',
    'Not power on',
    'Touch issue',
    'Screen functional issue',
    'Screen appearance issue',
    'Film wrinkle',
    'Appearance defects',
    'Power button issue',
    'No sound',
    'No signal',
    'OPS Malfunction',
    'Missing accessories',
    'Camera port issue',
    'Firmware upgrade failed',
    'Broken HDMI port',
    'Others',
  ],
  STAND_HARDWARE_DEFECT: [
    'Missing accessories',
    'Appearance issue',
    'Assembly issue',
    'Others',
  ],
  STYLUS_HARDWARE_DEFECT: [
    'Nib broken',
    'Unable to charge',
    'Unable to connect to board',
    'Button',
    'Others',
  ],
  CAREMA_HARDWARE_DEFECT: [
    'Can\'t be recognized',
    'Microphone issue',
    'Pogo pin broken',
  ],
  TAB_HARDWARE_DEFECT: [
    'Can\'t be recognized',
    'Can\'t connect to WiFi',
  ],
  SOFTWARE_DEFECT: ['Software defect'],
  SHIPPING_DELIVERY_ISSUE: [
    'Shipping damage',
    'Non-delivery',
  ],
  UNKNOWN: [
    'Customer change mind',
    'Unknown',
  ]
};
export enum unitConditionEnum {
  GOOD = 'Good',
  FIXED_A = 'Fixed Class A',
  FIXED_B = 'Fixed Class B',
  FIXED_C = 'Fixed Class C',
  SCRAP = 'Scrap',
  DAMAGED = 'Damaged',
}
export enum packageConditionEnum {
  GOOD = 'Good',
  MISSING = 'Missing',
  DAMAGED = 'Damaged',
}
// export enum reversedConditionEnum {
//   'Good' = 'GOOD',
//   'Fixed Class A' = 'FIXED_A',
//   'Fixed Class B' = 'FIXED_B',
//   'Fixed Class C' = 'FIXED_C',
//   'Scrap' = 'SCRAP',
//   'Damaged' = 'DAMAGED',
// }
export const transportEnum = {
  TRUCK: 'Truck',
  EXPRESS: 'Express',
  CUSTOMER_PICKUP: 'Customer Pick-up',
  FBA: 'FBA',
};
export const completionEnum = {
  'Complete': 'true',
  'Incomplete': 'false',
};
export const onHoldEnum = {
  'All': '',
  'On Hold': true,
  'Not Hold': false,
};
export const transportCarrierEnum = {
  TRUCK: {
    RRTS: 'RRTS',
    DAYLIGHT: 'Daylight',
    PILOT: 'PILOT',
    SAIA: 'SAIA',
    RL: 'R&L',
    ABF: 'ABF',
    ESTES: 'ESTES',
    'C.H.ROBINSON': 'C.H.ROBINSON',
    DAY_ROSS: 'Day & Ross',
    YRC_FREIGHT: 'YRC Freight',
    ONIXPORT: 'Onixport',
    XPO: 'XPO'
  },
  EXPRESS: {
    UPS: 'UPS',
    USPS: 'USPS',
    FEDEX: 'FedEx',
    DHL: 'DHL',
  },
  CUSTOMER_PICKUP: {
    CUSTOMER_PICKUP: 'Customer Pick-up'
  },
  FBA: {
    FBA: 'FBA',
  }
};
export enum codeNameEnum {
  '55V1B' = '55 V1 Board',
  '55V1WS' = '55 V1 White Stand',
  '55V1RS' = '55 V1 Red Stand',
  '55V1ESt' = '55 V1 Extra Stylus',
  '55V1ASt' = '55 V1 Active Stylus',
  '55V1UBSH' = '55 V1 Unboxed Board (Second Hand)',
  '55V1UB' = '55 V1 Unboxed Board',
  '55V1PC' = '55 V1 Power Cord',
  '55S1AS' = '55 S1 Active Stylus',
  '55BP' = '55 Board Pallet',
  '55SP' = '55 Stand Pallet',
  'EPP1_249' = 'Extend Protection Plan 1 year',
  'EPP1_350' = 'Extend Protection Plan 1 year',
  'EPP2_499' = 'Extend Protection Plan 2 year',
  'EPP2_625' = 'Extend Protection Plan 2 year',
  'EPP3_699' = 'Extend Protection Plan 3 year',
  'EPP3_850' = 'Extend Protection Plan 3 year',
  'CA02A' = 'C1B Camera',
  'TA01A' = 'Tap',
  'S1BStylus' = 'S1B Stylus',
  '75S1BB' = '75 S1B Board',
  '75S1S' = '75 S1 Stand',
  '75ProB' = '75 Board',
  '75ProUB' = '75 Unboxed Board',
  '75ProUBSH' = '75 Second Hand Board',
  '75ProUBSB' = '75 Sample Board',
  '75ProS' = '75 Stand',
  '75ProESt' = '75 Extra Stylus',
  '75ProASt' = '75 Active Stylus',
  '75ProUS' = '75 Unboxed Stand',
  '75ProOPS' = '75 OPS',
  '75ProPC' = '75 Power Cord',
  '75ProRm' = '75 Remote',
  '75ProSHB' = '75 Stand Hanging Bar',
  '75ProBP' = '75 Board Pallet',
  '75ProSP' = '75 Stand Pallet',
  '55S1RS' = '55 S1 Red Stand',
  '55S1GS' = '55 S1 Green Stand',
  '55S1WS' = '55 S1 White Stand',
  '55S1BS' = '55 S1 Blue Stand',
  '55S1B' = '55 S1 Board',
  '55S1BB' = '55 S1B Board',
  '55S1UB' = '55 S1 Refurbished Board',
  '55S1UBSH' = '55 S1 Second Hand Board',
  '55S1UBSB' = '55 S1 Sample Board',
  'CAM01A' = 'C1 Camera',
  '55P1B' = '55 P1 Board',
  '55V1BPB' = '55 V1 Package Box',
  '55S1BPB' = '55 S1 Package Box',
  '75ProBPB' = '75 Pro Package Box'
}
export enum codeIconEnum {
  '55V1B' = 'product-board',
  '55V1WS' = 'product-stand',
  '55V1RS' = 'product-stand',
  '55V1ESt' = 'product-stylus',
  '55V1ASt' = 'product-stylus',
  '55S1AS' = 'product-stylus',
  '55V1UB' = 'product-board',
  '55V1UBSH' = 'product-board',
  '55V1PC' = '55 V1 Power Cord',
  '55BP' = '55 Board Pallet',
  '55SP' = '55 Stand Pallet',
  'CAM01A' = 'product-camera',
  'CA02A' = 'product-camera',
  // 'TA01A' = 'product-tab',
  'S1BStylus' = 'product-stylus',
  '75S1BB' = 'product-board',
  '75S1S' = 'product-stand',
  '75ProB' = 'product-board',
  '75ProUB' = 'product-board',
  '75ProUBSH' = 'product-board',
  '75ProUBSB' = 'product-board',
  '75ProS' = 'product-stand',
  '75ProESt' = 'product-stylus',
  '75ProASt' = 'product-stylus',
  '75ProUS' = 'product-stand',
  '75ProOPS' = 'product-ops-75',
  '75ProPC' = '75 Power Cord',
  '75ProRm' = '75 Remote',
  '75ProSHB' = '75 Stand Hanging Bar',
  '75ProBP' = '75 Board Pallet',
  '75ProSP' = '75 Stand Pallet',
  '55S1B' = 'product-board',
  '55S1RS' = 'product-board',
  '55S1GS' = 'product-board',
  '55S1WS' = 'product-board',
  '55S1BS' = 'product-board',
  '55S1BB' = 'product-board',
  '55S1UB' = 'product-board',
  '55S1UBSH' = 'product-board',
  '55S1UBSB' = 'product-board',
  '55P1B' = 'product-board',
  '55V1BPB' = '55 V1 Package Box',
  '55S1BPB' = '55 S1 Package Box',
  '75ProBPB' = '75 Pro Package Box'
}
export const skuCodeEnum = {
  'V55N201W': {
    'GOOD': '55V1B',
    'FIXED_C': '55V1UB',
    'FIXED_B': '55V1UBSH',
  },
  'V55N203W': {
    'GOOD': '55V1B',
    'FIXED_B': '55V1UBSH',
  },
  'V55N205W': {
    'GOOD': '55V1B',
    'FIXED_B': '55V1UBSH',
  },
  'V55N201EU': '55V1B',
  'V55N203EU': '55V1B',
  'V55N205EU': '55V1B',
  'V55N205AU': '55V1B',
  '55WSTAND101': '55V1WS',
  '55WSTAND201': '55V1WS',
  '55WSTAND301': '55V1WS',
  '55RSTAND101': '55V1RS',
  '55RSTAND201': '55V1RS',
  '55RSTAND301': '55V1RS',
  'VTS001': '55V1ESt',
  'VTS002': '55V1ASt',
  'V55N203WR': {
    'FIXED_C': '55V1UB',
  },
  'V55N205WR': {
    'FIXED_C': '55V1UB',
  },
  'V55N203EUR': {
    'FIXED_C': '55V1UB',
  },
  'V55N205EUR': {
    'FIXED_C': '55V1UB',
  },
  'V55N205AUR': {
    'FIXED_C': '55V1UB',
  },
  'V55NWPC': '55V1PC',
  'V55NEUPC': '55V1PC',
  'V55NEWPC': '55V1PC',
  'V55PL': '55BP',
  '55STAND101PL': '55SP',
  '55STAND201PL': '55SP',
  '55STAND301PL': '55SP',
  'CA02A': 'CA02A',
  'TA01A': 'TA01A',
  'TS02B': 'S1BStylus',
  'S75T02AUS': '75S1BB',
  '75ST01W': '75S1S',
  'N75H301US': {
    'GOOD': '75ProB',
    'FIXED_A': '75ProUBSB',
    'FIXED_B': '75ProUBSH',
    'FIXED_C': '75ProUB'
  },
  'N75H301USR': '75ProUB',
  'ST02H': '75ProS',
  '75PS01': '75ProESt',
  'VTS004': '75ProASt',
  'ST02HR': '75ProUS',
  'WB5W810W': '75ProOPS',
  'N75HUSPC': '75ProPC',
  'N75HUKPC': '75ProPC',
  'N75HDEPC': '75ProPC',
  'N75HUSRM': '75ProRm',
  'N75HUKRM': '75ProRm',
  'N75HDERM': '75ProRm',
  'ST02HHB': '75ProSHB',
  'N75HPL': '75ProBP',
  'ST02HPL': '75ProSP',
  '55ST01R': '55S1RS',
  '55ST01G': '55S1GS',
  '55ST01W': '55S1WS',
  '55ST01B': '55S1BS',
  'S55T01AUS': {
    'GOOD': '55S1B',
    'FIXED_A': '55S1UBSB',
    'FIXED_B': '55S1UBSH',
    'FIXED_C': '55S1UB'
  },
  'S55T01BUS': {
    'GOOD': '55S1B',
    'FIXED_A': '55S1UBSB',
    'FIXED_B': '55S1UBSH',
    'FIXED_C': '55S1UB',
  },
  'S55T01CUS': {
    'GOOD': '55S1B',
    'FIXED_A': '55S1UBSB',
    'FIXED_B': '55S1UBSH',
    'FIXED_C': '55S1UB',
  },
  'S55T02AUS': '55S1BB',
  'CA01A': 'CAM01A',
  'CA01B': 'CAM01A',
  '55AS01': '55S1AS',
  'P55H301US': '55P1B'
};
export const codeSkuArrEnum = {
  '55V1B': [
    'V55N205AU',
    'V55N205EU',
    'V55N203EU',
    'V55N201EU',
    'V55N205W',
    'V55N203W',
    'V55N201W'
  ],
  '55V1WS': [
    '55WSTAND301',
    '55WSTAND201',
    '55WSTAND101'
  ],
  '55V1RS': [
    '55RSTAND301',
    '55RSTAND201',
    '55RSTAND101'
  ],
  '55V1ESt': [
    'VTS001'
  ],
  '55V1ASt': [
    'VTS002'
  ],
  '55V1UB': [
    'V55N205AUR',
    'V55N205EUR',
    'V55N203EUR',
    'V55N205WR',
    'V55N203WR',
    'V55N201W',
  ],
  '55V1UBSH': [
    'V55N201W',
    'V55N203W',
    'V55N205W'
  ],
  '55V1PC': [
    'V55NEWPC',
    'V55NEUPC',
    'V55NWPC'
  ],
  '55BP': [
    'V55PL'
  ],
  '55SP': [
    '55STAND301PL',
    '55STAND201PL',
    '55STAND101PL'
  ],
  '55S1UB': [
    'S55T01AUS',
    'S55T01BUS',
    'S55T01CUS'
  ],
  '55S1UBSH': [
    'S55T01AUS',
    'S55T01BUS',
    'S55T01CUS'
  ],
  '55S1UBSB': [
    'S55T01AUS',
    'S55T01BUS',
    'S55T01CUS'
  ],
  'TA01A': ['TA01A'],
  'CA02A': ['CA02A'],
  'S1BStylus': ['TS02B'],
  '75S1BB': ['S75T02AUS'],
  '75S1S': ['75ST01W'],
  '75ProB': [
    'N75H301US'
  ],
  '75ProUB': [
    'N75H301US'
  ],
  '75ProUBSH': [
    'N75H301US'
  ],
  '75ProUBSB': [
    'N75H301US'
  ],
  '75ProS': [
    'ST02H'
  ],
  '75ProESt': [
    '75PS01'
  ],
  '75ProASt': [
    'VTS004'
  ],
  '75ProUS': [
    'ST02HR'
  ],
  '75ProOPS': [
    'WB5W810W'
  ],
  '75ProPC': [
    'N75HDEPC',
    'N75HUKPC',
    'N75HUSPC'
  ],
  '75ProRm': [
    'N75HDERM',
    'N75HUKRM',
    'N75HUSRM'
  ],
  '75ProSHB': [
    'ST02HHB'
  ],
  '75ProBP': [
    'N75HPL'
  ],
  '75ProSP': [
    'ST02HPL'
  ],
  '55S1RS': [
    '55ST01R'
  ],
  '55S1GS': [
    '55ST01G'
  ],
  '55S1WS': [
    '55ST01W'
  ],
  '55S1BS': [
    '55ST01B'
  ],
  '55S1B': [
    'S55T01AUS',
    'S55T01BUS',
    'S55T01CUS'
  ],
  '55S1BB': ['S55T02AUS'],
  'CAM01A': [
    'CA01A',
    'CA01B',
  ],
  '55S1AS': [
    '55AS01'
  ],
  '55P1B': [
    'P55H301US'
  ]
};
// API 获取失败的情况下，调用默认写死的warehouseEnum

export const fixedWarehouseEnum = {
  '1': 'FBA-US',
  '2': 'FBA-CA',
  '3': 'FBA-DE',
  '4': 'FBA-UK',
  '5': 'FBA-JP',
  '6': 'IWIN',
  '7': 'RED STAG',
  '8': 'VIBE BEL',
  '9': 'Lightning',
  '10': 'FPL-CA',
  '11': 'FPL-AU',
  '12': 'TOYOND',
  '13': 'TCL',
  '14': 'SF (Fuqing)',
  '15': 'Jiguang',
  '16': 'HH',
  '17': 'Zhongao',
  '18': 'TPV',
  '19': 'Customer',
  '58': 'CustomerScrap',
  '79': 'Avatek',
  '101': 'Vibe Calif',
  '124': 'Recycle Company'
};

export const BSUnitSystemWarehouseArr = [
  1,  // FBA-US
  6   // IWIN
];

export const noSerialArr = [
  '55V1ESt',
  '55V1ASt',
  '55V1PC',
  '55BP',
  '55SP',
  '75ProESt',
  '75ProASt',
  '75ProPC',
  '75ProRm',
  '75ProSHB',
  '75ProBP',
  '75ProSP'
];

export const exportScopesEnum = {
  CURRENT: 'Current page'
};

export const taskFulfilmentErrorEnum = {
  SPECIFIED_SERIAL_UNFULFILLED: 'Specified serial unfulfilled',
  QUANTITY_MISMATCH: 'Quantity mismatch',
  UNWANTTED_PRODUCT: 'Unwantted product',
  EXTRA_PRODUCT: 'Extra product',
  MISSING_PRODUCT: 'Missing product',
  MISSING_TRACKING_NUMBER: 'Missing tracking number',
  MISSING_CARRIER: 'Missing carrier'
};

export const packageErrorEnum = {
  EDITING_OUTBOUND_TASK: 'Editing outbound task',
  UNIT_ERROR: 'Unit error'
};
