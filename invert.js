# 一、Mock

## 1、简介

1、Mock.js 是一款模拟数据生成器，旨在帮助前端攻城师独立于后端进行开发，帮助编写单元测试。提供了以下模拟功能：

- 根据数据模板生成模拟数据
- 模拟 Ajax 请求，生成并返回模拟数据
- 基于 HTML 模板生成模拟数据

2、示例

- [Mock.js (mockjs.com)](http://mockjs.com/examples.html)
- [Mock 语法 | Apifox 使用文档](https://www.apifox.cn/help/app/mock/mock-rules/)

## 2、语法规范

### 1）数据模板定义规范

#### （1）数据模板

- 数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值

#### （2）生成规则

- 生成规则的含义需要依赖属性值的类型才能确定。

```javascript
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value
```

#### （3）属性值

##### 【1】字符串 String

1. `'name|min-max': string`

   通过重复 `string` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。

2. `'name|count': string`

   通过重复 `string` 生成一个字符串，重复次数等于 `count`。

##### 【2】数字 Number

1. `'name|+1': number`

   属性值自动加 1，初始值为 `number`。

2. `'name|min-max': number`

   生成一个大于等于 `min`、小于等于 `max` 的整数，属性值 `number` 只是用来确定类型。

3. `'name|min-max.dmin-dmax': number`

   生成一个浮点数，整数部分大于等于 `min`、小于等于 `max`，小数部分保留 `dmin` 到 `dmax` 位。

```javascript
Mock.mock({
    'number1|1-100.1-10': 1,
    'number2|123.1-10': 1,
    'number3|123.3': 1,
    'number4|123.10': 1.123
})
// =>
{
    "number1": 12.92,
    "number2": 123.51,
    "number3": 123.777,
    "number4": 123.1231091814
}
```

#####  【3】布尔型Boolean

1. `'name|1': boolean`

   随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。

2. `'name|min-max': value`

   随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`。

##### 【4】对象 Object

1. `'name|count': object`

   从属性值 `object` 中随机选取 `count` 个属性。

2. `'name|min-max': object`

   从属性值 `object` 中随机选取 `min` 到 `max` 个属性。

##### 【5】数组 Array

1. `'name|1': array`

   从属性值 `array` 中随机选取 1 个元素，作为最终值。

2. `'name|+1': array`

   从属性值 `array` 中顺序选取 1 个元素，作为最终值。

3. `'name|min-max': array`

   通过重复属性值 `array` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。

4. `'name|count': array`

   通过重复属性值 `array` 生成一个新数组，重复次数为 `count`。

##### 【6】函数 Function

1. `'name': function`

   执行函数 `function`，取其返回值作为最终的属性值，函数的上下文为属性 `'name'` 所在的对象。

##### 【7】正则表达式 RegExp

```javascript
Mock.mock({
    'regexp1': /[a-z][A-Z][0-9]/,
    'regexp2': /\w\W\s\S\d\D/,
    'regexp3': /\d{5,10}/
})
// =>
{
    "regexp1": "pJ7",
    "regexp2": "F)\fp1G",
    "regexp3": "561659409"
}
```

### 2）数据占位符定义规范

## 3、Mock.mock()

- 语法为 Mock . mock ( rurl ? , rtype ? , template | function (options) )

### 1）rurl

- 表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。

### 2）rtype

- 表示需要拦截的 Ajax 请求类型。例如 `GET`、`POST`、`PUT`、`DELETE` 等。

### 3）template

- 表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。

### 4）function(options)

- 表示用于生成响应数据的函数。
- options 指向本次请求的 Ajax 选项集，含有 `url`、`type` 和 `body` 三个属性

## 4、Mock.setup()

- 目前，接口 `Mock.setup( settings )` 仅用于配置 Ajax 请求，将来可能用于配置 Mock 的其他行为。
- 指定被拦截的 Ajax 请求的响应时间，单位是毫秒。值可以是正整数，例如 `400`，表示 400 毫秒 后才会返回响应内容；也可以是横杠 `'-'` 风格的字符串，例如 `'200-600'`，表示响应时间介于 200 和 600 毫秒之间。
- 默认值是`'10-100'`。

```javascript
Mock.setup({
    timeout: 400
})
Mock.setup({
    timeout: '200-600'
})
```

## 5、Mock.Random()

- Mock.Random 是一个工具类，用于生成各种随机数据。

- Mock.Random 的方法在数据模板中称为『占位符』，书写格式为 @占位符(参数 [, 参数]) 。

- Mock.Random 提供的完整方法（占位符）如下：

  | Type          | Method                                                       |
  | ------------- | ------------------------------------------------------------ |
  | Basic         | boolean, natural, integer, float, character, string, range, date, time, datetime, now |
  | Image         | image, dataImage                                             |
  | Color         | color                                                        |
  | Text          | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle |
  | Name          | first, last, name, cfirst, clast, cname                      |
  | Web           | url, domain, email, ip, tld                                  |
  | Address       | area, region                                                 |
  | Helper        | capitalize, upper, lower, pick, shuffle                      |
  | Miscellaneous | guid, id                                                     |

### 1）Basic

#### 1、Random.boolean( min?, max?, current? )

- 返回一个随机的布尔值。
- min：指示参数 current 出现的概率。概率计算公式为 `min / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 current。
- max：指示参数 current 的相反值 `!current` 出现的概率。概率计算公式为 `max / (min + max)`。该参数的默认值为 `1`，即有 50% 的概率返回参数 `!current`。
- current：可选值为布尔值 `true` 或 `false`。如果未传入任何参数，则返回 `true` 和 `false` 的概率各为 50%。该参数没有默认值。

```javascript
Random.boolean()
// => true
Random.boolean(1, 9, true)
// => false
```

#### 2、Random.natural( min?, max? )

- 返回一个随机的自然数（大于等于 0 的整数）。
- min：指示随机自然数的最小值。默认值为 0。
- max：指示随机自然数的最大值。默认值为 9007199254740992。

```javascript
Random.natural()
// => 1002794054057984
Random.natural(10000)
// => 71529071126209
Random.natural(60, 100)
// => 77
```

#### 3、Random.integer( min?, max? )

- 返回一个随机的整数。

```javascript
Random.integer()
// => -3815311811805184
Random.integer(10000)
// => 4303764511003750
Random.integer(60,100)
// => 96
```

#### 4、Random.float( min?, max?, dmin?, dmax? )

- 返回一个随机的浮点数。
- min，max：整数部分的最小值与最大值
- dmin：小数部分位数的最小值。默认值为 0。
- dmax：小数部分位数的最大值。默认值为 17。

```javascript
Random.float()
// => -1766114241544192.8
Random.float(60, 100)
// => 82.56779679549358
Random.float(60, 100, 3)
// => 61.718533677927894
Random.float(60, 100, 3, 5)
// => 70.6849
```

#### 5、Random.character( pool? )

- 返回一个随机字符。

- 如果传入了 `'lower'` 或 `'upper'`、`'number'`、`'symbol'`，表示从内置的字符池从选取：

  ```javascript
  {
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      number: "0123456789",
      symbol: "!@#$%^&*()[]"
  }
  ```

- 如果未传入该参数，则从 `lower + upper + number + symbol` 中随机选取一个字符返回。

  ```javascript
  Random.character()
  // => "P"
  Random.character('lower')
  // => "y"
  Random.character('upper')
  // => "X"
  Random.character('number')
  // => "1"
  Random.character('symbol')
  // => "&"
  Random.character('aeiou')
  // => "u"
  ```

#### 6、Random.string( pool?, min?, max? )

- 返回一个随机字符串。

- min：随机字符串的最小长度。默认值为 3。

- max：随机字符串的最大长度。默认值为 7。

  ```javascript
  Random.string()
  // => "pJjDUe"
  Random.string( 5 )
  // => "GaadY"
  Random.string( 'lower', 5 )
  // => "jseqj"
  Random.string( 7, 10 )
  // => "UuGQgSYk"
  Random.string( 'aeiou', 1, 3 )
  // => "ea"
  Random.string( '壹贰叁肆伍陆柒捌玖拾', 3, 5 )
  // => "肆捌伍叁"
  ```

#### 7、Random.range( start?, stop, step? )

- 返回一个整型数组。

- start：整数的起始值

- stop：必选，整数的结束值（不包含在返回值中）。

- step：整数之间的步长。默认值为 1。

  ```javascript
  Random.range(10)
  // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  Random.range(3, 7)
  // => [3, 4, 5, 6]
  Random.range(1, 10, 2)
  // => [1, 3, 5, 7, 9]
  ```

### 2）Date

#### 1、Random.date( format ? )

- 返回一个随机的日期字符串

- format：指示生成的日期字符串的格式。默认值为 `yyyy-MM-dd`。  

  | Format |                       Description                        |   Example    |
  | :----: | :------------------------------------------------------: | :----------: |
  |  yyyy  |    A full numeric representation of a year, 4 digits     | 1999 or 2003 |
  |   yy   |           A two digit representation of a year           |   99 or 03   |
  |   y    |           A two digit representation of a year           |   99 or 3    |
  |   MM   |  Numeric representation of a month, with leading zeros   |   01 to 12   |
  |   M    | Numeric representation of a month, without leading zeros |   1 to 12    |
  |   dd   |      Day of the month, 2 digits with leading zeros       |   01 to 31   |
  |   d    |          Day of the month without leading zeros          |   1 to 31    |
  |   HH   |       24-hour format of an hour with leading zeros       |   00 to 23   |
  |   H    |     24-hour format of an hour without leading zeros      |   0 to 23    |
  |   hh   |     12-hour format of an hour without leading zeros      |   1 to 12    |
  |   h    |       12-hour format of an hour with leading zeros       |   01 to 12   |
  |   mm   |               Minutes, with leading zeros                |   00 to 59   |
  |   m    |              Minutes, without leading zeros              |   0 to 59    |
  |   ss   |               Seconds, with leading zeros                |   00 to 59   |
  |   s    |              Seconds, without leading zeros              |   0 to 59    |
  |   SS   |             Milliseconds, with leading zeros             |  000 to 999  |
  |   S    |           Milliseconds, without leading zeros            |   0 to 999   |
  |   A    |        Uppercase Ante meridiem and Post meridiem         |   AM or PM   |
  |   a    |        Lowercase Ante meridiem and Post meridiem         |   am or pm   |
  |   T    |        Milliseconds, since 1970-1-1 00:00:00 UTC         | 75988343730  |

  ```javascript
  Random.date()
  // => "2002-10-23"
  Random.date('yyyy-MM-dd')
  // => "1983-01-29"
  Random.date('yy-MM-dd')
  // => "79-02-14"
  Random.date('y-MM-dd')
  // => "81-05-17"
  Random.date('y-M-d')
  // => "84-6-5"
  ```

#### 2、Random.time( format? )

- 返回一个随机的时间字符串。

- 指示生成的时间字符串的格式。默认值为 `HH:mm:ss`。

  ```javascript
  Random.time()
  // => "00:14:47"
  Random.time('A HH:mm:ss')
  // => "PM 20:47:37"
  ```

#### 3、Random.datetime( format? )

- 返回一个随机的日期和时间字符串。
- 指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。

#### 4、Random.now( unit ?, format ? )

- 返回当前的日期和时间字符串。
- unit：表示时间单位，用于对当前日期和时间进行格式化。可选值有：`year`、`month`、`week`、`day`、`hour`、`minute`、`second`、`week`，默认不会格式化。
- format：指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。

### 3）Image

#### 1、Random.image( size?, background?, foreground?, format?, text? )

- 用于生成高度自定义的图片地址，一般情况下，应该使用更简单的 Random.dataImage()

- size：指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

  ```javascript
  [
      '300x250', '250x250', '240x400', '336x280', 
      '180x150', '720x300', '468x60', '234x60', 
      '88x31', '120x90', '120x60', '120x240', 
      '125x125', '728x90', '160x600', '120x600', 
      '300x600'
  ]
  ```

- background：指示图片的背景色。默认值为 `'#000000'`。

- foreground：指示图片的前景色（文字）。默认值为 `'#FFFFFF'`。

- format：指示图片的格式。默认值为 `'png'`，可选值包括：`'png'`、`'gif'`、`'jpg'`。

- text：指示图片上的文字。默认值为参数 size。

  ```javascript
  Random.image()
  // => "http://dummyimage.com/125x125"
  Random.image('200x100')
  // => "http://dummyimage.com/200x100"
  Random.image('200x100', '#fb0a2a')
  // => "http://dummyimage.com/200x100/fb0a2a"
  Random.image('200x100', '#02adea', 'Hello')
  // => "http://dummyimage.com/200x100/02adea&text=Hello"
  Random.image('200x100', '#00405d', '#FFF', 'Mock.js')
  // => "http://dummyimage.com/200x100/00405d/FFF&text=Mock.js"
  Random.image('200x100', '#ffcc33', '#FFF', 'png', '!')
  // => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=!"
  ```

#### 2、Random.dataImage( size?, text? )

- 生成一段随机的 Base64 图片编码。

### 4）Color

- 随机生成一个颜色。

|      API       |        格式        |
| :------------: | :----------------: |
| Random.color() |     '#RRGGBB'      |
|  Random.hex()  |     '#RRGGBB'      |
|  Random.rgb()  |   'rgb(r, g, b)'   |
| Random.rgba()  | 'rgba(r, g, b, a)' |
|  Random.hsl()  |   'hsl(h, s, l)'   |

### 5）Text

#### 1、Random.paragraph( min?, max? )

- 随机生成一段文本。

- len：指示文本中句子的个数。默认值为 3 到 7 之间的随机数。
- min：指示文本中句子的最小个数。默认值为 3。
- max：指示文本中句子的最大个数。默认值为 7。

#### 2、Random.cparagraph( min?, max? )

- 随机生成一段中文文本。

#### 3、Random.sentence( min?, max? )

- 随机生成一个句子，第一个单词的首字母大写。
- len：指示句子中单词的个数。默认值为 12 到 18 之间的随机数。
- min：指示句子中单词的个数。默认值为 12 到 18 之间的随机数。
- max：指示句子中单词的最大个数。默认值为 18。

#### 4、Random.csentence( min?, max? )

- 随机生成一段中文文本。

#### 5、Random.word( min?, max? )

- 随机生成一个单词。
- 指示单词中字符的个数。默认值为 3 到 10 之间的随机数。
- min：指示单词中字符的最小个数。默认值为 3。
- max：指示单词中字符的最大个数。默认值为 10。

#### 6、Random.cword( pool?, min?, max? )

- 随机生成一个汉字。
- pool：汉字字符串。表示汉字字符池，将从中选择一个汉字字符返回。
- min，max：默认为1。

```javascript
Random.cword()
// => "干"
Random.cword('零一二三四五六七八九十')
// => "六"
Random.cword(3)
// => "别金提"
Random.cword('零一二三四五六七八九十', 3)
// => ""七七七""
Random.cword(5, 7)
// => "设过证全争听"
Random.cword('零一二三四五六七八九十', 5, 7)
// => "九七七零四"
```

#### 7、Random.title( min?, max? )

- 随机生成一句标题，其中每个单词的首字母大写。
- len：指示单词中字符的个数。默认值为 3 到 7 之间的随机数。
- min，max：默认值分别为 3，7。

#### 8、Random.ctitle( min?, max? )

- 随机生成一句中文标题。

### 6）Name

|          API           |   含义   | 备注 |
| :--------------------: | :------: | :--: |
|     Random.first()     |  英文名  |      |
|     Random.last()      |  英文姓  |      |
| Random.name( middle? ) | 英文姓名 |  1   |
|    Random.cfirst()     |  中文名  |      |
|     Random.clast()     |  中文姓  |      |
|     Random.cname()     | 中文姓名 |      |

备注1：Random.name( middle? )

- 随机生成一个常见的英文姓名。

- 布尔值。指示是否生成中间名。

  ```javascript
  Random.name()
  // => "Larry Wilson"
  Random.name(true)
  // => "Helen Carol Martinez"
  ```

### 7）Address

- 随机生成一个地址

  |       API       |               含义               |                备注                |
  | :-------------: | :------------------------------: | :--------------------------------: |
  |  Random.region  |     随机生成一个（中国）大区     |               “华北”               |
  | Random.province |    随机生成一个（中国）省市区    |                                    |
  |   Random.city   |         随机生成一个城市         |   布尔值。指示是否生成所属的省。   |
  |  Random.county  |      随机生成一个（中国）县      | 布尔值。指示是否生成所属的省、市。 |
  |   Random.zip    | 随机生成一个邮政编码（六位数字） |                                    |

### 8）Miscellaneous

#### 1、Random.guid()

- 随机生成一个 GUID。

  ```javascript
  Random.guid()
  // => "662C63B4-FD43-66F4-3328-C54E3FF0D56E"
  ```

#### 2、Random.id()

- 随机生成一个 18 位身份证。

#### 3、Random.increment

- 生成一个全局的自增整数。
- step：整数自增的步长。默认值为 1。

#### 4、Random.pick

- 从数组中随机选取一个元素，并返回。

  ```javascript
  Random.pick(['a', 'e', 'i', 'o', 'u'])
  // => "o"
  ```

#### 5、Random.shuffle( arr )

- 打乱数组中元素的顺序，并返回。

  ```javascript
  Random.shuffle(['a', 'e', 'i', 'o', 'u'])
  // => ["o", "u", "e", "i", "a"]
  ```

## 6、Mock.valid

- Mock.valid ( template, data )
- 校验真实数据 `data` 是否与数据模板 `template` 匹配。

## 7、Mock.toJSONSchema

- 把 Mock.js 风格的数据模板 `template` 转换成 JSON





































