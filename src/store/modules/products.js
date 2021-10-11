import { createProductAPI, deleteProductAPI, findProductAPI, listProductsAPI, updateProductAPI } from '../apis/api'

export const productsModule = {
  namespaced: true,
  state: {
    products: []
  },

  getters: {
    getProducts: (state) => state.products,
    getProduct (state) {
      return (id) => id === undefined
        ? undefined
        : state.products.find(item => item.id === id)
    }
  },

  mutations: {
    UPDATE_PRODUCT (state, product) {
      const productObj = state.products.find(item => item.id === product.id)
      if (productObj) {
        Object.assign(productObj, product)
      } else {
        state.products.unshift(product)
      }
    },

    // DELETE_PRODUCT (state, id) {
    //   remove(state.products, item => item.id === id)
    // }
  },
  actions: {
    async listProducts ({ commit }) {
      const { rows } = await listProductsAPI()
      rows && rows.forEach((item) => {
        commit('UPDATE_PRODUCT', item)
      })
    },
    async findProduct ({ commit }, id) {
      const product = await findProductAPI(id)
      product && commit('UPDATE_PRODUCT', product)
    },
    async createProduct ({ commit }, productForm) {
      const product = await createProductAPI(productForm)
      console.log('product: ', product);
      product.code && commit('UPDATE_PRODUCT', { id: product.id, product: product })
      return product.code // 0：失败 || 1：成功
    },
    async updateProduct ({ commit }, { id, updates }) {
      const product = await updateProductAPI(id, updates)
      product && commit('UPDATE_PRODUCT', { id: product.id, product: product })
    },
    async deleteProduct ({ commit }, id) {
      await deleteProductAPI(id)
      commit('DELETE_PRODUCT', id)
    }
  }
}
