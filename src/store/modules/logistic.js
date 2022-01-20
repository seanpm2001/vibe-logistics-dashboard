import { listWarehousesAPI } from '/@/server/api/logistic';
import { fixedWarehouseOptions } from '/@/assets/enum/logistic';

const freight = {
  id: undefined,
  number: null,
  etaWh: null,
  ataWh: null,
  ataDp: null,
  etaDp: null,
  etdOp: null,
  atdOp: null,
  pickup: null,
  targetId: '',
  status: '',
  mode: '',
  oriPort: '',
  destPort: '',
  container: '',
  cost: '',
  oceanForwarder: '',
};
const emptyFreight = JSON.parse(JSON.stringify(freight));

export const logistic = {
  namespaced: true,
  state: {
    warehouseOptions: {},
    disableNewBatch: false,
    freightItem: freight,
    emptyFreightItem: emptyFreight,
  },

  getters: {
    getFreight: state => state.freightItem,
    getEmptyFreight: state => state.emptyFreightItem
  },

  mutations: {
    SET_WAREHOUSE_OPTIONS (state, options) {
      state.warehouseOptions = options;
    },

    // UPDATE_FREIGHT (state, updates) {
    //   state.freightItem = Object.assign(state.freightItem, updates);
    // },

    // DELETE_FREIGHT (state, id) {
    //   remove(state.freights, item => item.id === id)
    // }
  },
  actions: {
    async setWarehouseOptions ({ commit }) {
      return new Promise(resolve => {
        listWarehousesAPI()
          .then(data => {
            const options = {};
            data.forEach(item => {
              options[item.id] = item.name;
            });
            commit('SET_WAREHOUSE_OPTIONS', options);
          })
          .catch(() => commit('SET_WAREHOUSE_OPTIONS', fixedWarehouseOptions))
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
    async updateFreight ({ commit }, { id, updates }) {
      commit('UPDATE_FREIGHT', { freight: updates });
    },
    // async deleteFreight ({ commit }, id) {
    //   await deleteFreightAPI(id);
    //   commit('DELETE_FREIGHT', id);
    // }
  }
};
