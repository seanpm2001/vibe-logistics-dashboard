import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

// 引入element
import 'element-plus/packages/theme-chalk/src/base.scss'
import { ElButton, ElForm, ElFormItem } from 'element-plus'

const components = [ElButton, ElForm, ElFormItem]

// const ElementOption = { size: 'small', zIndex: 500 }

components.forEach(component => {
  // 注册
  app.component(component.name, component)
})
// 设置全局默认样式
// app.config.globalProperties.$ELEMENT = ElementOption



app.use(store).use(router).mount('#app')