// GitHub 通用技巧
GitHub 术语解释
Issues：可以理解为“问题”，举一个简单的例子，如果我们开源一个项目，如果别人看了我们的项目，并且发现了bug，或者感觉那个地方有待改进，他就可以给我们提出Issue，等我们把Issues解决之后，就可以把这些Issues关闭；反之，我们也可以给他人提出Issue。
Star：可以理解为“点赞”，当我们感觉某一个项目做的比较好之后，就可以为这个项目点赞，而且我们点赞过的项目，都会保存到我们的Star之中，方便我们随时查看。在 GitHub 之中，如果一个项目的点星数能够超百，那么说明这个项目已经很不错了。
Fork：可以理解为“拉分支”，如果我们对某一个项目比较感兴趣，并且想在此基础之上开发新的功能，这时我们就可以Fork这个项目，这表示复制一个完成相同的项目到我们的 GitHub 账号之中，而且独立于原项目。之后，我们就可以在自己复制的项目中进行开发了。
Pull Request：可以理解为“提交请求”，此功能是建立在Fork之上的，如果我们Fork了一个项目，对其进行了修改，而且感觉修改的还不错，我们就可以对原项目的拥有者提出一个Pull请求，等其对我们的请求审核，并且通过审核之后，就可以把我们修改过的内容合并到原项目之中，这时我们就成了该项目的贡献者。
Merge：可以理解为“合并”，如果别人Fork了我们的项目，对其进行了修改，并且提出了Pull请求，这时我们就可以对这个Pull请求进行审核。如果这个Pull请求的内容满足我们的要求，并且跟我们原有的项目没有冲突的话，就可以将其合并到我们的项目之中。当然，是否进行合并，由我们决定。
Watch：可以理解为“观察”，如果我们Watch了一个项目，之后，如果这个项目有了任何更新，我们都会在第一时候收到该项目的更新通知

// 实战
# 一、表单验证

## 1、失去焦点时验证

### 1）表单内容

```javascript
<!-- 表单 -->
<el-form ref="rulesForm" :rules="formRules" :model="rulesForm" label-width="200px">
    <el-form-item label="用户名称:" prop="userName">
       <el-input v-model="rulesForm.userName" style="width:300px" maxlength="50"/>
    </el-form-item>
</el-form>
```

- <el-form>：代表这是一个表单
- <el-form> -> ref：表单被引用时的名称，标识
- <el-form> -> rules：表单验证规则
- <el-form> -> model：表单数据对象
- <el-form> -> label-width：表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值
- <el-form> -> <el-form-item>：表单中的每一项子元素
- <el-form-item> -> label：标签文本
- <el-form-item> -> prop：表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
- <el-input>：输入框
- <el-input> -> v-model：绑定的表单数据对象属性
- <el-input> -> style：行内样式
- <el-input> -> maxlength：最大字符长度限制

### 2）data 数据

```javascript
data() {
    return {      
        // 表单验证
        formRules: {
            userName: [
                {required: true,message: "请输入用户名称",trigger: "blur"}
            ]
        }
    }
}
```

- formRules：与上文 '表单内容' 中 <el-form> 表单的 :rules 属性值相同
- userName：与上文 '表单内容' 中 <el-form-item> 表单子元素的 prop 属性值相同
- 验证内容是：必填，失去焦点时验证，如果为空，提示信息为 '请输入用户名称'

### 3）script 内容

```javascript
<script>
// 引入了外部的验证规则
import { validateAccountNumber } from "@/utils/validate";
 
// 判断银行卡账户是否正确
const validatorAccountNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入账户信息"));
  } else {
    if (validateAccountNumber(value)) {
      callback();
    } else {
      return callback(new Error('账号格式不正确'))
    }
  }
};
 
export default {
    data() {
        return {
            // 表单验证
            formRules: {
                accountNumber: [
                    {required: true,validator: validatorAccountNumber,trigger: "blur"}
                ]
            }
        }
    }
}
</script>
```

- import：先引入了外部的验证规则 
- const：定义一个规则常量，常量名可变， '= (rule, value, callback) => {}' 为固定格式，value 入参为验证的字段值
- formRules -> accountNumber：表单验证中使用 validator 指定自定义校验规则常量名称

## 2、提交时验证

