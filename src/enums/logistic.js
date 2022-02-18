export const freightStatusEnum = {
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Canceled',
  PICKED_UP: 'Picked Up'
};
export const forwarderEnum = {
  FPL: 'Full Power Logistics',
  FLEXPORT: 'FLEXPORT',
  LIGHTNING: 'LIGHTNING',
  AGL: 'AGL',
  SF: 'SF'
};
export const modeEnum = {
  OCEAN: 'Ocean',
  AIR: 'Air',
  TRUCK: 'Truck'
};
export const containerEnum = {
  GP20: '20GP',
  GP40: '40GP',
  HQ40: '40HQ',
  HQ45: '45HQ',
  LCL: 'LCL'
};
export const oriPortEnum = {
  CALGARY: 'Calgary',
  CALIFORNIA: 'California',
  FUZHOU: 'Fuzhou',
  HAMBURG: 'Hamburg',
  XIAMEN: 'Xiamen',
  YANTIAN: 'Yantian'
};
export const destPortEnum = {
  CALGARY: 'Calgary',
  FELIXTOWE: 'Felixtowe',
  FUZHOU: 'Fuzhou',
  HAMBURG: 'Hamburg',
  LA_LB: 'LA/LB',
  MELBOURNE: 'Melbourne'
};
export const packageStatusEnum = {
  DELIVERED: 'Delivered',
  DELIVEREING: 'Delivering',
  PARTIALLY_DELIVERED: 'Partially Delivered',
  RETURNING: 'Returning',
  RETURNED: 'Returned',
  LOST: 'Lost'
};
export const taskStatusEnum = {
  UNFULFILLED: 'Unfulfilled',
  FULFILLED_AND_DELIVERING: 'Fulfilled and delivering',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
  ONHOLD: 'Onhold',
  CANCELLED: 'Cancelled'
};
export const taskTypeEnum = {
  FULFILLMENT: 'Fulfillment',
  REPLACE: 'Replace',
  RETURN: 'Return',
  RETURN_TO_REPAIR: 'Return to Repair',
};
export const inventoryTaskTypeEnum = {
  MOVE: 'Move'
};
export const taskReasonEnum = {
  ITEM_UPGRADE: 'Item Upgrade',
  ITEM_DEGRADE: 'Item Degrade',
  ITEM_DEMAGED: 'Item Damaged',
  HARDWARE_DEFECT: 'Hardware Defect',
  PACKAGE_LOST: 'Package Lost'
};
export const usedAgeEnum = {
  WITHIN_3_MONTHS: 'Within 3 months',
  BETWEEN_3_TO_12_MONTHS: '3 to 12 months',
  OVER_12_MONTHS: 'Over 12 months'
};
export const reversedUsedAgeEnum = {
  'Within 3 months': 'WITHIN_3_MONTHS',
  '3 to 12 months': 'BETWEEN_3_TO_12_MONTHS',
  'Over 12 months': 'OVER_12_MONTHS'
};
export const conditionEnum = {
  SCRAP: 'Scrap',
  DAM_P_ONLY: 'Damage package only',
  DAM_U_ONLY: 'Damage unit only',
  DAM_P_AND_U: 'Damage package and unit only',
  DAM_U_NOT_SHIP: 'Damage unit not shipment'
};
export const reversedConditionEnum = {
  'Scrap': 'SCRAP',
  'Damage package only': 'DAM_P_ONLY',
  'Damage unit only': 'DAM_U_ONLY',
  'Damage package and unit only': 'DAM_P_AND_U',
  'Damage unit not shipment': 'DAM_U_NOT_SHIP'
};
export const productMap = {
  '55V1B': '55 V1 Board',
  '55V1WS': '55 V1 White Stand',
  '55V1RS': '55 V1 Red Stand',
  '55V1ESt': '55 V1 Extra Stylus',
  '55V1ASt': '55 V1 Active Stylus',
  '55V1UB': '55 V1 Unboxed Board',
  '55V1PC': '55 V1 Power Cord',
  '55BP': '55 Board Pallet',
  '55SP': '55 Stand Pallet',
  '75ProB': '75 Board',
  '75ProUB': '75 Unboxed Board',
  '75ProS': '75 Stand',
  '75ProESt': '75 Extra Stylus',
  '75ProASt': '75 Active Stylus',
  '75ProUS': '75 Unboxed Stand',
  '75ProOPS': '75 OPS',
  '75ProPC': '75 Power Cord',
  '75ProRm': '75 Remote',
  '75ProSHB': '75 Stand Hanging Bar',
  '75ProBP': '75 Board Pallet',
  '75ProSP': '75 Stand Pallet',
  '55S1B': '55 S1 Board',
  '55P1B': '55 P1 Board1',
};
export const productIconMap = {
  '55V1B': 'product-board',
  '55V1WS': 'product-stand',
  '55V1RS': 'product-stand',
  '55V1ESt': 'product-stylus',
  '55V1ASt': 'product-stylus',
  '55V1UB': 'product-board',
  '55V1PC': '55 V1 Power Cord',
  '55BP': '55 Board Pallet',
  '55SP': '55 Stand Pallet',
  '75ProB': 'product-board',
  '75ProUB': 'product-board',
  '75ProS': 'product-stand',
  '75ProESt': 'product-stylus',
  '75ProASt': 'product-stylus',
  '75ProUS': 'product-stand',
  '75ProOPS': 'product-ops-75',
  '75ProPC': '75 Power Cord',
  '75ProRm': '75 Remote',
  '75ProSHB': '75 Stand Hanging Bar',
  '75ProBP': '75 Board Pallet',
  '75ProSP': '75 Stand Pallet',
  '55S1B': 'product-board',
  '55P1B': 'product-board',
};

// API 获取失败的情况下，调用默认写死的warehouseEnum
export const fixedWarehouseEnum = {
  1: 'FBA-US',
  2: 'FBA-CA',
  3: 'FBA-DE',
  4: 'FBA-UK',
  5: 'FBA-JP',
  6: 'IWIN',
  7: 'RED STAG',
  8: 'VIBE BEL',
  9: 'FPL-CA',
  10: 'FPL-AU',
  11: 'TOYOND',
  12: 'TCL',
  13: 'SF (Fuqing)',
  14: 'Jiguang',
  15: 'HH',
  16: 'Zhongao',
  17: 'TPV',
  18: 'Customer'
};
