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
    async setWarehouseOptions () {
      await listWarehousesAPI()
        .then(data => {
          const options = {};
          data.forEach(item => {
            options[item.id] = item.name;
          });
          this.warehouseOptions = options;
        })
        .catch(() => (this.warehouseOptions = fixedWarehouseOptions));
    },
   
    setListQuery(pageName, query) {
      this.listQuery[pageName] = query;
    }
  }
});

// Need to be used outside the setup
export function useLogisticStoreWithOut() {
  return useLogisticStore(store);
}
