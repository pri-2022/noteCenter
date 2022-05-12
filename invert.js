## 1、概述

- 教程文档：[简介 · TypeScript 入门教程 (xcatliu.com)](https://ts.xcatliu.com/introduction/index.html)

### 1）类型系统

- 类型系统按照「类型检查的时机」来分类，可以分为动态类型和静态类型。
- 动态类型是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误。JavaScript 是一门解释型语言，没有编译阶段，所以它是动态类型。
- 静态类型是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查。

#### （1）JavaScript 动态类型

- 没有类型约束，一个变量可能初始化时是字符串，过一会儿又被赋值为数字。
- 由于隐式类型转换的存在，有的变量的类型很难在运行前就确定。
- 基于原型的面向对象编程，使得原型上的属性或方法可以在运行时被修改。

#### （2）TypeScript 静态类型

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- TypeScript 是一门静态类型、弱类型的语言。
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。

### 2）设计理念

- 在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型系统来提高代码的可维护性，减少可能出现的 bug。

## 2、基础

### 1）原始数据类型

#### （1）布尔值

- 在 TypeScript 中，使用 `boolean` 定义布尔值类型。

  ```javascript
  let isDone: boolean = false;
  ```

- 注意，使用构造函数 `Boolean` 创造的对象**不是**布尔值,而是一个 `Boolean` 对象。

  ```javascript
  let createdByNewBoolean: Boolean = new Boolean(1);
  ```

#### （2）数值

- 使用 `number` 定义数值类型。

  - 其中 `0b1010` 和 `0o744` 是 ES6 中的二进制和八进制表示法，它们会被编译为十进制数字。

  ```javascript
  let decLiteral: number = 6;
  let hexLiteral: number = 0xf00d;
  // ES6 中的二进制表示法
  let binaryLiteral: number = 0b1010;
  // ES6 中的八进制表示法
  let octalLiteral: number = 0o744;
  let notANumber: number = NaN;
  let infinityNumber: number = Infinity;
  
  ---编译结果：
  
  var decLiteral = 6;
  var hexLiteral = 0xf00d;
  // ES6 中的二进制表示法
  var binaryLiteral = 10;
  // ES6 中的八进制表示法
  var octalLiteral = 484;
  var notANumber = NaN;
  var infinityNumber = Infinity;
  ```

#### （3）字符串

- 使用 `string` 定义字符串类型

  ```javascript
  let myName: string = 'Tom';
  let myAge: number = 25;
  // 模板字符串
  let sentence: string = `Hello, my name is ${myName}. I'll be ${myAge + 1} years old next month.`;
  
  ---编译结果：
  
  var myName = 'Tom';
  var myAge = 25;
  // 模板字符串
  var sentence = "Hello, my name is " + myName + ". I'll be " + (myAge + 1) + " years old next month.";
  ```

#### （4）空值

- JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数。

  ```javascript
  function alertName(): void {
      alert('My name is Tom');
  }
  ```

#### （5）null 和 undefined

- 在 TypeScript 中，可以使用 `null` 和 `undefined` 来定义这两个原始数据类型。

  ```javascript
  let u: undefined = undefined;
  let n: null = null;
  ```

- 与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量。

  ```javascript
  // 这样不会报错
  let num: number = undefined;
  ```

### 2）任意值

- 普通类型在赋值过程中改变类型是不被允许的，但如果是 `any` 类型，则允许被赋值为任意类型。

  ```javascript
  let myFavoriteNumber: any = 'seven';
  myFavoriteNumber = 7;
  ```

- 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查。

  ```javascript
  let something;
  something = 'seven';
  something = 7;
  
  something.setName('Tom');
  
  ---等价于
  
  let something: any;
  something = 'seven';
  something = 7;
  
  something.setName('Tom');
  ```

### 3）类型推论

- 如果没有明确的指定类型，那么 TypeScript 会依照类型推论的规则推断出一个类型。

  ```javascript
  let myFavoriteNumber = 'seven';
  myFavoriteNumber = 7;
  // index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
  
  ---事实上，它等价于：
  
  let myFavoriteNumber: string = 'seven';
  myFavoriteNumber = 7;
  // index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
  ```

### 4）联合类型

#### （1）定义

- 联合类型（Union Types）表示取值可以为多种类型中的一种。

  ```javascript
  let myFavoriteNumber: string | number;
  myFavoriteNumber = 'seven';
  myFavoriteNumber = 7;
  // success
  
  let myFavoriteNumber: string | number;
  myFavoriteNumber = true;
  // index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
  ```

- 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型。

  ```javascript
  let myFavoriteNumber: string | number;
  myFavoriteNumber = 'seven';
  console.log(myFavoriteNumber.length); // 5
  
  myFavoriteNumber = 7;
  console.log(myFavoriteNumber.length); // 编译时报错
  // index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
  ```

#### （2）属性与方法

- 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们 **只能访问此联合类型的所有类型里共有属性或方法。**

- 例1，`length` 不是 `string` 和 `number` 的共有属性，所以会报错。

  ```javascript
  function getLength(something: string | number): number {
      return something.length;
  }
  
  // index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
  //   Property 'length' does not exist on type 'number'.
  ```

- 例2，访问 `string` 和 `number` 的共有属性是没问题的。

  ```javascript
  function getString(something: string | number): string {
      return something.toString();
  }
  ```

### 5）接口

#### （1）定义

- 在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

- 定义的变量比接口多了或者少了一些属性都是不允许的。

  ```javascript
  interface Person {
      name: string;
      age: number;
  }
  
  let tom: Person = {
      name: 'Tom',
      age: 25
  };
  ```

#### （2）可选属性

- 可选属性的含义是该属性可以不存在。

  ```javascript
  interface Person {
      name: string;
      age?: number;
  }
  
  let tom: Person = {
      name: 'Tom'
  };
  ```

- 这时**仍然不允许添加未定义的属性**。

  ```javascript
  interface Person {
      name: string;
      age?: number;
  }
  
  let tom: Person = {
      name: 'Tom',
      age: 25,
      gender: 'male'
  };
      
  //   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
  ```

#### （3）任意属性

- 接口允许有任意的属性，可以使用如下方式。

  ```javascript
  interface Person {
      name: string;
      age?: number;
      [propName: string]: any;
  }
  
  let tom: Person = {
      name: 'Tom',
      gender: 'male'
  };
  ```

- **定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**。

  ```javascript
  interface Person {
      name: string;
      age?: number;
      [propName: string]: string;
  }
  
  let tom: Person = {
      name: 'Tom',
      age: 25,
      gender: 'male'
  };
  
  // index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
  // Index signatures are incompatible.
  // Type 'string | number' is not assignable to type 'string'.
  // Type 'number' is not assignable to type 'string'.
  ```

- 一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型。

  ```javascript
  interface Person {
      name: string;
      age?: number;
      [propName: string]: string | number;
  }
  
  let tom: Person = {
      name: 'Tom',
      age: 25,
      gender: 'male'
  };
  ```

#### （4）只读属性

- 有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性。

  ```javascript
  interface Person {
      readonly id: number;
      name: string;
      age?: number;
      [propName: string]: any;
  }
  
  let tom: Person = {
      id: 89757,
      name: 'Tom',
      gender: 'male'
  };
  
  tom.id = 9527;
  
  // index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
  ```

### 6）数组类型

#### （1）「类型 + 方括号」

- 最简单的方法是使用「类型 + 方括号」来表示数组，数组的项中**不允许**出现其他的类型。

  ```ts
  let fibonacci: number[] = [1, 1, 2, 3, 5];
  // success
  
  let fibonacci: number[] = [1, '1', 2, 3, 5];
  // Type 'string' is not assignable to type 'number'.
  ```

- 数组的一些方法的参数也会根据数组在定义时约定的类型进行限制。

  ```ts
  let fibonacci: number[] = [1, 1, 2, 3, 5];
  fibonacci.push('8');
  // Argument of type '"8"' is not assignable to parameter of type 'number'.
  ```

#### （2）数组泛型

- 我们也可以使用数组泛型（Array Generic） `Array<elemType>` 来表示数组：

  ```ts
  let fibonacci: Array<number> = [1, 1, 2, 3, 5];
  ```

#### （3）接口表示数组

- 虽然接口也可以用来描述数组，但是我们一般不会这么做，因为这种方式比前两种方式复杂多了。不过有一种情况例外，那就是它常用来表示类数组。

  ```ts
  interface NumberArray {
      [index: number]: number;
  }
  let fibonacci: NumberArray = [1, 1, 2, 3, 5];
  ```

#### （4）any 在数组中的应用

- ==一个比较常见的做法是，用 `any` 表示数组中允许出现任意类型==

  ```javascript
  let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
  ```

### 7）函数类型

#### （1）函数声明

- 一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到。

  ```ts
  function sum(x: number, y: number): number {
      return x + y;
  }
  ```

#### （2）函数表达式

- 在 TypeScript 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

  ```tsx
  let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
      return x + y;
  };
  ```

#### （3）可选参数

- 可选参数后面不允许再出现必需参数。

  ```ts
  function buildName(firstName: string, lastName?: string) {
      if (lastName) {
          return firstName + ' ' + lastName;
      } else {
          return firstName;
      }
  }
  let tomcat = buildName('Tom', 'Cat');
  let tom = buildName('Tom');
  ```

#### （4）参数默认值

- 在 ES6 中，我们允许给函数的参数添加默认值，**TypeScript 会将添加了默认值的参数识别为可选参数**。

  ```ts
  function buildName(firstName: string, lastName: string = 'Cat') {
      return firstName + ' ' + lastName;
  }
  let tomcat = buildName('Tom', 'Cat');
  let tom = buildName('Tom');
  ```

- 此时就不受「可选参数必须接在必需参数后面」的限制。

  ```ts
  function buildName(firstName: string = 'Tom', lastName: string) {
      return firstName + ' ' + lastName;
  }
  let tomcat = buildName('Tom', 'Cat');
  let cat = buildName(undefined, 'Cat');
  ```

#### （5）剩余参数

- ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数（rest 参数）

  ```js
  function push(array, ...items) {
      items.forEach(function(item) {
          array.push(item);
      });
  }
  
  let a: any[] = [];
  push(a, 1, 2, 3);
  ```

- 事实上，`items` 是一个数组。所以我们可以用数组的类型来定义它。

  ```ts
  function push(array: any[], ...items: any[]) {
      items.forEach(function(item) {
          array.push(item);
      });
  }
  
  let a = [];
  push(a, 1, 2, 3);
  ```

#### （6）重载

- 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

  ```tsx
  function reverse(x: number): number;
  function reverse(x: string): string;
  function reverse(x: number | string): number | string | void {
      if (typeof x === 'number') {
          return Number(x.toString().split('').reverse().join(''));
      } else if (typeof x === 'string') {
          return x.split('').reverse().join('');
      }
  }
  ```

- 上例中，我们重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

- 注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

### 8）类型断言

#### （1）语法

```ts
值 as 类型

