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
var import_qstash = require("@upstash/qstash");
var import_slippi = require("$ts/api/slippi");
var import_respond = require("$ts/api/respond");
var import_private = require("$env/static/private");
var import_database = __toESM(require("$ts/database/database"), 1);
const batch_size = 25;
const qstash = new import_qstash.Receiver({
  currentSigningKey: import_private.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: import_private.QSTASH_NEXT_SIGNING_KEY
});
const POST = async (event) => {
  let ok = event.request.headers.get("authorization") === `Bearer ${import_private.API_SECRET}`;
  ok = ok || await qstash.verify({
    signature: event.request.headers.get("upstash-signature") ?? "",
    body: await event.request.text()
  });
  if (!ok) {
    return (0, import_respond.respond)(401, {
      "status": "error",
      "message": "nice try"
    });
  }
  const db = await import_database.default;
  const playersCollection = db.collection("players");
  const players = await playersCollection.find().toArray();
  const ids = players.map((x) => x.id);
  console.log(`Updating ${ids.length} players...`);
  while (ids.length) {
    const currentIds = [];
    for (let i = 0; i < batch_size && ids.length; i++) {
      currentIds.push(ids.shift());
    }
    const players2 = await (0, import_slippi.getPlayersById)(currentIds);
    for (let i = 0; i < currentIds.length; i++) {
      playersCollection.findOneAndUpdate({ id: currentIds[i] }, { $set: { data: players2[i] } });
    }
  }
  const statsCollection = db.collection("stats");
  if (!await statsCollection.countDocuments()) {
    statsCollection.insertOne({ lastUpdate: new Date(0) });
  }
  await statsCollection.findOneAndUpdate({}, { $set: { lastUpdate: new Date() } });
  console.log(`Done updating.`);
  return (0, import_respond.respond)(200, {
    "status": "success"
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  POST
});
//# sourceMappingURL=+server.js.map
