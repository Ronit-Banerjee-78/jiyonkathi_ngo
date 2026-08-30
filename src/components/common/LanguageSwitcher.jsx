"use client";

import React from "react";
import { useSite } from "../../hooks/useSite";

export function LanguageSwitcher({ isMobile = false }) {
  const { language, toggleLanguage } = useSite();

  if (isMobile) {
    return (
      <button
        id="mobile-language-switcher-btn"
        onClick={toggleLanguage}
        className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-2.5 py-2 rounded-xl border border-stone-200 transition-all flex items-center space-x-1"
      >
        <span className="text-xs">🇮🇳 {language === "bn" ? "বাংলা (IN)" : "English (IN)"}</span>
      </button>
    );
  }

  return (
    <button
      id="language-switcher-btn"
      onClick={toggleLanguage}
      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-stone-200 transition-all flex items-center space-x-1.5"
      title="Change Language / ভাষা পরিবর্তন করুন (ভারত / India)"
    >
      <span className="text-base">🇮🇳</span>
      <span>{language === "bn" ? "বাংলা (India)" : "English (IN)"}</span>
    </button>
  );
}
