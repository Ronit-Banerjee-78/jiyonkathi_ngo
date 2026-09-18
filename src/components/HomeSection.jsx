"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Sparkles,
  Sprout,
  Compass,
  FileText,
  Briefcase,
  Users,
  ChevronRight,
  BookOpen,
  Apple,
  Sun,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  ArrowRight,
  Play,
  Award,
  Layers,
  PhoneCall
} from "lucide-react";
import { motion } from "motion/react";

// Helper for video embed / direct stream
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

export default function HomeSection({ setActiveTab }) {
  const { siteData, language, reports: contextReports, setSelectedReportId } = useContext(SiteContext);

  const general = siteData.general || {};

  const defaultPillars = [
    {
      id: "pillar-1",
      number: "০১",
      titleBn: "পরিবেশ সংকটকালে, একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করা",
      titleEn: "Building a Sustainable Rural Platform in Environmental Crisis",
      taglineBn: "রাসায়নিক সার-কীটনাশকহীন চাষাবাদ, ভূগর্ভস্থ জল সুরক্ষা এবং পুনর্ব্যবহারযোগ্য শক্তির প্রয়োগ।",
      taglineEn: "Chemical-free agro-ecology, groundwater preservation, and renewable energy adoption.",
      descBn: "পরিবেশ সংকটকালে একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করার মাধ্যমে প্রকৃতিবান্ধব কৃষি, বিষমুক্ত ফল-সবজি ও খাদ্য নিরাপত্তা নিশ্চিত করা।",
      descEn: "Creating an ecologically sustainable rural platform to foster regenerative farming and chemical-free food security.",
      icon: "Leaf",
      colorTheme: "amber",
      topics: [
        {
          id: "p1-t1",
          number: "১",
          titleBn: "দেশীয় প্রজাতির দানাশস্য (মূলত ধান), সব্জী (যতটা সম্ভব) চাষ করা, এবং সেই কাজে-",
          titleEn: "Cultivating indigenous crops (chiefly paddy) and vegetables to the utmost extent:",
          subPoints: [
            "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা।",
            "মাটির তলার জল না তোলা।",
            "যতটা কম সম্ভব জীবাশ্ম জ্বালানী ব্যবহার করা।"
          ]
        },
        {
          id: "p1-t2",
          number: "২",
          titleBn: "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা।",
          titleEn: "Utilizing renewable energy for daily and farming workflows.",
          subPoints: []
        },
        {
          id: "p1-t3",
          number: "৩",
          titleBn: "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা",
          titleEn: "Chemical-free horticulture and natural food security.",
          subPoints: []
        }
      ],
      goals: [
        "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা",
        "মাটির তলার জল না তোলা",
        "যতটা কম সম্ভব জীবাশ্ম জ্বালানী ব্যবহার করা",
        "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা",
        "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা"
      ],
      linkedReportId: "rep-1"
    },
    {
      id: "pillar-2",
      number: "০২",
      titleBn: "DDMPBS সোসাইটির সহায়তায়, শহর এবং গ্রামের একসাথে প্রস্তুত হওয়ার কার্যকরী প্রচেষ্টা",
      titleEn: "Collaborative Rural-Urban Action Supported by DDMPBS Society",
      taglineBn: "বিলুপ্তপ্রায় দেশীয় বীজ সংরক্ষণ, পল্লী শিশুদের সহায়ক শিক্ষা এবং গ্রামীণ স্বাস্থ্য সচেতনতা।",
      taglineEn: "Preserving heirloom seed varieties, rural children's auxiliary education, and health camps.",
      descBn: "DDMPBS সোসাইটির সহযোগিতায় শহর ও গ্রামীণ সমাজের যৌথ সংহতি, দেশীয় প্রজাতির বীজ সংরক্ষণ ও শিশু শিক্ষার সহায়ক কার্যক্রম।",
      descEn: "Fostering solidarity between urban and agrarian communities, indigenous seed banking, and child education.",
      icon: "Users",
      colorTheme: "orange",
      topics: [
        {
          id: "p2-t1",
          number: "১",
          titleBn: "দেশীয় প্রজাতির দানাশস্য (ধান, রাগী, শ্যামা ধান, দেশী মুগ ডাল, ইত্যাদি) এবং সব্জীর (যতটা সম্ভব) বীজ সংরক্ষণ করা।",
          titleEn: "Preserving seeds of indigenous food grains (rice, ragi, shyama rice, desi moong dal, etc.) and vegetables.",
          subPoints: []
        },
        {
          id: "p2-t2",
          number: "২",
          titleBn: "সহায়ক শিক্ষাকেন্দ্র",
          titleEn: "Auxiliary Education Center",
          descriptionBn: "পল্লী অঞ্চলের শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয়, নীতিশিক্ষা এবং ব্যবহারিক কারুশিল্প প্রশিক্ষণ",
          subPoints: []
        },
        {
          id: "p2-t3",
          number: "৩",
          titleBn: "স্বাস্থ্য সচেতনতা শিবির, সর্প সচেতনতা শিবির, গ্রামের কৃষিজীবী মানুষজনের সাথে যোগাযোগ বাড়ানো, সাংস্কৃতিক অনুষ্ঠান, ইত্যাদি আয়োজন করা।",
          titleEn: "Organizing free health checkups, snakebite awareness camps, agrarian community dialogues, and cultural events.",
          subPoints: []
        }
      ],
      goals: [
        "দেশীয় প্রজাতির দানাশস্য ও সব্জীর বীজ সংরক্ষণ",
        "পল্লী শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয় ও কারুশিল্প শিক্ষা",
        "নিয়মিত স্বাস্থ্য ও সর্প সচেতনতা শিবির পরিচালনা",
        "কৃষিজীবী মানুষের সাথে নিবিড় মানবিক যোগ ও সংস্কৃতি চর্চা"
      ],
      linkedReportId: "rep-2"
    }
  ];

  const hasValidPillars =
    Array.isArray(siteData?.pillars) &&
    siteData.pillars.length === 2 &&
    siteData.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে") &&
    siteData.pillars[1]?.titleBn?.includes("DDMPBS");
  const pillars = (hasValidPillars ? siteData.pillars : defaultPillars).slice(0, 2);

  const reports = (Array.isArray(contextReports) && contextReports.length > 0)
    ? contextReports
    : (siteData.researchReports || [
      {
        id: "rep-1",
        title: "দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ গবেষণা প্রতিবেদন (২০১৩-২০২৬)",
        titleEnglish: "Indigenous Rice Cultivars & Seed Conservation Field Report",
        topic: "বীজ সংরক্ষণ ও দেশীয় ধান",
        topicEnglish: "Agro-Ecology",
        author: "জিয়নকাঠি কৃষি গবেষণা দল",
        publishedDate: "২০২৬-০৮-১৫",
        summary: "১২০টিরও বেশি বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতির ফলন বিশ্লেষণ, রাসায়নিক সার ব্যতিরেকে প্রাকৃতিক পুষ্টি ব্যবস্থাপনা ও ভূগর্ভস্থ জল সংরক্ষণ পদ্ধতি।"
      },
      {
        id: "rep-2",
        title: "বসতভিটায় সারাবছর বিষমুক্ত ফল ও সবজি চাষ পদ্ধতি এবং খাদ্য নিরাপত্তা",
        titleEnglish: "Homestead Organic Fruit & Vegetable Food Security Framework",
        topic: "সবজি ও ফল চাষ (খাদ্য নিরাপত্তা)",
        topicEnglish: "Food Security",
        author: "জিয়নকাঠি উদ্যানপালন ইউনিট",
        publishedDate: "২০২৬-০৮-১০",
        summary: "মাচা ভিত্তিক লতানো সবজি, দেশীয় বহুস্তরীয় ফলের বাগান এবং দশপর্ণী অর্ক বালাইনাশক ব্যবহারের ব্যবহারিক ক্ষেত্র পর্যালোচনা।"
      },
      {
        id: "rep-3",
        title: "বীরভূম ও বর্ধমানের প্রান্তিক কৃষকদের সাথে সহযোগিতামূলক টেকসই কৃষি রূপরেখা",
        titleEnglish: "Smallholder Sustainable Agriculture in Birbhum & Burdwan",
        topic: "টেকসই কৃষি ও সম্প্রদায় সংহতি",
        topicEnglish: "Social Solidarity",
        author: "গ্রামীণ সমন্বয় পরিষদ (DDBMPBS সহযোগে)",
        publishedDate: "২০২৬-০৮-০৫",
        summary: "স্থানীয় কৃষক পরিবারের সাথে সমন্বিতভাবে কীটনাশকমুক্ত ফসল উৎপাদন ও কৃষকদের অর্থনৈতিক স্বাবলম্বিতা অর্জনের বাস্তব তথ্য।"
      }
    ]);

  const handleReportCardClick = (r) => {
    if (setSelectedReportId && r.id) {
      setSelectedReportId(r.id);
    }
    setActiveTab("reports");
  };

  return (
    <div id="home-section" className="bg-[#faf7f0] text-stone-900 space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (Warm, Clean, Inviting) */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">


              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
                {language === "bn" ? (
                  <>
                    {general.bannerTitleBengali || "প্রাণ-প্রকৃতি-পরিবেশের টানে"} <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                      {general.bannerHighlightBengali || "জিয়নকাঠির সুস্থায়ী পথচলা"}
                    </span>
                  </>
                ) : (
                  <>
                    {general.bannerTitleEnglish || "Cultivating Life, Ecology &"} <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                      {general.bannerHighlightEnglish || "Sustainable Heritage"}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-medium max-w-2xl">
                {language === "bn"
                  ? (general.bannerSubtitleBengali || "বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সমাজ।")
                  : (general.bannerSubtitle || general.bannerSubtitleEnglish || "Dedicated to pesticide-free organic farming, conserving 56 types of indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.")}
              </p>

              {/* Exact Hero Action Buttons: "See Work" and "Report" */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="hero-see-work-btn"
                  onClick={() => setActiveTab("reports")}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{language === "bn" ? "আমাদের কাজ (See Work)" : "See Work"}</span>
                </button>

                <button
                  id="hero-report-btn"
                  onClick={() => setActiveTab("reports")}
                  className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-2xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>{language === "bn" ? "গবেষণা রিপোর্ট (Report)" : "Report"}</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/80">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-700">{general.statSeeds || "৫৬ রকম"}</div>
                  <div className="text-[11px] font-bold text-stone-600 mt-0.5">
                    {language === "bn" ? "দেশীয় ধান সংরক্ষণ" : "Rice Cultivars"}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">{general.statYears || "১৩+"}</div>
                  <div className="text-[11px] font-bold text-stone-600 mt-0.5">
                    {language === "bn" ? "বছরের মাঠ গবেষণা" : "Years Experience"}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
                  <div className="text-xl sm:text-2xl font-black text-orange-700">{general.statFamilies || "৩৫০+"}</div>
                  <div className="text-[11px] font-bold text-stone-600 mt-0.5">
                    {language === "bn" ? "কৃষক পরিবার" : "Partner Families"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-3 sm:p-4 rounded-3xl border border-amber-200/90 shadow-md relative">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 relative">
                  <img
                    key={general.heroImage || "/images/paddy-harvesting.jpg"}
                    src={general.heroImage || "/images/paddy-harvesting.jpg"}
                    alt={language === "bn" ? (general.heroTitleBengali || "জিয়নকাঠি কার্যক্রম") : (general.heroTitleEnglish || "Jiyonkathi Action")}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/paddy-harvesting.jpg";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-black px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-xs">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {language === "bn"
                        ? (general.heroBadgeBengali || "প্রাকৃতিক উপায়ে বীজতলা")
                        : (general.heroBadgeEnglish || "Natural Seed Bank")}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>
                      {language === "bn"
                        ? (general.heroLocationBengali || "স্থান: আউশগ্রাম, বর্ধমান")
                        : (general.heroLocationEnglish || "Location: Aushgram, Burdwan")}
                    </span>
                    <span className="text-amber-700 font-bold">
                      {language === "bn" ? (general.heroStationBengali || "মাঠ গবেষণা কেন্দ্র") : (general.heroStationEnglish || "Field Station")}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 leading-snug">
                    {language === "bn"
                      ? (general.heroTitleBengali || "রাসায়নিক সার ও কীটনাশকমুক্ত দেশীয় ধান ও ফল-সবজি উৎপাদনের মডেল")
                      : (general.heroTitleEnglish || "Heirloom Agro-Ecology & Sustainable Food Sovereignty")}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY QUOTE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-200/90 shadow-xs text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center font-serif text-2xl font-black shadow-2xs">
            “
          </div>
          <blockquote className="text-lg sm:text-2xl font-bold text-stone-800 leading-relaxed font-serif max-w-3xl mx-auto">
            {language === "bn"
              ? (general.quoteBengali || "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।")
              : (general.quoteEnglish || "In this era of extreme environmental crisis and global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi.")}
          </blockquote>
          <div className="pt-2 text-xs sm:text-sm font-extrabold text-amber-800 uppercase tracking-widest">
            — {language === "bn" ? (general.quoteAuthorBengali || "জিয়নকাঠির লক্ষ্য ও আদর্শ") : (general.quoteAuthorEnglish || "Goal & Ideology of Jiyonkathi")} —
          </div>
        </div>
      </section>



      {/* 3. THE TWO PILLARS (Directly matching PDF Page 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">
              {language === "bn" ? "মৌলিক আদর্শ" : "Core Philosophy"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "জিয়নকাঠির ২ টি মূল স্তম্ভ" : "Our 2 Guiding Pillars"}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("about")}
            className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all w-fit cursor-pointer"
          >
            <span>{language === "bn" ? "স্তম্ভগুলির বিশদ বিবরণ দেখুন" : "View Pillar Deep Dives"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pillars.map((p, idx) => {
            const isPillar2 = idx === 1 || p.id === "pillar-2";
            return (
              <div
                key={p.id || idx}
                onClick={() => setActiveTab("about")}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/80 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isPillar2 ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {isPillar2 ? <Users className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                    </div>
                    {/* <span className="text-xs font-black px-3 py-1 rounded-full bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                      {language === "bn" ? `স্তম্ভ ০${idx + 1}` : `Pillar 0${idx + 1}`}
                    </span> */}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {language === "bn" ? p.titleBn : p.titleEn}
                    </h3>
                  </div>

                  {/* Render Topics directly from PDF Page 2 */}
                  {Array.isArray(p.topics) && p.topics.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-stone-100 text-xs text-stone-700">
                      {p.topics.map((t, tIdx) => (
                        <div key={t.id || tIdx} className="space-y-1">
                          <div className="font-bold text-stone-900 flex items-start space-x-1.5">
                            <span className="text-amber-700 font-black shrink-0">{t.number || tIdx + 1})</span>
                            <span className="leading-snug">{language === "bn" ? t.titleBn : t.titleEn}</span>
                          </div>
                          {t.descriptionBn && (
                            <p className="pl-4 text-[11px] text-stone-600 font-medium">
                              {language === "bn" ? t.descriptionBn : t.descriptionEn}
                            </p>
                          )}
                          {Array.isArray(t.subPoints) && t.subPoints.length > 0 && (
                            <ul className="pl-5 space-y-0.5 list-disc text-[11px] text-stone-600 font-medium">
                              {(language === "bn" ? t.subPoints : (t.subPointsEn || t.subPoints)).map((sp, sIdx) => (
                                <li key={sIdx} className="leading-relaxed">{sp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between text-xs font-extrabold text-amber-700 group-hover:text-amber-800">
                  <span>{language === "bn" ? "পদ্ধতি ও বিস্তারিত তথ্য জানুন" : "Explore Methodology & Details"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* 4. RESEARCH REPORTS HIGHLIGHT (From Database) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <span className="text-orange-700 font-black text-xs uppercase tracking-wider">
              {language === "bn" ? "বিজ্ঞানভিত্তিক ক্ষেত্র পর্যালোচনা" : "Empirical Field Research"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "সাম্প্রতিক গবেষণা ও প্রতিবেদন" : "Recent Research Reports"}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("reports")}
            className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all w-fit cursor-pointer"
          >
            <span>{language === "bn" ? "সকল রিপোর্ট ও কাজ" : "All Reports & Work"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.slice(0, 3).map((r, i) => (
            <div
              key={r.id || i}
              onClick={() => handleReportCardClick(r)}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {language === "bn"
                      ? (r.topic || r.categoryBn || "কৃষি গবেষণা")
                      : (r.topicEnglish || r.categoryEn || "Research")}
                  </span>
                  <span className="text-[11px] font-bold text-stone-400">
                    {r.publishedDate || r.readTime || "গবেষণা প্রতিবেদন"}
                  </span>
                </div>

                <h3 className="text-base font-black text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                  {language === "bn" ? (r.title || r.titleBn) : (r.titleEnglish || r.titleEn || r.title)}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                  {language === "bn" ? (r.summary || r.excerptBn) : (r.summaryEnglish || r.excerptEn || r.summary)}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>{language === "bn" ? "সম্পূর্ণ রিপোর্ট পড়ুন" : "Read Full Report"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NGO VIDEO / EDITABLE HOMEPAGE VIDEO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 bg-stone-900 relative flex items-center justify-center min-h-[340px]">
            {(() => {
              const videoUrl = siteData.homepageVideo?.url?.trim();
              if (!videoUrl) {
                return (
                  <img
                    src={siteData.homepageVideo?.poster || "/images/community-collage.jpg"}
                    alt="Jiyonkathi Field Work Moments"
                    className="w-full h-full object-cover"
                  />
                );
              }

              const embedUrl = getYouTubeEmbedUrl(videoUrl);
              if (embedUrl) {
                return (
                  <iframe
                    src={embedUrl}
                    title="Jiyonkathi Video"
                    className="w-full h-full aspect-video border-0 min-h-[340px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              }

              return (
                <video
                  key={videoUrl}
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover max-h-[480px]"
                  poster={siteData.homepageVideo?.poster || "/images/ecology-collage.jpg"}
                >
                  <source src={videoUrl} />
                  Your browser does not support the video tag.
                </video>
              );
            })()}
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                <Play className="w-3 h-3 text-amber-700 fill-amber-700" />
                <span>{language === "bn" ? "ভিডিও ও মাঠের চিত্র" : "Visual Moments"}</span>
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                {language === "bn"
                  ? (siteData.homepageVideo?.title || "মাটির টানে, মানুষের সাথে জিয়নকাঠি")
                  : (siteData.homepageVideo?.titleEnglish || siteData.homepageVideo?.title || "Living with Nature: Jiyonkathi in Action")}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {language === "bn"
                  ? (siteData.homepageVideo?.description || "আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে দেশীয় ধান চাষের প্রদর্শনী খামার, প্রাকৃতিক বীজতলা এবং গ্রামীণ শিশুদের সহায়ক শিক্ষা কেন্দ্রের প্রাত্যহিক মুহূর্ত।")
                  : (siteData.homepageVideo?.descriptionEnglish || siteData.homepageVideo?.description || "A window into our decentralized ecological seedbed nursery, community learning center, and indigenous rice cultivation.")}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setActiveTab("gallery")}
                className="text-xs font-black text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>{language === "bn" ? "পূর্ণাঙ্গ গ্যালারি দেখুন" : "View Photo Archive"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab("volunteer")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                {language === "bn" ? "স্বেচ্ছাসেবী হন" : "Volunteer"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOLUNTEER & COMMUNITY SOLIDARITY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="text-xs font-black tracking-widest uppercase bg-white/20 text-white px-3.5 py-1 rounded-full inline-block">
              {language === "bn" ? "স্বেচ্ছাসেবা ও যৌথ উদ্যোগ" : "Solidarity & Community"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === "bn"
                ? "আমাদের সাথে প্রকৃতি ও ঐতিহ্য রক্ষায় যুক্ত হোন"
                : "Join Hands in Ecological Preservation"}
            </h2>
            <p className="text-sm sm:text-base text-amber-50 leading-relaxed font-medium">
              {language === "bn"
                ? "আপনি যদি শিক্ষার্থী, গবেষক, পরিবেশপ্রেমী বা কৃষক হন—জিয়নকাঠির বীজ সংরক্ষণ ও শিক্ষা কার্যক্রমে আপনার সক্রিয় অবদান সাদরে আমন্ত্রিত।"
                : "Whether you are a student, researcher, or nature enthusiast, contribute your energy to our heirloom seed banks and children's education center."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setActiveTab("volunteer")}
              className="bg-white hover:bg-amber-50 text-amber-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>{language === "bn" ? "স্বেচ্ছাসেবী আবেদন ফরম" : "Apply as Volunteer"}</span>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className="bg-amber-800/60 hover:bg-amber-800/90 text-white border border-amber-300/40 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === "bn" ? "সরাসরি যোগাযোগ" : "Contact Us"}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
