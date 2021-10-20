import { commonEnv, developmentEnv, productionEnv } from "./env";
import { defineConfig } from "vite";
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'; 
import styleImport from 'vite-plugin-style-import';
import { viteMockServe } from 'vite-plugin-mock';

const localEnabled = process.env.USE_MOCK || false;
const prodEnabled = process.env.USE_CHUNK_MOCK || false;


function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

export default (({command}) => {
  console.log('command: ', command);
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
    plugins:[
      vue(),
      viteMockServe({
        mockPath: './src/server/mock',
        localEnabled: localEnabled,
        prodEnabled: prodEnabled,
        // 控制关闭mock的时候不让mock打包到最终代码内
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: false,
        supportTs: false
      }),
      styleImport({
        libs: [{
          libraryName: 'element-plus',
          resolveStyle: (name) => {
            name = name.slice(3);
            return `element-plus/packages/theme-chalk/src/${name}.scss`;
          }
        }]
      })
    ],
    resolve: {
      alias: {
        '/@': pathResolve("src"),
      }
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
      minify: 'terser' // 混淆器，terser构建后文件体积更小
    },
    port: process.env.VITE_PORT,
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
      //反向代理配置
      proxy: {
        '/api': {
          target: process.env.VITE_API_DOMAINS,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    define: {
      'process.env': {}
    }
  });
});
