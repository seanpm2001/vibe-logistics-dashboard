import { defineStore } from 'pinia';
import { queryUnitsAPI, listWarehousesAPI } from '/@/api/logistic';
import { fixedWarehouseEnum } from '/@/enums/logistic';

export const useLogisticStore = defineStore({
  id: 'logistic',
  state: () => ({
    unitList: [],
    warehouseEnum: {},
    listQuery: {
      order: {},
      task: {},
      package: {},
      freight: {},
      inventory: {},
    }
  }),

  getters: {
  },
  actions: {
    setWarehouseEnum () {
      listWarehousesAPI()
        .then(_data => {
          console.log('_data: ', _data);
          const options = {};
          _data.forEach(item => {
            options[item.id] = item.name;
          });
          this.warehouseEnum = options;
        })
        .catch(() => this.warehouseEnum = options);
    }
  }
});
