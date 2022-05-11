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

#### （4）类数组

- 

#### （5）any 在数组中的应用

- ==一个比较常见的做法是，用 `any` 表示数组中允许出现任意类型==

  ```javascript
  let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
  ```

### 7）函数类型





















