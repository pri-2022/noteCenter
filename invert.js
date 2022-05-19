# 一、Vuex

## 1、简介

### 1）概述

- Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。
- 它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
- Vuex 和单纯的全局对象有以下两点不同：
  1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
  2. 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交  mutation。

### 2）示例

- 为了在 Vue 组件中访问 `this.$store` property，Vuex 提供了一个从根组件向所有子组件“注入”该 store 的机制。

- 简单地说，如果不在此处挂载，则很多 Vue 文件都要引入 store ,那是相当的麻烦。

  ```ts
  // main.js
  new Vue({
    el: '#app',
    store
  })
  
  methods: {
    increment() {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
  ```

## 2、核心

### 1）State

- Vuex 采用单一状态树，用一个对象就包含了全部的应用层级状态。这也意味着，每个应用将仅仅包含一个 store 实例。

#### （1）获取状态

- 由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态。

  ```js
  // 创建一个 Counter 组件
  // 每当 `store.state.count` 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。
  const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
      count () {
        return store.state.count
      }
    }
  }
  ```

#### （2）mapState 辅助函数

- 当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性。

  ```js
  import { mapState } from 'vuex';
  export default{
      computed:{
          ...mapState("loginModule",["userinfo"])
      }
  }
  ```

### 2）Getter

- 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

- Getter 接受 state 作为其第一个参数，也可以接受其他 getter 作为第二个参数。

  ```js
  const store = new Vuex.Store({
    state: {
      todos: [
        { id: 1, text: '...', done: true },
        { id: 2, text: '...', done: false }
      ]
    },
    getters: {
      doneTodos: state => {
        return state.todos.filter(todo => todo.done)
      }
        
      doneTodosCount: (state, getters) => {
        return getters.doneTodos.length
    }
    }
  })
  ```

#### （1）通过属性访问

- Getter 会暴露为 `store.getters` 对象，你可以以属性的形式访问这些值。

- 注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

  ```js
  store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
  ```

#### （2）通过方法访问

- 通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

- 注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

  ```js
  getters: {
    // ...
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
  store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
  ```

#### （3）mapGetters 辅助函数

- `mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：

  ```js
  import { mapGetters } from 'vuex'
  
  export default {
    computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'doneTodosCount',
        'anotherGetter',
      ])
    }
  }
  ```

- 如果你想将一个 getter 属性另取一个名字，使用对象形式

  ```js
  ...mapGetters({
    // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
    doneCount: 'doneTodosCount'
  })
  ```

### 3）Mutation

- 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。

#### （1）事件注册

- 每个 mutation 都有一个字符串的事件类型和 一个 handler。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。

  ```js
  const store = new Vuex.Store({
    state: {
      count: 1
    },
    mutations: {
      increment (state) {
        // 变更状态
        state.count++
      }
    }
  })
  ```

#### （2）事件调用

- 唤醒一个 mutation handler，你需要以相应的 type 调用 **store.commit** 方法。

  ```js
  store.commit('increment')
  ```

- 你可以向 `store.commit` 传入额外的参数，即 mutation 的 **载荷（payload）**。

  在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读。

  ```js
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    }
  }
  
  store.commit('increment', {
    amount: 10
  })
  ```

#### （3）注意事项

- store 中的状态是响应式的，当我们变更状态时，监视状态的 Vue 组件也会自动更新。这意味着 mutation 也需要与使用 Vue 一样遵守一些注意事项：

  ```js
  // 1. 最好提前在 store 中初始化好所有所需属性。
  // 2. 在对象上添加新属性时。
  
  Vue.set(obj, 'newProp', 123) // 添加属性
  state.obj = {...state.obj , newProp:123 }	// 新对象替换老对象
  ```

#### （4）同步函数

- 观察 devtool 中的 mutation 日志，为了记录每一条 mutation ，devtools 需要捕捉到 mutation 前一状态和后一状态的快照。
- 这要求 mutation 必须是同步函数。因为回调函数中进行的状态的改变都是不可追踪的。

#### （5）mapMutations辅助函数

- 使用 `mapMutations` 辅助函数将组件中的 methods 映射为 `store.commit` 调用。

  ```js
  import { mapMutations } from 'vuex'
  
  export default {
    methods: {
      ...mapMutations([
        'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
  
        // `mapMutations` 也支持载荷：
        'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
      ]),
      ...mapMutations({
        add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      }),
      ...mapMutations('loginModule',['setUser']),	// 模块
    }
  }
  ```

### 4）Actions

- Action 类似于 mutation，不同在于 Action 提交的是 mutation，而不是直接变更状态，而且 Action 可以包含任意异步操作。

  ```js
  const store = new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
      increment (state) {
        state.count++
      }
    },
    actions: {
      increment (context) {
        context.commit('increment')
      }
    }
  })
  ```

- Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象。

  因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

#### （1）分发 Action

- Action 通过 `store.dispatch` 方法触发：

  ```js
  store.dispatch('increment')
  ```

- Actions 支持同样的载荷方式和对象方式进行分发

  ```js
  // 以载荷形式分发
  store.dispatch('incrementAsync', {
    amount: 10
  })
  
  // 以对象形式分发
  store.dispatch({
    type: 'incrementAsync',
    amount: 10
  })
  ```

#### （2）mapActions 辅助函数

- 使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用。

  ```js
  import { mapActions } from 'vuex'
  
  export default {
    methods: {
      ...mapActions([
        'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
  
        // `mapActions` 也支持载荷：
        'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
      ]),
      ...mapActions({
        add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
      })
    }
  }
  ```

### 5）Module

- Vuex 允许我们将 store 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

  ```js
  const moduleA = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... },
    getters: { ... }
  }
  
  const moduleB = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... }
  }
  
  const store = new Vuex.Store({
    modules: {
      a: moduleA,
      b: moduleB
    }
  })
  
  store.state.a // -> moduleA 的状态
  store.state.b // -> moduleB 的状态
  ```

#### （1）局部状态

- 对于模块内部的 mutation 和 getter，接收的第一个参数是**模块的局部状态对象**。

  ```js
  const moduleA = {
    state: () => ({
      count: 0
    }),
    mutations: {
      increment (state) {
        // 这里的 `state` 对象是模块的局部状态
        state.count++
      }
    },
  
    getters: {
      doubleCount (state) {
        return state.count * 2
      }
    }
  }
  ```

- 对于模块内部的 action，局部状态通过 `context.state` 暴露出来，根节点状态则为 `context.rootState`：

  ```js
  const moduleA = {
    // ...
    actions: {
      incrementIfOddOnRootSum ({ state, commit, rootState }) {
        if ((state.count + rootState.count) % 2 === 1) {
          commit('increment')
        }
      }
    }
  }
  ```

- 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

  ```js
  const moduleA = {
    // ...
    getters: {
      sumWithRootCount (state, getters, rootState) {
        return state.count + rootState.count
      }
    }
  }
  ```

#### （2）命名空间

- 如果希望你的模块具有更高的封装度和复用性，你可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。

- 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

  ```js
  // loginModule.js
  export default {
      namespaced:true,
      state:{
          userinfo:{
              user:'',
              token:''
          }
      },
      mutations:{
          //设置用户信息
          setUser(state,payload){
              state.userinfo = payload;
          },
          //清空
          clearUser(state){
              state.userinfo={
                  user:'',
                  token:''  
              }
          }
      },
  }
  
  // index.js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import loginModule from './modules/loginModule'
  
  Vue.use(Vuex)
  
  export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
      loginModule
    }
  })
  ```

#### （3）模块动态注册

- 在 store 创建**之后**，你可以使用 `store.registerModule` 方法注册模块。

  ```js
  import Vuex from 'vuex'
  const store = new Vuex.Store({ /* 选项 */ })
  
  // 注册模块 `myModule`
  store.registerModule('myModule', {
    // ...
  })
  // 注册嵌套模块 `nested/myModule`
  store.registerModule(['nested', 'myModule'], {
    // ...
  })
  ```

- 相关方法：

  - 通过 `store.state.myModule` 和 `store.state.nested.myModule` 访问模块的状态。
  - 通过 `store.unregisterModule(moduleName)` 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。
  - 通过 `store.hasModule(moduleName)` 方法检查该模块是否已经被注册到 store。

## 3、进阶

### 1）严格模式

- 在严格模式下，无论何时发生了状态变更，只要不是由 mutation 引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

- 严格模式会深度监测状态树来检测不合规的状态变更，==请确保在发布环境下关闭严格模式，以避免性能损失。==

  ```js
  const store = new Vuex.Store({
    // ...
    strict: process.env.NODE_ENV !== 'production'
  })
  ```

### 2）表单处理

- 当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 `v-model` 会比较棘手：

  ```html
  <input v-model="obj.message">
  ```

  假设这里的 `obj` 是在计算属性中返回的一个属于 Vuex store 的对象，在用户输入时，`v-model` 会试图直接修改 `obj.message`。在严格模式中，由于这个修改不是在 mutation 函数中执行的, 这里会抛出一个错误。

- 方法是使用带有 setter 的双向绑定计算属性：

  ```js
  mutations: {
    updateMessage (state, message) {
      state.obj.message = message
    }
  }
  
  // login.vue
  <input v-model="message">
  
  computed: {
    message: {
      get () {
        return this.$store.state.obj.message
      },
      set (value) {
        this.$store.commit('updateMessage', value)
      }
    }
  }
  ```



# 二、Vue Router

## 1、基础

### 1）概述

#### （1）作用

- 把 Vue Router 添加进来，我们需要做的是，将组件 (components) 映射到路由 (routes)，然后告诉 Vue Router 在哪里渲染它们。

  ```html
  <div id="app">
    <h1>Hello App!</h1>
    <p>
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <router-link to="/foo">Go to Foo</router-link>
      <router-link to="/bar">Go to Bar</router-link>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
  ```

#### （2）定义

- 创建 router 实例，然后传 `routes` 配置。其中每个路由应该映射一个组件。

  ```js
  const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
  
  const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
  })
  
  // 4. 创建和挂载根实例。
  // 记得要通过 router 配置参数注入路由，
  // 从而让整个应用都有路由功能
  const app = new Vue({
    router
  }).$mount('#app')
  ```

- 通过注入路由器，我们可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由。

  ```js
  // Home.vue
  export default {
    computed: {
      username() {
        return this.$route.params.username
      }
    },
    methods: {
      goBack() {
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
      }
    }
  }
  ```

### 2）动态路由匹配

- 我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。

#### （1）动态路径参数

- 对于 ID 各不相同的用户，都使用 user 组件来渲染。可以在 `vue-router` 的路由路径中使用动态路径参数。

  ```js
  const User = {
    template: '<div>User</div>'
  }
  
  const router = new VueRouter({
    routes: [
      // 动态路径参数 以冒号开头
      { path: '/user/:id', component: User }
    ]
  })
  ```

- 路径参数”使用冒号 `:` 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.params`，可以在每个组件内使用。

  ```js
  const User = {
    template: '<div>User {{ $route.params.id }}</div>'
  }
  ```

