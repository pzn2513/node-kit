export {
  rf, //同步读
  wf, //同步写
  xpath, //自动处理路径
  arf, //异步读
  awf, //异步写
  xconsole, //更健全的日志
  log, //更健全的日志
  err, //更健全的日志
  mreplace, //多重替换
  mreplace_calc, //多重替换并计数和细节
  xreq, //module下,使用require导入
};

import { createRequire } from "module";
function xreq(path){
  // console.log(process.argv); // 进程文件导入用这个
  // console.log(import.meta); // 当前文件导入用这个
  const require = createRequire(process.argv[1]);
  return require(path);  
}
import fs from "fs";
const afs = fs.promises;
import path from "path";
/**
 * 同步读取文件
 * @param {string} filename - 文件路径
 * @returns {string|null} 文件内容或null(如果文件不存在)
 */
function rf(filename) {
  try {
    const data = fs.readFileSync(xpath(filename), "utf8");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(filename + "文件不存在");
      return null;
    }
    throw error;
  }
}

/**
 * 同步写入文件
 * @param {string} filename - 文件路径
 * @param {string} content - 要写入的内容
 * @returns {boolean} 是否写入成功
 */
function wf(filename, content) {
  try {
    fs.writeFileSync(xpath(filename), content, "utf8");
    // console.log(filename + "文件写入成功");
    return true;
  } catch (error) {
    console.error("写入" + filename + "文件失败:", error);
    throw error;
  }
}
async function arf(filename) {
  try {
    const data = await afs.readFile(xpath(filename), "utf8");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(filename + "文件不存在");
      return null;
    }
    throw error;
  }
}
async function awf(filename, content) {
  try {
    await afs.writeFile(xpath(filename), content, "utf8");
    // console.log(filename + "文件写入成功");
  } catch (error) {
    console.error("写入" + filename + "文件失败:", error);
    throw error;
  }
}
/**
 * 将路径转换为绝对路径
 * @param {string} inputPath - 输入的路径（可以是相对路径或绝对路径）
 * @param {string} [basePath=process.cwd()] - 基础路径，默认为当前工作目录
 * @returns {string} 转换后的绝对路径
 */
function xpath(inputPath, basePath = process.cwd(), separator = "/") {
  let resolvedPath;
  // 判断是否为绝对路径
  if (path.isAbsolute(inputPath)) {
    resolvedPath = path.normalize(inputPath);
  } else {
    resolvedPath = path.resolve(basePath, inputPath);
  }
  if (separator === "/") {
    // 将 Windows 格式的反斜杠转换为正斜杠
    return resolvedPath.split(path.sep).join("/");
  }
  // 如果指定的分隔符是'\'，使用windows格式
  if (separator === "\\") {
    return resolvedPath.split("/").join("\\");
  }
  return resolvedPath.split(path.sep).join(separator);
}

