import {
  ElButton,
  ElForm,
  ElFormItem,
} from 'element-plus'

export default (app) => {
  app
    .use(ElButton)
    .use(ElForm)
    .use(ElFormItem)
}