或

<类型>值
```

#### （2）用途

##### 【1】联合类型断言为类型

- 有时候，我们确实需要在还不确定类型的时候就访问其中一个类型特有的属性或方法，如下获取 `animal.swim` 的时候会报错。

  ```ts
  interface Cat {
      name: string;
      run(): void;
  }
  interface Fish {
      name: string;
      swim(): void;
  }
  
  function isFish(animal: Cat | Fish) {
      if (typeof animal.swim === 'function') {
          return true;
      }
      return false;
  }
  
  // index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
  //   Property 'swim' does not exist on type 'Cat'.
  ```

- 此时可以使用类型断言，将 `animal` 断言成 `Fish`。

  ```ts
  interface Cat {
      name: string;
      run(): void;
  }
  interface Fish {
      name: string;
      swim(): void;
  }
  
  function isFish(animal: Cat | Fish) {
      if (typeof (animal as Fish).swim === 'function') {
          return true;
      }
      return false;
  }
  ```

##### 【2】父类断言为子类

- 当类之间有继承关系时，类型断言也是很常见。

  ```ts
  class ApiError extends Error {
      code: number = 0;
  }
  class HttpError extends Error {
      statusCode: number = 200;
  }
  
  function isApiError(error: Error) {
      if (typeof (error as ApiError).code === 'number') {
          return true;
      }
      return false;
  }
  ```

- 上面的例子中，我们声明了函数 `isApiError`，它用来判断传入的参数是不是 `ApiError` 类型，为了实现这样一个函数，它的参数的类型肯定得是比较抽象的父类 `Error`，这样的话这个函数就能接受 `Error` 或它的子类作为参数了。

  但是由于父类 `Error` 中没有 `code` 属性，故直接获取 `error.code` 会报错，需要使用类型断言获取 `(error as ApiError).code`。

##### 【3】任何类型断言为 any

- 我们需要将 `window` 上添加一个属性 `foo`，但 TypeScript 编译时会报错，提示我们 `window` 上不存在 `foo` 属性。

  此时我们可以使用 `as any` 临时将 `window` 断言为 `any` 类型。

  ```ts
  window.foo = 1;
  // index.ts:1:8 - error TS2339: Property 'foo' does not exist on type 'Window & typeof globalThis'.
  
  (window as any).foo = 1;
  ```

- ==需要注意的是，将一个变量断言为 `any` 可以说是解决 TypeScript 中类型问题的最后一个手段。==

  **它极有可能掩盖了真正的类型错误，所以如果不是非常确定，就不要使用 `as any`。**

##### 【4】any断言为具体类型

- 在日常的开发中，我们不可避免的需要处理 `any` 类型的变量，它们可能是由于第三方库未能定义好自己的类型，也有可能是历史遗留的或其他人编写的烂代码，还可能是受到 TypeScript 类型系统的限制而无法精确定义类型的场景。

- 举例来说，历史遗留的代码中有个 `getCacheData`，它的返回值是 `any`：

  ```ts
  function getCacheData(key: string): any {
      return (window as any).cache[key];
  }
  ```

- 我们调用完 `getCacheData` 之后，立即将它断言为 `Cat` 类型。这样的话明确了 `tom` 的类型，后续对 `tom` 的访问时就有了代码补全，提高了代码的可维护性。

  ```javascript
  function getCacheData(key: string): any {
      return (window as any).cache[key];
  }
  
  interface Cat {
      name: string;
      run(): void;
  }
  
  const tom = getCacheData('tom') as Cat;
  tom.run();
  ```

#### （3）限制

- 要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或 `B` 兼容 `A` 即可，这也是为了在类型断言时的安全考虑，毕竟毫无根据的断言是非常危险的。

- `Cat` 包含了 `Animal` 中的所有属性，除此之外，它还有一个额外的方法 `run`。TypeScript 并不关心 `Cat` 和 `Animal` 之间定义时是什么关系，而只会看它们最终的结构有什么关系——所以它与 `Cat extends Animal` 是等价的。

  ```ts
  interface Animal {
      name: string;
  }
  interface Cat {
      name: string;
      run(): void;
  }
  
  let tom: Cat = {
      name: 'Tom',
      run: () => { console.log('run') }
  };
  let animal: Animal = tom;
  
  ---等价于
  
  interface Animal {
      name: string;
  }
  interface Cat extends Animal {
      run(): void;
  }
  ```

- 那么也不难理解为什么 `Cat` 类型的 `tom` 可以赋值给 `Animal` 类型的 `animal` 了——就像面向对象编程中我们可以将子类的实例赋值给类型为父类的变量。

  当 `Animal` 兼容 `Cat` 时，它们就可以互相进行类型断言了。

  ```ts
  interface Animal {
      name: string;
  }
  interface Cat {
      name: string;
      run(): void;
  }
  
  function testAnimal(animal: Animal) {
      return (animal as Cat);
  }
  function testCat(cat: Cat) {
      return (cat as Animal);
  }
  ```

#### （4）比较

##### 【1】断言 vs 类型转换

- 类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除。例子中，将 `something` 断言为 `boolean` 虽然可以通过编译，但是并没有什么用。

  ```ts
  function toBoolean(something: any): boolean {
      return something as boolean;
  }
  
  toBoolean(1);
  // 返回值为 1
  
  ---编译后
  
  function toBoolean(something) {
      return something;
  }
  
  toBoolean(1);
  // 返回值为 1
  ```

- 类型断言不是类型转换，它不会真的影响到变量的类型。若要进行类型转换，需要直接调用类型转换的方法：

  ```ts
  function toBoolean(something: any): boolean {
      return Boolean(something);
  }
  
  toBoolean(1);
  // 返回值为 true
  ```

##### 【2】断言 vs 类型声明

- 类型声明是比类型断言更加严格。

### 9）声明文件

- 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

### 10）内置对象

- 内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

#### （1）ECMAScript 内置对象

- ECMAScript 标准提供的内置对象有：`Boolean`、`Error`、`Date`、`RegExp` 等。

  ```js
  let b: Boolean = new Boolean(1);
  let e: Error = new Error('Error occurred');
  let d: Date = new Date();
  let r: RegExp = /[a-z]/;
  ```

#### （2）DOM、BOM 内置对象

- DOM 和 BOM 提供的内置对象有：`Document`、`HTMLElement`、`Event`、`NodeList` 等。

  ```js
  let body: HTMLElement = document.body;
  let allDiv: NodeList = document.querySelectorAll('div');
  document.addEventListener('click', function(e: MouseEvent) {
    // Do something
  });
  ```

## 3、进阶

### 1）类型别名

- 使用 `type` 创建类型别名，类型别名常用于联合类型。

  ```ts
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
      if (typeof n === 'string') {
          return n;
      } else {
          return n();
      }
  }
  ```

### 2）字符串字面量类型

- 字符串字面量类型用来约束取值只能是某几个字符串中的一个。

  ```ts
  type EventNames = 'click' | 'scroll' | 'mousemove';
  function handleEvent(ele: Element, event: EventNames) {
      // do something
  }
  
  handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
  handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'
  
  // index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
  ```

- ==注意，**类型别名与字符串字面量类型都是使用 `type` 进行定义。**==

### 3）元组

#### （1）定义

- 定义一对值分别为 `string` 和 `number` 的元组，可以只赋值其中一项。

  ```ts
  let tom: [string, number] = ['Tom', 25];
  
  ---
      
  let tom: [string, number];
  tom[0] = 'Tom';
  ```

- 当赋值或访问一个已知索引的元素时，会得到正确的类型。

  ```js
  let tom: [string, number];
  tom[0] = 'Tom';
  tom[1] = 25;
  
  tom[0].slice(1);
  tom[1].toFixed(2);
  ```

- 但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

  ```js
  let tom: [string, number];
  tom = ['Tom', 25];
  let tom: [string, number];
  tom = ['Tom'];
  
  // Property '1' is missing in type '[string]' but required in type '[string, number]'.
  ```

#### （2）越界元素

- 当添加越界元素时，它的类型会被限制为元组中每个类型的联合类型。

  ```js
  let tom: [string, number];
  tom = ['Tom', 25];
  tom.push('male');
  tom.push(true);
  
  // Argument of type 'true' is not assignable to parameter of type 'string | number'.
  ```

### 4）枚举

- 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

#### （1）定义

- 枚举使用 `enum` 关键字定义。

  ```ts
  enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
  ```

- 枚举成员会被赋值为从 `0` 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

  ```js
  enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
  
  console.log(Days["Sun"] === 0); // true
  console.log(Days["Mon"] === 1); // true
  console.log(Days["Sat"] === 6); // true
  
  console.log(Days[0] === "Sun"); // true
  console.log(Days[1] === "Mon"); // true
  console.log(Days[6] === "Sat"); // true
  ```

#### （2）手动赋值

- 未手动赋值的枚举项会接着上一个枚举项递增。

  ```js
  enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
  
  console.log(Days["Sun"] === 7); // true
  console.log(Days["Mon"] === 1); // true
  console.log(Days["Tue"] === 2); // true
  console.log(Days["Sat"] === 6); // true
  ```

- 手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 `1`：

  ```js
  enum Days {Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};
  
  console.log(Days["Sun"] === 7); // true
  console.log(Days["Mon"] === 1.5); // true
  console.log(Days["Tue"] === 2.5); // true
  ```

- 手动赋值的枚举项可以不是数字，此时需要使用类型断言来让 tsc 无视类型检查 (编译出的 js 仍然是可用的)：

  ```js
  enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
  ```

- 如果未手动赋值的枚举项与手动赋值的重复了，后者进行覆盖，TypeScript 是不会察觉到这一点的。

  ```js
  enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};
  
  console.log(Days["Sun"] === 3); // true
  console.log(Days["Wed"] === 3); // true
  console.log(Days[3] === "Sun"); // false
  console.log(Days[3] === "Wed"); // true
  ```

#### （3）计算所得项

- 枚举项有两种类型：常数项和计算所得项。前面我们所举的例子都是常数项，一个典型的计算所得项的例子：

  ```ts
  enum Color {Red, Green, Blue = "blue".length};
  ```

- **在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错**：

  ```ts
  enum Color {Red = "red".length, Green, Blue};
  
  // index.ts(1,33): error TS1061: Enum member must have initializer.
  // index.ts(1,40): error TS1061: Enum member must have initializer.
  ```

#### （4）常数枚举

- 常数枚举是使用 `const enum` 定义的枚举类型。

- 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

  ```js
  const enum Directions {
      Up,
      Down,
      Left,
      Right
  }
  
  let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
  
  ---编译为
  
  var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
  ```

#### （5）外部枚举

- 外部枚举（Ambient Enums）是使用 `declare enum` 定义的枚举类型。
- `declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。

