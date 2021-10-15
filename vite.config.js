import { defineConfig } from "vite";  // 帮手函数，这样不用 jsdoc 注解也可以获取类型提示
import { resolve } from "path"; // 主要用于alias文件路径别名
import vue from '@vitejs/plugin-vue'; 

function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

export default defineConfig({
  plugins:[vue()], // 配置需要使用的插件列表，这里将vue添加进去
  // 配置文件别名 这里是将src目录配置别名为 /@ 方便在项目中导入src目录下的文件
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
    open: true,
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
