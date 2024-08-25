<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { RatingHistoryEntry } from '$ts/types/ratingHistory';

    export let playerId: string;
    export let playerName: string;
    export let currentRating: number | null;

    let history: RatingHistoryEntry[] = [];
    let chartElement: HTMLCanvasElement;
    let chart: Chart | null = null;
    let isLoading = true;
    let error: string | null = null;

    onMount(async () => {
        await fetchData();
    });

    async function fetchData() {
        try {
            isLoading = true;
            error = null;
            const response = await fetch(`/api/ratingHistory?playerName=${encodeURIComponent(playerId)}`);
            const data = await response.json();

            console.log('API response:', data);

            if (data.status === 'success' && Array.isArray(data.data)) {
                history = data.data;
                console.log('History:', history);
                if (history.length > 0) {
                    setTimeout(createChart, 0);
                }
            } else {
                error = 'Failed to fetch rating history or invalid data format';
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            error = 'An error occurred while fetching data';
        } finally {
            isLoading = false;
        }
    }

    function createChart() {
        console.log('Creating chart...');
        if (!chartElement) {
            console.error('Chart element not found');
            return;
        }

        const ctx = chartElement.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context');
            return;
        }

        try {
            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: history.map(entry => new Date(entry.date).toLocaleDateString()),
                    datasets: [{
                        label: 'Rating',
                        data: history.map(entry => entry.rating),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: 'rgb(255, 255, 255)'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'rgb(255, 255, 255)',
                            bodyColor: 'rgb(255, 255, 255)',
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgb(255, 255, 255)'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgb(255, 255, 255)'
                            }
                        }
                    }
                }
            });
            console.log('Chart created successfully');
        } catch (err) {
            console.error('Error creating chart:', err);
            error = 'Failed to create chart';
        }
    }
</script>

<div class="rating-history">
    <h2>{playerName}'s Rating History</h2>
    <p>Current Rating: {currentRating !== null ? currentRating.toFixed(1) : 'N/A'}</p>
    {#if isLoading}
        <p>Loading rating history...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if history.length > 0}
        <div class="chart-container">
            <canvas bind:this={chartElement}></canvas>
        </div>
    {:else}
        <p>No rating history available.</p>
    {/if}
</div>

<style>
    .rating-history {
        padding: 20px;
        background-color: var(--color-background-light);
        border-radius: 8px;
        margin-top: 20px;
    }

    h2 {
        color: var(--color-foreground);
        margin-bottom: 10px;
    }

    .chart-container {
        position: relative;
        height: 400px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
    }

    .error {
        color: red;
    }
</style>