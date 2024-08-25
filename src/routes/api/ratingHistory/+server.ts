import type { RequestHandler } from "@sveltejs/kit";
import type { DatabasePlayer } from "$ts/database/schemas";
import dbPromise from "$ts/database/database";
import { respond } from "$ts/api/respond";

export const GET: RequestHandler = async ({ url }) => {
    const playerName = url.searchParams.get("playerName");

    if (!playerName) {
        return respond(400, {
            status: "error",
            message: "Player name is required"
        });
    }

    const db = await dbPromise;
    const playersCollection = db.collection<DatabasePlayer>("players");

    const player = await playersCollection.findOne({ name: playerName });
    if (!player || !player.data.ratingHistory) {
        return respond(404, {
            status: "error",
            message: "Rating history not found"
        });
    }

    return respond(200, {
        status: "success",
        data: player.data.ratingHistory
    });
};