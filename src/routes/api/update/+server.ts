import type { RequestEvent, RequestHandler } from "./$types";

import type { DatabasePlayer, DatabaseStats } from "$ts/database/schemas";

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

    const fetchStartTime = Date.now();
    const players = await playersCollection.find({}).toArray();
    const fetchTime = Date.now() - fetchStartTime;
    console.log(`Fetch players time: ${fetchTime}ms`);

    const ids = players.map(x => x.id);

    console.log(`Updating ${ids.length} players...`);

    const bulkOps: any[] = [];

    const updateStartTime = Date.now();
    while (ids.length) {
        const currentIds = ids.splice(0, batch_size);
        console.time('getPlayersById');
        const updatedPlayersData = await getPlayersById(currentIds);
        console.timeEnd('getPlayersById');

        currentIds.forEach((id, index) => {
            const player = players.find(p => p.id === id);
            const newRating = updatedPlayersData[index]?.rating;
            const lastRating = player?.data.ratingHistory?.[player.data.ratingHistory.length - 1]?.rating;

            if (lastRating !== newRating && newRating != null) {
                console.log(`Updating player ${id} with new rating: ${newRating}`);
                bulkOps.push({
                    updateOne: {
                        filter: { id: id },
                        update: {
                            $set: { 
                                data: {
                                    ...updatedPlayersData[index],
                                    ratingHistory: [
                                        ...(player?.data.ratingHistory || []),
                                        { date: new Date(), rating: newRating }
                                    ].slice(-100)
                                }
                            }
                        }
                    }
                });
            } else {
                bulkOps.push({
                    updateOne: {
                        filter: { id: id },
                        update: { 
                            $set: { 
                                data: {
                                    ...updatedPlayersData[index],
                                    ratingHistory: player?.data.ratingHistory || []
                                }
                            } 
                        }
                    }
                });
            }
        });
    }
    const updateTime = Date.now() - updateStartTime;
    console.log(`Update players time: ${updateTime}ms`);

    const bulkWriteStartTime = Date.now();
    if (bulkOps.length > 0) {
        await playersCollection.bulkWrite(bulkOps);
    }
    const bulkWriteTime = Date.now() - bulkWriteStartTime;
    console.log(`Bulk write time: ${bulkWriteTime}ms`);
    //console.log('Bulk write operations:', JSON.stringify(bulkOps, null, 2));

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