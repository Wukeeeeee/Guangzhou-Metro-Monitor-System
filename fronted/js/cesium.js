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

    viewer._cesiumWidget._creditContainer.style.display = 'none';
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

    const trailMaterial = new PolylineTrailLinkMaterialProperty(
        Cesium.Color.fromCssColorString('#F3D03E'),
        120
    );

    for (const entity of line.entities.values) {
        if (entity.polyline) {
            entity.polyline.width = 10;
            entity.polyline.material = trailMaterial;
        }
    }
}

async function loadStationPoints(viewer) {
    const stationGeoJson = await fetchJson(`${API_BASE}/stationPoint`);
    delete stationGeoJson.crs;

    const stations = await fetchJson(`${API_BASE}/ranking`);
    renderStationPoints(viewer, stationGeoJson, stations);
}

function renderStationPoints(viewer, stationGeoJson, stations) {
    for (const station of stationGeoJson.geometries) {
        const stationInfo = stations.find(item => item.name === station.name);
        const position = Cesium.Cartesian3.fromDegrees(
            station.coordinates[0],
            station.coordinates[1]
        );

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
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -30),
            },
        });

        entity.stationData = stationInfo;
    }
}

let selectedEntity = null;

function highlightStation(entity) {
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

initCesium().catch(error => {
    console.error('Cesium 初始化失败:', error);
});
