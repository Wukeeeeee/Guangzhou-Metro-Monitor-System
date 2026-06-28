# Guangzhou-Metro-Monitor-System

广州地铁 1 号线综合监控系统 3D 可视化原型。

基于 CesiumJS 构建的 WebGIS 前端项目，在 3D 地球场景中展示广州地铁 1 号线的线路走向和站点分布，并结合模拟数据呈现站点客流和运行状态信息。

**3D 地球场景仅展示地铁线路和站点位置，不包含人口数据、建筑模型或其他地理信息主题。**

---

## 项目简介

本项目是一个面向 GIS 专业学习的前端可视化练习。项目从原始的 Shapefile 空间数据出发，经过格式转换和坐标处理后，利用 CesiumJS 3D 地球引擎在前端进行渲染，实现了地铁监控系统常见的功能模块，包括线路展示、站点交互、客流排行、运行状态监控和异常告警等。

项目目前聚焦于广州地铁 1 号线，完整渲染了 1 号线全线 16 个站点与路径，同时保留了广州市全部线路的空间数据供后续扩展。

### 主要目的

- 探索 CesiumJS 3D 地球引擎在交通可视化领域的应用
- 打通从 GIS 空间数据（Shapefile）到前端可视化（GeoJSON 到 Cesium）的完整流程
- 用静态 JSON 数据模拟地铁监控系统的前端展示效果
- 练习 CSS Grid / Flexbox 实现的复杂仪表盘布局

---

## 功能特性

### 当前实现

- **3D 地球场景**：基于 CesiumJS 搭建，隐藏默认控件和版权信息，专注地图展示，初始视角定位在广州城区上空
- **线路高亮展示**：广州地铁 1 号线以黄色粗线在地图上标注，带有流光移动动画效果，光点沿线路方向循环移动
- **站点标注**：16 个站点以自定义图标和名称标签显示在地图对应坐标上，标签始终保持在最上层
- **站点点击交互**：点击地图上的站点图标，右侧面板显示该站点的详细信息，包括站名、换乘线路、是否为换乘站、实时客流量
- **选中高亮**：被点击的站点图标变为黄色并放大，取消选中时恢复原状
- **客流排行**：左侧面板展示 16 个站点按客流量从高到低的排名，每 5 秒刷新一次
- **告警面板**：左侧下方展示系统中出现异常的站点列表，异常条数实时更新，列表可滚动浏览
- **运行状态图**：右侧下方以垂直列表展示全部 16 个站的运行状态，每个站点对应绿色（正常）或红色（异常）状态灯
- **指标卡**：底部展示准点率、系统状态和在线列车数三个核心指标
- **实时时钟**：顶部时间显示，每秒刷新
- **运营状态**：根据当前时间自动判断运营状态（6:00-24:00 为运营中）
- **异常告警**：当线路中出现异常站点时，系统状态变为告警文字，同时全屏红色边框闪烁提示

### 规划中

- 站点脉冲呼吸动画
- 动态数据模拟（定时随机切换站点状态）
- 多线路支持
- 后端对接

---

## 技术栈

| 技术 | 用途 |
|------|------|
| CesiumJS 1.137 | 3D 地球场景构建与渲染，Entity 管理，场景拾取交互 |
| Tailwind CSS | 页面布局（CSS Grid 网格布局 / Flexbox 弹性布局） |
| 原生 JavaScript | 数据加载（fetch API）、DOM 操作、定时器驱动动画 |
| GeoJSON | 地铁线网路径和站点坐标的空间数据格式 |
| JSON | 站点属性信息、运行状态数据和仪表盘数据 |
| GLSL | 自定义着色器实现线路流光动画材质 |

---

## 页面布局

页面采用 12 列网格布局，分为四个主要区域：

```
+------------------+------------------+------------------+
|     左侧面板     |     中间地图      |     右侧面板     |
|  (col 1-3)       |  (col 4-9)       |  (col 10-12)     |
|                   |                   |                   |
| 客流排行          |   Cesium 3D 地球   | 站点详情          |
| (16 站排序)       |   (1 号线高亮)    | (点击后显示)      |
|                   |                   |                   |
| 告警列表          |                   | 运行状态          |
| (异常站点)        |                   | (16 站状态灯)     |
|                   +-------------------+                   |
|                   |   底部指标卡       |                   |
|                   | 准点率/状态/在线   |                   |
+-------------------+-------------------+-------------------+
```

---

## 项目结构

