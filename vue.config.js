const { defineConfig } = require('@vue/cli-service')

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = process.env.port || process.env.npm_config_port || 9527; // dev port

module.exports = defineConfig({
  /*
  node_modules里的依赖默认是不会编译的,会导致es6语法在ie中的语法报错,
  所以需要在vue.config.js中使用transpileDependencies属性配置node_modules中指定哪些文件夹或文件需要编译.
  */
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  publicPath: "./",
  outputDir: "dist1",
  assetsDir: "static",

  devServer: {
    port: port,
    open: true,
    /*
    在浏览器上全屏显示编译的errors或warnings。
    默认是关闭的。如果只想显示编译错误。则如下配置
    */
    /*
    overlay: {
      warnings: false,
      errors: true
    },
    */
    proxy: {
      "/": {
        target: "http://192.168.0.178:80",
        changeOrigin: true,
        // 是否启用websockets
        ws: false,
        //重写匹配的字段，如果不需要在请求路径上，重写为""
        pathRewrite: {
          "^/": ""
        }
      }
    }
  },



  chainWebpack: config => {
    // resolve.alias这个配置项相当于为文件目录配置一个别名
    config.resolve.alias
      .set("@", resolve("src"));
  },
})