- 路由中设置多段“路径参数”，对应的值都会设置到 `$route.params` 中。

  | 模式                          | 匹配路径            | $route.params                          |
  | ----------------------------- | ------------------- | -------------------------------------- |
  | /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
  | /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

#### （2）响应路由参数的变化

- ==路由参数由 `/user/foo` 导航到 `/user/bar`，原来的组件实例不会被销毁再创建，而是直接被复用。**这也意味着组件的生命周期钩子不会再被调用**。==

- 复用组件时，想对路由参数的变化作出响应，简单地 watch (监测变化) `$route` 对象：

  ```js
  const User = {
    template: '...',
    watch: {
      $route(to, from) {
        // 对路由变化作出响应...
      }
    }
  }
  ```

  或者使用  `beforeRouteUpdate`  导航守卫

  ```js
  const User = {
    template: '...',
    beforeRouteUpdate(to, from, next) {
      // react to route changes...
      // don't forget to call next()
    }
  }
  ```

#### （3）匹配优先级

- 同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：路由定义得越早，优先级就越高。

#### （4）捕获所有路由或 404

- 常规参数只会匹配被 `/` 分隔的 URL 片段中的字符。如果想匹配**任意路径**，我们可以使用通配符 (`*`)：

  ```js
  {
    // 会匹配所有路径
    path: '*'
  }
  {
    // 会匹配以 `/user-` 开头的任意路径
    path: '/user-*'
  }
  ```

### 3）嵌套路由

- **以 `/` 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。**

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/user/:id',
        component: User,
        children: [
          {
            // 当 /user/:id/profile 匹配成功，
            // UserProfile 会被渲染在 User 的 <router-view> 中
            path: 'profile',
            component: UserProfile
          },
          {
            // 当 /user/:id/posts 匹配成功
            // UserPosts 会被渲染在 User 的 <router-view> 中
            path: 'posts',
            component: UserPosts
          }
        ]
      }
    ]
  })
  ```

- ==访问 `/user/foo` 时，`User` 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：==

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/user/:id',
        component: User,
        children: [
          // 当 /user/:id 匹配成功，
          // UserHome 会被渲染在 User 的 <router-view> 中
          { path: '', component: UserHome }
  
          // ...其他子路由
        ]
      }
    ]
  })
  ```