### 5）类

- 传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链实现继承。而在 ES6 中，我们终于迎来了 `class`。
- TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

#### （1）ES6 类的用法

##### 【1】属性方法

- 使用 `class` 定义类，使用 `constructor` 定义构造函数。通过 `new` 生成新实例的时候，会自动调用构造函数。

  ```js
  class Animal {
      public name;
      constructor(name) {
          this.name = name;
      }
      sayHi() {
          return `My name is ${this.name}`;
      }
  }
  
  let a = new Animal('Jack');
  console.log(a.sayHi()); // My name is Jack
  ```

##### 【2】类的继承

- 使用 `extends` 关键字实现继承，子类中使用 `super` 关键字来调用父类的构造函数和方法。

  ```js
  class Cat extends Animal {
    constructor(name) {
      super(name); // 调用父类的 constructor(name)
      console.log(this.name);
    }
    sayHi() {
      return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
    }
  }
  
  let c = new Cat('Tom'); // Tom
  console.log(c.sayHi()); // Meow, My name is Tom
  ```

##### 【3】存取器

- 使用 getter 和 setter 可以改变属性的赋值和读取行为。

  ```js
  class Animal {
    constructor(name) {
      this.name = name;
    }
    get name() {
      return 'Jack';
    }
    set name(value) {
      console.log('setter: ' + value);
    }
  }
  
  let a = new Animal('Kitty'); // setter: Kitty
  a.name = 'Tom'; // setter: Tom
  console.log(a.name); // Jack
  ```

