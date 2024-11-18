# GHini Kit Dev

**高效泛功能库：用一行代码高效实现 H2 兼容 H1 的服务器，性能超越 Express，适用于微服务应用。**

---

## 特性

- **高效 H2/H1 兼容服务器**  
  一行代码即可创建原生性能超越 Express 的 HTTP/2 兼容 HTTP/1.1 服务器，轻松支持现代 Web 和微服务场景。

- **丰富的工具函数**  
  提供文件读写、路径解析、日志处理、请求封装等高效工具，覆盖开发常见需求。

- **现代化数据处理**  
  支持 gzip、brotli、zstd 等多种压缩和解压方式，为数据传输和存储提供便利。

- **便捷的 Cookie 操作**  
  内置 Cookie 转换和合并工具，助力高效管理客户端状态。

- **模块化设计**  
  灵活导入所需模块，无需加载多余代码，保持项目性能最佳。

---

## 快速开始

### 安装

```bash
npm install @ghini/kit-dev
```

### 使用示例

#### 创建一个兼容 H2/H1 的高性能服务器

```javascript
import {h2s,xconsole} from "@ghini/kit-dev";
h2s(3000, handleStream);
function handleStream(stream, headers) {
  const path=headers[":path"]
  if(path==="/"){
    stream.respond({
      ":status": 200,
      "content-type": "application/json",
    });
    stream.write(JSON.stringify(headers));
    stream.end();
  }
  else if(path==="/hello") {
    stream.end("Hello World!")
  }
}
```

#### 文件读写工具

```javascript
import { rf, wf } from '@ghini/kit-dev/lib/basic.js';

// 读取文件内容
const data = rf('./example.txt');
console.log(data);

// 写入文件内容
wf('./example.txt', 'Hello, world!');
```

#### 高效 Cookie 操作

```javascript
import { cookie_merge, cookie_obj, cookie_str } from '@ghini/kit-dev';

// 合并两个 Cookie 字符串
const mergedCookies = cookie_merge('key1=value1', 'key2=value2');
console.log(mergedCookies);

// 将 Cookie 字符串转为对象
const cookieObj = cookie_obj('key1=value1; key2=value2');
console.log(cookieObj);

// 将 Cookie 对象转为字符串
const cookieString = cookie_str({ key1: 'value1', key2: 'value2' });
console.log(cookieString);
```

#### 数据压缩与解压

```javascript
import { gzip, gunzip } from '@ghini/kit-dev/lib/codec.js';

const compressed = gzip('Hello, world!');
console.log(compressed);

const decompressed = gunzip(compressed);
console.log(decompressed);
```

#### 自定义日志工具

```javascript
import { log, err } from '@ghini/kit-dev';

// 普通日志
log('This is a log message.');

// 错误日志
err('This is an error message.');
```

---

## API 文档

### 1. HTTP/2 服务器
- **`h2s(handler: (req, res) => void): Server`**  
  创建一个兼容 HTTP/2 和 HTTP/1.1 的服务器。

### 2. 文件操作
- **`rf(path: string): string`**  
  读取文件内容。
- **`wf(path: string, content: string): void`**  
  写入文件内容。

### 3. Cookie 工具
- **`cookie_merge(...cookies: string[]): string`**  
  合并多个 Cookie 字符串。
- **`cookie_obj(cookieString: string): object`**  
  将 Cookie 字符串转换为对象。
- **`cookie_str(cookieObj: object): string`**  
  将 Cookie 对象转换为字符串。

### 4. 压缩与解压
- **`gzip(data: string): Buffer`**  
  使用 gzip 压缩数据。
- **`gunzip(data: Buffer): string`**  
  解压 gzip 数据。

---

## 贡献

欢迎贡献代码和提出建议！请通过以下方式参与：
1. 提交 Issue 或 Pull Request。
2. 提交代码时，请确保通过项目的 ESLint 和单元测试。

---

## 开源许可

MIT License. Enjoy! 😊