### 4）编程式导航

#### （1）router.push

- 当你点击 `<router-link>` 时，这个方法会在内部调用，所以说，点击 `<router-link :to="...">` 等同于调用 `router.push(...)`。

  |          声明式           |       编程式       |
  | :-----------------------: | :----------------: |
  | `<router-link :to="...">` | `router.push(...)` |

- 参数可以是一个字符串路径，或者一个描述地址的对象。

  ```js
  // 字符串
  router.push('home')
  
  // 对象
  router.push({ path: 'home' })
  
  // 命名的路由
  router.push({ name: 'user', params: { userId: '123' }})
  
  // 带查询参数，变成 /register?plan=private
  router.push({ path: 'register', query: { plan: 'private' }})
  ```

- **注意：如果提供了 `path`，`params` 会被忽略，需要提供路由的 `name` 或手写完整的带有参数的 `path`：**

  ```js
  const userId = '123'
  router.push({ name: 'user', params: { userId }}) // -> /user/123
  router.push({ path: `/user/${userId}` }) // -> /user/123
  // 这里的 params 不生效
  router.push({ path: '/user', params: { userId }}) // -> /user
  ```

#### （2）router.replace

- 跟 `router.push` 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

  |              声明式               |        编程式         |
  | :-------------------------------: | :-------------------: |
  | `<router-link :to="..." replace>` | `router.replace(...)` |

#### （3）router.go

- 这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。

  ```js
  // 在浏览器记录中前进一步，等同于 history.forward()
  router.go(1)
  
  // 后退一步记录，等同于 history.back()
  router.go(-1)
  
  // 前进 3 步记录
  router.go(3)
  
  // 如果 history 记录不够用，那就默默地失败呗
  router.go(-100)
  ```

### 5）命名路由

- 可以在创建 Router 实例的时候，在 `routes` 配置中给某个路由设置名称。

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/user/:userId',
        name: 'user',
        component: User
      }
    ]
  })
  ```

  要链接到一个命名路由，可以给 `router-link` 的 `to` 属性传一个对象：

  ```html
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  ```

  这跟代码调用 `router.push()` 是一回事：

  ```js
  router.push({ name: 'user', params: { userId: 123 } })
  ```

### 6）命名视图

- 在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default`。

  ```html
  <router-view class="view one"></router-view>
  <router-view class="view two" name="a"></router-view>
  <router-view class="view three" name="b"></router-view>
  ```

- 一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 `components` 配置 (带上 s)：

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/',
        components: {
          default: Foo,
          a: Bar,
          b: Baz
        }
      }
    ]
  })
  ```

### 7）重定向

- 通过 `routes` 配置来完成，下面例子是从 `/a` 重定向到 `/b`：

  ```js
  const router = new VueRouter({
    routes: [
      { path: '/a', redirect: '/b' }
    ]
  })
  ```

- 重定向的目标也可以是一个命名的路由：

  ```js
  const router = new VueRouter({
    routes: [
      { path: '/a', redirect: { name: 'foo' }}
    ]
  })
  ```

### 8）History

- `vue-router` 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

- 如果不想要很丑的 hash，我们可以用路由的 **history 模式**，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。

  ```js
  const router = new VueRouter({
    mode: 'history',
    routes: [...]
  })
  ```

## 2、进阶

### 1）导航守卫

#### （1）全局前置守卫

- 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**。

  ```js
  const router = new VueRouter({ ... })
  
  router.beforeEach((to, from, next) => {
    // ...
  })
  ```

- **`next: Function`**: 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 `next` 方法的调用参数。

  - **`next()`**: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - **`next(false)`**: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - **`next('/')` 或者 `next({ path: '/' })`**: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
  - **`next(error)`**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://v3.router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

- 场景1：==用户未能验证身份时重定向到 `/login` 的示例：==

  ```js
  // BAD
  router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    // 如果用户未能验证身份，则 `next` 会被调用两次
    next()
  })
  ```

#### （2）路由独享守卫

- 可以在路由配置上直接定义 `beforeEnter` 守卫：

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/foo',
        component: Foo,
        beforeEnter: (to, from, next) => {
          // ...
        }
      }
    ]
  })
  ```

#### （3）组件内守卫

- 在路由组件内直接定义以下路由导航守卫：

  ```js
  const Foo = {
    template: `...`,
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    }
  }
  ```

- 场景2：==离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 `next(false)` 来取消。==

  ```js
  beforeRouteLeave (to, from, next) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
  ```

#### （4）导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 2）路由元信息

