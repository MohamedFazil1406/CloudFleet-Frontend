import { type FormEvent, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error("Registration failed:", error);

      const message =
        error?.response?.data?.message ?? "Unable to create account";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="text-2xl">🚚</span>
          </div>

          <h1 className="text-3xl font-bold text-white">CloudFleet</h1>

          <p className="text-slate-400 mt-2">Create your fleet account</p>
        </div>

        {/* Card */}

        <div className="bg-[#0d1b2a] border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Create account</h2>

            <p className="text-sm text-slate-500 mt-1">
              Start managing your fleet securely.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Mohamed Fazil"
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#081522] border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition disabled:opacity-50"
              />
            </div>

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
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#081522] border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition disabled:opacity-50"
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Sign in
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

export default Register;
