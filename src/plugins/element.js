/**
 * 全局引入最常用的几个组件
 */
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElLoading,
  ElMessage,
} from 'element-plus';

const components = [
  ElButton,
  ElForm,
  ElFormItem,
  ElInput
];

const option = { size: 'small', zIndex: 3000 };

export const useElementPlus = (app) => {
  // element全局配置
  app.config.globalProperties.$ELEMENT = option;
  // 组件注册
  components.forEach((component) => {
    app.component(component.name, component);
  });
  // 插件注册 https://element-plus.gitee.io/zh-CN/component/loading.html
  app.config.globalProperties.$message = ElMessage;
  app.config.globalProperties.$loading = ElLoading;
};
