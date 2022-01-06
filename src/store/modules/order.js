import { createOrderAPI, deleteOrderAPI, findOrderAPI, queryOrdersAPI, updateOrderAPI } from '/@/server/api/logistic';

export const order = {
  namespaced: true,
  state: {
    orders: []
  },

  getters: {
    getOrders: (state) => state.orders,
    getOrder (state) {
      return (id) => id === undefined
        ? undefined
        : state.orders.find(item => item.id === id);
    }
  },

  mutations: {
    UPDATE_ORDER (state, order) {
      const orderObj = state.orders.find(item => item.id === order.id);
      if (orderObj) {
        Object.assign(orderObj, order);
      } else {
        state.orders.unshift(order);
      }
    },
  },
  actions: {
    async listOrders ({ commit }) {
      const { rows } = await queryOrdersAPI();
      rows && rows.forEach((item) => {
        commit('UPDATE_ORDER', item);
      });
    },
    async findOrder ({ commit }, id) {
      const order = await findOrderAPI(id);
      order && commit('UPDATE_ORDER', order);
    },
    async createOrder ({ commit }, orderForm) {
      const order = await createOrderAPI(orderForm);
      order.code && commit('UPDATE_ORDER', { id: order.id, order: order });
      return order.code; // 0：失败 || 1：成功
    },
    async updateOrder ({ commit }, { id, updates }) {
      const order = await updateOrderAPI(id, updates);
      order && commit('UPDATE_ORDER', { id: order.id, order: order });
    },
    async deleteOrder ({ commit }, id) {
      await deleteOrderAPI(id);
      commit('DELETE_ORDER', id);
    }
  }
};