function xconsole(rewrite=true) {
  const originalLog = console.log;
  const originalError = console.error;
  const dim = '\x1b[90m';     // 浅灰色
  const cyan = '\x1b[36m';    // 青色
  const red = '\x1b[31m';     // 红色
  const reset = '\x1b[0m';    // 重置颜色

  function getTimestamp() {
    const now = new Date();
    return `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now
      .getDate()
      .toString()
      .padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;
  }

  function getLineInfo() {
    const stack = new Error().stack.split("\n")[3];
    const lineInfo = stack.match(/at .*:(\d+):(\d+)\)?/);
    return lineInfo ? `[${lineInfo[1]}:${lineInfo[2]}]` : "";
  }

  function log(...args) {
    const timeString = getTimestamp();
    const line = getLineInfo();
    originalLog(`${dim}[${timeString}]${reset}${cyan}${line}${reset}:`, ...args);
  }

  function err(...args) {
    const timeString = getTimestamp();
    const line = getLineInfo();
    originalError(`${dim}[${timeString}]${reset}${cyan}${line}${reset}:${red}`, ...args,`${reset}`);
  }
  if(rewrite){
    console.log = log;
    console.error = err;    
  }
  return { log, err };
}
const {log,err}=xconsole(0);

// 批量replace，返回[result, counts, detail]
function mreplace(str, replacements) {
  for (const [search, replacement] of replacements) {
    str = str.replace(new RegExp(search), (...args) => {
      // 第一个是完整匹配内容，中间捕获组，最后两个参数是 offset 和原字符串，为节省运算不做切割，原版有如下下切割
      // const captures = args.slice(0, -2);
      return replacement.replace(/(\$)?\$(\d+)/g, (...args_$) => {
        // 保留$0可引用(原版无), $1 对应 captures[1], $2 对应 captures[2], 以此类推
        // 另考虑$1可能有用，$$1基本无用，可用作转义保护真正要用的$1
        if (args_$[1]) {
          return args_$[1] + args_$[2];
        } else {
          return args[args_$[2]] || args_$[0];
        }
      });
    });
  }
  // if (
  //   res[1][3][0] > 0 ||
  //   res[1][4][0] > 0 ||
  //   res[1][5][0] > 0 ||
  //   res[1][6][0] > 0
  // ) {
  //   console.log(content.length, res[1], res[2], req.url);
  // }
  return str;
}
function mreplace_calc(str, replacements) {
  const counts = [];
  const detail = [];
  counts.sum = 0;
  let result = str;
  for (const [search, replacement] of replacements) {
    let count = 0;
    result = result.replace(new RegExp(search), (...args) => {
      count++;
      detail.push([args.at(-2), args[0]]);
      // 第一个是完整匹配内容，中间捕获组，最后两个参数是 offset 和原字符串，为节省运算不做切割，原版有如下下切割
      // const captures = args.slice(0, -2);
      return replacement.replace(/(\$)?\$(\d+)/g, (...args_$) => {
        // 保留$0可引用(原版无), $1 对应 captures[1], $2 对应 captures[2], 以此类推
        // 另考虑$1可能有用，$$1基本无用，可用作转义保护真正要用的$1
        if (args_$[1]) {
          //(\$)不为undefined，即有转义不做变量，返回拼接
          return args_$[1] + args_$[2];
        } else {
          //正常作为变量，在范围内输出变量，否则输出原匹配即不变。
          return args[args_$[2]] || args_$[0];
        }
        // mreplace_calc('这苹果的价格为￥7',[[/￥(\d+)/,'$$1/￥$1']])
        // '这苹果的价格为￥7'.replace(/￥(\d+)/,'$$1/￥$1') 输出结果一致
      });
    });
    counts.push([count, search]);
    counts.sum += count;
  }
  // if (
  //   res[1][3][0] > 0 ||
  //   res[1][4][0] > 0 ||
  //   res[1][5][0] > 0 ||
  //   res[1][6][0] > 0
  // ) {
  //   console.log(content.length, res[1], res[2], req.url);
  // }
  return [result, counts, detail];
}





// 使用示例
function xpath_demo() {
  const testPaths = [
    "./test.txt", // 当前目录相对路径
    "../test.txt", // 上级目录相对路径
    "folder/test.txt", // 子目录相对路径
    "/absolute/path/test.txt", // Unix风格绝对路径
    "C:\\Windows\\test.txt", // Windows风格绝对路径
    "~/documents/test.txt", // 用户目录路径
  ];

  console.log("当前工作目录:", process.cwd());
  console.log("\n路径解析示例:");

  testPaths.forEach((testPath) => {
    console.log(`\n输入路径: "${testPath}"`);
    console.log(`是否绝对路径: ${path.isAbsolute(testPath)}`);
    console.log(`解析后路径: "${xpath(testPath)}"`);
  });

  // 使用自定义基础路径的示例
  const customBasePath = "/custom/base/path";
  console.log(`\n使用自定义基础路径 "${customBasePath}":`);
  console.log(`相对路径 "./test.txt" 解析结果:`);
  console.log(xpath("./test.txt", customBasePath));
}

// 运行示例
if (process.argv[1].endsWith("basic.js")) {
  xconsole()
  // xpath_demo()
  
  let res=mreplace_calc('苹果的价格为￥7',[
    ['苹果','🍎'],
    [/￥(\d+)/,'$$1/￥$1']
  ])
  log(res)
}