- 定义路由的时候可以配置 `meta` 字段，遍历 `$route.matched` 来检查路由记录中的 `meta` 字段。

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: '/foo',
        component: Foo,
        children: [
          {
            path: 'bar',
            component: Bar,
            // a meta field
            meta: { requiresAuth: true }
          }
        ]
      }
    ]
  })
  ```

### 3）过渡动效

#### （1）全局路由过渡

- `<router-view>` 是基本的动态组件，所以我们可以用 `<transition>` 组件给它添加一些过渡效果：

  ```html
  <transition>
    <router-view></router-view>
  </transition>
  ```

#### （2）单个路由过渡

- 让每个路由组件有各自的过渡效果，可以在各路由组件内使用 `<transition>` 并设置不同的 name。

  ```js
  const Foo = {
    template: `
      <transition name="slide">
        <div class="foo">...</div>
      </transition>
    `
  }
  
  const Bar = {
    template: `
      <transition name="fade">
        <div class="bar">...</div>
      </transition>
    `
  }
  ```

#### （3）基于路由的动态过渡

- 可以基于当前路由与目标路由的变化关系，动态设置过渡效果：

  ```html
  <!-- 使用动态的 transition name -->
  <transition :name="transitionName">
    <router-view></router-view>
  </transition>
  
  // 接着在父组件内
  // watch $route 决定使用哪种过渡
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
  ```

### 4）滚动行为

- 切换到新路由时，想要页面滚到顶部或者是保持原先的滚动位置， `vue-router` 可以自定义路由切换时页面如何滚动。

- 当创建一个 Router 实例，你可以提供一个 `scrollBehavior` 方法：

  - 第三个参数 `savedPosition` 当且仅当 `popstate` 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

  ```js
  const router = new VueRouter({
    routes: [...],
    scrollBehavior (to, from, savedPosition) {
      // return 期望滚动到哪个的位置
    }
  })
  ```

- 场景3：简单滚回顶部

  ```js
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
  ```

#### （1）异步滚动

- 可以返回一个 Promise 来得出预期的位置描述：

  ```js
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 500)
    })
  }
  ```

#### （2）平滑滚动

- 将 `behavior` 选项添加到 `scrollBehavior` 内部返回的对象中，就可以启用原生平滑滚动：

  ```js
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      }
    }
  }
  ```

### 5）导航故障

- *导航故障*是一个 `Error` 实例，附带了一些额外的属性。

- 检查一个错误是否来自于路由器，可以使用 `isNavigationFailure` 函数：

  - 如果你忽略第二个参数：`isNavigationFailure(failure)`，那么就只会检查这个错误是不是一个*导航故障*。

  ```js
  import VueRouter from 'vue-router'
  const { isNavigationFailure, NavigationFailureType } = VueRouter
  
  // 正在尝试访问 admin 页面
  router.push('/admin').catch(failure => {
    if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
      // 向用户显示一个小通知
      showToast('Login in order to access the admin panel')
    }
  })
  ```

#### （1）故障类型

`NavigationFailureType` 可以帮助开发者来区分不同类型的*导航故障*。有四种不同的类型：

- `redirected`：在导航守卫中调用了 `next(newLocation)` 重定向到了其他地方。
- `aborted`：在导航守卫中调用了 `next(false)` 中断了本次导航。
- `cancelled`：在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
- `duplicated`：导航被阻止，因为我们已经在目标位置了。

#### （2）故障属性

- 所有的导航故障都会有 `to` 和 `from` 属性，分别用来表达这次失败的导航的目标位置和当前位置。

  ```js
  // 正在尝试访问 admin 页面
  router.push('/admin').catch(failure => {
    if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
      failure.to.path // '/admin'
      failure.from.path // '/'
    }
  })
  ```


  

  ## 1、ES6

### 1）基本语法

#### （1）let 声明变量

1. 不能重复声明，防止命名污染
2. 块级作用域，但不影响作用域链

```javascript
{
    let school = 'Halo';
    function fn(){
        console.log(school);
    }
    fn();
}
```

3. 不存在变量提升

#### （2）const 声明常量

1. 必须赋初始值
2. 命名使用全大写
3. 块级作用域
4. 修改数组或者对象的元素, 不会报错

```javascript
	const TEAM = ['UZI','MXLG','Ming','Letme'];
	TEAM.push('Meiko');
```

#### （3）模板字符串

1. 内容中可以直接出现换行符

   ```javascript
   	let str = `<ul>
                <li>沈腾</li>
                <li>艾伦</li>
                </ul>`;
   ```

2. 变量拼接

   ```javascript
   		let lovest = '魏翔';
           let out = `${lovest}是我心目中最搞笑的演员!!`;
           console.log(out);
   ```

#### （4）变量解构赋值

- ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构赋值。

##### 【1】数组的解构赋值

	//数组的解构赋值
	const arr = ['张学友', '刘德华', '黎明', '郭富城'];
	let [zhang, liu, li, guo] = arr;
	console.log(zhang)		// 张学友

##### 【2】对象的解构赋值

     	//对象的解构赋值
            const zhao = {
                name: '赵本山',
                age: '不详',
                xiaopin: function(){
                    console.log("我可以演小品");
                }
            };
            
    	let {name, age, xiaopin} = zhao;
        console.log(name);
        console.log(age);
        console.log(xiaopin);
        xiaopin();

#### （5）箭头函数

##### 【1】基本语法

- 编写规范

```javascript
let fn = (a , b) => {
    return a + b ;
}
```

- this 是静态的，this 始终指向函数声明时所在作用域下的 this 的值

- 不能作为构造实例化对象

##### 【2】简写

- 省略小括号, 当形参有且只有一个的时候

```javascript
	 let add = n => {
                return n + n;
            }
```

- 省略花括号, 当代码体只有一条语句的时候, 此时 return 必须省略，而且语句的执行结果就是函数的返回值。

```javascript
	let pow = n => n * n;
```

##### 【3】应用场景

- 箭头函数适合与 this 无关的回调. 定时器, 数组的方法回调
- 箭头函数不适合与 this 有关的回调. 事件回调, 对象的方法

```javascript
 		// 从数组中返回偶数的元素
		const arr = [1,6,9,10,100,25];

        const result = arr.filter(function(item){
            if(item % 2 === 0){
                return true;
            }else{
                return false;
            }
        });
        
        const result = arr.filter(item => item % 2 === 0);
```

#### （6）参数默认值

- 形参初始值，具有默认值的参数，位置靠后。

```javascript
function add(a,b,c = 10) {
    return a + b + c;
}
```

#### （7）rest 参数

1. 用于获取函数的实参，用来代替 arguments，rest 参数必须要放到参数最后。

   ```javascript
       function fn(a,b,...args){
           console.log(a);
           console.log(b);
           console.log(args);
       }
       fn(1,2,3,4,5,6);
   ```

2. 应用于对象

   ```javascript
    		function connect({host, port, ...user}){
               console.log(host);
               console.log(port);
               console.log(user);
           }
   
           connect({
               host: '127.0.0.1',
               port: 3306,
               username: 'root',
               password: 'root',
               type: 'master'
           });
   ```

#### （8）扩展运算符

- 『 . . . 』 扩展运算符能将==『数组』或者 { 对象 }== 转换为逗号分隔的『参数序列』

1. 数组的合并

   ```javascript
    		const kuaizi = ['王太利','肖央'];
           const fenghuang = ['曾毅','玲花'];
           const zuixuanxiaopingguo = [...kuaizi, ...fenghuang];
           console.log(zuixuanxiaopingguo);
   ```

2. 数组的克隆，元素含有引用类型则为浅拷贝

   ```javascript
           const sanzhihua = ['E','G','M'];
           const sanyecao = [...sanzhihua];//  ['E','G','M']
           console.log(sanyecao);
   ```

3. 将伪数组转为真正的数组

   ```javascript
   		const divs = document.querySelectorAll('div');
           const divArr = [...divs];
           console.log(divArr);
   ```

4. 对象合并

   ```javascript
           //对象合并
           const skillOne = {
               q: '天音波'
           }
           const skillTwo = {
               w: '金钟罩'
           }
           const skillThree = {
               e: '天雷破'
           }
           const skillFour = {
               r: '猛龙摆尾'
           }
   
           const mangseng = {...skillOne, ...skillTwo, ...skillThree, ...skillFour};
           console.log(mangseng)
   ```

### 2）symbol

#### （1）概念 

1. Symbol 的值是唯一的，用来解决命名冲突的问题 ，==**遇到唯一性的场景时要想到** **Symbol**==

2. Symbol 值不能与其他数据进行运算，但是可以显示转为字符串，不能转为数字

   ```javascript
   let s = Symbol(666)
   console.log( String(s) )	// 输出 Symbol(666)
   ```

#### （2）定义

1. 添加标识的 symbol，标识只是为了便于开发，并不是 Symbol 的值，此方法返回的结果 不固定

   ```javascript
   	 	let s2 = Symbol('尚硅谷');
           let s3 = Symbol('尚硅谷');
   ```

2. 使用 symbol . for，此方法返回的结果 固定

   ```javascript
   		let s4 = Symbol.for('尚硅谷');
   ```

3. Symbol. prototype. description 可以获取描述字符串

   ```javascript
           //创建 Symbol
           let s = Symbol('尚硅谷');
           console.log(s.description);
   ```

#### （3）应用场景

##### 【1】定义颜色值

```javascript
// 使用symbol定义几个颜色值
const COLOR_RED = Symbol('red')
const COLOR_GREEN = Symbol('green')
const COLOR_PINK = Symbol('pink')
 
