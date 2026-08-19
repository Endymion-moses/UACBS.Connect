import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const filters = [{ label: "All", value: "ALL" }, { label: "Student", value: "STUDENT" }, { label: "Lecturer", value: "LECTURER" }];
const initialsFromName = (name = "User") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const roleLabel = (role) => role.charAt(0) + role.slice(1).toLowerCase();
const avatarColour = (role) => role === "STUDENT" ? "bg-emerald-600" : role === "LECTURER" ? "bg-[#1e4179]" : "bg-violet-700";
const roleStyles = (role) => role === "STUDENT" ? "bg-emerald-100 text-emerald-700" : role === "LECTURER" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiBaseUrl}/admin/users`, { credentials: "include", headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Could not load users.");
        setUsers(data.users || []);
      } catch (requestError) {
        setError(requestError.message || "Could not load users.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = activeFilter === "ALL" || user.role === activeFilter;
      const matchesQuery = !normalizedQuery || user.fullName.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery);
      return matchesRole && matchesQuery;
    });
  }, [activeFilter, query, users]);

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-3 sm:px-3 sm:py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Users</h1><p className="mt-0.5 text-base text-slate-500">{users.length} registered</p></div>
        <Link to="/register" aria-label="Register a user" title="Register a user" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1e4179] text-3xl font-light leading-none text-white shadow-sm transition hover:bg-[#173562] focus:outline-none focus:ring-2 focus:ring-[#1e4179] focus:ring-offset-2"><span aria-hidden="true">+</span></Link>
      </div>

      <label className="relative mb-4 block"><span className="sr-only">Search users</span><svg aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." className="h-15 w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-13 text-lg text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#1e4179] focus:ring-2 focus:ring-[#1e4179]/15" /></label>

      <div className="mb-7 flex flex-wrap gap-2.5" role="group" aria-label="Filter users by role">
        {filters.map((filter) => <button key={filter.value} type="button" onClick={() => setActiveFilter(filter.value)} aria-pressed={activeFilter === filter.value} className={`min-w-17 rounded-full border px-5 py-2.5 text-base font-semibold transition ${activeFilter === filter.value ? "border-[#1e4179] bg-[#1e4179] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>{filter.label}</button>)}
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {!error && <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 shadow-sm sm:px-6">
        {isLoading ? <div className="py-14 text-center text-sm text-slate-400">Loading users...</div> : filteredUsers.length ? filteredUsers.map((user) => <article key={user.id} className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0 sm:gap-4"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${avatarColour(user.role)}`}>{initialsFromName(user.fullName)}</div><div className="min-w-0 flex-1"><h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{user.fullName}</h2><p className="mt-0.5 truncate text-sm text-slate-400 sm:text-base">{user.email}</p></div><div className="flex shrink-0 flex-col items-end gap-1.5"><span className={`rounded-lg px-3 py-1 text-sm font-semibold ${roleStyles(user.role)}`}>{roleLabel(user.role)}</span><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" title="Registered account" aria-label="Registered account" /></div></article>) : <div className="py-14 text-center text-sm text-slate-400">No users match your search.</div>}
      </div>}
    </section>
  );
};

export default Users;
