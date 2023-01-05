"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tier_exports = {};
__export(tier_exports, {
  getSlugFromTier: () => getSlugFromTier,
  getTierFromRating: () => getTierFromRating
});
module.exports = __toCommonJS(tier_exports);
const ratingMap = [
  { rating: 2191.75, tier: "Grandmaster" },
  { rating: 2350, tier: "Master 3" },
  { rating: 2275, tier: "Master 2" },
  { rating: 2191.75, tier: "Master 1" },
  { rating: 2136.28, tier: "Diamond 3" },
  { rating: 2073.67, tier: "Diamond 2" },
  { rating: 2003.92, tier: "Diamond 1" },
  { rating: 1927.03, tier: "Platinum 3" },
  { rating: 1843, tier: "Platinum 2" },
  { rating: 1751.83, tier: "Platinum 1" },
  { rating: 1653.52, tier: "Gold 3" },
  { rating: 1548.07, tier: "Gold 2" },
  { rating: 1435.48, tier: "Gold 1" },
  { rating: 1315.75, tier: "Silver 3" },
  { rating: 1188.88, tier: "Silver 2" },
  { rating: 1054.87, tier: "Silver 1" },
  { rating: 913.72, tier: "Bronze 3" },
  { rating: 765.43, tier: "Bronze 2" },
  { rating: 0, tier: "Bronze 1" }
];
const slugMap = {
  "Unranked": "unranked",
  "Pending": "pending",
  "Bronze 1": "bronze-1",
  "Bronze 2": "bronze-2",
  "Bronze 3": "bronze-3",
  "Silver 1": "silver-1",
  "Silver 2": "silver-2",
  "Silver 3": "silver-3",
  "Gold 1": "gold-1",
  "Gold 2": "gold-2",
  "Gold 3": "gold-3",
  "Platinum 1": "platinum-1",
  "Platinum 2": "platinum-2",
  "Platinum 3": "platinum-3",
  "Diamond 1": "diamond-1",
  "Diamond 2": "diamond-2",
  "Diamond 3": "diamond-3",
  "Master 1": "master-1",
  "Master 2": "master-2",
  "Master 3": "master-3",
  "Grandmaster": "grandmaster"
};
function getSlugFromTier(tier) {
  return slugMap[tier];
}
function getTierFromRating(rating) {
  for (const bracket of ratingMap) {
    if (rating >= bracket.rating) {
      return bracket.tier;
    }
  }
  return "Unranked";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSlugFromTier,
  getTierFromRating
});
//# sourceMappingURL=tier.js.map
