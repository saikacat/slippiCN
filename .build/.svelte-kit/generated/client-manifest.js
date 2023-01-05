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
var client_manifest_exports = {};
__export(client_manifest_exports, {
  dictionary: () => dictionary,
  hooks: () => hooks,
  matchers: () => import_client_matchers.matchers,
  nodes: () => nodes,
  server_loads: () => server_loads
});
module.exports = __toCommonJS(client_manifest_exports);
var import_client_matchers = require("./client-matchers.js");
const nodes = [
  () => import("./nodes/0"),
  () => import("./nodes/1"),
  () => import("./nodes/2"),
  () => import("./nodes/3")
];
const server_loads = [];
const dictionary = {
  "/": [~2],
  "/register": [~3]
};
const hooks = {
  handleError: ({ error }) => {
    console.error(error);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dictionary,
  hooks,
  matchers,
  nodes,
  server_loads
});
//# sourceMappingURL=client-manifest.js.map
