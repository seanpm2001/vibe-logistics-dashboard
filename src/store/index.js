import { createStore } from 'vuex'
import { ordersModule } from './modules/orders'
import { productsModule } from './modules/products'
import { profilesModule } from './modules/profiles'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    profiles: profilesModule,
    orders: ordersModule,
    products: productsModule,
  }
})
