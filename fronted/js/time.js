function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('local-time').textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

const time = new Date();
if (time.getHours() >= 6 && time.getHours() <= 24) {
    let isOperating = true;
    document.getElementById('operation-status').textContent = '运营中';
} else {
    let isOperating = false;
    document.getElementById('operation-status').textContent = '停止运营';
    document.getElementById('operation-status').style.color = 'red';
}