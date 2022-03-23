# 一、基础

## 1、概述

### 1）作用

- webpack 是前端资源构建工具（将 less 转 css，将 JQuery 转 js 等），是静态资源打包工具（css，img 等）

### 2）核心概念

#### （1）入口(Entry)

- 入口(Entry)指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。

#### （2）输出(Output)

- 输出(Output)指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。

#### （3）**Loader** 

- Loader 让 webpack 能够去处理那些非 JavaScript 文件，webpack 只理解 JavaScript

#### （4）插件(Plugins)

- 插件(Plugins)可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩， 

  一直到重新定义环境中的变量等。

#### （5）模式(Mode)

- 模式(Mode)指示 webpack 使用相应模式的配置。

|    选项     |                             描述                             |            特点            |
| :---------: | :----------------------------------------------------------: | :------------------------: |
| development | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin | 能让代码本地调试运行的环境 |
| production  | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。启用 FlagDependencyUsagePlugin,FlagIncludedChunksPlugin, ModuleConcatenationPlugin, SideEffectsFlagPlugin 和 TerserPlugin。 |      能让代码优化上线      |

### 3）初体验

#### （1）安装

- npm install webpack webpack-cli -g 

- npm install webpack webpack-cli -D

#### （2）编译打包应用

1. 创建文件

2. 运行指令

   1. 开发环境指令：webpack src/js/index.js -o build/js/built.js --mode=development

   2. 功能：webpack 能够编译打包 js 和 json 文件，并且能将 es6 的模块化语法转换成 

      浏览器能识别的语法

   3. 生产环境指令：webpack src/js/index.js -o build/js/built.js --mode=production

   4. 功能：在开发配置功能上多一个功能，压缩代码。

3. 结论

   1. webpack 能够编译打包 js 和 json 文件。 

      能将 es6 的模块化语法转换成浏览器能识别的语法。 

      能压缩代码。 

   2. 不能编译打包 css、img 等文件。 

      不能将 js 的 es6 基本语法转化为 es5 以下语法。

### 4）插件集成

| 序号 |                             插件                             |        功能        |
| :--: | :----------------------------------------------------------: | :----------------: |
|  1   |      npm i css-loader style-loader less-loader less -D       |    打包样式资源    |
|  2   |              npm install html-webpack-plugin -D              |   打包 html 资源   |
|  3   |      npm install html-loader url-loader file-loader -D       |    打包图片资源    |
|  4   |                 npm i webpack-dev-server -D                  |   配置 devServer   |
|  5   |            npm install mini-css-extract-plugin -D            | css 提取成单独文件 |
|  6   |       npm install postcss-loader postcss-preset-env -D       |   css 兼容性处理   |
|  7   |      npm install optimize-css-assets-webpack-plugin -D       |      css 压缩      |
|  8   | npm install eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import -D |    js 语法检查     |
|  9   | npm install babel-loader @babel/core @babel/preset-env @babel/polyfill core-js -D |   js 兼容性处理    |
|  10  |            npm install workbox-webpack-plugin -D             |        pwa         |
|  11  |                 npm install thread-loader -D                 |     多进程打包     |

## 2、配置开发环境

### 1）打包资源

#### （1）打包样式资源

1. 下载安装 loader 包

   ```xml
   npm i css-loader style-loader less-loader less -D
   ```

2. 修改配置文件

   ```javascript
   const { resolve } = require('path'); // node 内置核心模块，用来处理路径问题。
   
   module.exports = { 
       entry: './src/js/index.js', 				// 入口文件 
       output: { 									// 输出配置 
           filename: './built.js', 				// 输出文件名 
           path: resolve(__dirname, 'build/js') 	// 输出文件路径配置 
       },
       // loader 的配置 
       module: { 
           rules: [ 
               // 详细 loader 配置 
               // 不同文件必须配置不同 loader 处理 
               { 
                   // 匹配哪些文件 
                   test: /\.css$/, 
                   // 使用哪些 loader 进行处理 
                   use: [ 
                       // use 数组中 loader 执行顺序：从右到左，从下到上 依次执行 
                       // 创建 style 标签，将 js 中的样式资源插入进行，添加到 head 中生效
                       'style-loader', 
                       // 将 css 文件变成 commonjs 模块加载 js 中，里面内容是样式字符串 
                       'css-loader' 
                   ] 
               },
               { 
                   test: /\.less$/, 
                   use: [ 
                       'style-loader', 
                       'css-loader', 
                       // 将 less 文件编译成 css 文件，需要下载 less-loader 和 less 
                       'less-loader' 
                   ] 
               } 
           ] 
       },
       // plugins 的配置 
       plugins: 
       [ 		// 详细 plugins 的配置 
       ],
       mode: 'development' //开发环境 
   };
   ```

3. 运行指令   webpack

#### （2）打包 html 资源

1. 下载安装 plugin 包，需要引入

   ```javas
   npm install html-webpack-plugin -D 
   ```

