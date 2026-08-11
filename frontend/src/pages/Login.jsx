import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, UserRound, ArrowRight, Eye, EyeOff, Mail, LockKeyhole, ArrowLeft } from "lucide-react";
import { useAuth } from "../Shared/AuthContext";

const roleChoices = [
  { value: "user", label: "Student", icon: UserRound },
  { value: "admin", label: "Admin", icon: ShieldCheck },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Signup থেকে অটো-ফিল ডেটা পাওয়ার জন্য useEffect
  useEffect(() => {
    if (location.state?.signupEmail || location.state?.signupPassword) {
      setForm((current) => ({
        ...current,
        email: location.state?.signupEmail ?? "",
        password: location.state?.signupPassword ?? "",
      }));
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form);

      if (!result?.ok) {
        setLoading(false);
        setError(result?.error || "Login failed");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);

      const fallbackPath =
        form.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      let target = location.state?.from || fallbackPath;

      if (
        form.role === "user" &&
        typeof target === "string" &&
        target.startsWith("/admin")
      ) {
        target = fallbackPath;
      } else if (
        form.role === "admin" &&
        typeof target === "string" &&
        target.startsWith("/user")
      ) {
        target = fallbackPath;
      }

      navigate(target, { replace: true });
    } catch (err) {
      setLoading(false);
      setError("An unexpected connection error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#071913] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-4xl bg-[#0f2e24] rounded-3xl border border-emerald-800/40 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Info Panel */}
        <section className="md:col-span-5 bg-[#0a231b] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-800/40">
          <div className="space-y-6">
            <span className="inline-block text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
              College role login
            </span>
            
            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
              Choose student or admin first, then open the correct library panel.
            </h1>
            
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Select the role you want to enter, then login with the matching account.
            </p>

            <div className="space-y-4 pt-2">
              <div className="bg-[#12382c] p-4 rounded-xl border border-emerald-800/30 space-y-1">
                <p className="text-xs font-semibold text-emerald-300 flex items-center gap-2">
                  <UserRound size={15} />
                  Student Sign In
                </p>
                <p className="text-[11px] text-emerald-100/60 leading-relaxed">
                  Register a new student account using the "Create account" link to test student functionality with real data.
                </p>
              </div>

              <div className="bg-[#12382c] p-4 rounded-xl border border-emerald-800/30 space-y-1">
                <p className="text-xs font-semibold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={15} />
                  Admin Access
                </p>
                <p className="text-[11px] text-emerald-100/60 leading-relaxed">
                  Access administrative dashboard and catalog features.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="md:col-span-7 p-6 md:p-8 bg-[#0f2e24]">
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Login Account</h2>
              <p className="text-xs text-emerald-100/70 mt-1">
                Select your role and use your college library account credentials.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Choose login role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleChoices.map((choice) => {
                    const Icon = choice.icon;
                    const isSelected = form.role === choice.value;
                    return (
                      <label
                        key={choice.value}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md"
                            : "bg-[#143d30] text-emerald-200 border-emerald-800/50 hover:bg-[#184738]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={choice.value}
                          checked={isSelected}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <Icon size={16} />
                        <span>{choice.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                  <Mail size={14} className="text-emerald-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#143d30] border border-emerald-800/60 text-white placeholder-emerald-100/30 text-xs focus:outline-none focus:border-emerald-400 transition"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                  <LockKeyhole size={14} className="text-emerald-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#143d30] border border-emerald-800/60 text-white placeholder-emerald-100/30 text-xs focus:outline-none focus:border-emerald-400 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Logging in..." : "Login"}
                <ArrowRight size={16} />
              </button>

              {/* Footer Links */}
              <div className="pt-2 flex items-center justify-between text-xs text-emerald-100/60 border-t border-emerald-800/40">
                <span>
                  {form.role === "admin"
                    ? "Admin accounts use existing credentials"
                    : "Student signup is available below"}
                </span>
                {form.role === "user" && (
                  <Link to="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
                    Create Account
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Login;
