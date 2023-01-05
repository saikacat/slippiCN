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
var server_exports = {};
__export(server_exports, {
  POST: () => POST
});
module.exports = __toCommonJS(server_exports);
var import_slippi = require("$ts/api/slippi");
var import_respond = require("$ts/api/respond");
var import_database = __toESM(require("$ts/database/database"), 1);
const POST = async (event) => {
  const db = await import_database.default;
  const bansCollection = db.collection("bans");
  if (await bansCollection.findOne({ ip: event.getClientAddress() })) {
    return (0, import_respond.respond)(403, {
      "status": "error",
      "message": "no"
    });
  }
  const json = await event.request.json();
  if (!json.code) {
    return (0, import_respond.respond)(400, {
      "status": "error",
      "message": "No code provided!"
    });
  }
  if (!json.name) {
    return (0, import_respond.respond)(400, {
      "status": "error",
      "message": "No name provided!"
    });
  }
  console.log(`Trying to add ${json.name} (${json.code})...`);
  const collection = db.collection("players");
  const id = await (0, import_slippi.getIdByCode)(json.code);
  if (!id) {
    return (0, import_respond.respond)(404, {
      "status": "error",
      "message": "Player not found!"
    });
  }
  if (await collection.findOne({ id })) {
    return (0, import_respond.respond)(409, {
      "status": "error",
      "message": "Player already exists!"
    });
  }
  const playerData = await (0, import_slippi.getPlayersById)([id]);
  const player = {
    id,
    name: json.name,
    data: playerData[0],
    addedIp: event.getClientAddress(),
    addedDate: new Date()
  };
  collection.insertOne(player);
  return (0, import_respond.respond)(201, {
    "status": "success",
    "data": {
      "slug": playerData[0].slippi_code.toLowerCase().replace("#", "-")
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  POST
});
//# sourceMappingURL=+server.js.map
