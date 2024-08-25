import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabaseRatingHistory, DatabaseStats } from "$ts/database/schemas";

import { Receiver } from "@upstash/qstash";
import { getPlayersById } from "$ts/api/slippi";
import { respond } from "$ts/api/respond";

import { API_SECRET, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "$env/static/private";

import dbPromise from "$ts/database/database";

const batch_size = 25;

const qstash = new Receiver({
    currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});

export const POST: RequestHandler = async (event: RequestEvent) => {
    const startTime = Date.now();

    let ok = event.request.headers.get("authorization") === `Bearer ${API_SECRET}`;
    
    ok = ok || await qstash.verify({
        signature: event.request.headers.get("upstash-signature") ?? "",
        body: await event.request.text()
    });

    if (!ok) {
        return respond(401, {
            "status": "error",
            "message": "nice try"
        });
    }

    const db = await dbPromise;
    const dbConnectTime = Date.now() - startTime;
    console.log(`Database connection time: ${dbConnectTime}ms`);

    const playersCollection = db.collection<DatabasePlayer>("players");
    const ratingHistoryCollection = db.collection<DatabaseRatingHistory>("rating_history");

    const fetchStartTime = Date.now();
    const players = await playersCollection.find({}, { projection: { id: 1, "data.rating": 1 } }).toArray();
    const fetchTime = Date.now() - fetchStartTime;
    console.log(`Fetch players time: ${fetchTime}ms`);

    const ids = players.map(x => x.id);

    console.log(`Updating ${ids.length} players...`);

    const bulkOps: any[] = [];
    const ratingHistoryOps: any[] = [];

    const updateStartTime = Date.now();
    while (ids.length) {
        const currentIds = ids.splice(0, batch_size);
        console.time('getPlayersById');
        const updatedPlayers = await getPlayersById(currentIds);
        console.timeEnd('getPlayersById');

        const currentPlayers = players.filter(p => currentIds.includes(p.id));

        bulkOps.push(...currentIds.map((id, index) => ({
            updateOne: {
                filter: { id },
                update: { $set: { data: updatedPlayers[index] } }
            }
        })));

        ratingHistoryOps.push(...currentIds
            .filter((id, index) => {
                const currentPlayer = currentPlayers.find(p => p.id === id);
                return currentPlayer?.data?.rating !== updatedPlayers[index]?.rating;
            })
            .map((id, index) => ({
                updateOne: {
                    filter: { playerId: id },
                    update: {
                        $push: {
                            history: {
                                $each: [{ date: new Date(), rating: updatedPlayers[index]?.rating }],
                                $slice: -100
                            }
                        }
                    },
                    upsert: true
                }
            })));
    }
    const updateTime = Date.now() - updateStartTime;
    console.log(`Update players time: ${updateTime}ms`);

    const bulkWriteStartTime = Date.now();
    if (bulkOps.length > 0) {
        await playersCollection.bulkWrite(bulkOps);
    }
    if (ratingHistoryOps.length > 0) {
        await ratingHistoryCollection.bulkWrite(ratingHistoryOps);
    }
    const bulkWriteTime = Date.now() - bulkWriteStartTime;
    console.log(`Bulk write time: ${bulkWriteTime}ms`);

    const statsUpdateStartTime = Date.now();
    const statsCollection = db.collection<DatabaseStats>("stats");
    await statsCollection.updateOne({}, { $set: { lastUpdate: new Date() } }, { upsert: true });
    const statsUpdateTime = Date.now() - statsUpdateStartTime;
    console.log(`Stats update time: ${statsUpdateTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(`Total execution time: ${totalTime}ms`);

    return respond(200, {
        "status": "success",
        "timings": {
            dbConnect: dbConnectTime,
            fetchPlayers: fetchTime,
            updatePlayers: updateTime,
            bulkWrite: bulkWriteTime,
            statsUpdate: statsUpdateTime,
            total: totalTime
        }
    });
};