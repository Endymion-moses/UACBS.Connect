import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to send reset instructions.");
      }
      setSuccess(data.message || "If an account exists for that email, instructions were sent.");
    } catch (err) {
      setError(err.message || "Unable to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Forgot Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your email and we will send instructions to reset your password.
        </p>

        {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-4">{error}</div>}
        {success && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@university.edu"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-900 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send reset instructions"}
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

export default ForgotPassword;
