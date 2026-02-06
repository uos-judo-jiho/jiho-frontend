const path = require("path");
const baseConfig = require("../web/tailwind.config.cjs");

module.exports = {
  ...baseConfig,
  content: Array.from(
    new Set([
      ...baseConfig.content,
      path.join(__dirname, "index.html"),
      path.join(__dirname, "src/**/*.{ts,tsx,js,jsx}"),
      path.join(__dirname, "../web/src/**/*.{ts,tsx,js,jsx}"),
    ]),
  ),
};
