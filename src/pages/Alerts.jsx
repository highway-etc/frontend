import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../app.css";

export default function Alerts() {
  const [rows, setRows] = useState([]);
  const [station, setStation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/alerts", {
        params: { stationId: station || undefined },
      });
      setRows(res.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="layout">
      <div className="header">Alerts</div>
      <div className="card">
        <div className="controls">
          <input placeholder="Station ID" value={station} onChange={(e) => setStation(e.target.value)} />
          <button onClick={fetchData} disabled={loading}>
            Refresh
          </button>
        </div>
        {error && <div style={{ marginBottom: 8 }}>Error: {error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Plate</th>
                <th>Time</th>
                <th>Alert Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.stationId}</td>
                  <td>{r.licensePlate}</td>
                  <td>{dayjs(r.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>{r.alertType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
