import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// element scss样式实际由vite.config.js按需引入(styleImport)
import 'element-plus/packages/theme-chalk/src/base.scss';
// import ElementPlus from 'element-plus';
import { useElementPlus } from './plugins/element';

const app = createApp(App);

useElementPlus(app);
app.use(store).use(router).mount('#app');
