# frontend：React + Vite 数据大屏

面向高速公路 ETC 的可视化看板，包含总览、明细、告警、交互式查询/离线分析入口。全程中文注释，尽量对萌新友好。

## 技术栈

- React 18 + Vite 5 + Ant Design 6
- ECharts（echarts + echarts-for-react）
- Axios + dayjs

## 目录速览

- src/App.jsx：顶层布局与导航
- src/pages/Dashboard.jsx：大屏地图/趋势/Top5/类型分布，轮询 /api/overview 与 /api/alerts
- src/pages/Traffic.jsx：明细表，支持车牌/站点/时间筛选，分页 1 基转 0 基已内置
- src/pages/Alerts.jsx：套牌告警列表，支持车牌筛选
- public/geo/china.json：本地高精度中国 GeoJSON，启动时注册 ECharts 地图
- deploy/nginx.conf：生产镜像内置的反向代理配置

## 快速开始（开发模式，热更新）

```powershell
npm install
npm run dev -- --host --port 3000
```

- 默认 Vite 代理 `/api` → `http://localhost:8080`，如后端不在本机，请在 vite.config.js 修改代理。
- 打开 <http://localhost:3000> 进入看板。

## 生产镜像运行

```powershell
docker build -t etc-frontend .
docker run --rm -p 8088:80 --network infra_etcnet --name etc-frontend etc-frontend
```

- Nginx 已将 `/api` 反代到 `http://etc-services:8080`，请确保同网络下有后端容器。
- 样式与开发模式一致，如样式旧请重新构建。

## 页面与接口对应

- Dashboard：GET /api/overview?windowMinutes=60（趋势/Top5/类型/省份来源）+ GET /api/alerts?size=20（右侧告警流）
- Traffic：GET /api/traffic（参数：stationId、licensePlate、start、end、page、size）
- Alerts：GET /api/alerts（参数：plate，可选 stationId/start/end）

## 常见问题

- 地图空白：检查 public/geo/china.json 是否可访问；如跨域失败，确认 devServer 代理或 nginx 静态目录。
- 分页卡在第一页：本仓库已将 UI 的 1 基页码减一传给后端，若修改分页逻辑记得同步转换。
- 车牌查询无结果：后端按脱敏字段模糊匹配，尝试输入部分车牌（如 "A12"）。

## 风格/体验

- 主色调为赛博蓝，渐变背景；Dashboard 带自适应地图缩放与实时轮询。
- Ant Design 组件已按暗色主题适配，表格行距与字体已优化，开箱即用。