2. . 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   module.exports = { 
       entry: './src/index.js', 
       output: { 
           filename: 'built.js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           // 功能：默认会创建一个空的 HTML，自动引入打包输出的所有资源（JS/CSS） 
           // 需求：需要有结构的 HTML 文件 
           new HtmlWebpackPlugin({ 
               // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS） 
               template: './src/index.html' 
           }) 
       ],
       mode: 'development' 
   };
   ```

#### （3）打包图片资源

1. 下载安装 loader 包

   ```javascript
   npm install html-loader url-loader file-loader -D
   ```

2. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   module.exports = { 
       entry: './src/index.js', 
       output: { 
           filename: 'built.js', 
           path: resolve(__dirname, 'build') 
       },
        // loader 的配置 
       module: { 
           rules: [ 
               { 
                   test: /\.less$/, 
                   use: [ 
                       'style-loader',  'css-loader', 'less-loader' 
                   ] 
               } ,
               {
                   // 处理图片资源 
                   test: /\.(jpg|png|gif)$/, 
                   // 下载 url-loader file-loader(依赖关系) 
                   loader: 'url-loader', 
                   options: {
                       // 图片大小小于 8kb，就会被 base64 处理 
                       // 优点: 减少请求数量；缺点：图片体积会更大
                       limit: 8 * 1024, 
         // 问题：因为 url-loader 默认使用 es6 模块化解析，而 html-loader 引入图片是 commonjs 
         // 解决：关闭 url-loader 的 es6 模块化，使用 commonjs 解析 
                       esModule: false, 
                       // 给图片进行重命名 
                       // [hash:10]取图片的 hash 的前 10 位，[ext]取文件原来扩展名 
                       name: '[hash:10].[ext]' 
                   } 
               },
               { test: /\.html$/, 
                // 处理 html 文件的 img 图片（负责引入 img，从而能被 url-loader 进行处理） 
                loader: 'html-loader' 
               } 
           ] 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html' 
           }) 
       ],
       mode: 'development' 
   };
   ```

#### （4）打包其他资源

```javascript
// 字体图标
module: { 
    rules: [ 
        { 
            test: /\.css$/, 
            use: ['style-loader', 'css-loader']
        },
        // 打包其他资源(除了 html/js/css 资源以外的资源) 
        { 
            // 排除 css/js/html 资源 
            exclude: /\.(css|js|html|less)$/, 
            loader: 'file-loader', 
            options: { 
                name: '[hash:10].[ext]',
                outputPath:'icons'	// 指定 build 的路径
            } 
        } 
    ] 
},
```

### 2）配置 devServer

1. 自动编译，自动打开浏览器，自动刷新

   ```javascript
   mode: 'development', 
   devServer: { 
       // 项目构建后路径 
       contentBase: resolve(__dirname, 'build'), 
       // 启动 gzip 压缩 
       compress: true, 
       // 端口号 
       port: 3000, 
       // 自动打开浏览器 
       open: true 
   }
   ```

2. 运行指令

   1. 安装 npm i webpack-dev-server -D
   2. 不会有输出，只会在内存编译中打包。

   ```javascript
   npx webpack-dev-server
   ```

## 3、生产环境

### 1）CSS

#### （1）提取成单独文件

1. 下载插件

   ```javascript
   npm install mini-css-extract-plugin -D
   ```

2. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   module.exports = { 
       ...
       module: { 
           rules: [ 
               { 
                   test: /\.css$/, 
                   use: [ 
                       // 创建 style 标签，将样式放入 
                       // 'style-loader', 
                       // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件 
                       MiniCssExtractPlugin.loader, 
                       // 将 css 文件整合到 js 文件中 
                       'css-loader' 
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html'
           }), 
           new MiniCssExtractPlugin({ 
               // 对输出的 css 文件进行重命名 
               filename: 'css/built.css'
           }) 
       ],
       mode: 'development' 
   };
   ```

#### （2）兼容性处理

1. 下载插件

   ```javascript
   npm install postcss-loader postcss-preset-env -D
   ```

2. 修改配置文件

   1. postcss-preset-env，帮 postcss 找到 package.json 的配置，通过配置加载指定的 css 兼容性样式。

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   
   // 设置 nodejs 环境变量
   // process.env.NODE_ENV = 'development';
   
   module.exports = { 
       ...
       module: { 
           rules: [ 
               { 
                   test: /\.css$/, 
                   use: [ 
                       MiniCssExtractPlugin.loader, 
                       'css-loader',
                       { 
                           loader: 'postcss-loader', 
                           options: { 
                               ident: 'postcss', 
                               plugins: () => [ 
                                   // postcss 的插件 
                                   require('postcss-preset-env')() 
                               ] 
                           } 
                       }
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html'
           }), 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.css'
           }) 
       ],
       mode: 'development' 
   };
   ```

3. 修改 package.json

   1. ==默认匹配生产环境，与 mode 无关，需要设置环境变量 NODE_ENV =  ' development '==

   ```javascript
   "browserslist": { 
       "development": [ 
           "last 1 chrome version", 	// 兼容最近一个版本
           "last 1 firefox version",
           "last 1 safari version" 
       ],
       "production": [ 
               ">0.2%", 	// 兼容 99.8%
               "not dead",  // 不要已经退役的
               "not op_mini all"  	// 不要 op_mini
       ] 
   }
   ```

#### （3）压缩

1. 下载插件

   ```javascript
   npm install optimize-css-assets-webpack-plugin -D
   ```

2. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   
   // 设置 nodejs 环境变量
   // process.env.NODE_ENV = 'development';
   
   module.exports = { 
       ...
       module: { 
           rules: [ 
               { 
                   test: /\.css$/, 
                   use: [ 
                       MiniCssExtractPlugin.loader, 
                       'css-loader',
                       { 
                           loader: 'postcss-loader', 
                           options: { 
                               ident: 'postcss', 
                               plugins: () => [ 
                                   // postcss 的插件 
                                   require('postcss-preset-env')() 
                               ] 
                           } 
                       }
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html'
           }), 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.css'
           }),
           // 压缩 css 
           new OptimizeCssAssetsWebpackPlugin()
       ],
       mode: 'development' 
   };
   ```

### 2）JS

#### （1）语法检查 eslint

1. 下载插件

   ```javascript
   npm install eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import -D
   ```

2. 修改配置文件

   1. 自动修复 eslint 的错误 。

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
   
   module.exports = { 
       module: { 
           rules: [ 
               /*语法检查： eslint-loader eslint 
               注意：只检查自己写的源代码，第三方的库是不用检查的 
               设置检查规则： 
               package.json 中 eslintConfig 中设置~ 
               "eslintConfig": { 
               	"extends": "airbnb-base" 
               } 
               airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint 
               */
               { 
                   test: /\.js$/,
                   exclude: /node_modules/, 
                   loader: 'eslint-loader', 
                   options: { 
                       // 自动修复 eslint 的错误 
                       fix: true 
                   } 
               } 
           ] 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html' 
           }),
           new MiniCssExtractPlugin({ 
               filename: 'css/built.css' 
           })
       // 压缩 css
           new OptimizeCssAssetsWebpackPlugin() 
       ],
       mode: 'development' 
   };
   ```

