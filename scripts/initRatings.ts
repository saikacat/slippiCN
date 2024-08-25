import dotenv from "dotenv";
dotenv.config();

import dbPromise from "../src/ts/database/database";
import type { DatabasePlayer, DatabaseRatingHistory } from "../src/ts/database/schemas";

async function initRatingHistory() {
    const db = await dbPromise;
    const playersCollection = db.collection<DatabasePlayer>("players");
    const ratingHistoryCollection = db.collection<DatabaseRatingHistory>("rating_history");

    const players = await playersCollection.find().toArray();

    for (const player of players) {
        if (player.data.rating !== undefined && player.data.rating !== null) {
            await ratingHistoryCollection.updateOne(
                { playerId: player.id },
                {
                    $setOnInsert: {
                        playerId: player.id,
                        playerName: player.name,
                        history: [{
                            date: new Date(),
                            rating: player.data.rating
                        }]
                    }
                },
                { upsert: true }
            );
        }
    }

    console.log("Rating history initialized for existing users");
}

initRatingHistory().catch(console.error);