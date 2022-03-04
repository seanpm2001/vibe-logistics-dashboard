import { queryUnitsAPI, listWarehousesAPI } from '/@/api/logistic';
import { fixedWarehouseEnum } from '/@/enums/logistic';

export const logistic = {
  namespaced: true,
  state: {
    unitList: [],
    warehouseEnum: {},
    listQuery: {
      order: {},
      task: {},
      package: {},
      freight: {},
      inventory: {},
    }
  },

  getters: {
  },

  mutations: {
    SET_UNIT_LIST (state, data) {
      state.unitList = data;
    },

    SET_WAREHOUSE_OPTIONS (state, options) {
      state.warehouseEnum = options;
    },

    SET_LIST_QUERY (state, payload) {
      const { query, pageName } = payload;
      state.listQuery[pageName] = query;
    }

    // UPDATE_FREIGHT (state, updates) {
    //   state.freightItem = Object.assign(state.freightItem, updates);
    // },
  },
  actions: {
    async setUnitList ({ commit }) {
      return new Promise(resolve => {
        queryUnitsAPI({ search: '' })
          .then(_data => {
            console.log('_data: ', _data);
            commit('SET_UNIT_LIST', _data);
          })
          .finally(() => resolve());
      });
    },

    async setWarehouseEnum ({ commit }) {
      return new Promise(resolve => {
        listWarehousesAPI()
          .then(_data => {
            const options = {};
            _data.forEach(item => {
              options[item.id] = item.name;
            });
            commit('SET_WAREHOUSE_OPTIONS', options);
          })
          .catch(() => commit('SET_WAREHOUSE_OPTIONS', fixedWarehouseEnum))
          .finally(() => resolve());
      });
    },
   
    // async listFreights ({ commit }) {
    //   return new Promise(resolve => {
    //     const { rows } = queryFreightsAPI();
    //     rows && rows.forEach((item) => {
    //       commit('UPDATE_FREIGHT', item);
    //     });
    //     resolve();
    //   });
    // },
    // async createFreight ({ commit }, freightForm) {
    //   const freight = await createFreightAPI(freightForm);
    //   console.log('freight: ', freight);
    //   freight.code && commit('UPDATE_FREIGHT', { id: freight.id, freight: freight });
    //   return freight.code; // 0：失败 || 1：成功
    // },
  }
};