// 封装方法，对颜色值进行判断
function getColor(color) {
    switch (color) {
        case COLOR_RED:
            return '红色'
        case COLOR_GREEN:
            return '绿色'
        case COLOR_PINK:
            return '粉色'
        default:
            return '未知色'
    }
}
 
console.log(getColor(COLOR_RED));
```

##### 【2】定义对象的唯一属性名

 ==这类属性不会被 Object.keys 或者 for...in 遍历到，不能被 JSON . stringfy() 序列化，起到保护隐私属性的作用==

```javascript
let a = {
    name:'zhangShan',
    [ Symbol('password') ]:'123456'
    [ Symbol('red') ]:function(){
        console.log("this is red")
    }
}

console.log( a[s] )		// 输出对象a的属性s的值
```

### 3）迭代器

#### （1）概念

- 一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

- ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费。

  a) Array 

  b) Arguments 

  c) Set 

  d) Map 

  e) String 

  f) TypedArray 

  g) NodeList

- ==for...in...保存的是键名，for...of...保存的是键值。==

  ```javascript
  for( let v of xiyou ){
      console.log(v);
  }
  ```

#### （2）自定义

```javascript
  //声明一个对象
        const banji = {
            name: "终极一班",
            stus: [
                'xiaoming',
                'xiaoning',
                'xiaotian',
                'knight'
            ],
            [Symbol.iterator]() {
                //索引变量
                let index = 0;
                //
                let _this = this;
                return {
                    next: function () {
                        if (index < _this.stus.length) {
                            const result = { value: _this.stus[index], done: false };
                            //下标自增
                            index++;
                            //返回结果
                            return result;
                        }else{
                            return {value: undefined, done: true};
                        }
                    }
                };
            }
        }

        //遍历这个对象 
        for (let v of banji) {
            console.log(v);
        }
```

### 4）生成器

#### （1）概念

- 异步编程解决方案，起到延时加载任务的作用，语法行为与传统函数完全不同 。

- 代码说明： 

  1) * 的位置没有限制。 

  2) 生成器函数返回的结果是迭代器对象，调用迭代器对象的 next 方法可以得到 yield 语句后的值。

  3) yield 相当于函数的暂停标记，也可以认为是函数的分隔符，每调用一次 next 方法，执行一段代码。 

  4) next 方法可以传递实参，作为上一个 yield 语句的返回值。

#### （2）语法

```javascript
	//函数代码的分隔符
        function * gen(){
            // console.log(111);
            yield '一只没有耳朵';
            // console.log(222);
            yield '一只没有尾部';
            // console.log(333);
            yield '真奇怪';
            // console.log(444);
        }

        let iterator = gen();
		gen().next();
       
        //遍历
        for(let v of gen()){
            console.log(v);		// 每次返回的结果为 yield 语句后的字符串
        }
```

#### （3）应用场景

##### 【1】定时器套娃

```javascript
	// 1s 后控制台输出 111  2s后输出 222  3s后输出 333 
   	// 回调地狱
        // setTimeout(() => {
        //     console.log(111);
        //     setTimeout(() => {
        //         console.log(222);
        //         setTimeout(() => {
        //             console.log(333);
        //         }, 3000);
        //     }, 2000);
        // }, 1000);

        function one(){
            setTimeout(()=>{
                console.log(111);
                iterator.next();
            },1000)
        }

        function two(){
            setTimeout(()=>{
                console.log(222);
                iterator.next();
            },2000)
        }

        function three(){
            setTimeout(()=>{
                console.log(333);
                iterator.next();
            },3000)
        }

        function * gen(){
            yield one();
            yield two();
            yield three();
        }

        //调用生成器函数
        let iterator = gen();
        iterator.next();
```

### 5）Promise函数

#### （1）概念

- Promise 是 js 中进行异步编程的新解决方案。
- Promise 对象用于封装一个异步操作并获取其成功 / 失败的结果值。

- ==支持链式调用，可以解决回调地狱的问题。==

#### （2）编码流程 

```javascript
	 const p = new Promise((resolve, reject) => {
                setTimeout(() => {
                    //获取从1 - 100的一个随机数
                    let n = rand(1, 100);
                    //判断
                    if(n <= 30){
                        resolve(n); // 将 promise 对象的状态设置为 『成功』
                    }else{
                        reject(n); // 将 promise 对象的状态设置为 『失败』
                    }
                }, 1000);
            });

            console.log(p);
            //调用 then 方法
            // value 值
            // reason 理由
            p.then((value) => {
                alert('恭喜恭喜, 奖品为 10万 RMB 劳斯莱斯优惠券, 您的中奖数字为 ' + value);
            }, (reason) => {
                alert('再接再厉, 您的号码为 ' + reason);
            });
```

#### （3）对象属性

##### 【1】状态属性 PromiseState

- pending	 未知的
- resolved     成功，结果数据称 value
- rejected     失败，结果数据称 reason

##### 【2】结果属性 PromiseResult

- 保存着异步任务 [成功 / 失败] 的结果。
- 只能由 resolved 或者 rejected 赋值。

#### （4）方法

##### 【1】resolve()

- 属于 Promise 函数对象的方法，不属于实例对象的方法。

- 传入的参数为 非Promise类型的对象, 则返回的结果为成功promise对象
- 传入的参数为 Promise 对象, 则参数的结果决定了 resolve 的结果

```javascript
 let p1 = Promise.resolve(521);
        //如果传入的参数为 非Promise类型的对象, 则返回的结果为成功promise对象
        //如果传入的参数为 Promise 对象, 则参数的结果决定了 resolve 的结果
        let p2 = Promise.resolve(new Promise((resolve, reject) => {
            // resolve('OK');
            reject('Error');
        }));
        p2.catch(reason => {
            console.log(reason);
        })