```
Guangzhou-Metro-Monitor-System/
├── index.html                  # 主页面（布局 + 所有 JavaScript 逻辑）
├── style.css                   # 自定义样式（毛玻璃效果、告警动画等）
├── .gitignore                  # 忽略 apikey.txt、原始 Shapefile 等
├── apikey.txt                  # Cesium Ion 访问令牌（不上传 GitHub）
├── GZmetro.jpg                 # 站点图标
├── light.png                   # 未使用
├── js/
│   └── PolylineTrailLinkMaterialProperty.js  # 自定义 Cesium Material：线路流光动画
├── data/
│   ├── stations.json           # 1 号线 16 站数据（名称、换乘线路、是否为换乘站、客流量）
│   ├── status.json             # 各站运行状态（normal / abnormal + 异常信息）
│   └── dashboard.json          # 仪表盘数据（准点率、在线列车数等）
├── GZLine1/
│   ├── GZLine1.geojson         # 1 号线路径地理坐标
│   ├── GZLine1_Station.geojson # 1 号线 16 个站点地理坐标
│   ├── GZ_FS_Metro.geojson     # 广州市全部地铁线路坐标（备用扩展）
│   └── shapefile/              # 原始 Shapefile 数据（不上传 GitHub）
├── docs/
│   └── 项目代码详解.md         # 逐行代码说明文档
└── README.md
```

---

## 数据流说明

项目目前为纯前端，所有数据源自本地静态 JSON 文件，通过 fetch API 加载：

```
data/stations.json  ──┬── 站点详情面板（点击时加载）
                      └── 客流排行面板（每 5 秒刷新）
data/status.json    ──┬── 线路运行状态图
                      └── 告警面板 + 异常状态判断
data/dashboard.json ──→ 底部指标卡
GZLine1/*.geojson   ──→ Cesium 地图渲染
```

页面上共 5 个独立脚本块按顺序执行：

1. 模块脚本（Cesium 初始化、站点加载、点击交互）
2. 时钟与运营状态
3. 站点客流排行（定时刷新）
4. 线路状态与告警渲染
5. 仪表盘数据加载

---

## 运行方式

1. 克隆仓库到本地
2. 在 Cesium Ion 注册并获取 Access Token（https://ion.cesium.com）
3. 将 Token 写入项目根目录下的 `apikey.txt`
4. 用本地服务器打开 `index.html`

```bash
git clone https://github.com/Wukeeeeee/Guangzhou-Metro-Monitor-System.git
cd Guangzhou-Metro-Monitor-System
# 将你的 Cesium Ion Token 写入 apikey.txt，然后启动本地服务器
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

注意：CesiumJS 需要跨域加载资源，直接用浏览器打开 index.html 无法正常运行，必须使用本地服务器（VS Code Live Server 或 python -m http.server 均可）。

---

## 数据来源

- 广州地铁线网空间数据来源于公开地理数据，经 ArcGIS 处理后导出为 GeoJSON 格式
- 站点客流量为模拟数据，仅用于前端展示练习，不代表真实运营数据
- 运行状态为静态 JSON 配置，可通过修改 data/status.json 中的 status 字段（normal / abnormal）观察告警效果
- 站点图标（GZmetro.jpg）为自定义素材

---

## AI 辅助说明

本项目代码由 AI辅助生成，但在以下方面由本人主导完成：

- 项目整体构思与功能规划
- UI 布局与交互逻辑设计决策
- GIS 数据处理：从原始 Shapefile 导出、坐标转换、GeoJSON 格式适配
- 需求定义、功能测试与 bug 调试
- 项目结构组织与 GitHub 部署管理

---

## 学习笔记

这个项目是 GIS 专业学习过程中的练习作品，主要涉及以下知识点：

- Cesium 场景搭建：Viewer 初始化、控件配置、相机飞行定位
- GeoJSON 数据处理：从 Shapefile 导出、CRS 坐标参考系处理、Cesium 加载适配
- Cesium Entity 管理：Billboard（图标）、Label（标签）、Polyline（路径）
- 自定义 Cesium Material：通过 GLSL 着色器实现自定义材质效果（流光动画）
- 场景拾取交互：ScreenSpaceEventHandler 实现点击检测与 Entity 信息读取
- CSS 布局：Grid 网格布局、Flexbox 弹性布局、毛玻璃效果
- 前端数据流：fetch 异步加载、JSON 解析、DOM 渲染
- CSS 动画：关键帧动画实现闪烁告警效果

---

## License

MIT