### 1）表单的提交按钮

```javascript
<!-- 表单 -->
<el-form ref="rulesForm" :rules="formRules" :model="rulesForm" label-width="200px">
    <el-form-item>
        <el-button type="primary" @click="onSubmit('rulesForm')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </el-form-item>
</el-form
```

- <el-button> -> @click：按钮点击时触发的事件，这里注意方法的入参为 'rulesForm'，这里要与 <el-form> 表单的 rel 属性值一致

### 2）methods 方法

```javascript
methods: {
    // 保存
    onSubmit(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                console.log("success submit!!");
            }else{
                console.log("error submit!!");
            }
        });
    },
    // 取消
    cancel() {}
}
```

- this.$refs[formName].validate：formName 就是传入的 'rulesForm'，与 <el-form> 表单的 rel 属性值一致

# 二、particles 粒子

## 1、基本使用

1. 安装插件

   ```xml
    npm i particles.js
   ```

2. 创建一个DOM元素，Particles.js 将在其中创建粒子

   ```javascript
     <div style="height: 100%; width: 100%">
       <div id="particles-js"></div>
     </div>
   ```

3. methods 方法

   1. particlesJS ( dom-id ,  path-json ,  callback ( optional ) ) ;
   2. `dom-id`是您希望粒子出现的元素的id。 `path-json`是具有所有配置选项的JSON文件的路径，而`callback`是可选的回调函数

   ```javascript
   import particlesJs from "particles.js";
   import particlesConfig from "./particles.json";
     mounted() {
       this.init();
     },
     methods: {
       init() {
         particlesJS("particles-js", particlesConfig);
         document.body.style.overflow = "hidden";
       },
     }
   ```

## 2、配置 particles.json

```javascript
 <script>
    //particles-js 为 HTML-DOM  ID
    particlesJS("particles-js", {
        //颗粒参数
        "particles": {
            "number": {
                //离粒子显示的数量值
                "value": 100,
                //密度
                "density": {
                    //激活
                    "enable": true,
                    //值区 值越小 显示的越多
                    "value_area": 300
                }
            },
            "color": {
                //下面是各种可接收值的格式
                //"#b61924" 
                // {r:182, g:25, b:36} 
                // {h:356, s:76, l:41} 
                // ["#b61924", "#333333", "999999"] 
                // "random"
                "value": "#ffffff"
            },
            //形状
            "shape": {
                //下面是各种可接收值的格式 都可以与下面的 nb_sides 边的数量结合使用
                //"circle"  园
                // "edge" 有边的 看起来像是嵌套的一种图形
                // "triangle" 三角形
                // "polygon" 多边形
                // "star" 星星
                // "image" 图片 对应下面的 image 参数
                // ["circle", "triangle", "image"]  数组混合参数 这样出来的形状就像是随机的多个形状
                "type": "circle",
                //
                "stroke": {
                    "width": 1,
                    "color": "#fff"
                },
                //多边形 配合上面的形状使用
                "polygon": {
                    //边数
                    "nb_sides": 5
                },
                //图片参数 配合上面的形状 type 为 image 使用
                "image": {
                    "src": "http://www.dynamicdigital.us/wp-content/uploads/2013/02/starburst_white_300_drop_2.png",
                    "width": 100,
                    "height": 100
                }
            },
            //透明度
            "opacity": {
                //数字（0到1）
                "value": 0.5,
                //布尔值
                "random": true,
                //动画参数
                "anim": {
                    //激活
                    "enable": false,
                    //速度
                    "speed": 1,
                    //时间
                    "opacity_min": 0.1,
                    //同步 
                    //布尔值
                    "sync": false
                }
            },
            //尺寸
            "size": {
                //粒子尺寸的数值 
                //注意：不可过大会报错  这个数值应该是计算推算出的一个大致的区间
                "value": 1,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 20,
                    "size_min": 1,
                    "sync": false
                }
            },
            //连接线
            "line_linked": {
                //激活
                "enable": false,
                //距离
                "distance": 50,
                "color": "#ffffff",
                "opacity": 0.6,
                "width": 1
            },
            //移动
            "move": {
                "enable": true,
                //移动的速度
                "speed": 10,
                //移动的方向
                //下面是各种可接收值
                //"none" 
                // "top" 
                // "top-right" 
                // "right" 
                // "bottom-right" 
                // "bottom" 
                // "bottom-left" 
                // "left" 
                // "top-left"
                "direction": "none",
                "random": true,
                //直线运动 数值为 true 粒子动效不好看
                //布尔值
                "straight": false,
                //输出模式
                //下面是各种可接收值
                //"out" 跑到外面
                //"bounce"  反弹
                "out_mode": "out",
                //粒子之间碰撞是否反弹
                //布尔值
                "bounce": false,
                //吸引 激活之后粒子的方向会有些杂乱无章
                "attract": {
                    "enable": false,
                    "rotateX": 300,
                    "rotateY": 1200
                }
            }
        },
        //互动性
        "interactivity": {
            //检测
            //下面是各种可接收值
            //"canvas", "window"
            "detect_on": "canvas",
            //添加各种事件
            "events": {
                //鼠标经过
                "onhover": {
                    "enable": false,
                    //模式
                    //下面是各种可接收值
                    //"grab" 抓住  显示的是粒子间的连接线
                    // "bubble" 气泡 显示的是放大版的上面的 image src 的图片 
                    // "repulse" 浅水 使粒子无法进入鼠标固定的范围
                    // ["grab", "bubble"]  还可以用数组的形式来设置
                    "mode": "bubble"
                },
                //点击事件
                "onclick": {
                    "enable": false,
                    //下面是各种可接收值
                    //"push"  增加粒子
                    // "remove"  删除粒子
                    // "bubble" 
                    // "repulse" 
                    // ["push", "repulse"]
                    "mode": "repulse"
                },
                //调整大小
                //布尔值
                "resize": false
            },
            //给上面的可设置的模式增加更多的的参数设置
            "modes": {
                "grab": {
                    //距离
                    "distance": 150,
                    //连接线
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 200,
                    //尺寸
                    "size": 20,
                    //持续的时间
                    "duration": 2,
                    "opacity": 8,
                    //速度
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.2
                },
                //增加
                "push": {
                    //颗粒面积
                    "particles_nb": 1
                },
                //去除
                "remove": {
                    //颗粒面积
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true //视网膜检测
    });
    </script>
```

