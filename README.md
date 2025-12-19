# frontend (Dashboard)

- src/: 前端代码（React + Vite）
- Dockerfile: 生产版静态资源 + Nginx
- .github/workflows/node-ci.yml: 构建与镜像推送
- docs/api.md: 前后端接口说明（分页与筛选参数）
- public/geo/: 存放本地高精度中国 GeoJSON（前端启动时从 /geo/china.json 加载）

## 本地开发（热更新）

```powershell
npm install
npm run dev -- --host --port 3000
```

- Vite 代理 `/api` → `http://localhost:8080`（可改为容器地址）。
- 页面对接的接口：Dashboard → `/api/overview?windowMinutes=60`；Traffic → `/api/traffic`（支持 `licensePlate` 模糊过滤）；Alerts → `/api/alerts?size=20`。
- 分页：UI 1 基，发送参数时自动减一；后端返回 `total/records`。
- 地图：使用项目自带的中国 GeoJSON（/public/geo/china.json）注册，呈现真实省份边界；`topStations` 为空时仅显示底图。

## 生产镜像运行（保持赛博风样式）

```powershell
docker build -t etc-frontend .
docker run --rm -p 8088:80 --network infra_etcnet --name etc-frontend etc-frontend
```

- Nginx 反代 `/api` → `http://etc-services:8080`，请确保同网络下已有 `etc-services` 容器。
- 若看到旧版“白板”样式，重新构建镜像确保最新代码已打包；本地开发与镜像效果应一致。

## 调试小贴士

- 车牌搜索：传入脱敏片段（如 `A12` 或 `浙A12`），后端按 `hphm_mask` 模糊匹配。
- 若分页停在第 1 页，检查请求参数是否已从 1 基转换为 0 基；本仓库默认已处理。
- 详细接口示例请查看 [docs/api.md](docs/api.md)。
