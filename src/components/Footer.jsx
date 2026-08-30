"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Compass,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Footer({ setActiveTab }) {
  const { siteData, language } = useContext(SiteContext);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleLinkClick = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="main-footer" className="bg-stone-950 text-stone-300">
      {/* Top Newsletter CTA */}
      <div
        id="footer-cta-banner"
        className="border-b border-stone-800/80 bg-stone-900/60 py-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === "bn" ? "মাঠ গবেষণা ও ত্রৈমাসিক বুলেটিন" : "Field Research & Quarterly Bulletin"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                {language === "bn"
                  ? "দেশীয় বীজ সংরক্ষণ ও জৈব কৃষির নিয়মিত প্রতিবেদন পেতে যুক্ত থাকুন।"
                  : "Subscribe for verified field research data and seed updates."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full md:w-auto max-w-md items-center space-x-2"
          >
            <div className="relative flex-grow">
              <input
                type="email"
                required
                placeholder={language === "bn" ? "আপনার ইমেইল লিখুন..." : "Enter your email..."}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 text-xs sm:text-sm rounded-xl py-2.5 pl-4 pr-10 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-stone-500" />
            </div>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 shrink-0 active:scale-95 cursor-pointer"
            >
              <span>{subscribed ? (language === "bn" ? "যুক্ত হয়েছেন!" : "Subscribed!") : (language === "bn" ? "সাবস্ক্রাইব" : "Subscribe")}</span>
              {!subscribed && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>

        {subscribed && (
          <div className="max-w-7xl mx-auto mt-3 text-center md:text-right">
            <p className="text-emerald-400 text-xs flex items-center justify-center md:justify-end space-x-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {language === "bn"
                  ? "ধন্যবাদ! ত্রৈমাসিক বুলেটিনে আপনার ইমেইল সফলভাবে নিবন্ধিত হয়েছে।"
                  : "Thank you! You are now subscribed to our quarterly field bulletin."}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleLinkClick("home")}>
              <div className="p-1 bg-stone-900 border border-stone-800 rounded-xl">
                <img
                  src="/images/logo.svg"
                  alt="Jiyonkathi Logo"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.target.src = "/logo.svg";
                  }}
                />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight flex items-center space-x-1.5">
                  <span>Jiyonkathi</span>
                  <span className="text-amber-400 font-extrabold text-sm">(জিয়নকাঠি)</span>
                </span>
                <span className="text-[11px] text-stone-400 block font-semibold">A Sustainable Living Community</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              {language === "bn"
                ? "সঞ্চিত আনন্দ, সচেতনতা এবং দায়িত্ববোধ থেকে তৈরি হওয়া এক স্বপ্নের গল্প হল “জিয়নকাঠি”। প্রাণ-প্রকৃতি-পরিবেশের সঙ্গে টেকসই জীবনের মেলবন্ধন।"
                : "A community initiative dedicated to indigenous seed conservation, chemical-free agriculture, and village auxiliary education."}
            </p>
            <div className="text-[11px] text-stone-500 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Aushgram, Purba Bardhaman, West Bengal, India</span>
            </div>
          </div>

          {/* Column 2: Core Programs & Research */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              {language === "bn" ? "কার্যক্রম ও গবেষণা" : "Programs & Research"}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li>
                <button
                  onClick={() => handleLinkClick("reports")}
                  className="text-stone-300 hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === "bn" ? "আমাদের কাজ ও গবেষণা" : "Work & Research Reports"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("mission")}
                  className="text-stone-300 hover:text-amber-400 transition-colors flex items-center space-x-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === "bn" ? "৪টি মূল স্তম্ভ ও খাদ্য নিরাপত্তা" : "4 Pillars & Food Security"}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("gallery")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "ফটোগ্রাফিক ও ভিডিও আর্কাইভ" : "Photo & Video Archive"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("blog")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "মাঠের বার্তা ও ব্লগ" : "Stories & Field Articles"}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Organization & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              {language === "bn" ? "সংগঠন ও সামাজিক পরিজন" : "Organization & Society"}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li>
                <button
                  onClick={() => handleLinkClick("about")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "আমাদের কথা ও পটভূমি" : "About Jiyonkathi"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("members")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "কার্যনির্বাহী সদস্যবৃন্দ" : "Executive Members & Team"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("volunteer")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "স্বেচ্ছাসেবী হিসেবে যোগ দিন" : "Volunteer Application"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("events")}
                  className="text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {language === "bn" ? "অনুষ্ঠান ও কর্মশালা" : "Events & Workshops"}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              {language === "bn" ? "যোগাযোগ ও প্রশাসন" : "Contact & Governance"}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>contact@jiyonkathi.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+91 94340 12345 / 98000 54321</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800">
              <button
                onClick={() => handleLinkClick("portal")}
                className="inline-flex items-center space-x-1.5 text-xs text-stone-400 hover:text-amber-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === "bn" ? "অ্যাডমিন পোর্টাল লগইন" : "Admin Portal Login"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-stone-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 space-y-3 sm:space-y-0 font-medium">
          <p>© {new Date().getFullYear()} Jiyonkathi (জিয়নকাঠি) NGO. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-stone-400 text-xs">
            <span>Aushgram, Burdwan, West Bengal</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold">Non-Profit Agro-Ecological Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