##### 【4】静态方法

- 使用 `static` 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用。

  ```js
  class Animal {
    static isAnimal(a) {
      return a instanceof Animal;
    }
  }
  
  let a = new Animal('Jack');
  Animal.isAnimal(a); // true
  a.isAnimal(a); // TypeError: a.isAnimal is not a function
  ```

#### （2）ES7 类的用法

##### 【1】实例属性

- ES6 中实例的属性只能通过构造函数中的 `this.xxx` 来定义，ES7 提案中可以直接在类里面定义。

  ```js
  class Animal {
    name = 'Jack';
  
    constructor() {
      // ...
    }
  }
  
  let a = new Animal();
  console.log(a.name); // Jack
  ```

##### 【2】静态属性

- ES7 提案中，可以使用 `static` 定义一个静态属性。

  ```js
  class Animal {
    static num = 42;
  
    constructor() {
      // ...
    }
  }
  
  console.log(Animal.num); // 42
  ```

#### （3）TS 类的用法

##### 【1】修饰符

- 对标其他语言的 private , public , protected

##### 【2】readonly

- 只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

  ```ts
  class Animal {
    readonly name;
    public constructor(name) {
      this.name = name;
    }
  }
  
  let a = new Animal('Jack');
  console.log(a.name); // Jack
  a.name = 'Tom';
  
  // index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
  ```

