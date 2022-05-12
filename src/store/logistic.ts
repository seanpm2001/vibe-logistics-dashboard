import { defineStore } from 'pinia';
import { queryUnitsAPI, listWarehousesAPI } from '@/api/logistic';
import { fixedWarehouseEnum } from '@/enums/logistic';

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
    M_unitList(data) {
      this.$patch((state => state.unitList = data));
    },
    M_warehouseEnum(data) {
      this.$patch((state => state.warehouseEnum = data));
    },

    setListQuery (payload) {
      const { query, pageName } = payload;
      this.$patch(state => state.listQuery[pageName] = query);
    },

    setUnitList () {
      return new Promise(resolve => {
        queryUnitsAPI({ search: '' })
          .then(data => this.M_unitList(data));
      });
    },

    setWarehouseEnum () {
      listWarehousesAPI()
        .then(data => {
          const options = {};
          data.forEach(item => options[item.id] = item.name);
          this.M_warehouseEnum(options);
        })
        .catch(() => this.warehouseEnum = fixedWarehouseEnum);
    }
  }
});
