<script lang="ts">
    import "$css/main.css";

    import { onMount } from "svelte";

    import Character from "$components/Character.svelte";

    import type { Player } from "$ts/types/player";

    import { DateTime } from "luxon";

    import { getSlugFromTier } from "$ts/types/tier";

    import type { PageData } from "./$types";

    import RatingHistory from '$components/RatingHistory.svelte';

    import { inject } from '@vercel/analytics'
    inject();
    export let data: PageData;

    const otherLeaderboards = [
        { code: "us_az", name: "Arizona", url: "https://joemama0s.github.io/AZSlippiLeaderboard/#/" },
        { code: "us_ar", name: "Arkansas", url: "https://smaneil.github.io/ArSlippiLeaderboard/#/" },
        { code: "us_wa", name: "Washington", url: "https://slippi.poyo.dev/" },
        { code: "us_co", name: "Colorado", url: "https://grantismo.github.io/CoSlippiLeaderboard/#/" },
        { code: "us_in", name: "Indiana", url: "https://freemanb2.github.io/InSlippiLeaderboard/#/" },
        { code: "us_ia", name: "Iowa", url: "https://teolandon.github.io/IaSlippiLeaderboard/#/" },
        { code: "us_mo", name: "Missouri", url: "https://timtempor.github.io/MOSlippiLeaderboard/#/" },
        { code: "us_ca", name: "Norcal", url: "https://costasford.github.io/NorcalSlippiLeaderboard/#/" },
        { code: "us_ne", name: "New England", url: "https://benjaminsg.github.io/NESlippiLeaderboard/#/" },
        { code: "us_nm", name: "New Mexico", url: "https://izzythecubemaster.github.io/NMSlippiLeaderboard/#/" },
        { code: "ca_qc", name: "Quebec", url: "https://tokage2000.github.io/QCSlippiLeaderboard/#/" },
        { code: "uk_ab", name: "Scotland", url: "https://melee-leaderboards.github.io/Scotland/" },
        { code: null, name: "Siouxland", url: "https://melangestillraces.github.io/SiouxlandSlippiLeaderboard/#/" },
        { code: null, name: "South America", url: "https://caioicy.github.io/slippi-leaderboard-sa/#/" },
        { code: "us_tx", name: "Texas", url: "https://timothysdavis00.github.io/TXSlippiLeaderboard/#/" },
        { code: "uk", name: "United Kingdom", url: "https://spirrit.github.io/UKSlippiLeaderboard/#/" },
    ];

    const players = data.players;
    const lastUpdate = DateTime.fromJSDate(data.lastUpdate);

    let ago = lastUpdate.toRelative();

    function slug(player: Player) {
        return `${player.slippiTag.toLowerCase()}-${player.slippiDiscriminator}`;
    }

    let showRatingHistory: { [key: string]: boolean } = {};

    function toggleRatingHistory(playerId: string) {
        showRatingHistory[playerId] = !showRatingHistory[playerId];
    }

    onMount(() => {
        setInterval(() => ago = lastUpdate.toRelative(), 500);

        if (window.location.hash) {
            const slug = window.location.hash.substring(1);

            const anchor = document.querySelector(`a[name="${slug}"]`);
            const row = anchor?.parentElement?.parentElement; // all because firefox doesn't support :has by default...

            if (row) {
                row.style.animation = "";
            }
        }
    });

</script>

<svelte:head>
    <title>Vancouver Slippi Leaderboard</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<h1><img src="/flags/va.svg" class="flag"/>Vancouver Slippi Leaderboard</h1>
<p class="ago">Last updated {ago}</p>

