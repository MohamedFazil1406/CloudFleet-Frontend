import { type FormEvent, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Email is required");

      return;
    }

    if (!password) {
      setError("Password is required");

      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error("Login failed:", error);

      const message =
        error?.response?.data?.message ?? "Invalid email or password";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="text-2xl">🚚</span>
          </div>

          <h1 className="text-3xl font-bold text-white">CloudFleet</h1>

          <p className="text-slate-400 mt-2">Real-Time Vehicle Monitoring</p>
        </div>

        {/* Login Card */}

        <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Welcome back</h2>

            <p className="text-sm text-slate-500 mt-1">
              Sign in to your fleet dashboard.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#081522] border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition disabled:opacity-50"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#081522] border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition disabled:opacity-50"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          CloudFleet • Secure Fleet Management
        </p>
      </div>
    </div>
  );
};

export default Login;
