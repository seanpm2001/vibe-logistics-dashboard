/**
 * 全局引入最常用的几个组件
 */
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
} from 'element-plus';

const components = [
  ElButton,
  ElForm,
  ElFormItem,
  ElInput
];

const option = { size: 'small', zIndex: 3000 };

// export const useElementPlus = (app) => {
//   // element全局配置
//   app.config.globalProperties.$ELEMENT = option;
//   // 组件注册
//   components.forEach((component) => {
//     app.component(component.name, component);
//   });
// };

export default {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
