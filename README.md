# frontend (Dashboard)

- src/: 前端代码（React/Vue）
- Dockerfile: 生产版静态资源 + Nginx
- .github/workflows/node-ci.yml: 构建与镜像推送
- docs/api.md: 前后端接口说明（新手友好版，已包含分页与筛选参数）

## 本地开发（热更新）

```powershell
npm install
npm run dev -- --host --port 3000
```

- Vite 代理 `/api` → `http://localhost:8080`（需本地启动 services 后端或将代理指向容器地址）。
- 页面对接的接口：Dashboard → `/api/stats`；Traffic → `/api/traffic`（支持 `licensePlate` 模糊过滤）；Alerts → `/api/alerts`（当前未支持 `stationId` 过滤）。
- 分页：UI 1 基，发送参数时自动减一；后端返回 `total/records`。

## 生产镜像（nginx）

```powershell
docker build -t etc-frontend .
docker run --rm -p 8088:80 --network infra_etcnet --name etc-frontend etc-frontend
```

- 默认同域反向代理到 `http://localhost:8080`，需要时可在 deploy/nginx.conf 调整。
- 页面加载后可直接命中后端根路径，已跳转至 Swagger UI（后端 services）。

## 调试小贴士

- 车牌搜索：传入脱敏片段（如 `A12` 或 `浙A12`），后端按 `hphm_mask` 模糊匹配。
- 若看到分页停在第 1 页，检查请求参数是否已从 1 基转换为 0 基；本仓库默认已处理。
- 详细接口示例请查看 [docs/api.md](docs/api.md)。
