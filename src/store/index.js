import { createStore } from 'vuex';
import getters from './getters';

// https://vitejs.dev/guide/features.html#glob-import
const modulesFiles = import.meta.globEager('./modules/*.js');

let modules = {};
for (const path in modulesFiles) {
  modules = { ...modules, ...modulesFiles[path] };
}

export default createStore({
  getters: getters,
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: modules
});
