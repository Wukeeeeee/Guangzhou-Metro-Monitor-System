async function initDashboard() {
    const dashboardjson = await fetch('http://127.0.0.1:8000/dashboard');
    const data = await dashboardjson.json();
    const hour = new Date().getHours();
    const isOperating = hour >= 6 && hour <= 24;
    const onTimeRate = document.getElementById('on-time-rate')
    const CorrectRate = onTimeRate>= 95;


if (isOperating && CorrectRate) {
    document.getElementById('on-time-rate').textContent = data.onTimeRate;
    document.getElementById('online-trains').textContent = data.onlineTrains;
    document.getElementById('system-status').textContent = data.systemStatus;
} 
if (isOperating && !CorrectRate) {
    document.getElementById('on-time-rate').textContent = data.onTimeRate;
    document.getElementById('on-time-rate').style.color = 'red';
    document.getElementById('online-trains').textContent = data.onlineTrains;
    document.getElementById('system-status').textContent = '异常';
    document.getElementById('system-status').style.color = 'red';
    document.body.classList.add('abnormal-alert')
    addAlarmToList('系统异常', '准点率低于95%', data.updatetime);
}
if (!isOperating) {
    document.getElementById('on-time-rate').textContent = 'N/A';
    document.getElementById('online-trains').textContent = 'N/A';
    document.getElementById('system-status').textContent = 'N/A';
}
}

initDashboard();