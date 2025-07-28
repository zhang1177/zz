const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,

  devServer: {
    port: 9091,
    // http 代理配置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api': '' //请求前缀白名单
        // }
      }
    }
  }
})