<table>
    <thead>
        <tr>
            <th class="rank">Rank</th>
            <th class="player">Player</th>
            <th class="characters">Characters</th>
            <th class="rating">Rating</th>
            <th class="wl">W / L</th>
        </tr>
    </thead>
    <tbody>
        {#each players as player, i}
            <tr class="animate" style="animation: none;">
                <td class="rank">{player.rating ? i + 1 : "—"}</td>
                <td class="player">
                    <!-- svelte-ignore a11y-missing-content -->
                    <a class="anchor" id={slug(player)} />
                    <p class="name"><a href="https://slippi.gg/user/{slug(player)}">{player.name}</a></p>
                    <p class="slippi">
                        <span class="slippi-tag">{player.slippiTag}#{player.slippiDiscriminator}</span>
                        <span class="slash">/</span>
                        <span class="slippi-name">{player.slippiName}</span>
                    </p>
                </td>
                <td class="characters">
                    {#each player.characters.slice(0, 3) as character}
                        <Character character={character.character} proportion={character.proportion}/>{" "} <!-- lmao??? -->
                    {/each}
                    {#if player.characters.length > 3}
                        <div class="extra">+{player.characters.length - 3}</div>
                    {/if}
                </td>
                <td class="rating">
                    {player.rating?.toFixed(1) ?? "⸻"}
                    <img src="/ranks/{getSlugFromTier(player.tier)}.svg" class="tier" alt="{player.tier}" title="{player.tier}"/>
                    <button on:click={() => toggleRatingHistory(player.name)} class="history-link">
                        {showRatingHistory[player.name] ? 'Hide History' : 'Show History'}
                    </button>
                </td>
                <td class="wl"><span class:wins={player.wins !== null}>{player.wins ?? "⸺"}</span> <span class="slash">/</span> <span class:losses={player.losses !== null}>{player.losses ?? "⸺"}</span></td>
            </tr>
            {#if showRatingHistory[player.name]}
                <tr>
                    <td colspan="5">
                        <RatingHistory playerName={player.name} playerId={player.name} currentRating={player.rating} />
                    </td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="navigation">
    <p>Other leaderboards</p>
    <ul>
        {#each otherLeaderboards as leaderboard}
            <a href={leaderboard.url}><li><img src="/flags/{leaderboard.code}.svg" class="flag"/> {leaderboard.name}</li></a>    
        {/each}
    </ul>
</div>
<div style="center; text-align: center;">
    <a href="https://github.com/saikacat" target="_blank" rel="noopener noreferrer">Saika</a>
</div>
<style>
    .flag {
        display: inline-block;
        vertical-align: middle;
        height: 0.7em;
        border-radius: 3px;
        margin: 0 0.3em;
        margin-bottom: 0.13em;
    }

    h1 {
        font-size: 2.6em;
        line-height: 1em;
        text-align: center;
        margin-bottom: 18px;
    }

    .ago {
        text-align: center;
        color: var(--color-foreground-dark);
    }

    .navigation {
        background-color: var(--color-background-light);
        position: absolute;
        top: 16px;
        left: 16px;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .navigation .flag {
        height: 1em;
    }

    .navigation > p {
        font-weight: 500;
    }

    .navigation > ul {
        list-style: none;
        display: none;
    }

    .navigation:hover > ul {
        display: unset;
    }

    .navigation > ul, .navigation > p {
        margin: 0;
        padding: 0;
    }

    .navigation li {
        border-top: 1px solid var(--color-background);
    }

    .navigation li:hover {
        background-color: var(--color-background-lighter);
        color: var(--color-foreground);
    }

    .navigation li, .navigation > p {
        padding: 12px 24px;
    }

    .anchor {
        position: absolute;
        top: -12px;
        left: 0;
    }

    table {
        width: 100%;
        max-width: 940px;
        margin: 26px auto 24px;
        background-color: var(--color-background-light);
        border-radius: 4px;
        table-layout: fixed;
        border-collapse: collapse;
    }

    th {
        color: var(--color-foreground-darkest);
        font-family: "Maven Pro";
        font-weight: 500;
        text-align: left;
        text-transform: uppercase;
    }

    td {
        position: relative;
    }

    th, td {
        padding: 6px 16px;
        line-height: 1.5;
    }

    tr {
        border-collapse: separate;
        border-bottom: 1px solid var(--color-background);
    }

    tbody tr:last-child {
        border-bottom: none;
    }

    a:link {
        text-decoration: none;
    }

    a:focus-visible {
        text-decoration: underline;
    }

    /* column widths */

    .rank {
        width: 50px;
    }

    .player {
        width: 220px;
    }

    .rating {
        width: 140px;
    }

    .wl {
        width: 80px;
    }

    .characters {
        width: 190px;
    }

    /* column styles */

    th.rank, th.rating, th.wl {
        text-align: center;
    }

    td.rank {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
    }

    td.player > p {
        margin: 0;
    }

    .name {
        font-size: 18px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .slippi {
        color: var(--color-foreground-darker);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .slash { color: var(--color-foreground-darkest); }

    .extra {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--color-foreground-darkest);
        display: inline-block;
        padding-left: 2px;
        width: 44px;
        height: 44px;
        line-height: 44px;
        vertical-align: top;
    }

    td.characters {
        padding-top: 11px;
        padding-bottom: 1px;
    }

    td.rating, td.wl {
        font-size: 18px;
        font-weight: 700;
        font-family: "Rubik", "Poyodash";
        font-variant-numeric: tabular-nums;
        text-align: center;
    }

    .tier {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
        margin-bottom: 5px;
        height: 46px;
        width: 56px;
    }

    td.wl {
        color: var(--color-foreground-darkest);
    }

    .wins { color: var(--color-green); }
    .losses { color: var(--color-red); }

    /* animation for anchors */

    .animate {
        animation-name: animate;
        animation-duration: 2.5s;
        animation-timing-function: ease-in;
    }

    @keyframes animate {
        0% { background-color: var(--color-background-lightest); }
        100% { background-color: var(--color-background-light); }
    }

    /*
    mess with columns by width, for mobile etc.
    sorry i don't have a better solution than just hiding as things get smaller
    */

    @media (max-width: 1200px) {
        .navigation {
            display: none;
        }
    }

    @media (max-width: 940px) {
        .tier {
            display: block;
            margin: 6px auto 0;
        }

        .rating {
            width: 70px;
        }

        tr:nth-child(odd):not(thead > tr) {
            background-color: var(--color-background-lighter);
        }
    }

    @media (max-width: 770px) {
        .wl {
            display: none;
        }
    }

    @media (max-width: 656px) {
        .characters {
            display: none;
        }
    }

    @media (max-width: 490px) {
        .player {
            width: auto;
        }
    }

    .history-link {
        display: block;
        margin-top: 5px;
        font-size: 12px;
        color: var(--color-foreground-darker);
        text-decoration: underline;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
    }
</style>