import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roles = ["Student", "Lecturer", "Admin"];

const Register = () => {
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "Lecturer" && (!department.trim() || !specialization.trim())) {
      setError("Please fill in all required lecturer fields.");
      return;
    }

    if (role === "Student" && (!department.trim() || !programme.trim())) {
      setError("Please fill in all required student fields.");
      return;
    }

    setError("");
    const userData = { role, name, email, phone };

    if (role === "Student") {
      userData.programme = programme;
      userData.department = department;
    } else if (role === "Lecturer") {
      userData.department = department;
      userData.specialization = specialization;
      userData.officeLocation = officeLocation;
    }

    login(userData);
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg rounded-[28px] bg-white border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Create an account</h1>
        <p className="mb-6 text-slate-600 text-sm">Register for the academic consultation booking system.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            >
              {roles.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Hussein Mashaka"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@ifm.ac.tz"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Student Fields */}
          {role === "Student" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  placeholder="IT & Computing"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Programme</label>
                <input
                  type="text"
                  value={programme}
                  onChange={(event) => setProgramme(event.target.value)}
                  placeholder="Bachelor of Computer Science"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
          )}

          {/* Lecturer Fields */}
          {role === "Lecturer" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  placeholder="IT & Computing"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(event) => setSpecialization(event.target.value)}
                  placeholder="Web Development, Database Systems"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Office Location</label>
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(event) => setOfficeLocation(event.target.value)}
                  placeholder="Building A, Room 201"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+255 7XX XXX XXX"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Create Account
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          Already have an account?
          <Link to="/" className="ml-2 font-semibold text-blue-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;