3. 配置 package.json

   ```javascript
   "eslintConfig": { 
       "extends": "airbnb-base", 
        "env": { 
            "browser": true 
        } 
   }
   ```

#### （2）兼容性处理

1. 下载插件

   ```javascript
   npm install babel-loader @babel/core @babel/preset-env @babel/polyfill core-js -D
   ```

2. 修改配置文件

   1. 基本的兼容性处理，@babel/preset-env，但只能转换基本语法，不能转换 Promise
   2. 全部 js 兼容性处理，@babel/polyfill，但文件体积太大
      1. index.js	引入	import '@babel / polyfill' ；不需要修改配置文件
   3. ==按需下载==
      1. 需要注释第二种方案。
   
   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   
   module: { 
       rules: [ 
           { 
               test: /\.js$/, 
               exclude: /node_modules/, 
               loader: 'babel-loader', 
               options: {
                   // 预设：指示 babel 做怎么样的兼容性处理 
                   presets: [ 
                       [ 
                           '@babel/preset-env', 
                           { 
                               // 按需加载 
                               useBuiltIns: 'usage', 
                               // 指定 core-js 版本 
                               corejs: { 
                                   version: 3 
                               },
                               // 指定兼容性做到哪个版本浏览器 
                               targets: { 
                                   chrome: '60', 
                                   firefox: '60', 
                                   ie: '9', 
                                   safari: '10', 
                                   edge: '17' 
                               } 
                           } 
                       ] 
                   ] 
               } 
           } 
       ] 
   },
   plugins: [ 
       new HtmlWebpackPlugin({ 
           template: './src/index.html' 
       }) 
   ],
   ```

### 3）HTML

#### （1）压缩

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   module.exports = { 
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html', 
               // 压缩 html 代码 
               minify: { 
                   // 移除空格 
                   collapseWhitespace: true, 
                   // 移除注释 
                   removeComments: true 
               } 
           }) 
       ],
       mode: 'production' 
   }
   ```

### 4）配置生产环境

