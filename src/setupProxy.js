const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://uosjudo.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
      ws: true,
    })
  );
};
