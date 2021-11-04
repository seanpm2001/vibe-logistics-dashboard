import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { setupProdMockServer } from './server/mock-prod-server';

import SvgIcon from '/@/components/SvgIcon.vue'; // svg component
import './permission'; // permission control

// element scss样式实际由vite.config.js按需引入(styleImport)
import 'element-plus/packages/theme-chalk/src/base.scss';
// import ElementPlus from 'element-plus';
import { useElementPlus } from './plugins/element';

if (process.env.USE_MOCK) setupProdMockServer(); // development mock
console.log('process.env.USE_MOCK: ', process.env.USE_MOCK);

const app = createApp(App);
app.component('svg-icon', SvgIcon);

useElementPlus(app);
// useElementPlus(app);
app.use(store).use(router).mount('#app');
