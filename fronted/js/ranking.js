async function initRanking() {
    const stationRes = await fetch('http://127.0.0.1:8000/ranking')
    const stations = await stationRes.json();


    function fillStationRanking() {
    const container = document.getElementById('station-ranking');
    if (!container) return;

    const data = stations.map(station => ({
        name: station.name,
        count: station.flow
    })).sort((a, b) => b.count - a.count);

    container.innerHTML = data.map((s, i) => `
        <div class="flex items-center justify-between border-b border-outline-variant/30 pb-2">
            <div class="flex items-center gap-3">
                <span class="digital-font text-secondary font-bold">${String(i+1).padStart(2,'0')}</span>
                <span class="headline-font text-sm">${s.name}</span>
            </div>
            <span class="digital-font text-tertiary">${s.count.toLocaleString()}</span>
        </div>
    `).join('');
    }

    fillStationRanking();
    setInterval(fillStationRanking, 5000);
}

initRanking();
