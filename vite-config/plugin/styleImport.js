/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */
import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild) {
  // const path = isBuild ? 
  const styleImportPlugin = styleImport({
    resolves: [],
    libs: [
      {
        libraryName: 'element-plus',
        esModule: true,
        resolveStyle: (name) => {
          console.log('name: ', name);
          name = name.replace('el-', '');

          // 这里是需要额外引入样式的子组件列表
          const replaceArr = [
            'message',
            'message-box',
            'el-tooltip'
          ];

          return replaceArr.includes(name)
            ? `element-plus/theme-chalk/src/${name}.scss`
            : '';
        },
      },
    ],
  });
  return styleImportPlugin;
}
