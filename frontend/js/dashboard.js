async function initDashboard() {
    const dashboardjson = await fetch('http://127.0.0.1:8000/dashboard');
    const data = await dashboardjson.json();
    const hour = new Date().getHours();
    const isOperating = hour >= 6 && hour <= 24;

if (isOperating) {
    document.getElementById('on-time-rate').textContent = data.onTimeRate;
    document.getElementById('online-trains').textContent = data.onlineTrains;
    document.getElementById('system-status').textContent = data.systemStatus;
} else {
    document.getElementById('on-time-rate').textContent = 'N/A';
    document.getElementById('online-trains').textContent = 'N/A';
    document.getElementById('system-status').textContent = 'N/A';
}
}

initDashboard();