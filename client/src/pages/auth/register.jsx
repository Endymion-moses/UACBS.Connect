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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Basic validation
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

    // Tanzanian phone validation
    if (role === "Student" || role === "Lecturer") {

      // Check if the phone state variable is empty first
    if (!phone || !phone.trim()) {
        setError("Phone number is required for students and lecturers.");
        return;
    }
    // 1. Remove all spaces, dashes, parentheses, or trailing symbols
    const cleanPhone = phone.replace(/[\s\-()]/g, "");

    // 2. Validate format and exact length constraints
    const isLocalValid = cleanPhone.startsWith('0') && cleanPhone.length === 10;
    const isInternationalValid = cleanPhone.startsWith('+255') && cleanPhone.length === 13;
    const isNoPlusValid = cleanPhone.startsWith('255') && cleanPhone.length === 12;

    if (!isLocalValid && !isInternationalValid && !isNoPlusValid) {
        setError("Invalid Tanzanian phone number length. Use a domestic layout (e.g., 0740544147) or international layout (e.g., +255740544147).");
        return; // Halts form execution safely
    }
}


    setIsLoading(true);

    // Payload mapping
    const backendRole = role.toUpperCase();
    const payload = {
      fullName: name,
      email,
      password,
      role: backendRole,
      profileInfo: {}
    };

    if (backendRole === "STUDENT") {
      payload.profileInfo = {
        department,
        programme,
        phoneNumber: phone
      };
    } else if (backendRole === "LECTURER") {
      payload.profileInfo = {
        department,
        specialization,
        officeLocation,
        phoneNumber: phone
      };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      if (login) {
        login(data.user);
      }

      navigate(`/${role.toLowerCase()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg rounded-[28px] bg-white border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Create an account</h1>
        <p className="mb-6 text-slate-600 text-sm">
          Register for the academic consultation booking system.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
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

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Passwords */}
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

          {/*phone number*/}


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
           <div>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                placeholder="Web Development, Database Systems"
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>
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
            </div>)}

            {/* Phone Number */}
            {/*  FIX: Explicitly wrap the Phone field so it is hidden for Admins */}
            {role !== "Admin" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                <input type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="07XXXXXXXX or +255..."
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-900 focus:ring-1 focus:ring-blue-900" />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-3xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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


          )}
export default Register;