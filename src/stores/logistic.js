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
  actions: {
    setListQuery (payload) {
      const { query, pageName } = payload;
      this.listQuery[pageName] = query;
    },

    setUnitList () {
      return new Promise(resolve => {
        queryUnitsAPI({ search: '' })
          .then(data => {
            this.unitList = data;
          })
          .finally(() => resolve());
      });
    },

    setWarehouseEnum () {
      listWarehousesAPI()
        .then(_data => {
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
