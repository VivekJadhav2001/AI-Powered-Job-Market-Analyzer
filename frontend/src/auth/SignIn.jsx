import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import Card from "../components/ui/Card";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
    // Simulated login delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="app-background grid-fade min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Dynamic background glows */}
      <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-mint/10 blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-violet/15 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      <Card className="w-full max-w-lg p-6 sm:p-10 relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="signin-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-tr from-cyan-400 to-violet shadow-lg shadow-violet/20">
                  <FiZap className="text-slate-900 text-2xl" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Sign In to your account
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Access your personalized dashboard and insights.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
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
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400 font-medium">
                      <FiAlertCircle size={13} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
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

                {/* Remember Me & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet focus:ring-violet/30 focus:outline-none"
                    />
                    Remember me
                  </label>
                  <Link to="#" className="text-xs text-violet hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-4 rounded-xl bg-linear-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white text-sm font-medium shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In <FiArrowRight />
                    </>
                  )}
                </button>

                {/* Link to sign‑up */}
                <p className="text-center text-xs text-muted mt-6 pt-2">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-violet hover:underline font-semibold">
                    Sign Up
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
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-muted text-sm max-w-sm mb-6">
                You are being redirected to your dashboard.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
