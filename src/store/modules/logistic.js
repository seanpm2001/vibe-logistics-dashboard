import { listWarehousesAPI } from '/@/server/api/logistic';
import { fixedWarehouseOptions } from '/@/assets/enum/logistic';

export const logistic = {
  namespaced: true,
  state: {
    freights: [],
    warehouseOptions: {}
  },

  getters: {
    getFreights: state => state.freights,
  },

  mutations: {
    SET_WAREHOUSE_OPTIONS (state, options) {
      state.warehouseOptions = options;
    }
    // UPDATE_FREIGHT (state, freight) {
    //   const freightObj = state.freights.find(item => item.id === freight.id);
    //   if (freightObj) {
    //     Object.assign(freightObj, freight);
    //   } else {
    //     state.freights.unshift(freight);
    //   }
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
    // async findFreight ({ commit }, id) {
    //   const freight = await findFreightAPI(id);
    //   freight && commit('UPDATE_FREIGHT', freight);
    // },
    // async createFreight ({ commit }, freightForm) {
    //   const freight = await createFreightAPI(freightForm);
    //   console.log('freight: ', freight);
    //   freight.code && commit('UPDATE_FREIGHT', { id: freight.id, freight: freight });
    //   return freight.code; // 0：失败 || 1：成功
    // },
    // async updateFreight ({ commit }, { id, updates }) {
    //   const freight = await updateFreightAPI(id, updates);
    //   freight && commit('UPDATE_FREIGHT', { id: freight.id, freight: freight });
    // },
    // async deleteFreight ({ commit }, id) {
    //   await deleteFreightAPI(id);
    //   commit('DELETE_FREIGHT', id);
    // }
  }
};
