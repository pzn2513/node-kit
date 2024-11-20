import zlib from "zlib"; //异步
import { zstd_compress, zstd_decompress } from "@ghini/zstd-win"; //同步
import { promisify } from "util";
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
// 这里提供直接加解压,大于100m的文件建议创建编解码器流式处理.
// 由原来的函数回调变成更现代化的async语法.
// gzip可以淘汰了,deflate和zstd快,br压缩率最好.
// 将 zlib 的回调函数转换为 Promise。他们可接收字符、typeArray 或 Buffer 类型的数据.最终都会处理成buffer再编解码

// GZip compression
async function gzip(data) {
  return await promisify(zlib.gzip)(data);
}

async function gunzip(compressed) {
  try {
    return await promisify(zlib.gunzip)(compressed);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Deflate compression
async function deflate(data) {
  return await promisify(zlib.deflate)(data);
}

async function inflate(compressed) {
  try {
    return await promisify(zlib.inflate)(compressed);
  } catch (error) {
    throw new Error(error.message);
  }
}
// br compression
async function br_compress(data) {
  return await promisify(zlib.brotliCompress)(data);
}

async function br_decompress(compressed) {
  try {
    return await promisify(zlib.brotliDecompress)(compressed);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Test functions
async function runTests() {
  // const testData =
  // "Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.";
  // const testData = "Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.Hello, 这是一个测试文本！This is a test text with both English and Chinese characters.";
  const testData = `Cloudflare SSL/TLS
  // Encrypt your web traffic to prevent data theft and other tampering.

  // Available on all plans
  // Through Universal SSL, Cloudflare is the first Internet performance and security company to offer free SSL/TLS protection. Cloudflare SSL/TLS also provides a number of other features to meet your encryption requirements and certificate management needs. Refer to Get started for more.

  // Features
  // Total TLS
  // Extending the protection offered by Universal SSL, Total TLS is an easy way to automatically issue certificates for all levels of subdomains that you have.

  // Use Total TLS
  // Delegated DCV
  // Even if you use a different provider for authoritative DNS, you can delegate domain control validation (DCV) to Cloudflare, reducing the need of manual intervention.

  // Use Delegated DCV
  // Custom TLS settings
  // Cloudflare also allows you to specify the minimum TLS version that visitors must use to connect to your website or application, and restrict cipher suites according to your security requirements.

  // Use Custom TLS settings

  // Refer to features and availability for a complete list of SSL/TLS features and their availability according to different Cloudflare plans.

  // Related products
  // Cloudflare DNS
  // When you use Cloudflare DNS, all DNS queries for your domain are answered by Cloudflare’s global anycast network. This network delivers performance and global availability.

  // Cloudflare for SaaS
  // Cloudflare for SaaS allows you to extend the security and performance benefits of Cloudflare’s network to your customers via their own custom or vanity domains.
  // Concepts
  // This page defines and articulates key concepts that are relevant to Cloudflare SSL/TLS and are used in this documentation. For more concepts and broader descriptions, check out the Cloudflare Learning Center ↗.

  // SSL/TLS certificate
  // An SSL/TLS certificate is what enables websites and applications to establish secure connections. With SSL/TLS, a client - such as a browser - can verify the authenticity and integrity of the server it is connecting with, and use encryption to exchange information.

  // Since Cloudflare’s global network ↗ is at the core of several products and services that Cloudflare offers, what this implies in terms of SSL/TLS is that, instead of only one certificate, there can actually be two certificates involved in a single request: an edge certificate and an origin certificate.

  // Edge certificate
  // The edge certificates are the ones that Cloudflare presents to clients visiting your website or application. You can manage edge certificates through the Cloudflare Dashboard ↗.

  // Edge certificate

  // Origin certificate

  // Browser

  // Cloudflare

  // Origin server

  // Origin certificate
  // Origin certificates guarantee the security and authentication on the other side of the network, between Cloudflare and the origin server of your website or application. Origin certificates are managed on your origin server.

  // SSL/TLS encryption modes control whether and how Cloudflare will use both these ceritifcates, and you can choose between different modes on the SSL/TLS overview page ↗.

  // Validity period
  // One common aspect of every SSL/TLS certificate is that they must have a fixed expiration date. If a certificate is expired, clients - such as your visitor’s browser - will consider that a secure connection cannot be established, resulting in warnings or errors.

  // Different certificate authorities (CAs) support different validity periods. Cloudflare works with them to guarantee that both Universal and Advanced edge certificates are always renewed.

  // Certificate authority (CA)
  // A certificate authority (CA) is a trusted third party that generates and gives out SSL/TLS certificates. The CA digitally signs the certificates with their own private key, allowing client devices - such as your visitor’s browser - to verify that the certificate is trustworthy.

  // As explained in the article about what is an ssl certificate ↗, this means that, besides not being expired, an SSL/TLS certificate should be issued by a certificate authority (CA) in order to avoid warnings or errors.

  // Validation level
  // SSL/TLS certificates vary in terms of the level to which a CA has validated them. As explained in the article about types of certificates ↗, SSL/TLS certificates can be DV (Domain Validated), OV (Organization Validated) or EV (Extended Validation).

  // Certificates issued through Cloudflare - Universal, Advanced, and Custom Hostname certificates - are Domain Validated (DV). You can upload a custom certificate if your organization needs OV or EV certificates.

  // Origin pull
  // When visitors request content from your website or application, Cloudflare first attempts to serve content from the cache ↗. If this attempt fails, Cloudflare sends a request back to your origin web server to get the content. This request between Cloudflare and your origin web server is called origin pull.

  // This relates to the difference between edge certificates and origin certificates, and also explains why some specifications such as cipher suites can be set differently depending on whether they refer to the connection between Cloudflare and your visitor’s browser or between Cloudflare and your origin server.

  // Cipher suites
  // Besides the authentication and integrity aspects that valid certificates guarantee, the other important aspect of SSL/TLS certificates is encryption. Cipher suites determine the set of algorithms that can be used for encryption/decryption and that will be negotiated during an SSL/TLS handshake ↗.

  // For the purpose of this documentation, keep in mind that cipher suites supported at Cloudflare’s network may not be the same as cipher suites presented by Cloudflare to your origin server.

  // Trust store
  // The list of certificate authority (CA) and intermediate certificates that are trusted by operating systems, web browsers or other software that interacts with SSL/TLS certificates is called trust store. Cloudflare maintains its trust store on a public GitHub repository ↗.

  // While for most cases you do not have to worry about this list or how it is used when a client checks your SSL/TLS certificate, some features such as Custom Origin Trust Store, and processes such as bundle methodologies, are directly related to it.

  // Chain of trust
  // Depending on your organization requirements, or if you have to troubleshoot an issue with your certificates, for example, you might come across the terms root certificate, intermediate certificate and leaf certificate.

  // These terms refer to the way in which the certificate presented to a client - the leaf certificate - has to be traceable back to a trusted certificate authority (CA) certificate - the root certificate ↗. This process is structured around a chain of trust ↗.

  // Edit page
  // Cloudflare Dashboard
  // Discord
  // Community
  // Learning Center
  // Support Portal
  // Cookie Preferences
  // Get started
  // Follow the steps below to enable SSL/TLS protection for your application.

  // Before you begin
  // Create an account and register an application
  // Choose an edge certificate
  // As explained in the concepts page, edge certificates are the SSL/TLS certificates that Cloudflare presents to your visitors.

  // Cloudflare offers a variety of options for your application’s edge certificates:

  // Universal certificates:
  // By default, Cloudflare issues — and renews — free, unshared, publicly trusted SSL certificates to all domains added to and activated on Cloudflare.

  // Advanced certificates:
  // Use advanced certificates when you want something more customizable than Universal SSL but still want the convenience of SSL certificate issuance and renewal.

  // Custom certificates:
  // Custom certificates are meant for Business and Enterprise customers who want to use their own SSL certificates.

  // Keyless certificates (Enterprise only):
  // Keyless SSL allows security-conscious clients to upload their own custom certificates and benefit from Cloudflare, but without exposing their TLS private keys.

  // Refer to Edge certificates for more information on how different certificate types can respond to common use cases.

  // For SaaS providers

  // Cloudflare for SaaS allows you to extend the security and performance benefits of Cloudflare’s network to your customers via their own custom or vanity domains.

  // For more details, refer to Cloudflare for SaaS (managed hostnames).

  // Choose your encryption mode
  // Once you have chosen your edge certificate, choose an encryption mode.

  // Encryption modes specify how Cloudflare encrypts connections between (a) visitors and Cloudflare, and (b) Cloudflare and your origin server. For more context about this two-part process refer to the concepts page.

  // Note that some encryption modes will require you to have a valid origin certificate, which is managed on your origin server. Each encryption mode setup page lists out this and other requirements and you can also consider other Cloudflare options to use with your origin server, such as Origin CA certificates.

  // Enforce HTTPS connections
  // Even if your application has an active edge certificate, visitors can still access resources over unsecured HTTP connections.

  // Using various Cloudflare settings, however, you can force all or most visitor connections to use HTTPS.

  // Optional - Enable additional features
  // After you have chosen your encryption mode and enforced HTTPS connections, evaluate the following settings:

  // Edge certificates: Customize different aspects of your edge certificates, from enabling Opportunistic Encryption to specifying a Minimum TLS Version.
  // Authenticated origin pull: Ensure all requests to your origin server originate from the Cloudflare network.
  // Notifications: Set up alerts related to certificate validation status, issuance, deployment, renewal, and expiration.
  // Edit page
  // Cloudflare Dashboard
  // Discord
  // Community
  // Learning Center
  // Support Portal
  // Cookie Preferences
  // `;
  console.log("Original size:", Buffer.from(testData).length, "bytes");

  try {
    // Test GZip
    let start, end;
    console.log("\n=== Testing GZip ===");
    start = Date.now();
    const gzipped = await gzip(testData);
    console.log("Compressed size:", gzipped.length, "bytes");
    const gzipDecoded = await gunzip(gzipped);
    console.log(
      "GZip compression ratio:",
      ((1 - gzipped.length / Buffer.from(testData).length) * 100).toFixed(2) +
        "%"
    );
    console.log("GZip test passed:", testData === gzipDecoded.toString());
    console.log("GZip time:", Date.now() - start, "ms");

    // Test Deflate
    console.log("\n=== Testing Deflate ===");
    start = Date.now();
    const deflated = await deflate(testData);
    console.log("Compressed size:", deflated.length, "bytes");
    const deflateDecoded = await inflate(deflated);
    console.log(
      "Deflate compression ratio:",
      ((1 - deflated.length / Buffer.from(testData).length) * 100).toFixed(2) +
        "%"
    );
    console.log("Deflate test passed:", testData === deflateDecoded.toString());
    console.log("Deflate time:", Date.now() - start, "ms");

    // Test br
    console.log("\n=== Testing br ===");
    start = Date.now();
    const br = await br_compress(testData);
    console.log("Compressed size:", br.length, "bytes");
    const brDecoded = await br_decompress(br);
    console.log(
      "br compression ratio:",
      ((1 - br.length / Buffer.from(testData).length) * 100).toFixed(2) + "%"
    );
    console.log("br test passed:", testData === brDecoded.toString());
    console.log("br time:", Date.now() - start, "ms");

    // Test zstd
    console.log("\n=== Testing zstd ===");
    start = Date.now();
    const zstd = await zstd_compress(testData);
    console.log("Compressed size:", zstd.length, "bytes");
    const zstdDecoded = await zstd_decompress(zstd);
    console.log(
      "zstd compression ratio:",
      ((1 - zstd.length / Buffer.from(testData).length) * 100).toFixed(2) + "%"
    );
    console.log("zstd test passed:", testData === zstdDecoded.toString());
    console.log("zstd time:", Date.now() - start, "ms");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

if (process.argv[1].endsWith("codec.js")) {
  runTests();
}