- 注意如果 `readonly` 和其他访问修饰符同时存在的话，需要写在其后面。

  ```ts
  class Animal {
    // public readonly name;
    public constructor(public readonly name) {
      // this.name = name;
    }
  }
  ```

##### 【3】抽象类

- `abstract` 用于定义抽象类和其中的抽象方法。

- 首先，抽象类是不允许被实例化的。

  ```ts
  abstract class Animal {
    public name;
    public constructor(name) {
      this.name = name;
    }
    public abstract sayHi();
  }
  
  let a = new Animal('Jack');
  
  // index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
  ```

- 其次，抽象类中的抽象方法必须被子类实现。

  ```ts
  abstract class Animal {
    public name;
    public constructor(name) {
      this.name = name;
    }
    public abstract sayHi();
  }
  
  class Cat extends Animal {
    public eat() {
      console.log(`${this.name} is eating.`);
    }
  }
  
  let cat = new Cat('Tom');
  
  // index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
  ```

- 下面是一个正确使用抽象类的例子。

  ```ts
  abstract class Animal {
    public name;
    public constructor(name) {
      this.name = name;
    }
    public abstract sayHi();
  }
  
  class Cat extends Animal {
    public sayHi() {
      console.log(`Meow, My name is ${this.name}`);
    }
  }
  
  let cat = new Cat('Tom');
  ```

