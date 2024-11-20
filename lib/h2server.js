import http2 from "http2";
import EventEmitter from "events";
import { xpath, rf, xconsole } from "@ghini/kit-dev";
export { h2s };

// 第一个是端口号,中间可传配置，最后一个是处理函数
function h2s(...argv) {
  let { port, config } = getArgv(argv);
  const server = http2.createSecureServer(config);
  server.listen(port, () => {
    console.log(`H2 server is running on https://localhost:${port}`);
  });
  server.on("stream", hd_stream);
  // 把request处理的像stream 以走同一套逻辑
  server.on("request", (req, res) => {
    if (req.headers[":path"]) return;
    const stream = simulateHttp2Stream(req, res);
    try {
      hd_stream(stream, stream.headers);
    } catch (err) {
      console.error("Server request error:", err);
      res.writeHead(500);
      res.end("need to uprade H2");
    }
  });
  server.on("error", (err) => {
    console.error(`Server error: ${err.message}`);
  });
  // 后面版本再升级正则匹配,数组匹配.
  server.routers = [
    // [path,method,type,fn,config,flag]
    // 0只走end 1只走data 2都走
    ["/", "*", "*", hd_0, {}, 0],
    ["/headers", "*", "*", hd_1, {}, 0],
    ["/data", "*", "*", hd_data, {}, 0],
    ["/data", "POST", "*", hd_postdata, {}, 0],
    ["/data", "POST", "application/json", hd_postdata_json, {}, 0],
  ];
  // '/path/xxx get post delete application/json application/x-www-form-urlencoded'
  // ('/path/xxx',['get','post'],['application/json','application/x-www-form-urlencoded'])
  server.addr = (string, func, ...config_flag) => {
    let path, // /path/xxx *
      method, //  [GET,POST,PUT,DELETE] *
      type, // application/json application/x-www-form-urlencoded *
      config,
      flag;
    string.split(" ").forEach((item) => {
      if (item.startsWith("/")) path = item;
      else if (
        ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PUT"].includes(
          item.toUpperCase()
        )
      )
        method = item.toUpperCase();
      else if (item.match("/")) type = item;
    });
    if (!path) {
      console.error("path is required");
      return;
    }
    if (!method) method = "*";
    if (!type) type = "*";
    config_flag.forEach((item) => {
      if (typeof item === "object") config = item;
      if (typeof item === "number") flag = item;
    });
    if (!config) config = {};
    if (!flag) flag = 0;
    if (!func) func = hd_0;
    // 默认需要path,method type默认为*,func默认返回ok,config默认为{},flag默认为0
    // 查重覆盖
    server.routers.push([path, method, type, func, config, flag]);
  };
  return server;
  function hd_stream(stream, headers) {
    // 改成增强工具addon
    const addon = {
      headers,
      path: headers[":path"],
      method: headers[":method"],
      type: headers["content-type"],
      param: {},
      data: {},
      body: "",
      config: {
        MAX_BODY: 4 * 1024 * 1024,
      },
      end: stream.end.bind(stream),
      write: stream.write.bind(stream),
      respond: stream.respond.bind(stream),
    };
    addon.param = Object.fromEntries(
      new URLSearchParams(
        addon.path.replace(/.*?\?/, (matched) => {
          addon.path = matched.endsWith("?") ? matched.slice(0, -1) : matched;
          return "";
        })
      )
    );
    const router_target = router_find();
    if (!router_target) {
      stream.respond({ ":status": 404 });
      stream.end("404");
      return;
    }
    addon.config = { ...addon.config, ...router_target.at(-2) };
    let length = 0,
      chunks = [];
    stream.on("data", (chunk) => {
      length += chunk.length;
      if (length > addon.config.MAX_BODY) {
        stream.end(`Request body large than ${addon.config.MAX_BODY}B`);
      }
      if (router_target.at(-1) > 0) {
        router_target.at(-3)(addon);
      } else {
        chunks.push(chunk);
      }
    });
    stream.on("end", () => {
      if (router_target.at(-1) === 0 || router_target.at(-1) === 2) {
        addon.body = Buffer.concat(chunks).toString();
        router_target.at(-3)(addon);
      }
    });
    function router_find() {
      const arr = [];
      for (const [path, method, type, func, config, flag] of server.routers) {
        if (
          (path === "*" || path === addon.path) &&
          (method === "*" || method === addon.method) &&
          (type === "*" || type === addon.type)
        ) {
          // path4 method2 type1 *0
          const score =
            (path === "*" ? 0 : 4) +
            (method === "*" ? 0 : 2) +
            (type === "*" ? 0 : 1);
          arr.push([score, method, path, type, func, config, flag]);
        }
      }
      if (arr.length === 0) return null;
      return arr.sort((a, b) => b[0] - a[0])[0].slice(1);
    }
  }
}
function getArgv(argv) {
  // 返回端口和配置
  let port, config;
  argv.forEach((item) => {
    if (typeof item === "number") {
      port = item;
    } else if (typeof item === "object") {
      config = item;
    }
  });
  port = port || 3000;
  config = {
    ...{
      key: rf(xpath("cert/selfsigned.key", import.meta.dirname)),
      cert: rf(xpath("cert/selfsigned.cert", import.meta.dirname)),
      allowHTTP1: true,
      settings: {
        maxConcurrentStreams: 100, // 最大并发流数
        maxHeaderListSize: 32 * 1024, // 最大请求头大小 (32KB)
      },
    },
    ...config,
  };
  return { port, config };
}

// 模拟 HTTP/2 的 `stream` 对象
function simulateHttp2Stream(req, res) {
  const headers = { ...req.headers };
  headers[":method"] = req.method;
  headers[":path"] = req.url;
  headers[":scheme"] = "https";
  headers[":authority"] = req.headers.host || "";
  headers["httpVersion"] = req.httpVersion;
  const stream = new EventEmitter(); // 添加事件发射器功能
  stream.headers = headers;
  stream.respond = (responseHeaders) => {
    const status = responseHeaders[":status"] || 200; // 默认状态码 200
    const filteredHeaders = Object.fromEntries(
      Object.entries(responseHeaders).filter(([key]) => !key.startsWith(":"))
    );
    res.writeHead(status, filteredHeaders);
  };
  stream.write = res.write.bind(res);
  stream.end = res.end.bind(res);

  // 将 req 的数据事件转发到 stream 上
  req.on("data", (chunk) => stream.emit("data", chunk));
  req.on("end", () => stream.emit("end"));
  req.on("error", (err) => stream.emit("error", err));
  return stream;
}
function hd_0(stream) {
  stream.respond({
    ":status": 200,
    "content-type": "application/json",
  });
  if (stream.headers["httpVersion"]) {
    stream.write(
      JSON.stringify({ hello: "http" + stream.headers["httpVersion"] })
    );
  } else {
    stream.write(JSON.stringify({ hello: "http2" }));
  }
  stream.end();
}
function hd_1(stream) {
  stream.respond({
    ":status": 200,
    "content-type": "application/json",
  });
  stream.write(JSON.stringify(stream.headers));
  stream.end();
}
function hd_data(addon) {
  // console.log(2, addon);
  addon.write("[hd_data]\n");
  addon.end(addon.body);
}
function hd_postdata(addon) {
  // console.log(1, addon);
  addon.write("[hd_postdata]\n");
  addon.end(addon.body);
}
function hd_postdata_json(addon) {
  // console.log(1, addon);
  addon.write("[hd_postdata_json]\n");
  addon.end(addon.body);
}

if (process.argv[1] == import.meta.filename){
  xconsole();
  const server = h2s();
  server.addr("/a");  
}