# GZMetroScope

广州地铁 1 号线综合监控系统 3D 可视化原型。

基于 CesiumJS 构建，展示地铁线路、站点客流、运行状态等信息的监控仪表盘。

---

## 功能特性

### 当前实现

- 3D 地球场景，基于 CesiumJS，隐藏默认控件，专注地图展示
- 广州地铁 1 号线高亮显示，带流光移动动画
- 16 个站点图标 + 名称标签，始终显示在最上层
- 点击站点，右侧面板显示站名、换乘信息、客流量详情
- 选中站点图标高亮（变黄 + 放大）
- 左侧客流排行，按客流量降序排列
- 左侧告警面板，异常站点列表，可滚动
- 右侧全线运行状态灯（绿 / 红），16 站紧凑显示
- 底部指标卡：准点率、系统状态、在线列车数
- 实时时钟（每秒刷新）
- 运营状态判断（6:00-24:00 显示"运营中"）
- 异常告警机制：线路中有异常站点时，全屏红色闪烁告警

### 规划中

- 站点脉冲呼吸动画
- 动态数据模拟（定时切换站点状态）
- 多线路支持
- 后端对接

---

## 技术栈

| 技术 | 用途 |
|------|------|
| CesiumJS 1.137 | 3D 地球场景构建与渲染 |
| Tailwind CSS | 页面布局（Grid / Flex） |
| 原生 JavaScript | 数据加载（fetch）、DOM 操作、动画驱动 |
| GeoJSON | 地铁线网空间数据 |
| JSON | 站点信息、运行状态、仪表盘数据 |

---

## 项目结构

```
GZMetroScope/
├── index.html                  # 主页面（布局 + 所有 JavaScript）
├── style.css                   # 自定义样式（毛玻璃、告警动画等）
├── .gitignore                  # 忽略 apikey.txt、原始 Shapefile 等
├── apikey.txt                  # Cesium Ion 访问令牌（不上传 GitHub）
├── GZmetro.jpg                 # 站点图标
├── js/
│   └── PolylineTrailLinkMaterialProperty.js  # 线路流光动画材质
├── data/
│   ├── stations.json           # 1 号线 16 站数据（名称、换乘、客流量）
│   ├── status.json             # 各站运行状态（normal / abnormal）
│   └── dashboard.json          # 仪表盘数据（准点率、在线列车数）
├── GZLine1/
│   ├── GZLine1.geojson         # 1 号线路径坐标
│   ├── GZLine1_Station.geojson # 1 号线 16 站坐标
│   ├── GZ_FS_Metro.geojson     # 广州全部线路坐标（备用）
│   └── shapefile/              # 原始 Shapefile（不上传 GitHub）
└── docs/
    └── 项目代码详解.md         # 逐行代码说明
```

---

## 运行方式

1. 克隆仓库到本地
2. 在 Cesium Ion 注册并获取 Access Token（https://ion.cesium.com）
3. 将 Token 写入项目根目录下的 `apikey.txt`
4. 用本地服务器打开 `index.html`（推荐 VS Code Live Server 或 `python -m http.server`）

注意：CesiumJS 需要跨域加载资源，直接用浏览器打开 `index.html` 无法正常运行，必须使用本地服务器。

---

## 数据来源

- 广州地铁线网空间数据来源于公开地理数据，经 ArcGIS 处理后导出为 GeoJSON 格式
- 站点客流量为模拟数据，仅用于前端展示练习，不代表真实运营数据
- 运行状态为静态 JSON 配置，可通过修改 `data/status.json` 观察告警效果

---

## AI 辅助说明

本项目代码由 AI（Claude）辅助生成，但在以下方面由本人主导：

- 项目构思与功能规划
- UI 布局与交互逻辑设计
- GIS 数据处理：Shapefile 导出、坐标转换、GeoJSON 适配
- 需求定义、测试与调试
- 项目结构组织与部署

---

## 学习笔记

这个项目是 GIS 专业学习过程中的练习作品，主要涉及：

- Cesium 场景搭建：Viewer 初始化、控件配置、相机飞行
- GeoJSON 数据处理：从 Shapefile 导出、CRS 处理、Cesium 适配
- Entity 管理：Billboard（图标）、Label（标签）、自定义 Material（流光）
- 前端数据流：fetch 到 JSON 解析到 DOM 渲染的完整链路
- 自定义 Cesium Material：GLSL 着色器实现流光动画

---

## License

MIT
