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
var proxy_page_server_exports = {};
__export(proxy_page_server_exports, {
  load: () => load
});
module.exports = __toCommonJS(proxy_page_server_exports);
var import_kit = require("@sveltejs/kit");
var import_database = __toESM(require("$ts/database/database"), 1);
const load = async (event) => {
  const db = await import_database.default;
  const bansCollection = db.collection("bans");
  if (await bansCollection.findOne({ ip: event.getClientAddress() })) {
    throw (0, import_kit.error)(403, "no");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  load
});
//# sourceMappingURL=proxy+page.server.js.map
