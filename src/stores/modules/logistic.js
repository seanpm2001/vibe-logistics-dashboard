import { store } from '/@/stores';
import { defineStore } from 'pinia';
import { listWarehousesAPI } from '/@/server/api/logistic';
import { fixedWarehouseOptions } from '/@/assets/enum/logistic';

export const useLogisticStore = defineStore({
  id: 'logistic',
  namespaced: true,
  state: () => ({
    warehouseOptions: {},
    listQuery: {
      order: { page: 1, perPage: 10 },
      task: { page: 1, perPage: 10 },
      package: { page: 1, perPage: 10 },
      freight: { page: 1, perPage: 10 },
      inventory: { page: 1, perPage: 10 },
    }
  }),

  getters: {
    getWarehouseOptions: state => state.warehouseOptions,
  },

  actions: {
    async setWarehouseOptions () {
      const state = this;
      return new Promise((resolve, reject) => {
        listWarehousesAPI()
          .then(data => {
            const options = {};
            data.forEach(item => {
              options[item.id] = item.name;
            });
            state.warehouseOptions = options;
            console.log('state: ', state);
          })
          .catch(() => (state.warehouseOptions = fixedWarehouseOptions))
          .finally(() => resolve());
      });
    },
   
    setListQuery(pageName, query) {
      this.listQuery[pageName] = query;
      console.log('this.listQuery: ', this.listQuery);
    }
  }
});

// Need to be used outside the setup
export function useLogisticStoreWithOut() {
  return useLogisticStore(store);
}
