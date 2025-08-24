import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ViewForms() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/employees");
      setRows(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Logo + Home Button Row */}
      <header className="w-full flex items-center justify-between mb-6">
        <img src="/logo.jpg" alt="Logo" className="h-10 w-auto" />
        <Link to="/" className="px-3 py-2 rounded-lg border">
          Home
        </Link>
      </header>

      {/* Page Title Centered */}
      <h1 className="text-3xl font-bold mb-6 text-center">Stored Forms</h1>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="p-3">{r.personal?.name}</td>
                  <td className="p-3">{r.personal?.email}</td>
                  <td className="p-3">{r.personal?.phone}</td>
                  <td className="p-3">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
