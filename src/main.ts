
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import vPermission from '@/directive/permission';
import vWave from '@/directive/wave';
import './permission'; // permission control

// import { setupProdMockServer } from '../mock/mock-prod-server';
import SvgIcon from '@/components/SvgIcon.vue'; // svg component
import 'virtual:svg-icons-register'; // svg component, Important


// if (process.env.USE_MOCK) setupProdMockServer(); // development mock

export const app = createApp(App);
app.component('SvgIcon', SvgIcon);

app
  .use(createPinia())
  .use(router)
  .use(vPermission)
  .use(vWave)
  .mount('#app');