1. 修改配置文件

   1. 配置 enforce:"pre"，指定 loader 的执行顺序。
   
   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 
       'css-loader', { 
           // 还需要在 package.json 中定义 browserslist 
           loader: 'postcss-loader', 
           options: { 
               ident: 'postcss', 
               plugins: () => [require('postcss-preset-env')()] 
           } 
       } 
   ];
   
   module.exports = { 
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.js', 
           path: resolve(__dirname, 'build') 
       },
       module: { 
           rules: [ 
               { 
                   test: /\.css$/, 
                   use: [...commonCssLoader] 
               },
               { 
                   test: /\.less$/, 
                   use: [...commonCssLoader, 'less-loader'] 
               },
               /*正常来讲，一个文件只能被一个 loader 处理。 
               当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序：
               先执行 eslint 在执行 babel 
               */
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, 
                   exclude: /node_modules/,
                   // 优先执行 
                   enforce: 'pre', 
                   loader: 'eslint-loader',
                   options: { 
                       fix: true 
                   } 
               },
               { 
                   test: /\.js$/, 
                   exclude: /node_modules/, 
                   loader: 'babel-loader', 
                   options: { 
                       presets: [ 
                           [ 
                               '@babel/preset-env', 
                               { 
                                   useBuiltIns: 'usage', 
                                   corejs: {version: 3}, 
                                   targets: { 
                                       chrome: '60',
                                       firefox: '50'
                                   } 
                               } 
                           ] 
                       ] 
                   } 
               },
               { 
                   test: /\.(jpg|png|gif)/, 
                   loader: 'url-loader', 
                   options: { 
                       limit: 8 * 1024, 
                       name: '[hash:10].[ext]', 
                       outputPath: 'imgs', 
                       // 此处配合 hmtl-loader;
                       // html-loader 使用 commonJS,需要关闭 url-loader的ES6语法
                       esModule: false 
                   }
               },
               { 
                   test: /\.html$/, 
                   loader: 'html-loader' 
               },
               { 
                   exclude: /\.(js|css|less|html|jpg|png|gif)/, 
                   loader: 'file-loader', 
                   options: {
                       outputPath: 'media' 
                   } 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.css' 
           }), 
           new OptimizeCssAssetsWebpackPlugin(), 
           new HtmlWebpackPlugin({ 
               template: './src/index.html',
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           }) 
       ],
       mode: 'production' };
   ```

## 4、优化配置

### 1）HMR

1. 作用：实现模块热替换
   1. 一个模块发生变化，只重新打包这一个模块，而不是所有。
   2. 极大地提升了构建速度
2. 使用
   1. 样式文件：可以使用HMR，因为 style-loader 内部实现了
   2. js 文件：默认不能使用
      1. 需要修改 js 代码，添加支持 HMR 功能的代码。
      2. 较为繁琐，此处不推荐。
   3. html 文件：默认不能使用，且导致 html 不能热更新
      1. 解决：修改 entry 入口，将html文件引入
      2. 不需要 HMR 功能，因为只有一个 html 文件。

```javascript
module.exports = { 
    // 修改 entry 入口，将html文件引入
    entry: ['./src/js/index.js', './src/index.html'], 
	...
    mode: 'development', 
    devServer: { 
        contentBase: resolve(__dirname, 'build'), 
        compress: true, 
        port: 3000, 
        open: true, 
        // 开启 HMR 功能 
        // 当修改了 webpack 配置，新配置要想生效，必须重新 webpack 服务 
        hot: true 
    } 
};
```

### 2）source-map

#### 1）作用

1. 提供源代码到构建后代码的映射关系，通过映射可以定位源代码错误。

#### 2）配置

1. 修改配置文件 

   ```javascript
   mode: 'development', 
   devServer: { 
       contentBase: resolve(__dirname, 'build'), 
       compress: true, 
       port: 3000, 
       open: true, 
       hot: true 
   },
   devtool: 'eval-source-map'
   ```

### 3）oneOf

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 
       'css-loader', 
       { 
           // 还需要在 package.json 中定义 
           browserslist loader: 'postcss-loader', 
           options: { 
           	ident: 'postcss', 
           	plugins: () => [require('postcss-preset-env')()] 
   		} 
   	} 
   ];
   module.exports = {
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.js', 
           path: resolve(__dirname, 'build') 
       },
       module: { 
           rules: [ 
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, 
                   exclude: /node_modules/, 
                   // 优先执行 
                   enforce: 'pre', 
                   oader: 'eslint-loader',
                   options: { 
                       fix: true 
                   } 
               },
               { 
                   // 以下 loader 只会匹配一个 
                   // 注意：不能有两个配置处理同一种类型文件 
                   oneOf: [ 
                       { 
                           test: /\.css$/, 
                           use: [...commonCssLoader] 
                       },
                       { 
                           test: /\.less$/, 
                           use: [...commonCssLoader, 'less-loader'] 
                       },
                       /*正常来讲，一个文件只能被一个 loader 处理。 
                       当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序：
                       先执行 eslint 在执行 babel 
                       */
                       { 
                           test: /\.js$/, 
                           exclude: /node_modules/, 
                           loader: 'babel-loader',
                           options: {
                               presets: [ 
                                   [ 
                                       '@babel/preset-env',
                                       { 
                                           useBuiltIns: 'usage',
                                           corejs: {version: 3}, 
                                           targets: { 
                                               chrome: '60', 
                                               firefox: '50' 
                                           } 
                                       } 
                                   ] 
                               ] 
                           } 
                       },
                       {
                           test: /\.(jpg|png|gif)/, 
                           loader: 'url-loader', 
                           options: { 
                               limit: 8 * 1024, 
                               name: '[hash:10].[ext]', 
                               outputPath: 'imgs', 
                               esModule: false
                           } 
                       },
                       { 
                           test: /\.html$/, 
                           loader: 'html-loader' 
                       },
                       { 
                           exclude: /\.(js|css|less|html|jpg|png|gif)/, 
                           loader: 'file-loader', 
                           options: {
                               outputPath: 'media'
                           } 
                       } 
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ filename: 'css/built.css' }),
           new OptimizeCssAssetsWebpackPlugin(), 
           new HtmlWebpackPlugin({ 
               template: './src/index.html',
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           }) 
       ],
       mode: 'production' 
   };
   ```