### 6）类与接口

#### （1）类实现接口

- 一个类可以实现多个接口。

  ```ts
  interface Alarm {
      alert(): void;
  }
  
  interface Light {
      lightOn(): void;
      lightOff(): void;
  }
  
  class Car implements Alarm, Light {
      alert() {
          console.log('Car alert');
      }
      lightOn() {
          console.log('Car light on');
      }
      lightOff() {
          console.log('Car light off');
      }
  }
  ```

#### （2）接口继承接口

- 接口与接口之间可以是继承关系。

  ```ts
  interface Alarm {
      alert(): void;
  }
  
  interface LightableAlarm extends Alarm {
      lightOn(): void;
      lightOff(): void;
  }
  ```

#### （3）接口继承类

- ==常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：==

  ```ts
  class Point {
      x: number;
      y: number;
      constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
      }
  }
  
  interface Point3d extends Point {
      z: number;
  }
  
  let point3d: Point3d = {x: 1, y: 2, z: 3};
  ```

- ==但是，接口继承类的时候，也只会继承它的实例属性和实例方法。==

### 7）泛型

#### （1）定义

- 指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

  ```ts
  function createArray<T>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  
  createArray<string>(3, 'x'); // ['x', 'x', 'x']
  ```

- 接着在调用的时候，可以指定它具体的类型为 `string`。当然，也可以不手动指定，而让类型推论自动推算出来。

#### （2）类型参数

- 定义泛型的时候，可以一次定义多个类型参数

  ```ts
  function swap<T, U>(tuple: [T, U]): [U, T] {
      return [tuple[1], tuple[0]];
  }
  
  swap([7, 'seven']); // ['seven', 7]
  ```

#### （3）泛型约束





















































