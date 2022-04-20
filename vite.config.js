import { defineConfig } from 'vite';
import { commonEnv, developmentEnv, productionEnv } from './env';
import { VITE_DROP_CONSOLE, VITE_PORT } from './vite-config/constant';
import { createVitePlugins } from './vite-config/plugin';
import proxy from './vite-config/proxy';
import { resolve } from 'path';

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
        { find: '@', replacement: resolve(__dirname, 'src'), },
        { find: '@img', replacement: resolve(__dirname, 'src/assets/img') },
        { find: '@css', replacement: resolve(__dirname, 'src/assets/css') },
      ]
    },
    css: {
      postcss: {
        //remove build charset warning
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      },
      // preprocessorOptions: {
      //   //define global scss variable
      //   scss: {
      //     // eslint-disable-next-line quotes
      //     additionalData: `@import "@css/_response.sass";`
      //   }
      // }
    },
    // 强制预构建插件包
    optimizeDeps: {
      include: ['axios'],
    },
    // 打包配置
    build: {
      target: 'modules',
      outDir: 'dist', //指定输出路径
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      chunkSizeWarningLimit: 5000, // 消除打包大小超过警告
      terserOptions: {
        //detail to look https://terser.org/docs/api-reference#compress-options
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: true
        },
      },
      //build assets Separate
      assetsDir: 'static/assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
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
      'process.env': process.env,
      'process.platform': null,
      'process.version': null,
    }
  });
});
