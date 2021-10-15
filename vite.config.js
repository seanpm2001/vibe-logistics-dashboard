import { defineConfig } from "vite"; 
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'; 
import styleImport from 'vite-plugin-style-import';

function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

export default defineConfig({
  plugins:[
    vue(),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        resolveStyle: (name) => {
          name = name.slice(3)   // 这里有个彩蛋，官网居然是用splice的，没错用的是数组方法。
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`;
        },
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
        target: 'http://192.168.99.223:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'process.env': {}
  }
})
