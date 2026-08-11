import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
  BookOpen,
  IdCard,
  CheckCircle2,
  Library,
} from "lucide-react";
import { useAuth } from "../Shared/AuthContext";

const studentSemesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const studentYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const Signup = () => {
  const { registerStudent, verifyOtpCode, completeProfileData } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    role: "user",
    department: "",
    stream: "",
    semester: "Semester 1",
    academicYear: "1st Year",
    rollNumber: "",
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateStepOne = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      setError("Please fill all required fields in Step 1.");
      return false;
    }
    if (form.phone.trim().replace(/\D/g, "").length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const validateStepThree = () => {
    if (
      !form.department.trim() ||
      !form.stream.trim() ||
      !form.semester.trim() ||
      !form.academicYear.trim() ||
      !form.rollNumber.trim()
    ) {
      setError("Please complete all academic details.");
      return false;
    }
    return true;
  };

  const goNext = async () => {
    setError("");

    if (step === 1) {
      if (!validateStepOne()) return;
      setLoading(true);
      const res = await registerStudent({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setLoading(false);

      if (!res?.ok) {
        showToast(res?.error || "Registration failed", "error");
        setError(res?.error || "Registration failed");
        return;
      }
      showToast("OTP sent to your email successfully!");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.otp.trim()) {
        setError("Please enter the 6-digit OTP code.");
        return;
      }
      setLoading(true);
      const res = await verifyOtpCode({
        email: form.email,
        otp: form.otp,
      });
      setLoading(false);

      if (!res?.ok) {
        showToast(res?.error || "Invalid OTP", "error");
        setError(res?.error || "Invalid OTP");
        return;
      }
      showToast("OTP verified successfully!");
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!validateStepThree()) return;
      setLoading(true);
      const res = await completeProfileData({
        email: form.email,
        department: form.department,
        stream: form.stream,
        semester: form.semester,
        academicYear: form.academicYear,
        rollNumber: form.rollNumber,
      });
      setLoading(false);

      if (!res?.ok) {
        showToast(res?.error || "Profile completion failed", "error");
        setError(res?.error || "Profile completion failed");
        return;
      }

      showToast("Account created successfully!");
      navigate("/login", {
        state: { signupEmail: form.email, signupPassword: form.password },
      });
    }
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };

  return (
    <div className="min-h-screen bg-[#071913] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-5xl bg-[#0f2e24] rounded-3xl border border-emerald-800/40 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Banner Section */}
        <div className="lg:col-span-5 bg-[#0a231b] text-white p-6 md:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-800/40">
          <div className="relative z-10 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-medium"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-800/50">
                <Library className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-emerald-100">EduLibrary</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white">
              Create your student account.
            </h1>
            <p className="text-emerald-100/70 text-xs leading-relaxed">
              Join our digital library platform to access thousands of academic resources, manage borrowings, and track your progress.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-800/40 mt-8">
            <p className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider mb-1">Need Help?</p>
            <p className="text-xs text-emerald-100/60">Contact library support for account activation queries.</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 p-6 md:p-8 bg-[#0f2e24] flex flex-col justify-between">
          <div>
            {/* Step Progress Bar */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[
                { id: 1, title: "Account", sub: "Basic Details" },
                { id: 2, title: "OTP", sub: "Verification" },
                { id: 3, title: "Profile", sub: "Academic Info" },
              ].map((sItem) => (
                <div
                  key={sItem.id}
                  className={`p-3 rounded-xl border transition-all ${
                    step === sItem.id
                      ? "bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-sm"
                      : step > sItem.id
                      ? "bg-[#143d30] border-emerald-800/60 text-emerald-400"
                      : "bg-[#0a231b] border-emerald-900/40 text-emerald-100/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Step {sItem.id}</span>
                    {step > sItem.id && <CheckCircle2 size={13} className="text-emerald-400" />}
                  </div>
                  <p className="text-xs font-bold">{sItem.title}</p>
                </div>
              ))}
            </div>

            {/* Toast Message */}
            {toast && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-medium border flex items-center justify-between ${
                  toast.tone === "success"
                    ? "bg-emerald-950/80 text-emerald-200 border-emerald-700/60"
                    : "bg-red-950/80 text-red-200 border-red-800/60"
                }`}
              >
                {toast.message}
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-3.5">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="student@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9174174174"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-3 text-emerald-400 hover:text-emerald-300 transition"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-3.5">
                  <div className="p-4 bg-[#12382c] border border-emerald-800/40 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-300 mb-0.5">Verification Code Sent</p>
                    <p className="text-xs text-emerald-100/70 leading-relaxed">
                      Please enter the 6-digit OTP code sent to <span className="font-semibold text-emerald-200">{form.email}</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="otp"
                        type="text"
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs tracking-widest text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="department"
                        type="text"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="Computer Science & Engineering"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Stream / Course
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="stream"
                        type="text"
                        value={form.stream}
                        onChange={handleChange}
                        placeholder="B.Tech / B.Sc"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-emerald-200 mb-1">
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 transition"
                      >
                        {studentSemesters.map((sem) => (
                          <option key={sem} value={sem} className="bg-[#0f2e24] text-white">
                            {sem}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-emerald-200 mb-1">
                        Academic Year
                      </label>
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 transition"
                      >
                        {studentYears.map((yr) => (
                          <option key={yr} value={yr} className="bg-[#0f2e24] text-white">
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-200 mb-1">
                      Roll Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400/60" />
                      <input
                        name="rollNumber"
                        type="text"
                        value={form.rollNumber}
                        onChange={handleChange}
                        placeholder="Enter college roll number"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#143d30] border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p className="text-xs text-red-400 font-medium pt-1">{error}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-emerald-800/40 mt-6">
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-2.5 px-4 bg-[#143d30] hover:bg-[#184738] text-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}

              <button
                type="button"
                onClick={goNext}
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Processing..."
                  : step === 3
                  ? "Complete Registration"
                  : "Next Step"}
                <ArrowRight size={14} />
              </button>
            </div>

            <p className="text-center text-xs text-emerald-100/60 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;