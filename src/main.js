import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// element scss样式实际由vite.config.js按需引入(styleImport)
import 'element-plus/packages/theme-chalk/src/base.scss';
import ElComponents from './plugins/element';

const app = createApp(App);
ElComponents.forEach(component => {
  app.component(component.name, component);
});
// 设置全局默认样式
// const ElementOption = { size: 'small', zIndex: 500 }
// app.config.globalProperties.$ELEMENT = ElementOption

app.use(store).use(router).mount('#app');
