"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
module.exports = __toCommonJS(vite_config_exports);
var import_path = __toESM(require("path"), 1);
var import_vite = require("@sveltejs/kit/vite");
const config = {
  plugins: [(0, import_vite.sveltekit)()],
  resolve: {
    alias: {
      $ts: import_path.default.resolve("./src/ts"),
      $css: import_path.default.resolve("./src/css"),
      $components: import_path.default.resolve("./src/components"),
      $gql: import_path.default.resolve("./src/gql")
    }
  }
};
var vite_config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=vite.config.js.map
