"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Info,
  Calendar,
  Home,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Users,
  Compass,
  FileText,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Eye,
  Sparkles,
} from "lucide-react";

export default function Header({
  activeTab,
  setActiveTab,
  userSession,
  setUserSession,
}) {
  const { siteData, language, toggleLanguage } = useContext(SiteContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAdmin = userSession && userSession.role === "admin";

  // Visitor Navigation Items with unified Work & Research Reports tab
  const navigationItems = [
    { id: "home", label: language === "bn" ? "প্রচ্ছদ" : "Home", icon: <Home className="w-4 h-4" /> },
    { id: "about", label: language === "bn" ? "আমাদের কথা" : "About Us", icon: <Info className="w-4 h-4" /> },
    { id: "mission", label: language === "bn" ? "আমাদের লক্ষ্য" : "Our Mission", icon: <Compass className="w-4 h-4" /> },
    { id: "reports", label: language === "bn" ? "আমাদের কাজ ও গবেষণা" : "Work & Reports", icon: <FileText className="w-4 h-4" /> },
    { id: "volunteer", label: language === "bn" ? "স্বেচ্ছাসেবী" : "Volunteer", icon: <UserPlus className="w-4 h-4" /> },
    { id: "gallery", label: language === "bn" ? "গ্যালারি" : "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "blog", label: language === "bn" ? "ব্লগ" : "Blog", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const moreItems = [
    { id: "events", label: language === "bn" ? "অনুষ্ঠানসূচী" : "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "members", label: language === "bn" ? "সদস্যবৃন্দ" : "Members", icon: <Users className="w-4 h-4" /> },
    { id: "contact", label: language === "bn" ? "যোগাযোগ" : "Contact", icon: <Mail className="w-4 h-4" /> },
    { id: "portal", label: language === "bn" ? "অ্যাডমিন পোর্টাল" : "Admin Portal", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  // Admin Specific Navigation Bar
  const adminNavigationItems = [
    {
      id: "admin",
      label: language === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      isPrimary: true,
    },
    {
      id: "home",
      label: language === "bn" ? "ওয়েবসাইট দেখুন" : "View Site",
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: language === "bn" ? "গবেষণা রিপোর্ট" : "Reports",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "volunteer",
      label: language === "bn" ? "স্বেচ্ছাসেবক তালিকা" : "Volunteers",
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: "gallery",
      label: language === "bn" ? "গ্যালারি নিয়ন্ত্রণ" : "Gallery",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: "blog",
      label: language === "bn" ? "ব্লগ প্রকাশনা" : "Blogs",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setActiveTab("home");
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo container with verified image */}
          <div
            id="header-logo-container"
            className="flex items-center space-x-3.5 cursor-pointer group select-none shrink-0 mr-6 lg:mr-10"
            onClick={() => handleTabClick(isAdmin ? "admin" : "home")}
          >
            <div className="relative flex items-center justify-center p-1.5 bg-amber-50 rounded-2xl border border-amber-200 shadow-2xs group-hover:border-amber-300 transition-colors">
              <img
                src={siteData?.general?.logoImage || "/images/logo.svg"}
                alt="Jiyonkathi (জিয়নকাঠি) Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/logo.svg";
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 leading-tight">
                  Jiyonkathi
                </span>
                <span className="text-amber-600 text-sm sm:text-base font-extrabold">
                  (জিয়নকাঠি)
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-semibold block leading-none mt-0.5">
                {isAdmin ? "Admin Control Panel" : "A Sustainable Living Community"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav"
            className="hidden xl:flex items-center space-x-1.5 flex-1 justify-center"
          >
            {isAdmin ? (
              <div className="flex items-center space-x-1 bg-amber-50/70 p-1 rounded-2xl border border-amber-200/80">
                {adminNavigationItems.map((item) => (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl cursor-pointer text-xs font-bold transition-all ${activeTab === item.id || (item.id === "admin" && activeTab === "portal")
                      ? item.isPrimary
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white text-amber-800 shadow-2xs border border-amber-200"
                      : "text-stone-700 hover:text-amber-700 hover:bg-white/80"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] cursor-pointer font-bold transition-all duration-150 ${activeTab === item.id
                      ? "bg-amber-100/80 text-amber-900 shadow-2xs border border-amber-200"
                      : "text-stone-700 hover:text-amber-700 hover:bg-amber-50/60"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}

                {/* More Items Dropdown */}
                <div className="relative">
                  <button
                    id="nav-more-dropdown"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs cursor-pointer sm:text-[13px] font-bold transition-all ${moreItems.some((item) => item.id === activeTab)
                      ? "bg-amber-100/80 text-amber-900 shadow-2xs border border-amber-200"
                      : "text-stone-700 hover:text-amber-700 hover:bg-amber-50/60"
                      }`}
                  >
                    <span>{language === "bn" ? "আরও" : "More"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      id="more-dropdown-menu"
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {moreItems.map((item) => (
                        <button
                          key={item.id}
                          id={`dropdown-${item.id}`}
                          onClick={() => handleTabClick(item.id)}
                          className={`flex items-center space-x-2.5 w-full px-4 py-2.5 cursor-pointer text-left text-xs font-bold transition-colors ${activeTab === item.id
                            ? "bg-amber-50 text-amber-900 font-extrabold"
                            : "text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                            }`}
                        >
                          <span className="text-amber-600">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Desktop Right Controls (Language & Admin Controls) */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <button
              id="language-switcher-btn"
              onClick={toggleLanguage}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-extrabold px-3.5 py-2 rounded-xl border border-amber-200 transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <span>🇮🇳</span>
              <span>{language === "bn" ? "বাংলা (India)" : "English (IN)"}</span>
            </button>

            {isAdmin && (
              <div className="flex items-center space-x-2">
                <div
                  id="admin-status-badge"
                  className="hidden 2xl:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Active</span>
                </div>

                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
                  title="Logout from Admin account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>{language === "bn" ? "লগআউট" : "Logout"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              id="mobile-language-switcher-btn"
              onClick={toggleLanguage}
              className="bg-amber-50 text-amber-900 text-xs font-extrabold px-2.5 py-2 rounded-xl border border-amber-200 flex items-center space-x-1"
            >
              <span>{language === "bn" ? "🇮🇳 বাংলা" : "🇮🇳 ENG"}</span>
            </button>

            {isAdmin && (
              <button
                id="mobile-admin-dashboard-btn"
                onClick={() => handleTabClick("admin")}
                className="bg-amber-600 text-white p-2 rounded-xl shadow-2xs flex items-center justify-center"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}

            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 bg-stone-100 hover:bg-amber-50 hover:text-amber-700 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden border-t border-amber-100 bg-[#fffdfa] py-4 px-4 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          {isAdmin ? (
            <>
              <div className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 mb-2">
                <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Session Active</span>
                </div>
              </div>

              {adminNavigationItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-admin-nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.id || (item.id === "admin" && activeTab === "portal")
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-700 hover:bg-amber-50"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="pt-2 border-t border-stone-200">
                <button
                  id="mobile-drawer-logout-btn"
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-700 border border-red-200 font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout Admin Account</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                    ? "bg-amber-100 text-amber-900 shadow-2xs border border-amber-200"
                    : "text-stone-700 hover:bg-amber-50/70"
                    }`}
                >
                  <span className="text-amber-600">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 pt-3 pb-1 border-t border-stone-200">
                {language === "bn" ? "অন্যান্য সংযোগ" : "More Links"}
              </div>
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-more-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                    ? "bg-amber-100 text-amber-900 font-bold"
                    : "text-stone-700 hover:bg-amber-50"
                    }`}
                >
                  <span className="text-amber-600">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </header>
  );
}
