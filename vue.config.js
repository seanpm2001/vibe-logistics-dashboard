// const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 构建项目生成的目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devDist',

  // 关闭语法自动检测
  // lintOnSave: false,
  devServer: {
    // disableHostCheck: true,
    // open: false,
    // host: 'localhost',
    port: '8080',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        // target: 'https://www.wnpic.site/api',
        target: 'http://127.0.0.1:7001/api',
        // changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'sass',
  //     patterns: [
  //       // 带less相关语法如.class-name()的文件须在此引入不然报undefined
  //       // path.resolve(__dirname, './src/styles/loader.less')
  //     ]
  //   }
  // },
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       prependData: '@import "./src/assets/css/main.sass";'
  //     },
  //   }
  // },

  // svg
  // i18n config for vue-loader v15 或更高版本
  // chainWebpack: config => {
  //   config.module.rules.delete('svg')
  //   config.module
  //     .rule('svg-sprite-loader').test(/\.svg$/)
  //     .include
  //     .add(path.resolve('./src/assets/icon/svg'))
  //     .end()
  //     .use('svg-sprite-loader')
  //     .loader('svg-sprite-loader')
  //     .options({
  //       symbolId: 'icon-[name]'
  //     })
  // }
}