### 4）缓存

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 
       'css-loader', 
       { 
           // 还需要在 package.json 中定义 browserslist
           loader: 'postcss-loader', 
           options: { 
               ident: 'postcss',
               plugins: () => [require('postcss-preset-env')()]
           } 
       } 
   ];
   module.exports = { 
       entry: './src/js/index.js',
       output: { 
           filename: 'js/built.[contenthash:10].js', 
           path: resolve(__dirname, 'build')
       },
       module: { 
           rules: [ 
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, 
                   exclude: /node_modules/, 
                   // 优先执行 
                   enforce: 'pre', 
                   loader: 'eslint-loader', 
                   options: { 
                       fix: true 
                   } 
               },
               { 
                   // 以下 loader 只会匹配一个 
                   // 注意：不能有两个配置处理同一种类型文件 
                   oneOf: [ 
                       {
                           test: /\.css$/, 
                           use: [...commonCssLoader] 
                       },
                       { 
                           test: /\.less$/, 
                           use: [...commonCssLoader, 'less-loader'] 
                       },
                       /*正常来讲，一个文件只能被一个 loader 处理。
                       当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序： 先执行 eslint 在执行 babel */
                       { 
                           test: /\.js$/, 
                           exclude: /node_modules/, 
                           loader: 'babel-loader', 
                           options: {
                               presets: [ 
                                   [ 
                                       '@babel/preset-env',
                                       { 
                                           useBuiltIns: 'usage',
                                           corejs: { version: 3 },
                                           targets: { 
                                               chrome: '60', 
                                               firefox: '50'
                                           } 
                                       } 
                                   ] 
                               ],
                               // 开启 babel 缓存 
                               // 第二次构建时，会读取之前的缓存 
                               cacheDirectory: true 
                           } 
                       },
                       { 
                           test: /\.(jpg|png|gif)/, 
                           loader: 'url-loader', 
                           options: { 
                               limit: 8 * 1024, 
                               name: '[hash:10].[ext]', 
                               outputPath: 'imgs',
                               esModule: false 
                           } 
                       },
                       { 
                           test: /\.html$/, 
                           loader: 'html-loader' 
                       },
                       {
                           exclude: /\.(js|css|less|html|jpg|png|gif)/, 
                           loader: 'file-loader',
                           options: { 
                               outputPath: 'media' 
                           } 
                       } 
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.[contenthash:10].css' 
           }),
           new OptimizeCssAssetsWebpackPlugin(),
           new HtmlWebpackPlugin({ 
               template: './src/index.html', 
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           }) 
       ],
       mode: 'production', 
       devtool: 'source-map' 
   };
   ```

### 5）tree shaking

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 
       'css-loader', 
       {
           // 还需要在 package.json 中定义 browserslist 
           loader: 'postcss-loader',
           options: { 
               ident: 'postcss', 
               plugins: () => [require('postcss-preset-env')()] 
           } 
       } 
   ];
   module.exports = { 
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.[contenthash:10].js',
           path: resolve(__dirname, 'build') 
       },
       module: { 
           rules: [ 
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, exclude: /node_modules/, 
                   // 优先执行 
                   enforce: 'pre', 
                   loader: 'eslint-loader', 
                   options: { 
                       fix: true 
                   } 
               },
               { 
                   // 以下 loader 只会匹配一个 
                   // 注意：不能有两个配置处理同一种类型文件 
                   oneOf: [ 
                       { 
                           test: /\.css$/, 
                           use: [...commonCssLoader] 
                       },
                       { 
                           test: /\.less$/, 
                           use: [...commonCssLoader, 'less-loader'] 
                       },
                       /*正常来讲，一个文件只能被一个 loader 处理。
                       当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序： 先执行 eslint 在执行 babel 
                       */
                       { 
                           test: /\.js$/,
                           exclude: /node_modules/, 
                           loader: 'babel-loader', 
                           options: { 
                               presets: [ 
                                   [ 
                                       '@babel/preset-env', 
                                       { 
                                           useBuiltIns: 'usage', 
                                           corejs: { version: 3 }, 
                                           targets: { 
                                               chrome: '60', 
                                               firefox: '50'
                                           } 
                                       } 
                                   ] 
                               ],
                               // 开启 babel 缓存 
                               // 第二次构建时，会读取之前的缓存 
                               cacheDirectory: true 
                           } 
                       },
                       { 
                           test: /\.(jpg|png|gif)/, 
                           loader: 'url-loader', 
                           options: { 
                               limit: 8 * 1024, 
                               name: '[hash:10].[ext]', 
                               outputPath: 'imgs', 
                               esModule: false
                           } 
                       },
                       {
                           test: /\.html$/, 
                           loader: 'html-loader' 
                       },
                       { 
                           exclude: /\.(js|css|less|html|jpg|png|gif)/,
                           loader: 'file-loader', 
                           options: { 
                               outputPath: 'media' 
                           } 
                       } 
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.[contenthash:10].css' 
           }), 
           new OptimizeCssAssetsWebpackPlugin(), 
           new HtmlWebpackPlugin({
               template: './src/index.html', 
               minify: { 
                   collapseWhitespace: true,
                   removeComments: true 
               } 
           }) 
       ]
       ,mode: 'production', 
       devtool: 'source-map' 
   };
   ```

### 6）code split

1. 修改 demo1 配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   module.exports = { 
       // 单入口 
       // entry: './src/js/index.js', 
       entry: { 
           // 多入口：有一个入口，最终输出就有一个 bundle 
           index: './src/js/index.js', 
           test: './src/js/test.js' 
       },
       output: { 
           // [name]：取文件名 
           filename: 'js/[name].[contenthash:10].js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html', 
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           })
       ],
       mode: 'production' 
   };
   ```

2. 修改 demo2 配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   module.exports = { 
       // 单入口 
       // entry: './src/js/index.js', 
       entry: { 
           // 多入口：有一个入口，最终输出就有一个 bundle 
           index: './src/js/index.js', 
           test: './src/js/test.js' 
       },
       output: { 
           // [name]：取文件名 
           filename: 'js/[name].[contenthash:10].js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html', 
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           })
       ],
       /*
       1. 可以将 node_modules 中代码单独打包一个 chunk 最终输出 
       2. 自动分析多入口 chunk 中，有没有公共的文件。如果有会打包成单独一个 chunk 
       */
       optimization: { 
           splitChunks: { 
               chunks: 'all'
           } 
       },
       mode: 'production' 
   };
   ```

