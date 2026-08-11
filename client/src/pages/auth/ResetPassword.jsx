import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get("token") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("No reset token provided. Please use the link from your email.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to reset password.");
      }

      setSuccess(data.message || "Password reset successfully.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your new password below and submit to complete the reset.
        </p>

        {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-4">{error}</div>}
        {success && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">New password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-900 focus:outline-none"
          />

          <label className="block text-sm font-medium text-slate-700">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-900 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