```

##### 【2】reject()

- 属于 Promise 函数对象的方法，不属于实例对象的方法。
- 无论参数是什么，永远返回一个失败的 promise 对象。

##### 【3】all()

- promises: 包含 n 个 promise 的数组
- 返回一个新的 promise
  - 只有所有的 promise 都成功才成功, 结果为所有  promise 对象 成功的结果所组成的数组。
  - 只要有一个失败了就直接失败，结果为该  promise 对象 失败的结果。

```javascript
 	    let p1 = new Promise((resolve, reject) => {
            resolve('OK');
        })
        
        // let p2 = Promise.resolve('Success');
        let p2 = Promise.reject('Error');
        let p3 = Promise.resolve('Oh Yeah');
        
        const result = Promise.all([p1, p2, p3]);
        console.log(result);
```

##### 【4】race()

- promises: 包含 n 个 promise 的数组

- 返回一个新的 promise，由第一个完成的 promise 的结果状态就是最终的结果状态

```javascript
		let p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        })
        
        let p2 = Promise.resolve('Success');
        let p3 = Promise.resolve('Oh Yeah');

        //调用
        const result = Promise.race([p1, p2, p3]);
        console.log(result);
```

#### （5）关键问题

##### 【1】能否执行多个回调

- 当 promise 实例对象的结果状态 改变为对应状态时都会调用。

##### 【2】 promise 状态改变和指定回调函数的执行顺序

- 都有可能
  - 执行器函数为同步任务时，先改变状态再指定回调函数
  - 执行器函数为异步任务（定时器）时，先指定回调函数再改变状态。但如果 then 方法也是异步任务且延迟时间更长，则先改变状态再指定回调函数。

##### 【3】串联多个任务

1. promise 的 then()返回一个新的 promise, 可以开成 then()的链式调用
2. 通过 then 的链式调用串连多个同步/异步任务

```javascript
  	    let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            return new Promise((resolve, reject) => {
                resolve("success");
            });
        }).then(value => {
            console.log(value);         // 输出 success
        }).then(value => {
            console.log(value);         // 输出 underfined
        })
```

##### 【4】异常穿透

- 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调。前面任何操作出了异常, 都会传到最后失败的回调中处理。

```javascript
 	p.then(value => {
            // console.log(111);
            throw '失败啦!';
        }).then(value => {
            console.log(222); 
        }).then(value => {
            console.log(333);
        }).catch(reason => {
            console.warn(reason);
        });
```

##### 【5】中断 Promise 链

- 有且只有一个方式，返回一个 pending 状态的 Promise 实例对象

```javascript
 	p.then(value => {
            console.log(111);
            return new Promise(() => {});       // 中断 Promise 链条
        }).then(value => {
            console.log(222);
        }).catch(reason => {
            console.warn(reason);
        });
```

### 6）async 函数

#### （1）概述

- async 与 await 结合，可以让异步代码像同步代码一样。

#### （2）async 函数

- 返回值不是 promise 对象，则返回结果的 Promise 对象 PromiseState 为 true，PromiseResult 为返回值。

- 返回值是 promise 对象，函数的返回结果与该对象一致。

#### （3）await 语句

- await 必须写在 async 函数中，await 右侧的表达式一般为 promise 对象。
- 如果表达式是 promise 对象, await 返回的是 promise 成功的值 。
- 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理。

```javascript
 // await 要放在 async 函数中.
        async function main() {
            try {
                let result = await new Promise((resolve, reject) => {
                    // resolve("用户数据");
                    reject("失败啦!");
                });
                console.log(result);
            } catch (e) {
                console.log(e);
            }
        }
```

#### （4）应用场景

1. 读取文件

   ```javascript
   //1. 引入 fs 模块
   const fs = require("fs");
   
   //读取『为学』
   function readWeiXue() {
       return new Promise((resolve, reject) => {
           fs.readFile("./resources/为学.md", (err, data) => {
               //如果失败
               if (err) reject(err);
               //如果成功
               resolve(data);
           })
       })
   }
   
   function readGuanShu() {
       return new Promise((resolve, reject) => {
           fs.readFile("./resources/观书有感.md", (err, data) => {
               //如果失败
               if (err) reject(err);
               //如果成功
               resolve(data);
           })
       })
   }
   
   //声明一个 async 函数
   async function main(){
       //获取为学内容
       let weixue = await readWeiXue();
       // 获取观书有感
       let guanshu = await readGuanShu();
   
       console.log(weixue.toString());
       console.log(guanshu.toString());
   }
   ```

2. 封装 AJAX 请求

   ```javascript
     // 发送 AJAX 请求, 返回的结果是 Promise 对象
           function sendAJAX(url) {
               return new Promise((resolve, reject) => {
                   //1. 创建对象
                   const x = new XMLHttpRequest();
                   //2. 初始化
                   x.open('GET', url);
                   //3. 发送
                   x.send();
                   //4. 事件绑定
                   x.onreadystatechange = function () {
                       if (x.readyState === 4) {
                           if (x.status >= 200 && x.status < 300) {
                               //成功啦
                               resolve(x.response);
                           }else{
                               //如果失败
                               reject(x.status);
                           }
                       }
                   }
               })
           }
     
           // async 与 await 测试  axios
           async function main(){
               //发送 AJAX 请求
               let result = await sendAJAX("https://api.apiopen.top/getJoke");
               console.log(tianqi);
           }
   ```

### 7）axios 函数

#### （1）基本使用

```javascript
 	//添加一篇新的文章
        btns[1].onclick = function(){
            //发送 AJAX 请求
            axios({
                //请求类型
                method: 'POST',
                //URL
                url: 'http://localhost:3000/posts',
                //设置请求体
                data: {
                    title: "今天天气不错, 还挺风和日丽的",
                    author: "张三"
                }
            }).then(response => {
                console.log(response);
            });
        }
```

#### （2）默认配置

```javascript
 //默认配置
        axios.defaults.method = 'GET';//设置默认的请求类型为 GET
        axios.defaults.baseURL = 'http://localhost:3000';//设置基础 URL
        axios.defaults.params = {id:100};
        axios.defaults.timeout = 3000;//

        btns[0].onclick = function(){
            axios({
                url: '/posts'
            }).then(response => {
                console.log(response);
            })
        }