### 7）lazy loading

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   module.exports = { 
       // 单入口 
       // entry: './src/js/index.js', 
       entry: { 
           // 多入口：有一个入口，最终输出就有一个 bundle 
           index: './src/js/index.js', 
           test: './src/js/test.js' 
       },
       output: { 
           // [name]：取文件名 
           filename: 'js/[name].[contenthash:10].js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html', 
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           })
       ],
       /*
       1. 可以将 node_modules 中代码单独打包一个 chunk 最终输出 
       2. 自动分析多入口 chunk 中，有没有公共的文件。如果有会打包成单独一个 chunk 
       */
       optimization: { 
           splitChunks: { 
               chunks: 'all'
           } 
       },
       mode: 'production' 
   };
   ```

### 8）pwa

1. 下载插件

   ```javascript
   npm install workbox-webpack-plugin -D
   ```

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const WorkboxWebpackPlugin = require('workbox-webpack-plugin'); 
   /*
   PWA: 渐进式网络开发应用程序(离线可访问) 
   workbox --> workbox-webpack-plugin 
   */
   
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 
       'css-loader', 
       { 
           // 还需要在 package.json 中定义 browserslist 
           loader: 'postcss-loader', 
           options: { 
               ident: 'postcss', 
               plugins: () => [require('postcss-preset-env')()]
           } 
       } 
   ];
   module.exports = {
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.[contenthash:10].js', 
           path: resolve(__dirname, 'build') 
       },
       module: { 
           rules: [ 
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, 
                   exclude: /node_modules/, 
                   // 优先执行 
                   enforce: 'pre', 
                   loader: 'eslint-loader', 
                   options: { 
                       fix: true 
                   } 
               },
               {
                   // 以下 loader 只会匹配一个 
                   // 注意：不能有两个配置处理同一种类型文件
                   oneOf: [ 
                       { 
                           test: /\.css$/, 
                           use: [...commonCssLoader] 
                       },
                       { 
                           test: /\.less$/, 
                           use: [...commonCssLoader, 'less-loader'] 
                       },
                       /*正常来讲，一个文件只能被一个 loader 处理。 
                       当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序： 
                       先执行 eslint 在执行 babel 
                       */
                       { 
                           test: /\.js$/,
                           exclude: /node_modules/, 
                           loader: 'babel-loader', 
                           options: { 
                               presets: [ 
                                   [ 
                                       '@babel/preset-env', 
                                       { 
                                           useBuiltIns: 'usage', 
                                           corejs: { version: 3 }, 
                                           targets: { 
                                               chrome: '60', 
                                               firefox: '50' 
                                           } 
                                       } 
                                   ] 
                               ],
                               // 开启 babel 缓存 
                               // 第二次构建时，会读取之前的缓存 
                               cacheDirectory: true 
                           } 
                       },
                       { 
                           test: /\.(jpg|png|gif)/, 
                           loader: 'url-loader', 
                           options: { 
                               limit: 8 * 1024, 
                               name: '[hash:10].[ext]', 
                               outputPath: 'imgs', 
                               esModule: false 
                           } 
                       },
                       { 
                           test: /\.html$/, 
                           loader: 'html-loader' 
                       },
                       {
                           exclude: /\.(js|css|less|html|jpg|png|gif)/, 
                           loader: 'file-loader', 
                           options: { outputPath: 'media' 
                                    } 
                       }
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.[contenthash:10].css' 
           }), 
           new OptimizeCssAssetsWebpackPlugin(), 
           new HtmlWebpackPlugin({ 
               template: './src/index.html',
               minify: { 
                   collapseWhitespace: true, 
                   removeComments: true 
               } 
           }), 
           new WorkboxWebpackPlugin.GenerateSW({ 
               /*1. 帮助 serviceworker 快速启动 
               2. 删除旧的 serviceworker 生成一个 serviceworker 配置文件~ 
               */
               clientsClaim: true, 
               skipWaiting: true 
           }) 
       ],
       mode: 'production', 
       devtool: 'source-map' 
   };
   ```

### 9）多进程打包

