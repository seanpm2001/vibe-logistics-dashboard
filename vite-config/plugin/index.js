import vue from '@vitejs/plugin-vue';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
// import { svgBuilder } from './svgBuilder'; 
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { AutoImportDeps } from './autoImport';
import { configVisualizerPlugin } from './visualizer';
import { configStyleImportPlugin } from './styleImport';
import { resolve } from 'path';

export function createVitePlugins(isBuild) {
  const vitePlugins = [
    // vue支持
    vue(),
    AutoImportDeps(), // 自动按需引入依赖
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), './src/icons/svg')],
    }),
    // svgBuilder('./src/icons/svg/'), // 已经将src/icons/svg/下的svg全部导入，无需再单独导入
    Components({
      resolvers: [ElementPlusResolver({importStyle: 'sass'})],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),
  ];

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerPlugin());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin(isBuild));

  return vitePlugins;
}
