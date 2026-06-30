 const lineStations = ['广州东站','体育中心','体育西路','杨箕','东山口','烈士陵园','农讲所','公园前','西门口','陈家祠','长寿路','黄沙','芳村','花地湾','坑口','西塱'];
function renderLineStatus(statusList) {
console.log(statusList);

const container = document.getElementById('line-status');
if (!container) return;

container.innerHTML = `
<div class="flex flex-col items-center">
    ${lineStations.map((name, i) => {
        const st = statusList ? statusList.find(function(x) { return x.name === name; }) : null;
        const isAbnormal = st && st.status === 'abnormal';
        const dotColor = isAbnormal ? '#ef4444' : '#22c55e';
        const shadowColor = isAbnormal ? 'rgba(239,68,68,0.6)' : 'rgba(34,197,94,0.6)';
        const lineColor = isAbnormal ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)';
        const statusText = isAbnormal ? '● 异常' : '● 正常';
        const statusColor = isAbnormal ? '#ef4444' : '#22c55e';
        return `
        <div class="flex items-center gap-2" style="margin:0;">
            <div style="display:flex;flex-direction:column;align-items:center;">
                <div style="width:15px;height:15px;border-radius:50%;background:${dotColor};box-shadow:0 0 10px ${shadowColor};flex-shrink:0;"></div>
                ${i < lineStations.length - 1 ? `<div style="width:10px;height:20px;background:${lineColor};flex-shrink:0;"></div>` : ''}
            </div>
            <span class="headline-font text-xs text-on-surface" style="min-width:55px;">${name}</span>
            <span class="digital-font text-xs" style="color:${statusColor};">${statusText}</span>
        </div>
    `}).join('')}
</div>
`;
};

async function initStatus() {
    const statusjson = await fetch('http://127.0.0.1:8000/status');
    const data = await statusjson.json();
    renderLineStatus(data.status);
const hasAbnormal = data.status.some(s => s.status === 'abnormal');
const statusEl = document.getElementById('system-status');
if (hasAbnormal) {
    statusEl.textContent = '异常待处理';
    statusEl.style.color = '#ef4444';
    statusEl.style.textShadow = '0 0 10px rgba(239,68,68,0.5)';
    document.body.classList.add('abnormal-alert');
} else {
    document.body.classList.remove('abnormal-alert');
    statusEl.textContent = '正常运营';
    statusEl.style.color = '';
    statusEl.style.textShadow = '';
}


const container = document.getElementById('alarm-list');
const countEl = document.getElementById('alarm-count');
if (container && countEl) {
    const alarms = data.status.filter(s => s.status === 'abnormal');
    countEl.textContent = alarms.length;
    if (alarms.length === 0) {
        container.innerHTML = '<div class="text-secondary/40 text-xs text-center py-4">系统运行正常</div>';
    } else {
        container.innerHTML = alarms.map(alarm => `
            <div class="flex items-start gap-2 border-b border-outline-variant/20 pb-2">
                <span class="text-red-400 text-xs">●</span>
                <div class="flex-1">
                    <span class="headline-font text-lg text-on-surface">${alarm.name}</span>
                    <span class="digital-font text-lg text-red-400 ml-2">${alarm.message}</span>
                    <span class="digital-font text-lg text-secondary/40 ml-2">${alarm.abnormaltime}</span>
                </div>
            </div>
        `).join('');
    }
}}

initStatus();