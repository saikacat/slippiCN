import type { RequestHandler } from "@sveltejs/kit";
import type { DatabaseRatingHistory } from "$ts/database/schemas";
import dbPromise from "$ts/database/database";
import { respond } from "$ts/api/respond";

export const GET: RequestHandler = async ({ url }) => {
    const playerName = url.searchParams.get("playerName");

    if (!playerName) {
        return respond(400, {
            status: "error",
            message: "Player ID is required"
        });
    }

    const db = await dbPromise;
    const ratingHistoryCollection = db.collection<DatabaseRatingHistory>("rating_history");

    const ratingHistory = await ratingHistoryCollection.findOne({ playerName: playerName });

    if (!ratingHistory) {
        return respond(404, {
            status: "error",
            message: "Rating history not found"
        });
    }

    return respond(200, {
        status: "success",
        data: ratingHistory.history
    });
};