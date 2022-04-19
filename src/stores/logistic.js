import { defineStore } from 'pinia';
import { queryUnitsAPI, listWarehousesAPI } from '/@/api/logistic';
import { fixedWarehouseEnum } from '/@/enums/logistic';

const emptyListQuery = {
  page: 1,
  perPage: 10,
  search: '',
};

export const useLogisticStore = defineStore({
  id: 'logistic',
  state: () => ({
    unitList: [],
    warehouseEnum: {},
    listQuery: {
      order: emptyListQuery,
      task: emptyListQuery,
      package: emptyListQuery,
      freight: emptyListQuery,
      inventory: emptyListQuery,
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
        .then(data => {
          const options = {};
          data.forEach(item => options[item.id] = item.name);
          this.warehouseEnum = options;
        })
        .catch(() => this.warehouseEnum = options);
    }
  }
});
