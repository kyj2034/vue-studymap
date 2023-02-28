const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: 'https://sgisapi.kostat.go.kr/OpenAPI3',
        pathReWrite: { '^/': '' },
        changeOrigin: true,
        secure: false
      }
    }
  }
})
