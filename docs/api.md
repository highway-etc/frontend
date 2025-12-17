# 前后端接口文档（前端视角）

适用范围：`frontend` 看板在本地开发或生产部署时，调用 `services` 后端 API。文档按“先看能跑、再看细节”排序，便于新同学快速上手。

## 0. 服务基准地址

- 本地开发（Vite dev server）：`http://localhost:5173`，接口代理到 `http://localhost:8080`。
- 生产镜像（nginx）：页面端口通常 `8088`，接口同域反向代理到 `http://localhost:8080`（或实际后端地址）。
- 所有示例均使用 `/api/*` 前缀；若生产域名不同，请在 nginx 或前端代理中对齐。

## 1. 通用约定

- **时间格式**：接受/返回 ISO8601（示例：`2025-12-01T00:00:00`）。
- **分页基数**：后端 `page` 从 0 开始；当前前端 UI 以 1 开始展示，需要在请求侧减一。
- **编码与脱敏**：车牌字段返回已脱敏的 `licensePlate/hphm_mask`。
- **响应格式**：全部 JSON；无鉴权。

## 2. API 速查表

| 功能 | 方法 | 路径 | 关键参数 | 返回体核心字段 |
| --- | --- | --- | --- | --- |
| 交通明细 | GET | `/api/traffic` | `stationId?` `start?` `end?` `page=0` `size=20` | `total`，`records[{timestamp, licensePlate, stationId, speed}]` |
| 窗口统计 | GET | `/api/stats` | `stationId?` `start?` `end?` | `[ {stationId, windowStart, windowEnd, totalCount, uniquePlates, avgSpeed} ]` |
| 套牌告警 | GET | `/api/alerts` | `plate?` `start?` `end?` | `[ {stationId, licensePlate, timestamp, alertType} ]` |

> `?` 表示可选参数。

## 3. 交通明细 `/api/traffic`

- 作用：分页查询 `traffic_pass_dev` 车辆通行记录，按 `gcsj` 倒序。
- 参数：
  - `stationId`（可选）：整数，过滤站点。
  - `start` / `end`（可选）：ISO8601，含边界。
  - `page`（默认 0）：0 基页码；前端展示请用 1 基并在请求时减一。
  - `size`（默认 20，最小 1）。
- 返回：

  ```json
  {
    "total": 1234,
    "records": [
      {
        "timestamp": "2025-12-17T10:15:30",
        "licensePlate": "浙A12****",
        "stationId": 100,
        "speed": null
      }
    ]
  }
  ```

- 示例：

  ```bash
  curl "http://localhost:8080/api/traffic?stationId=100&start=2025-12-01T00:00:00&end=2025-12-31T23:59:59&page=0&size=20"
  ```

- 备注：`speed` 当前为 `null`，后端留档位以备后续速度字段接入。

## 4. 窗口统计 `/api/stats`

- 作用：查询每 30 秒窗口聚合数据。
- 行为：
  1) 优先读取实时表 `stats_realtime`；
  2) 若无数据，则按 `traffic_pass_dev` 现算 30 秒窗口；
  3) 默认按 `window_end` 倒序返回最多 200 条。
- 参数：`stationId`、`start`、`end`（均可选，时间为窗口边界过滤）。
- 返回：

  ```json
  [
    {
      "stationId": 100,
      "windowStart": "2025-12-17T10:15:00",
      "windowEnd": "2025-12-17T10:15:30",
      "totalCount": 320,
      "uniquePlates": 260,
      "avgSpeed": null
    }
  ]
  ```

- 示例：

  ```bash
  curl "http://localhost:8080/api/stats?stationId=100&start=2025-12-01T00:00:00&end=2025-12-31T23:59:59"
  ```

## 5. 套牌告警 `/api/alerts`

- 作用：查询套牌告警记录（源表 `alert_plate_clone`）。
- 参数：
  - `plate`（可选）：模糊匹配 `hphm_mask`。
  - `start` / `end`（可选）：`created_at` 时间范围。
- 行为：按 `created_at` 倒序，最多 200 条。
- 返回：

  ```json
  [
    {
      "stationId": 101,
      "licensePlate": "浙A12****",
      "timestamp": "2025-12-17T10:20:11",
      "alertType": "Plate Clone"
    }
  ]
  ```

- 示例：

  ```bash
  curl "http://localhost:8080/api/alerts?plate=A12&start=2025-12-01T00:00:00"
  ```

## 6. 前端页面与接口对应

- Dashboard（折线 + 表格）：页面初次加载调用 `/api/stats`，展示 `totalCount/uniquePlates/avgSpeed` 与时间窗口。
- Traffic（明细列表）：调用 `/api/traffic`，前端页码 1 基，后端 0 基；车牌过滤当前 UI 参数名为 `licensePlate`，后端暂未支持此参数，若需要请在后端补充 `LIKE` 条件或改前端参数为 `plate`。
- Alerts（告警列表）：调用 `/api/alerts`，UI 有 Station ID 输入，但后端未支持 `stationId` 参数，当前仅 `plate/start/end` 生效。

## 7. 常见调用模式（前端示例）

```js
// axios 全局：baseURL 可留空，依赖 Vite dev 代理 `/api`
import axios from "axios";

// 查询明细第 1 页（前端 1 基 → 后端 0 基）
const page = 1;
const res = await axios.get("/api/traffic", {
  params: {
    page: page - 1,
    size: 20,
    stationId: 100,
    start: "2025-12-01T00:00:00",
    end: "2025-12-31T23:59:59",
  },
});

// 查询统计（默认最近 200 个窗口）
const stats = await axios.get("/api/stats");

// 查询告警（模糊车牌）
const alerts = await axios.get("/api/alerts", { params: { plate: "A12" } });
```

## 8. FAQ（前端常见问题）

- **为什么分页总是停在第 1 页？** 确认请求参数 `page` 是否从 0 开始；UI 展示可用 1 基，发送时减一。
- **车牌过滤无效？** 后端当前未支持 `/api/traffic` 的 `licensePlate` 参数；需后端新增或前端改名并同步 SQL。
- **告警页 Station 过滤无效？** 后端未支持 `stationId`；如需按站点筛选，请在告警查询 SQL 增加 `first_station_id` 条件。
- **时间格式报错？** 确认使用 ISO8601（不带空格），例如 `2025-12-01T00:00:00`。

## 9. 变更记录（维护用）

- 2025-12-17：首版整理，覆盖 `/api/traffic` `/api/stats` `/api/alerts`，补充分页和过滤差异说明。
