# Guangzhou Metro Monitor System

广州地铁 1 号线综合监控系统 WebGIS 原型。

项目基于 CesiumJS、原生 JavaScript 和 FastAPI 构建，前端负责 3D 地图展示、站点交互和监控面板渲染，后端负责读取 JSON/GeoJSON/图片资源并以 API 形式提供给前端。

> 当前数据主要为学习和演示用途，站点客流、运行状态等为模拟数据，不代表真实运营数据。

## 功能

- Cesium 3D 地图展示广州地铁 1 号线线路
- 加载 GeoJSON 站点坐标并渲染站点图标和标签
- 点击站点后展示站名、换乘信息、是否换乘站和客流量
- 站点客流排行
- 线路运行状态和异常告警列表
- 准点率、系统状态、在线列车数等监控指标
- FastAPI 后端提供数据接口

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端 | HTML, CSS, JavaScript, Tailwind CSS |
| 三维地图 | CesiumJS |
| 后端 | Python, FastAPI, Uvicorn |
| 数据 | JSON, GeoJSON |

## 项目结构

```text
Guangzhou-Metro-Monitor-System/
├── backend/
│   └── main.py                         # FastAPI 后端接口
├── data/
│   ├── stations.json                   # 站点属性数据
│   ├── status.json                     # 运行状态和告警数据
│   ├── dashboard.json                  # 仪表盘数据
│   ├── GZLine1.geojson                 # 1 号线线路 GeoJSON
│   ├── GZLine1_Station.geojson         # 1 号线站点 GeoJSON
│   └── GZ_FS_Metro.geojson             # 广州地铁线网数据
├── fronted/
│   ├── index.html                      # 前端页面
│   ├── style.css                       # 页面样式
│   ├── GZmetro.jpg                     # 站点图标
│   ├── apikey.txt                      # Cesium Ion Token，本地创建，不提交
│   └── js/
│       ├── cesium.js                   # Cesium 初始化、线路和站点渲染
│       ├── info.js                     # 站点点击详情
│       ├── ranking.js                  # 客流排行
│       ├── alarm.js                    # 运行状态和告警
│       ├── dashboard.js                # 仪表盘指标
│       ├── time.js                     # 时间和运营状态
│       └── PolylineTrailLinkMaterialProperty.js
├── .gitignore
└── README.md
```

## 后端接口

| 接口 | 说明 |
| --- | --- |
| `GET /cesium` | 返回 Cesium Ion Token |
| `GET /dashboard` | 返回仪表盘指标 |
| `GET /status` | 返回站点运行状态和告警 |
| `GET /ranking` | 返回站点属性和客流数据 |
| `GET /stationPoint` | 返回站点 GeoJSON |
| `GET /line` | 返回线路 GeoJSON |
| `GET /logo` | 返回站点图标 |

## 运行方式

### 1. 准备 Cesium Token

在 `fronted/` 目录下创建 `apikey.txt`，写入自己的 Cesium Ion Access Token。

```text
fronted/apikey.txt
```

`apikey.txt` 已加入 `.gitignore`，不要提交到 GitHub。

### 2. 安装后端依赖

```bash
pip install fastapi uvicorn
```

### 3. 启动后端

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

后端启动后可以访问：

```text
http://127.0.0.1:8000/docs
```

### 4. 启动前端静态服务

在项目根目录执行：

```bash
python -m http.server 8002
```

浏览器打开：

```text
http://127.0.0.1:8002/fronted/index.html
```

## 数据流

```text
fronted/js/*.js
        |
        | fetch("http://127.0.0.1:8000/...")
        v
backend/main.py
        |
        | 读取 data/*.json, data/*.geojson, fronted/GZmetro.jpg
        v
返回 JSON / GeoJSON / 图片给前端
```

前端不再直接读取所有本地数据文件，而是逐步改为通过 FastAPI 接口获取数据。

## 当前说明

这是一个阶段性学习项目，主要目标是把原本偏静态的 Cesium 前端页面逐步拆分为：

- 独立前端文件结构
- 独立 JavaScript 功能模块
- FastAPI 后端数据接口
- 后续可继续接入 SQLite / PostgreSQL / PostGIS

## AI 辅助说明

本项目开发过程中使用了 AI 辅助生成和重构代码。本人主要参与了项目选题、GIS 数据整理、功能拆分、接口调试、前后端联调和项目结构调整。

## License

MIT
