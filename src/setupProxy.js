const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("setupProxy");
  app.use(
    "/login",
    createProxyMiddleware({
      target: "https://uosjudo.com",
      changeOrigin: true,
      pathRewrite: {
        "^/login": "",
      },
    })
  );
};
