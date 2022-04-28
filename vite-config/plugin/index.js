import vue from '@vitejs/plugin-vue';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { configVisualizerPlugin } from './visualizer';
import { configStyleImportPlugin } from './styleImport';
import { resolve } from 'path';

export function createVitePlugins(isBuild) {
  const vitePlugins = [
    // vue支持
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), './src/icons/svg')],
    }),
    AutoImport({ // 自动按需引入依赖
      // resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia', {
        '@/hooks/useLogistic': ['useQueryHook', 'useWarehouseEnumHook'],
      }],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
  ];

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerPlugin());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin(isBuild));

  return vitePlugins;
}
