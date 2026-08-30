"use client";

import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import {
  User,
  Lock,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PortalSection({ userSession, setUserSession, setActiveTab = () => { } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (
      (email === "admin@jiyonkathi.org" && password === "admin123") ||
      (email === "admin" && password === "admin123")
    ) {
      setUserSession({
        role: "admin",
        name: "জিয়নকাঠি অ্যাডমিনিস্ট্রেটর",
        username: "admin@jiyonkathi.org",
        email: "admin@jiyonkathi.org",
      });
      setSuccessMsg("প্রশাসনিক এক্সেস সফলভাবে অনুমোদিত!");
    } else {
      setError("ভুল ইমেইল বা পাসওয়ার্ড। ডেমো এক্সেসের জন্য admin@jiyonkathi.org / admin123 ব্যবহার করুন।");
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setEmail("");
    setPassword("");
    setError("");
    setSuccessMsg("");
  };

  return (
    <div id="portal-section" className="bg-[#faf7f0] min-h-screen py-12 sm:py-16">
      {userSession ? (
        <div className="space-y-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-white hover:bg-red-50 text-red-600 font-bold text-xs px-4 py-2 rounded-xl border border-stone-200 shadow-2xs transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করুন (Sign Out)</span>
            </button>
          </div>
          <AdminDashboard userSession={userSession} setUserSession={setUserSession} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>নিরাপদ অ্যাডমিন পোর্টাল</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              জিয়নকাঠি কেন্দ্রীয় নিয়ন্ত্রণ ব্যবস্থা
            </h1>
            <p className="text-sm text-stone-600">
              ওয়েবসাইটের গবেষণা রিপোর্ট, মূল স্তম্ভ, ব্লগ, সদস্য ক্রম ও গ্যালারি পরিচালনার জন্য লগইন করুন।
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12">
            {/* Info Side */}
            <div className="md:col-span-5 bg-[#fbf9f4] p-8 sm:p-10 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-stone-900">
                  অ্যাডমিন ড্যাশবোর্ড তথ্য
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  এই ড্যাশবোর্ডের মাধ্যমে আপনি গবেষণার .docx ফাইল আপলোড করে অটো-এক্সট্রাক্ট, চার মূল স্তম্ভের খাদ্য নিরাপত্তা পদ্ধতি সম্পাদন ও স্বেচ্ছাসেবী আবেদন নিয়ন্ত্রণ করতে পারেন।
                </p>

                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5 font-medium">
                  <div className="font-bold text-amber-950">ডেমো লগইন তথ্য:</div>
                  <div>ইমেইল: <span className="font-mono font-bold select-all">admin@jiyonkathi.org</span></div>
                  <div>পাসওয়ার্ড: <span className="font-mono font-bold select-all">admin123</span></div>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 font-medium pt-4 border-t border-stone-200">
                জিয়নকাঠি ডিজিটাল অ্যাডমিনিস্ট্রেশন সিস্টেম ২০২৬
              </div>
            </div>

            {/* Form Side */}
            <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-stone-900">
                  অ্যাডমিন লগইন
                </h2>
                <p className="text-xs text-stone-500">
                  আপনার প্রশাসনিক ইমেইল ও পাসওয়ার্ড প্রদান করুন
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-200 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    ইমেইল ঠিকানা (Email)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="admin@jiyonkathi.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-700 block">
                      পাসওয়ার্ড (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("admin@jiyonkathi.org");
                        setPassword("admin123");
                        setError("");
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:underline"
                    >
                      অটোফিল ডেমো একাউন্ট
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/20 font-medium text-stone-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ড্যাশবোর্ডে প্রবেশ করুন (Enter Dashboard)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
