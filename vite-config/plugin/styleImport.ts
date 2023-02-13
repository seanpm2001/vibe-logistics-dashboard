/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */
import {createStyleImportPlugin, ElementPlusResolve} from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild) {
  // const path = isBuild ? 
  const styleImportPlugin = createStyleImportPlugin({
    resolves: [ElementPlusResolve()],
    libs: [{
      libraryName: 'element-plus',
      esModule: true,
      resolveStyle: (name) => {
        return `element-plus/es/components/${name.substring(3)}/style/css`
      }
    }]
  });
  return styleImportPlugin;
}
