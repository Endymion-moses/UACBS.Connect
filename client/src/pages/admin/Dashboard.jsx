import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialsFromName = (name = "User") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const avatarColours = ["bg-emerald-600", "bg-blue-900", "bg-violet-600", "bg-amber-600", "bg-rose-600"];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({ monthlyBookings: [], recentUsers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiBaseUrl}/admin/dashboard`, { credentials: "include", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load dashboard data.");
        setDashboard(data);
      } catch (requestError) {
        setError(requestError.message || "Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-1 py-3 sm:px-3 sm:py-6">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-medium text-slate-500">Administration</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1e4179] sm:text-3xl">Admin Dashboard</h1></div>
        <p className="text-sm text-slate-500">System overview</p>
      </div>
      {error && <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="mb-8 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4"><h2 className="text-xl font-semibold text-[#1e4179]">Monthly Bookings</h2><p className="mt-1 text-sm text-slate-400">Appointments created in the last six months</p></div>
        <div className="h-65 sm:h-75">
          {isLoading ? <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading bookings…</div> : (
            <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.monthlyBookings} margin={{ top: 12, right: 8, left: -18, bottom: 0 }} barCategoryGap="38%">
              <CartesianGrid vertical stroke="#e8eef8" strokeDasharray="4 4" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#91a3bf", fontSize: 14 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: "#91a3bf", fontSize: 14 }} />
              <Tooltip cursor={{ fill: "#edf3fc" }} contentStyle={{ borderRadius: 12, border: "1px solid #dfe8f5", boxShadow: "0 5px 16px rgba(15, 49, 98, .10)" }} />
              <Bar dataKey="bookings" name="Bookings" fill="#1e4179" radius={[7, 7, 0, 0]} maxBarSize={34} />
            </BarChart></ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1"><h2 className="text-xl font-semibold text-[#1e4179]">Recent Users</h2><Link to="/admin/users" className="text-sm font-semibold text-[#1e4179] transition hover:text-blue-600">See all →</Link></div>
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white px-5 shadow-sm sm:px-6">
        {isLoading ? <div className="py-12 text-center text-sm text-slate-400">Loading recent users…</div> : dashboard.recentUsers.length ? dashboard.recentUsers.map((user, index) => (
          <div key={user.id} className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0 sm:gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${avatarColours[index % avatarColours.length]}`}>{initialsFromName(user.fullName)}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-base font-semibold text-slate-800 sm:text-lg">{user.fullName}</p><p className="truncate text-sm text-slate-400">{user.role === "STUDENT" ? "Student" : user.role === "LECTURER" ? "Lecturer" : "Administrator"} · {user.department}{user.programme ? ` · ${user.programme}` : ""}</p></div>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-label="Active user" />
          </div>
        )) : <div className="py-12 text-center text-sm text-slate-400">No users have been registered yet.</div>}
      </div>
    </section>
  );
};

export default AdminDashboard;
