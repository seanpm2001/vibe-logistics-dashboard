import { createFreightAPI, deleteFreightAPI, findFreightAPI, listFreightsAPI, updateFreightAPI } from '/@/server/api/logistic';

export const freight = {
  namespaced: true,
  state: {
    freights: []
  },

  getters: {
    getFreights: (state) => state.freights,
    getFreight (state) {
      return (id) => id === undefined
        ? undefined
        : state.freights.find(item => item.id === id);
    }
  },

  mutations: {
    UPDATE_FREIGHT (state, freight) {
      const freightObj = state.freights.find(item => item.id === freight.id);
      if (freightObj) {
        Object.assign(freightObj, freight);
      } else {
        state.freights.unshift(freight);
      }
    },

    // DELETE_FREIGHT (state, id) {
    //   remove(state.freights, item => item.id === id)
    // }
  },
  actions: {
    async listFreights ({ commit }) {
      return new Promise(resolve => {
        const { rows } = listFreightsAPI();
        rows && rows.forEach((item) => {
          commit('UPDATE_FREIGHT', item);
        });
        resolve();
      });
    },
    async findFreight ({ commit }, id) {
      const freight = await findFreightAPI(id);
      freight && commit('UPDATE_FREIGHT', freight);
    },
    async createFreight ({ commit }, freightForm) {
      const freight = await createFreightAPI(freightForm);
      console.log('freight: ', freight);
      freight.code && commit('UPDATE_FREIGHT', { id: freight.id, freight: freight });
      return freight.code; // 0：失败 || 1：成功
    },
    async updateFreight ({ commit }, { id, updates }) {
      const freight = await updateFreightAPI(id, updates);
      freight && commit('UPDATE_FREIGHT', { id: freight.id, freight: freight });
    },
    async deleteFreight ({ commit }, id) {
      await deleteFreightAPI(id);
      commit('DELETE_FREIGHT', id);
    }
  }
};