1. 下载插件

   ```javascript
   npm install thread-loader -D
   ```

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
   const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin' );
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const WorkboxWebpackPlugin = require('workbox-webpack-plugin'); 
   
   /*
   PWA: 渐进式网络开发应用程序(离线可访问) 
   workbox --> workbox-webpack-plugin 
   */
   // 定义 nodejs 环境变量：决定使用 browserslist 的哪个环境 
   process.env.NODE_ENV = 'production'; 
   // 复用 loader 
   const commonCssLoader = [ 
       MiniCssExtractPlugin.loader, 'css-loader', 
       { 
           // 还需要在 package.json 中定义 browserslist 
           loader: 'postcss-loader', 
           options: { 
               ident: 'postcss', 
               plugins: () => [require('postcss-preset-env')()] 
           } 
       } 
   ];
   module.exports = { 
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.[contenthash:10].js', 
           path: resolve(__dirname, 'build') 
       },
       module: { 
           rules: [
               { 
                   // 在 package.json 中 eslintConfig --> airbnb 
                   test: /\.js$/, 
                   exclude: /node_modules/, 
                   // 优先执行 
                   enforce: 'pre', 
                   loader: 'eslint-loader', 
                   options: { 
                       fix: true 
                   } 
               },
               { 
                   // 以下 loader 只会匹配一个 
                   // 注意：不能有两个配置处理同一种类型文件 
                   oneOf: [ 
                       { 
                           test: /\.css$/, 
                           use: [...commonCssLoader] 
                       },
                       { 
                           test: /\.less$/, 
                           use: [...commonCssLoader, 'less-loader'] 
                       },
                       /*正常来讲，一个文件只能被一个 loader 处理。 
                       当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序： 
                       先执行 eslint 在执行 babel 
                       */
                       { 
                           test: /\.js$/, 
                           exclude: /node_modules/, 
                           use: [ 
                               /*开启多进程打包。 
                               进程启动大概为 600ms，进程通信也有开销。 
                               只有工作消耗时间比较长，才需要多进程打包 
                               */
                               { 
                                   loader: 'thread-loader', 
                                   options: {
                                       workers: 2 // 进程 2 个 
                                   }
                               },
                               { 
                                   loader: 'babel-loader', 
                                   options: { 
                                       presets: [ 
                                           [ 
                                               '@babel/preset-env', 
                                               { 
                                                   useBuiltIns: 'usage', 
                                                   corejs: { version: 3 }, 
                                                   targets: { 
                                                       chrome: '60', 
                                                       firefox: '50' 
                                                   } 
                                               }
                                           ] 
                                       ],
                                       // 开启 babel 缓存 
                                       // 第二次构建时，会读取之前的缓存 
                                       cacheDirectory: true 
                                   } 
                               } 
                           ] 
                       },
                       {
                           test: /\.(jpg|png|gif)/, 
                           loader: 'url-loader', 
                           options: { 
                               limit: 8 * 1024, 
                               name: '[hash:10].[ext]', 
                               outputPath: 'imgs', 
                               esModule: false 
                           } 
                       },
                       { 
                           test: /\.html$/, 
                           loader: 'html-loader' 
                       },
                       { 
                           exclude: /\.(js|css|less|html|jpg|png|gif)/, 
                           loader: 'file-loader', 
                           options: {
                               outputPath: 'media' 
                           } 
                       }
                   ] 
               } 
           ] 
       },
       plugins: [ 
           new MiniCssExtractPlugin({ 
               filename: 'css/built.[contenthash:10].css' 
           }),
           new OptimizeCssAssetsWebpackPlugin(), 
           new HtmlWebpackPlugin({ 
               template: './src/index.html',
               minify: { 
                   collapseWhitespace: true,
                   removeComments: true 
               } 
           }),
           new WorkboxWebpackPlugin.GenerateSW({ 
               /*
               1. 帮助 serviceworker 快速启动 
               2. 删除旧的 serviceworker 生成一个 serviceworker 配置文件~ 
               */
               clientsClaim: true, 
               skipWaiting: true 
           }) 
       ],
       mode: 'production', 
       devtool: 'source-map' 
   };
   ```

### 10）externals

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   module.exports = { 
       entry: './src/js/index.js', 
       output: { 
           filename: 'js/built.js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html' 
           }) 
       ],
       mode: 'production',
       externals: { 
           // 拒绝 jQuery 被打包进来 
           jquery: 'jQuery' 
       } 
   };
   ```

### 11）ddl

1. 修改配置文件

   ```javascript
   const { resolve } = require('path'); 
   const HtmlWebpackPlugin = require('html-webpack-plugin'); 
   const webpack = require('webpack'); 
   const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin'); 
   module.exports = { 
       entry: './src/index.js', 
       output: { 
           filename: 'built.js', 
           path: resolve(__dirname, 'build') 
       },
       plugins: [ 
           new HtmlWebpackPlugin({ 
               template: './src/index.html' 
           }), 
           // 告诉 webpack 哪些库不参与打包，同时使用时的名称也得变~ 
           new webpack.DllReferencePlugin({ 
               manifest: resolve(__dirname, 'dll/manifest.json') 
           }),
           // 将某个文件打包输出去，并在 html 中自动引入该资源 
           new AddAssetHtmlWebpackPlugin({ 
               filepath: resolve(__dirname, 'dll/jquery.js')
           }) 
       ],
       mode: 'production' 
   };
   ```

## 5、配置详情

### 1）entry

```javascript
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: { 
        index: ['./src/index.js', './src/count.js'], 
        add: './src/add.js' },
    	output: { 
            filename: '[name].js', 
            path: resolve(__dirname, 'build') 
        },
    plugins: [new HtmlWebpackPlugin()], 
    mode: 'development' 
}
```

### 2）output

