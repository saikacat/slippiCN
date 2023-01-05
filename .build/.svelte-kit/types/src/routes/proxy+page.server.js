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
var import_database = __toESM(require("$ts/database/database"), 1);
var import_tier = require("$ts/types/tier");
const load = async () => {
  const db = await import_database.default;
  const playersCollection = db.collection("players");
  const dbPlayers = await playersCollection.find().toArray();
  const players = dbPlayers.map((x) => {
    const split = x.data.slippi_code.split("#");
    const characters = x.data.characters || [];
    characters.sort((a, b) => b.proportion - a.proportion);
    let tier = "Unranked";
    if (x.data.wins !== null) {
      if (x.data.sets < 5) {
        tier = "Pending";
      } else {
        tier = (0, import_tier.getTierFromRating)(x.data.rating);
      }
    }
    const rating = x.data.sets >= 5 ? x.data.rating : null;
    return {
      name: x.name,
      slippiName: x.data.slippi_name,
      slippiTag: split[0],
      slippiDiscriminator: split[1],
      characters,
      rating,
      tier,
      sets: x.data.sets,
      wins: x.data.wins,
      losses: x.data.losses
    };
  });
  players.sort((a, b) => {
    const compareRating = (b.rating ?? 0) - (a.rating ?? 0);
    if (compareRating !== 0) {
      return compareRating;
    }
    if (a.tier !== b.tier) {
      if (a.tier === "Pending") {
        return -1;
      } else {
        return 1;
      }
    }
    const bw = b.wins ?? 0;
    const bl = b.losses ?? 0;
    const aw = a.wins ?? 0;
    const al = a.losses ?? 0;
    return (bw / (bw + bl) || 0) - (aw / (aw + al) || 0);
  });
  const statsCollection = db.collection("stats");
  if (!await statsCollection.countDocuments()) {
    await statsCollection.insertOne({ lastUpdate: new Date(0) });
  }
  const lastUpdate = (await statsCollection.findOne({})).lastUpdate;
  return {
    players,
    lastUpdate
  };
};
;
null;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  load
});
//# sourceMappingURL=proxy+page.server.js.map