# 三、cookie

cookie 就是服务端留给计算机用户浏览器端的小文件。



session机制采用的是在服务端保持状态的方案，而cookie机制则是在[客户端](https://so.csdn.net/so/search?q=客户端&spm=1001.2101.3001.7020)保持状态的方案，cookie又叫会话跟踪机制。打开一次浏览器到关闭浏览器算一次会话。说到这里，讲下HTTP协议，HTTP协议是一种无状态协议，在数据交换完毕后，服务端和客户端的链接就会关闭，每次交换数据都需要建立新的链接。此时，服务器无法从链接上跟踪会话。cookie可以跟踪会话，弥补HTTP无状态协议的不足。



cookie分为会话cookie和持久cookie，会话cookie是指在不设定它的生命周期expires时的状态，浏览器开启到关闭就是一次会话，当关闭浏览器时，会话cookie就会跟随浏览器而销毁。当关闭一个页面时，不影响会话cookie的销毁。会话cookie就像我们没有办理[积分](https://so.csdn.net/so/search?q=积分&spm=1001.2101.3001.7020)卡时，单一的买卖过程，离开之后，信息则销毁。

持久cookie则是设定了生命周期expires，此时，cookie像商品一样，有个保质期，关闭浏览器之后，它不会销毁，知道设定的过期时间。对于持久cookie，可以在同一个浏览器中传递数据，比如，你在打开一个淘宝页面登录后，你在点开一个商品页面，依然是登录状态，即便你关闭了浏览器，再次开启浏览器，依然会是登录状态。这就是因为cookie自动将数据传送到服务端，在反馈回来的结果。持久cookie就像是我们办理了一张积分卡，即便雷凯，信息一直保留，直达时间到期，信息销毁。

cookie的集中常见属性

```javascript
document.cookie="key=value;expires=失效时间;path=路径;secure;(secure表安全级别)"
```

# 四、draggable 属性

1. 一个可拖动的段落

   ```
   <p draggable="true">This is a draggable paragraph.</p>
   ```

2. 链接和图像默认是可拖动的。

   ```javascript
   <script type="text/javascript">
   function allowDrop(ev)
   {
   ev.preventDefault();
   }
   
   function drag(ev)
   {
   ev.dataTransfer.setData("Text",ev.target.id);
   }
   
   function drop(ev)
   {
   ev.preventDefault();
   var data=ev.dataTransfer.getData("Text");
   ev.target.appendChild(document.getElementById(data));
   }
   </script>
   </head>
   <body>
   
   <p>请把 W3School 的图片拖放到矩形中：</p>
   
   <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
   <br />
   <img id="drag1" src="/i/eg_dragdrop_w3school.gif" draggable="true" ondragstart="drag(event)" />
   
   </body>
   </html>
   
   ```

3. 使用

   1. 把元素设置为可拖放

      首先：为了把一个元素设置为可拖放，请把 draggable 属性设置为 true：

   ```
   <img draggable="true">
   ```

   2. 拖放的内容 - ondragstart 和 setData()

      然后，规定当元素被拖动时发生的事情。

      在上面的例子中，ondragstart 属性调用了一个 drag(event) 函数，规定拖动什么数据。

      dataTransfer.setData() 方法设置被拖动数据的数据类型和值：

      ```
      function drag(ev) {
          ev.dataTransfer.setData("text", ev.target.id);
      }
      ```

      在本例中，数据类型是 "text"，而值是这个可拖动元素的 id ("drag1")。

   3. 拖到何处 - ondragover

      ondragover 事件规定被拖动的数据能够被放置到何处。

      默认地，数据/元素无法被放置到其他元素中。为了实现拖放，我们必须阻止元素的这种默认的处理方式。

      这个任务由 ondragover 事件的 event.preventDefault() 方法完成：

      ```
      event.preventDefault()
      ```

   4. 进行放置 - ondrop

      当放开被拖数据时，会发生 drop 事件。

      在上面的例子中，ondrop 属性调用了一个函数，drop(event)：

      ```
      function drop(ev) {
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data));
      }
      ```

   5. 代码解释

      - 调用 preventDefault() 来阻止数据的浏览器默认处理方式（drop 事件的默认行为是以链接形式打开）
      - 通过 dataTransfer.getData() 方法获得被拖的数据。该方法将返回在 setData() 方法中设置为相同类型的任何数据
      - 被拖数据是被拖元素的 id ("drag1")
      - 把被拖元素追加到放置元素中





# N、特别说明

1. bject.prototype.toString.call( a ) 判断类型，包括 set 与 map
2.  @dblclick 双击事件



















































## 1、报错

### 1）初始化

1. Parsing error: No Babel config file detected for 

   1. 修改 packjson.json

      ```javascript
          "parserOptions": {
            "parser": "@babel/eslint-parser",
            "requireConfigFile" : false		// 补充该行
          },
      ```

2. Component name "Test" should always be multi-word

   1. 需要驼峰命名

   2. 修改 vue.config.js

      ```javascript
      module.exports = defineConfig({
        transpileDependencies: true,
        lintOnSave:false	// 补充该行
      })
      ```

## 2、基础

### 1）事件监听

- 「事件名称」
- 「事件的处理程序」(事件触发时执行的function)
- 「Boolean」值，由这个Boolean决定事件是以「捕获」还是「冒泡」机制执行，若不指定则预设为「冒泡」。默认为 false

```javascript
  addEvent (el, fn) {
    el.addEventListener('mousewheel', fn, false)
  }
```

## 4、轮子

### 1）判断竖屏

1. 官方已经弃用

```javascript
// 判断竖屏
(function (window) {
  var pd = null;
  function createPd(){
    if(document.getElementById('preventTran') === null){
      var imgData = 'data:image/png;base64,x3k8kM/9/PfV3K53L5EIsH/nrP2PzAJNfmP9znfAAAAAElFTkSuQmCC';	// base 简化
      pd = document.createElement('div');
      pd.setAttribute('id','preventTran');
      pd.style.position = 'fixed';
      pd.style.left = '0';
      pd.style.top = '0';
      pd.style.width = '100%';
      pd.style.height = '100%';
      pd.style.overflow = 'hidden';
      pd.style.backgroundColor = '#2e2e2e';
      pd.style.textAlign = 'center';
      pd.style.zIndex = '99999';
      
      document.getElementsByTagName('body')[0].appendChild(pd);
      var img = document.createElement('img');
      img.src = imgData;
      pd.appendChild(img);
      img.style.margin = '60px auto 30px'
      var br = document.createElement('br');
      var p = document.createElement('p');
      p.style.width = '100%';
      p.style.height = 'auto';
      p.style.fontSize = '22px';
      p.style.color = '#626262';
      p.style.lineHeight = '34px';
      p.style.textAlign = 'center';
      p.innerHTML = '为了您的良好体验';
      p.appendChild(br);
      p.innerHTML += '请将手机/平板横屏操作';
      pd.appendChild(p);
    }
  }

  if (window.orientation === 180 || window.orientation === 0) {
    if(pd == null && document.getElementById('preventTran') === null) createPd();
    document.getElementById('preventTran').style.display = 'block';
    // alert('竖屏状态！');
  }
  window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    if (window.orientation === 180 || window.orientation === 0) {
      if(pd == null && document.getElementById('preventTran') === null) createPd();
      document.getElementById('preventTran').style.display = 'block';
      // alert('竖屏状态！');
    }
    if (window.orientation === 90 || window.orientation === -90 ){
      if(pd == null && document.getElementById('preventTran') == null) createPd();
      document.getElementById('preventTran').style.display='none';
      // alert('横屏状态！');
    }
  }, false);
})(window)
```

2. orientation: portrait（竖屏，即设备中的页面可见区域高度>=宽度）

   orientation: landscape（横屏，即\**设备中的页面可见区域高度<=宽度\**）

   ```javascript
   <!DOCTYPE html>
   <html>
   
       <head>
           <meta charset="utf-8" />
           <title>识别横竖屏</title>
           <style>
               @media (orientation: landscape) {
                   body {
                       background-color: #ccc;
                   }
               }
               
               @media (orientation: portrait) {
                   body {
                       background-color: #000;
                   }
               }
           </style>
       </head>
   
       <body>
       </body>
   
   </html>
   ```

### 2）全局过滤器数组

```javascript
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
```



​	回顾一下最近一年的需求，大部分都解决了，没有解决的有：

1. 一些性价比太低的需求。如果我们花时间去解决，可能只能服务到很少一部分用户，所以这种任务的优先级就会被我们降低。

   

2. 技术债务。一个功能已经实现了，但是由于需求变更，导致存在这样或那样的小问题，重写吧时间太久，不重写吧总是报错。我们只能按照其对用户的影响程度来标注它们的优先级了。虽然我们的网站才开发了一年，就已经有一些技术债务了……

   

3. 组件复用问题。由于我们一开始没有先做通用组件，所以造成了一些重复的实现，这些重复的实现又会变成潜在的 bug。所以下一步打算打造自己的通用组件。



# A、个人网站

1. 泡泡显示技术栈
2. 拖拽效果
3. css 修饰首页

//技术栈.me
### 1）前端技术栈

|     课程     | 熟悉 | 日期 |
| :----------: | :--: | :--: |
|     Git      |  是  | 2021 |
|     less     |  是  | 2021 |
|     ES6+     |  是  | 2021 |
|    Vue2.0    |  是  | 2021 |
|              |      |      |
| Element Plus |  1   |      |
|    nodeJS    |  1   |      |
|    Vue3.0    |      |      |
|   uni-app    |      |      |
|   webpack    |      |      |
|    web3D     |  1   |      |
|    React     |  1   |      |
|   Echarts    |      |      |
|  typeScript  |  1   |      |
|  Bootstrap   |      |      |
|  sass-scss   |  1   |      |
|   设计模式   |  1   |      |
|   Nuxt,js    |  1   |      |
|  自动化测试  |      |      |

### 2）个人网站

- 核心：酷炫，创意，新颖

1. 泡泡效果显示技术栈。
2. 时间线表示技术栈。
3. 拖拽效果



### 3）要点

1. 浏览器

   1. 浏览器兼容
   2. 浏览器跨域
   3. 移动端适配方案

2. 项目工程

   1. 性能优化--webpack

      1. 优化打包构建速度
      2. 优化代码调试
      3. 优化运行性能

                                                             
                                        





