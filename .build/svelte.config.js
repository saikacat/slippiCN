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
var svelte_config_exports = {};
__export(svelte_config_exports, {
  default: () => svelte_config_default
});
module.exports = __toCommonJS(svelte_config_exports);
var import_adapter_vercel = __toESM(require("@sveltejs/adapter-vercel"), 1);
var import_svelte_preprocess = __toESM(require("svelte-preprocess"), 1);
const config = {
  preprocess: (0, import_svelte_preprocess.default)(),
  kit: {
    adapter: (0, import_adapter_vercel.default)(),
    files: {
      routes: "src/routes"
    }
  }
};
var svelte_config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=svelte.config.js.map
