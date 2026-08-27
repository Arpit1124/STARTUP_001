import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User as UserIcon, Shield, CreditCard, Sparkles, Check, X, LogOut, ArrowRight, Activity } from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (user: User | null) => void;
  initialTab?: "login" | "register" | "profile" | "pricing";
}

export default function AuthModal({ isOpen, onClose, user, onUpdateUser, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register" | "forgot" | "profile" | "pricing">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate Login
    const mockUser: User = {
      id: "user-123",
      email: email,
      name: email.split("@")[0].toUpperCase(),
      subscriptionTier: "pro", // Default upgrade for demo
      aiUsageLimit: 50,
      aiUsageCount: 4,
      recentActivity: [
        { action: "Logged in successfully", time: "Just now" },
        { action: "Created agriculture concept idea", time: "2 hours ago" }
      ],
      savedStartupsCount: 1
    };
    onUpdateUser(mockUser);
    setSuccess("Logged in successfully!");
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate Register
    const mockUser: User = {
      id: "user-123",
      email: email,
      name: name,
      subscriptionTier: "free",
      aiUsageLimit: 5,
      aiUsageCount: 0,
      recentActivity: [{ action: "Account registered", time: "Just now" }],
      savedStartupsCount: 0
    };
    onUpdateUser(mockUser);
    setSuccess("Account registered! Welcome to StartupForge AI.");
    setTimeout(() => {
      setSuccess("");
      setTab("pricing"); // Redirect to pricing so they can check out plans
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please specify your email.");
      return;
    }
    setSuccess("Password reset instructions sent to your inbox!");
    setTimeout(() => {
      setSuccess("");
      setTab("login");
    }, 2000);
  };

  const handleUpgrade = (tier: "free" | "pro" | "enterprise") => {
    if (!user) {
      setTab("register");
      return;
    }
    const limits = { free: 5, pro: 50, enterprise: 500 };
    const updated: User = {
      ...user,
      subscriptionTier: tier,
      aiUsageLimit: limits[tier],
      recentActivity: [
        { action: `Upgraded to ${tier.toUpperCase()} Subscription`, time: "Just now" },
        ...user.recentActivity
      ]
    };
    onUpdateUser(updated);
    setSuccess(`Successfully upgraded to ${tier.toUpperCase()}!`);
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1500);
  };

  const handleSocialLogin = (platform: string) => {
    // Simulate Google / GitHub login
    const mockUser: User = {
      id: "user-123",
      email: "founder@google.com",
      name: "Alex Mercer",
      subscriptionTier: "pro",
      aiUsageLimit: 50,
      aiUsageCount: 8,
      recentActivity: [
        { action: `Connected via ${platform}`, time: "Just now" }
      ],
      savedStartupsCount: 2
    };
    onUpdateUser(mockUser);
    setSuccess(`Connected successfully with ${platform}!`);
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1000);
  };

  const handleLogout = () => {
    onUpdateUser(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} id="auth-backdrop" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 z-10"
        id="auth-modal"
      >
        {/* Header decoration */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          id="auth-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-800 rounded-xl text-rose-200 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-800 rounded-xl text-emerald-200 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {success}
            </div>
          )}

          {/* LOGIN VIEW */}
          {tab === "login" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-400" /> Welcome Back
                </h3>
                <p className="text-sm text-slate-400 mt-1">Sign in to your StartupForge AI workspace</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-slate-400">Password</label>
                    <button
                      type="button"
                      onClick={() => setTab("forgot")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-1 text-sm mt-2"
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-6 text-center">
                <hr className="border-slate-800" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-xs text-slate-500">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 hover:bg-slate-800 text-xs font-medium transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.67 14.93 1 12 1 7.35 1 3.39 3.67 1.48 7.56l3.75 2.91C6.18 7.15 8.87 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.23 14.73c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.48 7.28C.54 9.12 0 11.19 0 13.36s.54 4.24 1.48 6.08l3.75-2.91z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 22.04c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.13 0-5.82-2.11-6.77-5.43L1.48 14.84c1.91 3.89 5.87 6.56 10.52 6.56z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 hover:bg-slate-800 text-xs font-medium transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <button onClick={() => setTab("register")} className="text-cyan-400 hover:underline font-medium">
                  Sign Up Free
                </button>
              </div>
            </div>
          )}

          {/* REGISTER VIEW */}
          {tab === "register" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" /> Create Account
                </h3>
                <p className="text-sm text-slate-400 mt-1">Start forging your startup in minutes</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-1 text-sm mt-2"
                >
                  Start Forging <Sparkles className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-6 text-center">
                <hr className="border-slate-800" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-xs text-slate-500">
                  OR SIGN UP WITH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 hover:bg-slate-800 text-xs font-medium transition-colors"
                >
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 hover:bg-slate-800 text-xs font-medium transition-colors"
                >
                  GitHub
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button onClick={() => setTab("login")} className="text-cyan-400 hover:underline font-medium">
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {tab === "forgot" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-white">Reset Password</h3>
                <p className="text-sm text-slate-400 mt-1">Enter your email to receive recovery link</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-colors text-sm"
                >
                  Send Recovery Link
                </button>

                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="w-full text-center text-xs text-slate-400 hover:underline hover:text-slate-200 mt-2 block"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

          {/* USER PROFILE */}
          {tab === "profile" && user && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-slate-950 font-extrabold text-2xl mx-auto shadow-lg mb-3">
                  {user.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">{user.name}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 text-cyan-400 rounded-full text-xs font-semibold border border-cyan-800/30">
                  <Shield className="w-3.5 h-3.5" /> {user.subscriptionTier.toUpperCase()} ACCOUNT
                </div>
              </div>

              <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 mb-6">
                <div className="flex justify-between items-center text-xs border-b border-slate-800/60 pb-2.5">
                  <span className="text-slate-400">Account ID:</span>
                  <span className="font-mono text-slate-300">usr_3lycowaozl</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-800/60 pb-2.5">
                  <span className="text-slate-400">Total Saved Startups:</span>
                  <span className="text-white font-medium">{user.savedStartupsCount}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">AI Tokens / Credits Used:</span>
                    <span className="text-cyan-400 font-bold">{user.aiUsageCount} / {user.aiUsageLimit}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((user.aiUsageCount / user.aiUsageLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setTab("pricing")}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Manage Subscription
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-slate-950 border border-slate-800 text-rose-400 hover:bg-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}

          {/* PRICING PLANS */}
          {tab === "pricing" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-white">Choose Your Workspace</h3>
                <p className="text-sm text-slate-400 mt-1">Unlock premium AI limits & export files easily</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {/* FREE PLAN */}
                <div className={`p-4 rounded-xl border transition-all ${user?.subscriptionTier === "free" ? "bg-slate-900 border-slate-700" : "bg-slate-950/40 border-slate-800 hover:border-slate-700"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">Forge Free</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Explore the builder basics</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white">$0</span>
                      <span className="text-slate-500 text-[10px] block">Forever</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> 5 Total Forge Credits</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Basic business analysis</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Standard dashboard interface</li>
                  </ul>
                  <button
                    onClick={() => handleUpgrade("free")}
                    disabled={user?.subscriptionTier === "free"}
                    className="w-full mt-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold py-1.5 rounded-lg text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user?.subscriptionTier === "free" ? "Active Plan" : "Downgrade to Free"}
                  </button>
                </div>

                {/* PRO PLAN */}
                <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${user?.subscriptionTier === "pro" ? "bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`}>
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wide">
                    Popular
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-1">
                        Forge Pro <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Perfect for active founders</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white">$49</span>
                      <span className="text-slate-500 text-[10px] block">/ month</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> 50 Forge Credits/mo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Access to all 13 core modules</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Full Document exports (PRD, Pitch, PDF)</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Active live landing page deployment</li>
                  </ul>
                  <button
                    onClick={() => handleUpgrade("pro")}
                    className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold py-1.5 rounded-lg text-xs hover:opacity-90 active:scale-98 transition-all"
                  >
                    {user?.subscriptionTier === "pro" ? "Current Plan" : "Upgrade to Pro"}
                  </button>
                </div>

                {/* ENTERPRISE PLAN */}
                <div className={`p-4 rounded-xl border transition-all ${user?.subscriptionTier === "enterprise" ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10" : "bg-slate-950/40 border-slate-800 hover:border-slate-700"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">Forge Studio</h4>
                      <p className="text-xs text-slate-400 mt-0.5">For accelerators & agencies</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white">$199</span>
                      <span className="text-slate-500 text-[10px] block">/ month</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> 500 Forge Credits/mo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Real-time collaborative team workspaces</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Premium white-labeled brand setups</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> Priority API generation bandwidth</li>
                  </ul>
                  <button
                    onClick={() => handleUpgrade("enterprise")}
                    className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-lg text-xs active:scale-98 transition-all"
                  >
                    {user?.subscriptionTier === "enterprise" ? "Current Plan" : "Contact / Upgrade Enterprise"}
                  </button>
                </div>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() => setTab("profile")}
                  className="w-full text-center text-xs text-slate-500 hover:underline hover:text-slate-300 mt-4 block"
                >
                  Back to Profile
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
