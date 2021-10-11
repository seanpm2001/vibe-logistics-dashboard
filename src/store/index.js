import { createStore } from 'vuex'
import { ordersModule } from './modules/orders'
import { productsModule } from './modules/products'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    orders: ordersModule,
    products: productsModule
  }
})
