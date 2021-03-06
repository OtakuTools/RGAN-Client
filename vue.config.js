const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    devtool: 'none', // webpack内关闭sourceMap
    optimization: { // 优化配置
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // 拆分Vue
          vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            name: 'chunk-vue'
          },
          // 拆分Element
          element: {
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            name: 'chunk-element'
          },
          // 拆分monaco
          monaco_editor: {
            test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            name: 'chunk-monaco'
          },
          markdown_it: {
            test: /[\\/]node_modules[\\/]markdown-it[\\/]/,
            name: 'chunk-markdownit'
          },
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            name: 'chunk-vuetify'
          }
        }
      }
    },
    plugins: [
      // new MonacoWebpackPlugin({
      //   // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      //   languages: ['javascript', 'css', 'html', 'typescript', 'json']
      // }),

      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$/,
        threshold: 10240,
        deleteOriginalAssets: false
      })

      // new VuetifyLoaderPlugin()
    ],
    externals: {
      'highlight': 'highlight.js',
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'markdown-it': 'markdownit',
      'monaco-editor': 'monaco',
      'vuetify': 'Vuetify',
      'qiniu': 'qiniu',
      'showdown': 'showdown',
      'echarts' : 'echarts'
    }
  },
  devServer: {
    host: 'localhost', // target host
    port: 8121,
    // proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
    proxy: {
      '/api': {
        target: 'http://122.51.156.251:31500', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        // target: 'http://localhost:8080', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        ws: true, // proxy websockets
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
