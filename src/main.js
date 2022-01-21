import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import store from './store';
import vPermission from '/@/directive/permission';
import vWave from '/@/directive/wave';

import { setupProdMockServer } from './server/mock-prod-server';

import SvgIcon from '/@/components/SvgIcon.vue'; // svg component
import './permission'; // permission control

if (process.env.USE_MOCK) setupProdMockServer(); // development mock

export const app = createApp(App);
app.component('svg-icon', SvgIcon);

app
  .use(store)
  .use(router)
  // .use(createPinia())
  .use(vPermission)
  .use(vWave)
  .mount('#app');
