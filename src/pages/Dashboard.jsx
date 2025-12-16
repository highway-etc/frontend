import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import "../app.css";

const toSeriesData = (records) =>
  records.map((r) => ({
    name: r.windowEnd,
    value: [dayjs(r.windowEnd).valueOf(), r.totalCount],
  }));

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/stats");
        setData(res.data || []);
      } catch (e) {
        setError(e?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartOption = useMemo(
    () => ({
      title: { text: "Traffic Volume" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "time" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Total",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: toSeriesData(data),
        },
      ],
    }),
    [data]
  );

  return (
    <div className="layout">
      <div className="header">Dashboard</div>
      {error && <div className="card">Error: {error}</div>}
      {loading && <div className="card">Loading...</div>}
      <div className="card">
        <ReactECharts style={{ height: 360 }} option={chartOption} notMerge lazyUpdate />
      </div>
      <div className="card">
        <div className="header" style={{ fontSize: 16 }}>
          Latest Windows
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Window Start</th>
              <th>Window End</th>
              <th>Total Count</th>
              <th>Unique Plates</th>
              <th>Avg Speed</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, idx) => (
              <tr key={idx}>
                <td>{r.windowStart}</td>
                <td>{r.windowEnd}</td>
                <td>{r.totalCount}</td>
                <td>{r.uniquePlates}</td>
                <td>{r.avgSpeed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
