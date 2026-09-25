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

  // Visitor Navigation Items with unified About Us & Mission tab
  const navigationItems = [
    { id: "home", label: language === "bn" ? "প্রচ্ছদ" : "Home", icon: <Home className="w-4 h-4" /> },
    { id: "about", label: language === "bn" ? "আমাদের কথা ও লক্ষ্য" : "About Us & Mission", icon: <Info className="w-4 h-4" /> },
    { id: "reports", label: language === "bn" ? "আমাদের কাজ ও অন্বেষণ" : "Work & Reports", icon: <FileText className="w-4 h-4" /> },
    { id: "volunteer", label: language === "bn" ? "স্বেচ্ছাসেবী" : "Volunteer", icon: <UserPlus className="w-4 h-4" /> },
    { id: "gallery", label: language === "bn" ? "গ্যালারি" : "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "blog", label: language === "bn" ? "ব্লগ" : "Blog", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const moreItems = [
    { id: "events", label: language === "bn" ? "অনুষ্ঠানসূচী" : "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "members", label: language === "bn" ? "সদস্যবৃন্দ" : "Members", icon: <Users className="w-4 h-4" /> },
    { id: "contact", label: language === "bn" ? "যোগাযোগ" : "Contact", icon: <Mail className="w-4 h-4" /> },
    ...(isAdmin
      ? [{ id: "admin", label: language === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard", icon: <ShieldCheck className="w-4 h-4" /> }]
      : []),
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
      className="sticky top-0 z-50 bg-white/95 border-b border-stone-200 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo container with verified image */}
          <div
            id="header-logo-container"
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0 mr-4 lg:mr-8"
            onClick={() => handleTabClick(isAdmin ? "admin" : "home")}
          >
            <div className="flex items-center justify-center p-1 bg-amber-50 rounded-lg border border-amber-200 group-hover:border-amber-300 transition-colors">
              <img
                src={siteData?.general?.logoImage || "/images/logo.svg"}
                alt="Jiyonkathi (জিয়নকাঠি) Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
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
                <span className="text-amber-700 text-sm sm:text-base font-bold">
                  (জিয়নকাঠি)
                </span>
              </div>
              <span className="text-xs text-stone-500 font-medium block leading-none mt-0.5">
                {isAdmin ? "Admin Control Panel" : "A Sustainable Living Community"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav"
            className="hidden xl:flex items-center space-x-1 flex-1 justify-center"
          >
            {navigationItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors ${(activeTab === item.id || (item.id === "about" && activeTab === "mission"))
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "text-stone-700 hover:text-amber-800 hover:bg-stone-100"
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
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors ${moreItems.some((item) => item.id === activeTab)
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "text-stone-700 hover:text-amber-800 hover:bg-stone-100"
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
                  className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-md border border-stone-200 py-1 z-50"
                >
                  {moreItems.map((item) => (
                    <button
                      key={item.id}
                      id={`dropdown-${item.id}`}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center space-x-2 w-full px-3 py-2 text-left text-xs font-semibold transition-colors ${activeTab === item.id
                        ? "bg-amber-50 text-amber-900 font-bold"
                        : "text-stone-700 hover:text-amber-800 hover:bg-stone-50"
                        }`}
                    >
                      <span className="text-amber-700">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Controls (Language & Admin Controls) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            <button
              id="language-switcher-btn"
              onClick={toggleLanguage}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-md border border-stone-200 transition-colors flex items-center space-x-1.5"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <span>🇮🇳</span>
              <span>{language === "bn" ? "বাংলা (India)" : "English (IN)"}</span>
            </button>

            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  id="header-admin-dashboard-btn"
                  onClick={() => handleTabClick("admin")}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Dashboard"}</span>
                </button>

                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 hover:border-red-200 font-semibold text-xs px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5"
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
              className="bg-stone-100 text-stone-800 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-stone-200 flex items-center space-x-1"
            >
              <span>{language === "bn" ? "🇮🇳 বাংলা" : "🇮🇳 ENG"}</span>
            </button>

            {isAdmin && (
              <button
                id="mobile-admin-dashboard-btn"
                onClick={() => handleTabClick("admin")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-md flex items-center justify-center"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}

            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 bg-stone-100 hover:bg-stone-200 focus:outline-none transition-colors"
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
          className="xl:hidden border-t border-stone-200 bg-white py-3 px-4 space-y-1 shadow-md"
        >
          {isAdmin && (
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded-md border border-emerald-200 mb-2">
              <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Session Active</span>
              </div>
              <button
                onClick={() => handleTabClick("admin")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-xs font-semibold"
              >
                {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
              </button>
            </div>
          )}

          {navigationItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center space-x-2.5 w-full px-3 py-2 rounded-md text-xs font-semibold transition-colors ${(activeTab === item.id || (item.id === "about" && activeTab === "mission"))
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "text-stone-700 hover:bg-stone-100"
                }`}
            >
              <span className="text-amber-700">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider px-3 pt-2.5 pb-1 border-t border-stone-200">
            {language === "bn" ? "অন্যান্য সংযোগ" : "More Links"}
          </div>
          {moreItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-more-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center space-x-2.5 w-full px-3 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === item.id
                ? "bg-amber-100 text-amber-900 font-bold"
                : "text-stone-700 hover:bg-stone-100"
                }`}
            >
              <span className="text-amber-700">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {isAdmin && (
            <div className="pt-2 border-t border-stone-200">
              <button
                id="mobile-drawer-logout-btn"
                onClick={handleLogout}
                className="w-full bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 font-semibold text-xs py-2 rounded-md text-center flex items-center justify-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>{language === "bn" ? "লগআউট" : "Logout Admin Account"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