```

#### （3）拦截器

1. 请求拦截器

   ```javascript
    // 设置请求拦截器  config 配置对象
           axios.interceptors.request.use(function (config) {
               console.log('请求拦截器 成功 - 1号');
               //修改 config 中的参数
               config.params = {a:100};
               return config;
           }, function (error) {
               console.log('请求拦截器 失败 - 1号');
               return Promise.reject(error);
           });
   
           axios.interceptors.request.use(function (config) {
               console.log('请求拦截器 成功 - 2号');
               //修改 config 中的参数
               config.timeout = 2000;
               return config;
           }, function (error) {
               console.log('请求拦截器 失败 - 2号');
               return Promise.reject(error);
           });
   ```

2. 响应拦截器

   ```javascript
     // 设置响应拦截器
           axios.interceptors.response.use(function (response) {
               console.log('响应拦截器 成功 1号');
               return response.data;
               // return response;
           }, function (error) {
               console.log('响应拦截器 失败 1号')
               return Promise.reject(error);
           });
   
           axios.interceptors.response.use(function (response) {
               console.log('响应拦截器 成功 2号')
               return response;
           }, function (error) {
               console.log('响应拦截器 失败 2号')
               return Promise.reject(error);
           });
   ```

### 8）数据结构

#### （1）Set 集合

- 类似于数组，元素的值唯一，创建时自动去重

- 本质是一个对象，实现了 iterator 接口

- 属性方法

  |  方法  |                    含义                     |
  | :----: | :-----------------------------------------: |
  |  size  |             返回集合的元素个数              |
  |  add   |        增加一个新元素，返回当前集合         |
  | delete |          删除元素，返回 boolean 值          |
  |  has   | 检测集合中是否包含某个元素，返回 boolean 值 |
  | clear  |          清空集合，返回 undefined           |

- 运算

  1. 数组去重

  ```javas
          let result = [...new Set(arr)];
          console.log(result);
  ```

  2. 交集

  ```javascript
  		let arr = [1,2,3,4,5,4,3,2,1];
          let arr2 = [4,5,6,5,6];
          let result = [...new Set(arr)].filter(item => new Set(arr2).has(item));
  ```

  3. 并集

  ```javascript
  	  let union = [...new Set([...arr, ...arr2])];
        console.log(union);
  ```

  4. 差集

  ```javascript
  	let diff = [...new Set(arr)].filter(item => !(new Set(arr2).has(item)));
      console.log(diff);
  ```

#### （2）Map

- 类似于对象，也是键值对的集合。

- ==Object.entries 可以结合使用== 

  ```javascript
  		//声明对象
          const school = {
              name:"尚硅谷",
              cities:['北京','上海','深圳'],
              xueke: ['前端','Java','大数据','运维']
          };
  
          // 创建 Map
          const m = new Map(Object.entries(school));
          console.log(m.get('cities'));
  
          // 输出 ['北京', '上海', '深圳']
  ```

- ==但是“键” 的范围不限于字符串，各种类型的值（包括对象）都可以当作键。==

- 实现了 iterator 接口，遍历时每个元素形成一个数组，每个数组有两个元素，元素1是键名，元素2是键值。

- 属性方法

  | 方法  |                     含义                     |
  | :---: | :------------------------------------------: |
  | size  |             返回 Map 的元素个数              |
  |  set  |         增加一个新元素，返回当前 Map         |
  |  get  |              返回键名对象的键值              |
  |  has  | 检测 Map 中是否包含某个元素，返回 boolean 值 |
  | clear |           清空集合，返回 undefined           |


### 9）Class 类

#### （1）构造方法

```javascript
 //class
        class Shouji{
            //构造方法 名字不能修改
            constructor(brand, price){
                this.brand = brand;
                this.price = price;
            }

            //方法必须使用该语法, 不能使用 ES5 的对象完整形式 call:function(){}
            call(){
                console.log("我可以打电话!!");
            }
        }

        let onePlus = new Shouji("1+", 1999);
        console.log(onePlus);
```

#### （2）私有属性

- ‘ # ’ 表示私有属性

  ```javascript
          class Person{
              //公有属性
              name;
              //私有属性
              #age;
              #weight;
              //构造方法
              constructor(name, age, weight){
                  this.name = name;
                  this.#age = age;
                  this.#weight = weight;
              }
          }
  ```

#### （3）静态成员

- 对于 static 标注的属性方法，属于类而不属于实例对象。

  ```javascript
   class Phone{
              //静态属性
              static name = '手机';
              static change(){
                  console.log("我可以改变世界");
              }
          }
  
          let nokia = new Phone();
          console.log(nokia.name);	// underfined
          console.log(Phone.name);	// 手机
  ```

#### （4）类继承

- 子类对父类方法的重写，只能是完全重写

```javascript
		class Phone{
            //构造方法
            constructor(brand, price){
                this.brand = brand;
                this.price = price;
            }
            //父类的成员属性
            call(){
                console.log("我可以打电话!!");
            }
        }

        class SmartPhone extends Phone {
            //构造方法
            constructor(brand, price, color, size){
                super(brand, price);// Phone.call(this, brand, price)
                this.color = color;
                this.size = size;
            }

            photo(){
                console.log("拍照");
            }

            playGame(){
                console.log("玩游戏");
            }

            // 重写父类的方法
            call(){
                console.log('我可以进行视频通话');
            }
        }

        const xiaomi = new SmartPhone('小米',799,'黑色','4.7inch');
        console.log(xiaomi);
        xiaomi.call();
        xiaomi.photo();
        xiaomi.playGame();
```

#### （5）getter 与 setter

- 设置、获取属性时，自动调用。

```javascript
 	// get 和 set  
        class Phone{
            get price(){
                console.log("价格属性被读取了");
                return 'iloveyou';
            }

            set price(newVal){
                console.log('价格属性被修改了');
            }
        }

        //实例化对象
        let s = new Phone();
        console.log(s.price);      // 输出 价格属性被读取了
        s.price = 'free';         // 输出 价格属性被修改了
