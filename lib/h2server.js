import http2 from "http2";
import { xpath, rf, xconsole } from "@ghini/kit-dev";
export {h2s};

// 第一个是端口号,中间可传配置，最后一个是处理函数
function h2s(port, ...argv) {
  port = port || 3000
  let {config,f_stream} = getArgv(argv);
  const server = http2.createSecureServer(config);
  server.listen(port, () => {
    console.log(`H2 server is running on https://localhost:${port}`);
  })
  server.on("stream", f_stream);
  // 把request处理的像stream 以走同一套逻辑
  server.on("request", (req, res) => {
    if (req.headers[":path"]) return;
    const stream = simulateHttp2Stream(req, res);
    try {
      f_stream(stream, stream.headers);
    } catch (err) {
      console.error('Server request error:',err);
      res.writeHead(500);
      res.end("need to uprade H2");
    }
  });
  server.on('error', (err) => {
    console.error(`Server error: ${err.message}`);
  });  
}
function getArgv(argv) {
  let config, f_stream;
  if (argv?.length === 2) {
    config = argv[0];
    f_stream = argv[1];
  } else if (argv?.length === 1) {
    if (typeof argv[0] === "function") {
      f_stream = argv[0];
    } else {
      config = argv[0];
    }
  }
  if (!f_stream || typeof f_stream !== "function")
    f_stream = f_stream_default;
  config={
    ...{
      key: rf(xpath("cert/selfsigned.key",import.meta.dirname)),
      cert: rf(xpath("cert/selfsigned.cert",import.meta.dirname)),
      allowHTTP1: true,
    },
    ...config,
  }
  return { config, f_stream };
}
// 模拟 HTTP/2 的 `stream` 对象
function simulateHttp2Stream(req, res) {
  const headers = { ...req.headers };
  headers[":method"] = req.method;
  headers[":path"] = req.url;
  headers[":scheme"] = "https";
  headers[":authority"] = req.headers.host || "";
  headers["httpVersion"] = req.httpVersion;
  const stream = {
    headers,
    respond: (responseHeaders) => {
      // 转换 HTTP/2 头到 HTTP/1.1
      const status = responseHeaders[":status"] || 200; // 默认状态码 200
      const filteredHeaders = Object.fromEntries(
        Object.entries(responseHeaders).filter(([key]) => !key.startsWith(":"))
      );
      res.writeHead(status, filteredHeaders);
    },
    write: res.write.bind(res), // 代理写入方法
    end: res.end.bind(res), // 代理结束方法
  };
  return stream;
}
function f_stream_default(stream, headers) {
  stream.respond({
    ":status": 200,
    "content-type": "application/json",
  });
  if (headers["httpVersion"]) {
    stream.write(JSON.stringify({ hello: "http" + headers["httpVersion"] }));
  } else {
    stream.write(JSON.stringify({ hello: "http2" }));
  }
  stream.end();
}
function f_stream_test(stream, headers) {
  stream.respond({
    ":status": 200,
    "content-type": "application/json",
  });
  stream.write(JSON.stringify(headers));
  stream.end();
}

if (process.argv[1].endsWith("h2server.js")) {
  xconsole()
  h2s(3001);
  h2s(3002, f_stream_test);
  h2s(3003, { allowHTTP1: false });
  h2s(3004, { allowHTTP1: false }, f_stream_test);
}
