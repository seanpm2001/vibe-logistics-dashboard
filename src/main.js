import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vPermission from '/@/directive/permission';

import { setupProdMockServer } from './server/mock-prod-server';

import SvgIcon from '/@/components/SvgIcon.vue'; // svg component
import './permission'; // permission control

if (process.env.USE_MOCK) setupProdMockServer(); // development mock

export const app = createApp(App);
app.component('svg-icon', SvgIcon);

// useElementPlus(app);
app.use(store).use(router).use(vPermission).mount('#app');
