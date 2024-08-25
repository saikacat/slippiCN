import dotenv from "dotenv";
dotenv.config();

import dbPromise from "../src/ts/database/database";
import type { DatabasePlayer } from "../src/ts/database/schemas";

async function initRatingHistory() {
    const db = await dbPromise;
    const playersCollection = db.collection<DatabasePlayer>("players");

    const players = await playersCollection.find().toArray();

    for (const player of players) {
        if (player.data.rating !== undefined && player.data.rating !== null) {
            await playersCollection.updateOne(
                { id: player.id },
                {
                    $set: {
                        "data.ratingHistory": [{
                            date: new Date(),
                            rating: player.data.rating
                        }]
                    }
                }
            );
        }
    }

    console.log("Rating history initialized in players collection for existing users");
}

initRatingHistory().catch(console.error);