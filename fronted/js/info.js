function bindStationClick(viewer) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position);

        if (!Cesium.defined(pickedObject) || !Cesium.defined(pickedObject.id)) {
            return;
        }

        const entity = pickedObject.id;
        if (entity.name !== 'station' || !entity.stationData) {
            return;
        }

        const data = entity.stationData;

        document.body.classList.add('show-detail');
        document.getElementById('detail-title').textContent = data.name;
        document.getElementById('d-name').textContent = data.name;
        document.getElementById('d-transfers').textContent = data.transfers;
        document.getElementById('d-isTransfer').textContent = data.isTransfer === 'yes' ? '是' : '否';
        document.getElementById('d-flow').textContent = data.flow.toLocaleString() + ' 人';

        highlightStation(entity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
