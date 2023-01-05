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
var slippi_exports = {};
__export(slippi_exports, {
  getIdByCode: () => getIdByCode,
  getPlayersById: () => getPlayersById
});
module.exports = __toCommonJS(slippi_exports);
var import_limiter = require("$ts/state/limiter");
var import_FragmentPlayer = __toESM(require("$gql/FragmentPlayer.gql?raw"), 1);
var import_GetIdByCode = __toESM(require("$gql/GetIdByCode.gql?raw"), 1);
async function getIdByCode(code) {
  await import_limiter.slippiLimiter.removeTokens(1);
  const response = await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
    "headers": {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      operationName: "GetIdByCode",
      query: import_GetIdByCode.default,
      variables: {
        code
      }
    }),
    "method": "POST"
  });
  const data = (await response.json()).data;
  if (!data.getConnectCode) {
    return null;
  }
  return data.getConnectCode.user.fbUid;
}
async function getPlayersById(ids) {
  await import_limiter.slippiLimiter.removeTokens(1);
  const queryParams = ids.map((_, i) => `$i${i}: String!`).join(", ");
  const aliases = ids.map((_, i) => `u${i}: getUser(fbUid: $i${i}) { ...Player }`).join("\n");
  const query = import_FragmentPlayer.default + `query GetPlayersById(${queryParams}) { ${aliases} }`;
  const variables = {};
  for (let i = 0; i < ids.length; i++) {
    variables["i" + i] = ids[i];
  }
  const response = await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
    "headers": {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      operationName: "GetPlayersById",
      query,
      variables
    }),
    "method": "POST"
  });
  const data = (await response.json()).data;
  const players = [];
  for (let i = 0; i < ids.length; i++) {
    players.push(slippiUserToDatabasePlayerData(data["u" + i]));
  }
  return players;
}
const slippiSlugMap = {
  "BOWSER": "Bowser",
  "CAPTAIN_FALCON": "Captain Falcon",
  "DONKEY_KONG": "Donkey Kong",
  "DR_MARIO": "Dr. Mario",
  "FALCO": "Falco",
  "FOX": "Fox",
  "GAME_AND_WATCH": "Mr. Game & Watch",
  "GANONDORF": "Ganondorf",
  "ICE_CLIMBERS": "Ice Climbers",
  "KIRBY": "Kirby",
  "LINK": "Link",
  "LUIGI": "Luigi",
  "MARIO": "Mario",
  "MARTH": "Marth",
  "MEWTWO": "Mewtwo",
  "NESS": "Ness",
  "PEACH": "Peach",
  "PICHU": "Pichu",
  "PIKACHU": "Pikachu",
  "JIGGLYPUFF": "Jigglypuff",
  "ROY": "Roy",
  "SAMUS": "Samus",
  "SHEIK": "Sheik",
  "YOSHI": "Yoshi",
  "YOUNG_LINK": "Young Link",
  "ZELDA": "Zelda"
};
function slippiCharacterToCharacter(slippi) {
  return slippiSlugMap[slippi];
}
function slippiUserToDatabasePlayerData(slippiUser) {
  var _a, _b;
  const totalGameCount = (_a = slippiUser.rankedNetplayProfile.characters) == null ? void 0 : _a.map((x) => x.gameCount).reduce((a, b) => a + b, 0);
  let wins = slippiUser.rankedNetplayProfile.wins;
  let losses = slippiUser.rankedNetplayProfile.losses;
  if (wins || losses) {
    wins = wins ?? 0;
    losses = losses ?? 0;
  }
  return {
    slippi_code: slippiUser.connectCode.code,
    slippi_name: slippiUser.displayName,
    characters: (_b = slippiUser.rankedNetplayProfile.characters) == null ? void 0 : _b.map((x) => ({
      character: slippiCharacterToCharacter(x.character),
      proportion: x.gameCount / totalGameCount
    })),
    rating: slippiUser.rankedNetplayProfile.ratingOrdinal,
    sets: slippiUser.rankedNetplayProfile.ratingUpdateCount,
    wins,
    losses
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getIdByCode,
  getPlayersById
});
//# sourceMappingURL=slippi.js.map
