const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["**/api"], {
      target: "https://uosjudo.com",
      changeOrigin: true,
      pathRewrite: (path, _req) => path.replace(/.+\/api\//, "api/"),
    })
  );
};
