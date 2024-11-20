export { cookie_merge, cookie_obj, cookie_str };

// 客户端是cookie字符串，服务器返回是cookie字符串或cookie数组，
// 请求阶段：合并步骤是都转为对象merge，再变回字符串（cookie_obj cookie_merge）
// 响应阶段：直接操作响应头cookie数组,往往只需要修改和删除。
// 将 set-cookie 数组转换为对象

// 不带属性 考虑undefined '' '   '
function cookie_obj(str) {
  let obj = {};
  if (str) {
    str
      .split(";")
      .map((r) => r.trim())
      .forEach((r) => {
        let a = r.split("=");
        obj[a[0]] = a[1];
      });
  }
  return obj;
}
function cookie_str(obj) {
  return Object.entries(obj)
    .map((r) => r[0] + "=" + r[1])
    .join(";");
}
// 两cookieStr合并，后覆盖前
function cookie_merge(str1, str2) {
  return cookie_str({ ...cookie_obj(str1), ...cookie_obj(str2) });
}

// 使用示例
function demonstrateCookieMerger() {
  const str1 = `token=4862eadf75779858d85cabc82db83234bedd93292e93e7cd7c4d78b04abdd7ba%7C8bca782391f1f0ad54740979e007d03f1abb0aa25b87321779917a3dc8addbdb; oai-did=af9a722d-77c1-426c-8bb3-6ce886c1044d; oai-hlib=true; oai-nav-state=1; _account=a66e010e-43b3-48b3-ab82-a91e835a00ee; _account_residency_region=no_constraint; __Secure-next-auth.callback-url=https%3A%2F%2Fchat-identity-edge-onramp.unified-7.api.openai.com`;
  const str2 = `pzn=666666;token=4; oai-did=a; oai-hlib=false; oai-nav-state=100; _account=a; _account_residency_region=; __Secure-next-auth.callback-url=h`;
  console.log(cookie_merge(str1, str2));
}

if (process.argv[1].endsWith("cookie.js")) {
  demonstrateCookieMerger();
}
