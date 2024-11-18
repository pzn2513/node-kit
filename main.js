const kit = {};
export default kit;
import {
  rf,
  wf,
  xpath,
  arf,
  awf,
  xconsole,
  log,
  err,
  mreplace,
  mreplace_calc,
  xreq,
} from "@ghini/kit-dev/lib/basic.js";
export {
  rf,
  wf,
  xpath,
  arf,
  awf,
  xconsole,
  log,
  err,
  mreplace,
  mreplace_calc,
  xreq,
};
kit.rf = rf;
kit.wf = wf;
kit.xpath = xpath;
kit.arf = arf;
kit.awf = awf;
kit.xconsole = xconsole;
kit.log = log;
kit.err = err;
kit.mreplace = mreplace;
kit.mreplace_calc = mreplace_calc;
kit.xreq = xreq;
import { cookie_merge, cookie_obj, cookie_str } from "./lib/cookie.js";
export { cookie_merge, cookie_obj, cookie_str };
kit.cookie_merge = cookie_merge; //合并cookie
kit.cookie_obj = cookie_obj; //cookie字符转对象
kit.cookie_str = cookie_str; //cookie对象转字符
import {
  gzip,
  gunzip,
  deflate,
  inflate,
  br_compress,
  br_decompress,
  zstd_compress,
  zstd_decompress,
} from "./lib/codec.js";
export {
  gzip,
  gunzip,
  deflate,
  inflate,
  br_compress,
  br_decompress,
  zstd_compress,
  zstd_decompress,
};
kit.gzip = gzip;
kit.gunzip = gunzip;
kit.deflate = deflate;
kit.inflate = inflate;
kit.br_compress = br_compress;
kit.br_decompress = br_decompress;
kit.zstd_compress = zstd_compress;
kit.zstd_decompress = zstd_decompress;
import {h2s} from './lib/h2server.js'
export {h2s}
kit.h2s = h2s
