import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import Card from "../components/ui/Card";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "Data Analyst",
    "UX/UI Designer",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear validation error when the field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.role) {
      newErrors.role = "Please select your career path";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms & Conditions";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate client-side API signup response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2500);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="app-background grid-fade min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-mint/10 blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-violet/15 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      <Card className="w-full max-w-lg p-6 sm:p-10 relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* App Icon/Logo */}
              <div className="flex justify-center mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-tr from-cyan-400 to-violet shadow-lg shadow-violet/20">
                  <FiZap className="text-slate-900 text-2xl" />
                </div>
              </div>

              {/* Header Text */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Unlock market insights, optimize your profile, and find your edge.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                      <FiUser size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                        errors.name
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-white/10 focus:border-violet focus:ring-violet/20"
                      } bg-white/4 text-ink placeholder-slate-500 focus:outline-none focus:ring-3 transition-all duration-200 text-sm`}
                      placeholder="Arjun Kumar"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <FiAlertCircle size={13} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                      <FiMail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                        errors.email
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-white/10 focus:border-violet focus:ring-violet/20"
                      } bg-white/4 text-ink placeholder-slate-500 focus:outline-none focus:ring-3 transition-all duration-200 text-sm`}
                      placeholder="arjun.kumar@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <FiAlertCircle size={13} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Career Path Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                    Career Path
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                      <FiBriefcase size={18} />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-10 py-2.5 rounded-xl border appearance-none ${
                        errors.role
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-white/10 focus:border-violet focus:ring-violet/20"
                      } bg-[#0b0a1d] text-ink focus:outline-none focus:ring-3 transition-all duration-200 text-sm`}
                    >
                      <option value="" disabled className="text-slate-500">
                        Select your specialization
                      </option>
                      {roles.map((role) => (
                        <option key={role} value={role} className="bg-[#0b0a1d]">
                          {role}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <FiAlertCircle size={13} /> {errors.role}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                        <FiLock size={18} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                          errors.password
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                            : "border-white/10 focus:border-violet focus:ring-violet/20"
                        } bg-white/4 text-ink placeholder-slate-500 focus:outline-none focus:ring-3 transition-all duration-200 text-sm`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                        <FiAlertCircle size={13} /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                        <FiLock size={18} />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${
                          errors.confirmPassword
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                            : "border-white/10 focus:border-violet focus:ring-violet/20"
                        } bg-white/4 text-ink placeholder-slate-500 focus:outline-none focus:ring-3 transition-all duration-200 text-sm`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                        <FiAlertCircle size={13} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-violet focus:ring-violet/30 focus:ring-offset-0 focus:outline-none cursor-pointer"
                    />
                    <span className="text-xs text-muted leading-relaxed">
                      I agree to the{" "}
                      <span className="text-violet hover:underline cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-violet hover:underline cursor-pointer">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <FiAlertCircle size={13} /> {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-4 rounded-xl bg-linear-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-sm font-medium shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Free Account <FiArrowRight />
                    </>
                  )}
                </button>

                {/* Link to sign-in */}
                <p className="text-center text-xs text-muted mt-6 pt-2">
                  Already have an account?{" "}
                  <Link to="/" className="text-violet hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-10"
            >
              <div className="grid h-20 w-20 place-items-center rounded-full bg-mint/10 text-mint mb-6 border border-mint/20 shadow-lg shadow-mint/10 animate-bounce">
                <FiCheckCircle size={44} className="stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome aboard, {formData.name}!</h2>
              <p className="text-muted text-sm max-w-sm mb-6 leading-relaxed">
                Your career specialization as <strong>{formData.role}</strong> has been configured. We are redirecting you to your intelligence dashboard now.
              </p>
              <div className="flex items-center gap-2 text-xs text-violet font-medium">
                <span>Redirecting dashboard</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce"></span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
