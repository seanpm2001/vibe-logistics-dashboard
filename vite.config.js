import { defineConfig } from 'vite';
import { commonEnv, developmentEnv, productionEnv } from './env';
import { VITE_DROP_CONSOLE, VITE_PORT } from './vite-config/constant';
import { createVitePlugins } from './vite-config/plugin';
import proxy from './vite-config/proxy';
console.log('proxy: ', proxy);
import { resolve } from 'path';

function pathResolve(dir) {
  return resolve(__dirname, '.', dir);
}
export default (({command}) => {
  const isBuild = command === 'build';
  // 加载不同生产环境下的配置
  const NODE_ENV =  process.env.NODE_ENV || 'development'; // 无local API，默认采用beta API的配置
  let envSettings = commonEnv;
  if (NODE_ENV === 'development') {
    envSettings = Object.assign(developmentEnv, commonEnv);
  } else if (NODE_ENV === 'production') {
    envSettings = Object.assign(productionEnv, commonEnv);
  }
  process.env = Object.assign(envSettings, process.env);
  
  return defineConfig({
    plugins: createVitePlugins(isBuild),
    resolve: {
      alias: [
        { find: '/~', replacement: pathResolve('node_modules') },
        { find: '/@', replacement: pathResolve('src'), }
      ]
    },
    // 强制预构建插件包
    optimizeDeps: {
      include: ['axios'],
    },
    // 打包配置
    build: {
      target: 'modules',
      outDir: 'dist', //指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
    },
    port: VITE_PORT,
    open: true,
    https: false,
    hot: true,
    hotOnly: false,
    base: process.env.VITE_BASE_URL,
    outDir: process.env.VITE_OUTPUT_DIR,
    // 本地运行配置，及反向代理配置
    server: {
      host: process.env.VITE_HOST,
      cors: true,
      proxy, // 反向代理配置
    },
    define: {
      'process.env': process.env
    }
  });
});