```

### 10）扩展

#### （1）Numer 类

1. Number.EPSILON 是 JavaScript 表示的最小精度

   ```javascript
    function equal(a, b){
               if(Math.abs(a-b) < Number.EPSILON){
                   return true;
               }else{
                   return false;
               }
           }
           console.log(0.1 + 0.2 === 0.3);     // false
           console.log(equal(0.1 + 0.2, 0.3))  // true
   ```

2. 进制

   ```javascript
     		let b = 0b1010;
           let o = 0o777;
           let d = 100;
           let x = 0xff;
           console.log(x);
   ```

3. 属性方法

   |       方法        |                       作用                       |
   | :---------------: | :----------------------------------------------: |
   |  Number.isFinite  |             检测一个数值是否为有限数             |
   |   Number.isNaN    |              检测一个数值是否为 NaN              |
   |  Number.parseInt  |                   字符串转整数                   |
   | Number.parseFloat |                  字符串转浮点数                  |
   | Number.isInteger  |               判断一个数是否为整数               |
   |    Math.trunc     |               将数字的小数部分抹掉               |
   |     Math.sign     | 判断一个数到底为正数 负数 还是零，返回1 / -1 / 0 |

#### （2）Object 类

0. 属性方法

   |        方法        |                           作用                           |
   | :----------------: | :------------------------------------------------------: |
   |    Object.keys     |                     获取对象所有的键                     |
   |   Object.values    |                     获取对象所有的值                     |
   |   Object.entries   | 对象转数组，返回二维数组，第二层数组的元素为键名，键值。 |
   | Object.fromEntries |      数组转对象，用于创建对象，参数为二维数组或 Map      |

1. Object.is 判断两个值是否完全相等 

   ```javascript
   console.log(Object.is(120, 120));// true
   console.log(Object.is(NaN, NaN));// true
   console.log(NaN === NaN);// false
   ```

2. Object.assign 对象的合并，有相同属性时，参数2 把参数1 覆盖

   ```javascript
    		const config1 = {
               host: 'localhost',
               port: 3306,
               name: 'root',
               pass: 'root',
               test: 'test'
           };
           const config2 = {
               host: 'http://atguigu.com',
               port: 33060,
               name: 'atguigu.com',
               pass: 'iloveyou',
               test2: 'test2'
           }
           console.log(Object.assign(config1, config2));
   
   // 输出
           host: "http://atguigu.com"
           name: "atguigu.com"
           pass: "iloveyou"
           port: 33060
           test: "test"
           test2: "test2"
   ```

#### （3）数组

1. Includes 方法用来检测数组中是否包含某个元素，返回布尔类型值 

   ```javascript
           const mingzhu = ['西游记','红楼梦','三国演义','水浒传'];
           console.log(mingzhu.includes('西游记'));
           console.log(mingzhu.includes('金瓶梅'));
   ```

2. flat 方法用于数组降维，参数为深度，是一个数字

   ```javascript
           //将多维数组转化为低位数组
           const arr = [1,2,3,4,[5,6,[7,8,9]]];
           console.log(arr.flat(2));  
   ```

#### （4）字符串

- trimStart 清除左侧空白
- trimEnd 清除右侧空白

#### （5）指数操作符

- 在 ES7 中引入指数运算符「**」，用来实现幂运算，功能与 Math.pow 结果相同

  ```javascript
   		console.log(2 ** 10);
          console.log(Math.pow(2, 10));
  ```

### 11）模块化

#### （1）暴露方式

##### （1）分别暴露

```javascript
    //分别暴露
    export let school = '尚硅谷';

    export function teach() {
        console.log("我们可以教给你开发技能");
    }

	import * as m1 from "./src/js/m1.js";
```

##### （2）统一暴露

```javascript
    //统一暴露
    let school = '尚硅谷';

    function findJob(){
        console.log("我们可以帮助你找工作!!");
    }

    export {school, findJob};
```

##### （3）默认暴露

- default 是一个对象

```javascript
    //默认暴露
    export default {
        school: 'ATGUIGU',
        change: function(){
            console.log("我们可以改变你!!");
        }
    }

	import * as m3 from "./src/js/m3.js";

	m3.default.change();	// 需要添加 default
```

#### （2）导入方式

##### （1）通用导入

```javascript
	import * as m2 from "./src/js/m2.js";
```

##### （2）解构赋值形式

- 使用别名，防止命名冲突

```javascript
	import {school, teach} from "./src/js/m1.js";
	import {school as guigu, findJob} from "./src/js/m2.js";
	import {default as m3} from "./src/js/m3.js";
```

##### （3）简便形式

- 简便形式  针对默认暴露

```javascript
	import m3 from "./src/js/m3.js";
```

### 12）正则表达式

#### （1）元字符

|     类型      |   符号   |             说明             | 注解 |
| :-----------: | :------: | :--------------------------: | :--: |
|    边界符     |    ^     |         必须以谁开头         |      |
|    边界符     |    $     |         必须以谁结尾         |      |
|               |    .     | 默认匹配除换行符外的单个字符 |      |
| 大括号/原子表 |   [ ]    |         匹配其一即可         |  1   |
| 中括号/量词符 |  { n }   |          重复 n 次           |      |
| 小括号/原子组 |   （）   |            优先级            |  4   |
|    字符类     |   [^]    |             取反             |      |
|    范围符     |  [ - ]   |           范围限定           |  2   |
|    量词符     |    *     |          0次及以上           |  3   |
|    量词符     |    +     |          1次及以上           |      |
|    量词符     |    ？    |           0次及1次           |      |
|    量词符     | { n , }  |       重复 n 次及以上        |      |
|    量词符     | { n , m} |       重复 n 次到 m 次       |      |

1. [] 表示有一系列字符可以选择，匹配其一即可

   ```javascript
   let rg = /[abc]/;
   console.log(rg.test('andy'));	// true
   ```

2. 字符组合，大小写字母、数字、短杆、下划线都可以

   ```javascript
   let rg = /^[a-zA-Z0-9_-]$/
   ```

3. 量词符 *

   ```javascript
   let reg = /^a*$/
   console.log(reg.test(''))		// true
   console.log(reg.test('a'))		// true
   console.log(reg.test('aaaa'))	// true
   ```

4. （）表示优先级

   ```javascript
   let reg = /^(abc){3}$/;
   console.log(reg.test('abccc'))	// false
   console.log(reg.test('abcabcabc'))	// true
   ```

#### （2）预定义类

| 预定义类 |                             说明                             |
| :------: | :----------------------------------------------------------: |
|   \ d    |                        相当于[ 0-9 ]                         |
|   \ D    |                        相当于[ ^0-9 ]                        |
|   \ w    |                     相当于[ a-zA-Z0-9_ ]                     |
|   \ W    |                    相当于[ ^a-zA-Z0-9_ ]                     |
|   \ s    | 匹配空格（换行符、制表符、空格符），相当于[ \t \r \n \v \f ] |
|   \ S    |                        相当于 \s 取反                        |

#### （3）方法

1. replace 替换，参数1是正则表达式，参数2是替换为的字符串

   ```javas
   let str = 'andy和red';
   let newStr = str.replace(/andy/,'baby');	// baby和red
   ```

2. test 匹配，返回 true 或者 false

3. exec 捕获，返回 Array 或者 null

#### （4）参数

- g：全局匹配

- i：忽略大小写

- gi：全局匹配并且忽略大小写

- m：多行搜索模式

- s：使 . 能够匹配换行符

  ```javascript
  let reg = /^(abc){3}$/g;
  ```