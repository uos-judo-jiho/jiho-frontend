require("ignore-styles");

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server.js");