```javascript
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = { 
    entry: './src/index.js', 
    output: { 
        // 文件名称（指定名称+目录） 
        filename: 'js/[name].js', 
        // 输出文件目录（将来所有资源输出的公共目录） 
        path: resolve(__dirname, 'build'), 
        // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> '/imgs/a.jpg' 
        publicPath: '/', 
        chunkFilename: 'js/[name]_chunk.js', 
        // 非入口 chunk 的名称 
        // library: '[name]',
        // 整个库向外暴露的变量名
        // libraryTarget: 'window'
        // 变量名添加到哪个上 browser
        // libraryTarget: 'global'
        // 变量名添加到哪个上 node 
        // libraryTarget: 'commonjs' },
        plugins: [new HtmlWebpackPlugin()], 
        mode: 'development' 
    }
```

### 3）module

```javascript
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = { 
    entry: './src/index.js', 
    output: { 
        filename: 'js/[name].js', 
        path: resolve(__dirname, 'build') 
    },
    module: { 
        rules: [ 
            // loader 的配置 
            { 
                test: /\.css$/, 
                // 多个 loader 用 use 
                use: ['style-loader', 'css-loader'] 
            },
            { 
                test: /\.js$/, 
                // 排除 node_modules 下的 js 文件 
                exclude: /node_modules/, 
                // 只检查 src 下的 js 文件 
                include: resolve(__dirname, 'src'),
                // 优先执行 
                enforce: 'pre', 
                // 延后执行 // 
                enforce: 'post', 
                // 单个 loader 用 loader 
                loader: 'eslint-loader', 
                options: {} 
            },
            { 
                // 以下配置只会生效一个 
                oneOf: [] 
            } 
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: 'development' 
}
```

### 4）resolve

```javascript
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = { 
    entry: './src/js/index.js', 
    output: { 
        filename: 'js/[name].js', 
        path: resolve(__dirname, 'build') 
    },
    module: { 
        rules: [ 
            { 
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'] 
            } 
        ] 
    },
    plugins: [new HtmlWebpackPlugin()], 
    mode: 'development', 
    // 解析模块的规则 
    resolve: { 
        // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示 
        alias: { 
            $css: resolve(__dirname, 'src/css') 
        },
        // 配置省略文件路径的后缀名 
        extensions: ['.js', '.json', '.jsx', '.css'], 
        // 告诉 webpack 解析模块是去找哪个目录 
        modules: [
            resolve(__dirname, '../../node_modules'), 
            'node_modules'] 
    }
```

### 5）devServer

```javascript
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/[name].js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()],
    mode: 'development',
    resolve: {
        alias: {
            $css: resolve(__dirname, 'src/css')
        },
        extensions: ['.js', '.json', '.jsx', '.css'],
        modules: [
            resolve(__dirname, '../../node_modules'),
            'node_modules']
    }
    devServer: {
        // 运行代码的目录 
        contentBase: resolve(__dirname, 'build'),
        // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload 
        watchContentBase: true,
        watchOptions: {
            // 忽略文件 
            ignored: /node_modules/
        },
        // 启动 gzip 压缩 
        compress: true,
        // 端口号
        port: 5000,
        // 域名 
        host: 'localhost',
        // 自动打开浏览器 
        open: true,
        // 开启 HMR 功能 
        hot: true,
        // 不要显示启动服务器日志信息 
        clientLogLevel: 'none',
        // 除了一些基本启动信息以外，其他内容都不要显示 
        quiet: true,
        // 如果出错了，不要全屏提示~ 
        overlay: false,
        // 服务器代理 --> 解决开发环境跨域问题 
        proxy: {
            // 一旦 devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器 (3000)
            '/api': {
                target: 'http://localhost:3000',
                // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
                pathRewrite: { '^/api': '' }
            }
        }
    }
};
```

### 6）optimization

```javascript
const { resolve } = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const TerserWebpackPlugin = require('terser-webpack-plugin') 
module.exports = { 
    entry: './src/js/index.js', 
    output: { 
        filename: 'js/[name].[contenthash:10].js', 
        path: resolve(__dirname, 'build'), 
        chunkFilename: 'js/[name].[contenthash:10]_chunk.js' 
    },
    module: { 
        rules: [ 
            { 
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'] 
            } 
        ] 
    },
    plugins: [new HtmlWebpackPlugin()], 
    mode: 'production', 
    resolve: { 
        alias: { 
            $css: resolve(__dirname, 'src/css') 
        },
        extensions: ['.js', '.json', '.jsx', '.css'], 
        modules: [
            resolve(__dirname, '../../node_modules'), 
            'node_modules']
    },
    optimization: { 
        splitChunks: { 
            chunks: 'all' // 默认值，可以不写~ 
        },
        // 将当前模块的记录其他模块的 hash 单独打包为一个文件 runtime 
        // 解决：修改 a 文件导致 b 文件的 contenthash 变化
        runtimeChunk: { 
            name: entrypoint => `runtime-${entrypoint.name}` 
        },
        minimizer: [
            // 配置生产环境的压缩方案：js 和 css
            new TerserWebpackPlugin({ 
                // 开启缓存 
                cache: true, 
                // 开启多进程打包 
                parallel: true, 
                // 启动 source-map 
                sourceMap: true 
            }) 
        ] 
    } 
};
```

# 二、高级





1. function(){}() 为立即调用函数；

   ```javascript
   var result = (function(){
       let myName = '千峰'
       return myName
   })()
   
   console.log(result)
   ```

   