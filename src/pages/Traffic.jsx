import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../app.css";

export default function Traffic() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [plateFilter, setPlateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = async (nextPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/traffic", {
        params: {
          page: Math.max(nextPage - 1, 0),
          size: pageSize,
          licensePlate: plateFilter.trim() || undefined,
        },
      });
      setRows(res.data?.records || []);
      setTotal(res.data?.total || 0);
      setPage(nextPage);
    } catch (e) {
      setError(e?.message || "Failed to load traffic records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="layout">
      <div className="header">Traffic Records</div>
      <div className="card">
        <div className="controls">
          <input
            placeholder="License plate"
            value={plateFilter}
            onChange={(e) => setPlateFilter(e.target.value)}
          />
          <button onClick={() => fetchPage(1)} disabled={loading}>
            Search
          </button>
          <span style={{ marginLeft: "auto", fontSize: 13 }}>
            Total: {total} | Page {page} / {totalPages}
          </span>
        </div>
        {error && <div style={{ marginBottom: 8 }}>Error: {error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>License Plate</th>
                <th>Station</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td>{dayjs(r.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>{r.licensePlate}</td>
                  <td>{r.stationId}</td>
                  <td>{r.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="controls" style={{ justifyContent: "flex-end" }}>
          <button onClick={() => fetchPage(Math.max(1, page - 1))} disabled={page === 1 || loading}>
            Prev
          </button>
          <button
            onClick={() => fetchPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
