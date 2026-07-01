const API_BASE = 'http://127.0.0.1:8000';

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`请求失败: ${url}`);
    }
    return res.json();
}

async function initCesium() {
    const token = await fetchJson(`${API_BASE}/cesium`);
    Cesium.Ion.defaultAccessToken = token.token;

    const viewer = createViewer();

    await loadLine(viewer);
    await loadStationPoints(viewer);
    bindStationClick(viewer);
}

function createViewer() {
    //创建viewer,关闭组件
    const viewer = new Cesium.Viewer('cesiumcontainer', {
        animation: false,
        timeline: false,
        homeButton: false,
        geocoder: false,
        selectionIndicator: false,
        infoBox: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        fullscreenButton: false,
    });
    //关闭版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    //关闭点击双击事件
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(113.28, 23.05, 13000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-60),
        },
        duration: 0.01,
    });

    return viewer;
}
//加载线路
async function loadLine(viewer) {
    const lineResult = await fetchJson(`${API_BASE}/line`);
    delete lineResult.crs;

    const line = await Cesium.GeoJsonDataSource.load(lineResult, {
        stroke: Cesium.Color.fromCssColorString('#F3D03E'),
        strokeWidth: 10,
        clampToGround: true,
        zIndex: 2,
    });

    viewer.dataSources.add(line);
    // 添加轨迹的颜色，速度
    const trailMaterial = new PolylineTrailLinkMaterialProperty(
        Cesium.Color.fromCssColorString('#F3D03E'),
        120
    );

    // 设置轨迹的宽度和材质
    //一个geojson文件中可能存在多端线
    for (const entity of line.entities.values) {
        if (entity.polyline) {
            entity.polyline.width = 10;
            entity.polyline.material = trailMaterial;
        }
    }
}

//添加站点
async function loadStationPoints(viewer) {
    const stationGeoJson = await fetchJson(`${API_BASE}/stationPoint`);
    delete stationGeoJson.crs;

    const stations = await fetchJson(`${API_BASE}/ranking`);
    renderStationPoints(viewer, stationGeoJson, stations);
}

function renderStationPoints(viewer, stationGeoJson, stations) {
    for (const station of stationGeoJson.geometries) {
        //遍历数组，获取站点信息
        const stationInfo = stations.find(item => item.name === station.name);
        //位置信息
        const position = Cesium.Cartesian3.fromDegrees(
            station.longitude,
            station.latitude
        );
        //添加实体
        const entity = viewer.entities.add({
            name: 'station',
            position,
            billboard: {
                image: `${API_BASE}/logo`,
                width: 20,
                height: 20,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: station.name,
                font: '16px Microsoft YaHei, sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,//填充和描边
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,//垂直对齐方式
                pixelOffset: new Cesium.Cartesian2(0, -30),//像素偏移
            },
        });
        //添加信息，stationData不是entity的属性，在添加的时候不能直接添加
        entity.stationData = stationInfo;
    }
}





initCesium().catch(error => {
    console.error('Cesium 初始化失败:', error);
});
