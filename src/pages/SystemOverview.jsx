import React from 'react';
import { ClusterOutlined, PartitionOutlined, DatabaseOutlined, ThunderboltOutlined, LineChartOutlined } from '@ant-design/icons';

const SystemOverview = () => {
  return (
    <div className="system-page page-fade-in">
      <div className="section-card">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">System overview</div>
            <div className="section-title">ETC 大数据系统全览</div>
          </div>
          <div className="pill-row">
            <span className="pill">实时流</span>
            <span className="pill">离线分析</span>
            <span className="pill">可视化</span>
          </div>
        </div>
        <div className="section-subtitle">
          覆盖采集、处理、存储、服务和可视化的端到端高速 ETC 数据体系，支持风险告警、交互式查询与深度分析。
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <ClusterOutlined className="section-icon" />
          <div className="section-title">架构分层</div>
        </div>
        <div className="system-grid three-col">
          <div className="system-tile">
            <div className="tile-title">实时处理</div>
            <ul>
              <li>Kafka 汇聚 RSU/OBU 原始交易与过车事件。</li>
              <li>Flink CEP 识别套牌、异常通行，秒级输出。</li>
              <li>多流 Join + 去重窗口，保障指标一致性。</li>
            </ul>
          </div>
          <div className="system-tile">
            <div className="tile-title">存储与分片</div>
            <ul>
              <li>MyCat 做路由，按省份/车牌前缀分片落表。</li>
              <li>冷热分层：热表承载 7 天高 QPS，冷表归档。</li>
              <li>维表缓存车辆、站点、黑名单元数据。</li>
            </ul>
          </div>
          <div className="system-tile">
            <div className="tile-title">服务与应用</div>
            <ul>
              <li>API 层提供交互式查询、告警下发与报表。</li>
              <li>前端大屏与分析页消费聚合指标与告警流。</li>
              <li>Prometheus + Grafana 观测算子、Topic、存储。</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <PartitionOutlined className="section-icon" />
          <div className="section-title">数据链路</div>
        </div>
        <pre className="diagram-block">
[RSU/OBU]
   │ 原始过车+扣费
   ▼
[KAFKA ingress topics]
   │ ETL、清洗、维表 Cache
   ▼
[FLINK 作业]
   │ 聚合/CEP/维表 Join/去重
   ▼
[下游]
   ├─ Kafka alerts → 告警通道/大屏
   ├─ OLTP (MyCat → 分片表)
   └─ OLAP (冷数据/离线分析)
        </pre>
        <div className="pill-row">
          <span className="pill ghost">入口：Kafka Ingress</span>
          <span className="pill ghost">处理：Flink Stateful + Savepoint</span>
          <span className="pill ghost">出口：MyCat / Kafka Alerts / OLAP</span>
        </div>
      </div>

      <div className="section-card two-col">
        <div>
          <div className="section-header">
            <DatabaseOutlined className="section-icon" />
            <div className="section-title">数据库设计</div>
          </div>
          <ul className="bullet-list">
            <li>分片键：车牌前缀 + 省份码，支持跨省追踪与热点分散。</li>
            <li>核心表：`pass_record` (交易/过车明细)、`alert_event`、`vehicle_profile`、`station_dim`。</li>
            <li>索引：车牌 + 时间、站点 + 时间；TTL/分区策略按天归档冷数据。</li>
            <li>事务：支付与过车解耦，采用幂等流水号避免重复入库。</li>
          </ul>
        </div>
        <div>
          <div className="section-header">
            <ThunderboltOutlined className="section-icon" />
            <div className="section-title">模拟 / 风控 / 算法</div>
          </div>
          <ul className="bullet-list">
            <li>模拟：批量 CSV/Kafka 推送脚本、流量回放，验证吞吐与告警规则。</li>
            <li>风控：黑名单匹配、同车不同牌/同牌不同车组合校验、稀疏时间窗口检测。</li>
            <li>算法：路径重建、车牌纠错、异常速度/费率检测，按站点与车型输出多维指标。</li>
          </ul>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <LineChartOutlined className="section-icon" />
          <div className="section-title">运维与弹性</div>
        </div>
        <div className="system-grid three-col">
          <div className="system-tile">
            <div className="tile-title">观测性</div>
            <ul>
              <li>Prometheus 采集 Flink/Topic/QPS，Grafana 看板预设。</li>
              <li>日志集中收集，按流水号/告警 ID 可追踪全链路。</li>
            </ul>
          </div>
          <div className="system-tile">
            <div className="tile-title">可靠性</div>
            <ul>
              <li>Savepoint/Checkpoint 策略，脚本一键恢复到最近状态。</li>
              <li>Kafka 多副本 + 精确一次语义，避免重放污染。</li>
            </ul>
          </div>
          <div className="system-tile">
            <div className="tile-title">交付与环境</div>
            <ul>
              <li>Dev/Prod Docker Compose，对齐 Flink、Kafka、MyCat 版本。</li>
              <li>配置集中管理，参数化 Topic、分片、并行度。</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section-card two-col">
        <div>
          <div className="section-header">
            <div className="section-title">核心能力矩阵</div>
          </div>
          <ul className="bullet-list">
            <li>数据链路：Kafka → Flink → MyCat/OLAP，全链路延迟秒级可观测。</li>
            <li>风险告警：CEP 套牌、异常速度、稀疏窗口复现，支持多流 Join。</li>
            <li>查询分析：OLTP 低延迟点查 + OLAP 批量聚合，前后端统一接口。</li>
            <li>弹性扩缩：按 Topic/算子并行度与 Checkpoint 策略线性扩展。</li>
          </ul>
        </div>
        <div>
          <div className="section-header">
            <div className="section-title">数据质量守护</div>
          </div>
          <ul className="bullet-list">
            <li>编码：全链路 UTF-8；投递前转码校验，避免中文乱码。</li>
            <li>去重：窗口内按车牌 + 站点去重，保留最新时间戳。</li>
            <li>巡检：Kafka 延迟、Flink Checkpoint 失败、MyCat 分片健康均有监控。</li>
            <li>回放：支持历史 CSV / Mock 流量回放，验证规则与算子升级。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
