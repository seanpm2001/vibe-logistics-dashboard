export const freightStatusOptions = {
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Canceled',
  PICKED_UP: 'Picked Up'
};
export const forwarderOptions = {
  FPL: 'Full Power Logistics',
  FLEXPORT: 'FLEXPORT',
  LIGHTNING: 'LIGHTNING',
  AGL: 'AGL',
  SF: 'SF'
};
export const modeOptions = {
  OCEAN: 'Ocean',
  AIR: 'Air',
  TRUCK: 'Truck'
};
export const containerOptions = {
  GP20: '20GP',
  GP40: '40GP',
  HQ40: '40HQ',
  HQ45: '45HQ',
  LCL: 'LCL'
};
export const oriPortOptions = {
  CALGARY: 'Calgary',
  CALIFORNIA: 'California',
  FUZHOU: 'Fuzhou',
  HAMBURG: 'Hamburg',
  XIAMEN: 'Xiamen',
  YANTIAN: 'Yantian'
};
export const destPortOptions = {
  CALGARY: 'Calgary',
  FELIXTOWE: 'Felixtowe',
  FUZHOU: 'Fuzhou',
  HAMBURG: 'Hamburg',
  LA_LB: 'LA/LB',
  MELBOURNE: 'Melbourne'
};
export const packageStatusOptions = {
  DELIVERED: 'Delivered',
  DELIVEREING: 'Delivering',
  PARTIALLY_DELIVERED: 'Partially Delivered',
  RETURNING: 'Returning',
  RETURNED: 'Returned',
  LOST: 'Lost'
};
export const taskStatusOptions = {
  UNFULFILLED: 'Unfulfilled',
  FULFILLED_AND_DELIVERING: 'Fulfilled and delivering',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
  ONHOLD: 'Onhold',
  CANCELLED: 'Cancelled'
};
export const taskTypeOptions = {
  FULFILLMENT: 'Fulfillment',
  REPLACE: 'Replace',
  RETURN: 'Return',
  RETURN_TO_REPAIR: 'Return to Repair',
  MOVE: 'Move'
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
  '55V1B': 'board',
  '55V1WS': 'stand',
  '55V1RS': 'stand',
  '55V1ESt': 'stylus',
  '55V1ASt': 'stylus',
  '55V1UB': 'board',
  '55V1PC': '55 V1 Power Cord',
  '55BP': '55 Board Pallet',
  '55SP': '55 Stand Pallet',
  '75ProB': 'board',
  '75ProUB': 'board',
  '75ProS': 'stand',
  '75ProESt': 'stylus',
  '75ProASt': 'stylus',
  '75ProUS': 'stand',
  '75ProOPS': 'ops-75',
  '75ProPC': '75 Power Cord',
  '75ProRm': '75 Remote',
  '75ProSHB': '75 Stand Hanging Bar',
  '75ProBP': '75 Board Pallet',
  '75ProSP': '75 Stand Pallet',
  '55S1B': 'board',
  '55P1B': 'board',
};

// API 获取失败的情况下，调用默认写死的warehouseOptions
export const fixedWarehouseOptions = {
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
