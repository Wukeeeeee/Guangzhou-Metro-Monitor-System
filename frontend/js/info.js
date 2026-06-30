
let selectedEntity = null;

//突出显示
function highlightStation(entity) {
    //点击实体时判断是否有selectedEntity，如果有此时的selectedEntity为上一个实体，此时重置上一个实体的大小颜色
    if (selectedEntity) {
        selectedEntity.billboard.color = Cesium.Color.WHITE;
        selectedEntity.billboard.scale = 1.0;
    }

    selectedEntity = entity;
    if (entity && entity.billboard) {
        entity.billboard.color = Cesium.Color.YELLOW;
        entity.billboard.scale = 1.5;
    }
}


//点击图标的事件
function bindStationClick(viewer) {
    //监听画布
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //当用户执行特定操作的时候执行
    handler.setInputAction((click) => {
        //获取点击位置的坐标
        const pickedObject = viewer.scene.pick(click.position);
        //defined检验是否同时有实体以及id
        if (!Cesium.defined(pickedObject) || !Cesium.defined(pickedObject.id)) {
            return;
        }

        const entity = pickedObject.id;
        //筛选出属于站点且有内容的实体
        //stationData是CesiumJS部分传入的
        if (entity.name !== 'station' || !entity.stationData) {
            return;
        }

        const data = entity.stationData;

        document.body.classList.add('show-detail');
        document.getElementById('detail-title').textContent = data.name;
        document.getElementById('d-name').textContent = data.name;
        document.getElementById('d-transfers').textContent = data.transfers;
        document.getElementById('d-isTransfer').textContent = data.isTransfer ? '是' : '否';
        document.getElementById('d-flow').textContent = data.flow.toLocaleString() + ' 人';

        highlightStation(entity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
