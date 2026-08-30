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

export default function HomeSection({ setActiveTab }) {
  const { siteData, language } = useContext(SiteContext);

  const general = siteData.general || {};

  const pillars = siteData.pillars || [
    {
      id: "pillar-1",
      titleBn: "দেশীয় প্রজাতির দানাশস্য ও বীজ সংরক্ষণ",
      titleEn: "Indigenous Crop & Seed Conservation",
      taglineBn: "১২০+ দেশীয় ধানের প্রজাতি ও রাসায়নিক মুক্ত বীজ সুরক্ষা",
      taglineEn: "Preserving 120+ heirloom cultivars without synthetic chemicals",
      icon: "Leaf",
      colorTheme: "amber"
    },
    {
      id: "pillar-2",
      titleBn: "কৃষিজীবী মানুষের সাথে নিবিড় যোগাযোগ",
      titleEn: "Community Engagement & Knowledge Sharing",
      taglineBn: "মাঠ পর্যায়ের কৃষক ও সমাজের যৌথ অভিজ্ঞতা বিনিময়",
      taglineEn: "Direct dialogue uniting rural cultivators and urban learners",
      icon: "Users",
      colorTheme: "orange"
    },
    {
      id: "pillar-3",
      titleBn: "পুনর্ব্যবহারযোগ্য শক্তি ও পরিবেশ সুরক্ষা",
      titleEn: "Renewable Energy & Eco-Balance",
      taglineBn: "জীবাশ্ম জ্বালানিমুক্ত টেকসই জীবনযাপনের পথ",
      taglineEn: "Decentralized clean solar energy across farm workflows",
      icon: "Sun",
      colorTheme: "amber"
    },
    {
      id: "pillar-4",
      titleBn: "Practicing Food Security for Life",
      titleEn: "Practicing Food Security for Life",
      taglineBn: "জীবনের জন্য খাদ্য নিরাপত্তা: বিষমুক্ত ফল ও বহুমুখী সবজি চাষ",
      taglineEn: "Homestead vegetable & fruit farming methodologies",
      icon: "Apple",
      colorTheme: "emerald"
    }
  ];

  const reports = siteData.researchReports || [
    {
      id: "rep-1",
      titleBn: "দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ গবেষণা প্রতিবেদন (২০১৩-২০২৬)",
      titleEn: "Indigenous Rice Cultivars & Seed Conservation Field Report",
      categoryBn: "কৃষি ও পরিবেশ",
      categoryEn: "Agro-Ecology",
      authorBn: "জিয়নকাঠি কৃষি গবেষণা দল",
      readTime: "৮ মিনিট পাঠ",
      excerptBn: "১২০টিরও বেশি বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতির ফলন বিশ্লেষণ, রাসায়নিক সার ব্যতিরেকে প্রাকৃতিক পুষ্টি ব্যবস্থাপনা ও ভূগর্ভস্থ জল সংরক্ষণ পদ্ধতি।"
    },
    {
      id: "rep-2",
      titleBn: "বসতভিটায় সারাবছর বিষমুক্ত ফল ও সবজি চাষ পদ্ধতি এবং খাদ্য নিরাপত্তা",
      titleEn: "Homestead Organic Fruit & Vegetable Food Security Framework",
      categoryBn: "খাদ্য নিরাপত্তা",
      categoryEn: "Food Security",
      authorBn: "জিয়নকাঠি উদ্যানপালন ইউনিট",
      readTime: "৬ মিনিট পাঠ",
      excerptBn: "মাচা ভিত্তিক লতানো সবজি, দেশীয় বহুস্তরীয় ফলের বাগান এবং দশপর্ণী অর্ক বালাইনাশক ব্যবহারের ব্যবহারিক ক্ষেত্র পর্যালোচনা।"
    },
    {
      id: "rep-3",
      titleBn: "বীরভূম ও বর্ধমানের প্রান্তিক কৃষকদের সাথে সহযোগিতামূলক টেকসই কৃষি রূপরেখা",
      titleEn: "Smallholder Sustainable Agriculture in Birbhum & Burdwan",
      categoryBn: "সামাজিক সংহতি",
      categoryEn: "Social Solidarity",
      authorBn: "গ্রামীণ সমন্বয় পরিষদ",
      readTime: "৫ মিনিট পাঠ",
      excerptBn: "স্থানীয় কৃষক পরিবারের সাথে সমন্বিতভাবে কীটনাশকমুক্ত ফসল উৎপাদন ও কৃষকদের অর্থনৈতিক স্বাবলম্বিতা অর্জনের বাস্তব তথ্য।"
    }
  ];

  const initiatives = [
    {
      id: "init-1",
      titleBn: "দেশীয় বীজ সংরক্ষণাগার",
      titleEn: "Heirloom Seed Conservation Bank",
      descBn: "১২০+ বিলুপ্তপ্রায় ধান ও ফসলের বীজ সংগ্রহ, বংশবৃদ্ধি এবং বিনামূল্যে প্রান্তিক কৃষকদের মাঝে বিতরণ।",
      descEn: "Preserving and multiplying 120+ endangered indigenous crop seeds and distributing to smallholders.",
      icon: <Leaf className="w-5 h-5 text-amber-700" />,
      tagBn: "বীজ সংরক্ষণ",
      tagEn: "Seed Bank"
    },
    {
      id: "init-2",
      titleBn: "সহায়ক শিক্ষাকেন্দ্র",
      titleEn: "Rural Auxiliary Learning Center",
      descBn: "পল্লী অঞ্চলের শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয়, নীতিশিক্ষা এবং ব্যবহারিক কারুশিল্প প্রশিক্ষণ।",
      descEn: "Nature-based experiential learning, indigenous folklore, and basic craftsmanship for rural children.",
      icon: <BookOpen className="w-5 h-5 text-emerald-700" />,
      tagBn: "শিশু শিক্ষা",
      tagEn: "Education"
    },
    {
      id: "init-3",
      titleBn: "প্রাকৃতিক উপায়ে চাষাবাদ",
      titleEn: "Chemical-Free Natural Cultivation",
      descBn: "কীটনাশক ও রাসায়নিক মুক্ত দশপর্ণী অর্ক ও জীবাণুসার প্রয়োগে মাটির উর্বরতা ও স্বাস্থ্য সুরক্ষা।",
      descEn: "Restoring soil microbiology using botanical concoctions, zero synthetic fertilizers, and bio-manure.",
      icon: <Sprout className="w-5 h-5 text-orange-700" />,
      tagBn: "বিষমুক্ত কৃষি",
      tagEn: "Eco-Farming"
    }
  ];

  return (
    <div id="home-section" className="bg-[#faf7f0] text-stone-900 space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (Warm, Clean, Inviting) */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* <div className="inline-flex items-center space-x-2 bg-amber-100/90 text-amber-900 border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === "bn" ? "টেকসই পল্লী উন্নয়ন ও পরিবেশ উদ্যোগ" : "Sustainable Rural Development"}</span>
              </div> */}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
                {language === "bn" ? (
                  <>
                    মাটি, মানুষ ও প্রকৃতির টানে <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                      জিয়নকাঠির টেকসই পথচলা
                    </span>
                  </>
                ) : (
                  <>
                    Cultivating Life, Ecology & <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                      Sustainable Heritage
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-medium max-w-2xl">
                {language === "bn"
                  ? (general.bannerSubtitleBengali || "বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ১২০+ বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সমাজ।")
                  : (general.bannerSubtitle || "Dedicated to pesticide-free organic farming, conserving 120+ indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.")}
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
                  <div className="text-xl sm:text-2xl font-black text-amber-700">{general.statSeeds || "১২০+"}</div>
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
                    src="/images/paddy-harvesting.jpg"
                    alt="Jiyonkathi Community Paddy Harvesting"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/seedbed.jpg";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-black px-3 py-1 rounded-full flex items-center space-x-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === "bn" ? "প্রাকৃতিক উপায়ে বীজতলা" : "Natural Seed Bank"}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>{language === "bn" ? "স্থান: আউশগ্রাম, বর্ধমান" : "Location: Aushgram, Burdwan"}</span>
                    <span className="text-amber-700 font-bold">{language === "bn" ? "মাঠ গবেষণা কেন্দ্র" : "Field Station"}</span>
                  </div>
                  <h3 className="text-base font-black text-stone-900">
                    {language === "bn"
                      ? "রাসায়নিক সার ও কীটনাশকমুক্ত দেশীয় ধান ও ফল-সবজি উৎপাদনের মডেল"
                      : "Heirloom Agro-Ecology & Sustainable Food Sovereignty"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REQUIRED HOMEPAGE QUOTE SECTION (From User Prompt & Image 3) */}
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

      {/* 3. KEY INITIATIVES SECTION (আমাদের প্রধান কর্মসূচিসমূহ - From Image 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">
              {language === "bn" ? "আমাদের প্রধান কর্মসূচিসমূহ" : "Our Key Initiatives"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "টেকসই গ্রামীণ প্রকল্পসমূহ" : "Sustainable Rural Initiatives"}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("reports")}
            className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all w-fit cursor-pointer"
          >
            <span>{language === "bn" ? "আমাদের সকল কাজ দেখুন >" : "See All Our Work >"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initiatives.map((init) => (
            <div
              key={init.id}
              onClick={() => setActiveTab("reports")}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 group-hover:bg-amber-100 transition-colors">
                    {init.icon}
                  </div>
                  <span className="text-[10px] font-extrabold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full uppercase">
                    {language === "bn" ? init.tagBn : init.tagEn}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-700 transition-colors">
                    {language === "bn" ? init.titleBn : init.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                    {language === "bn" ? init.descBn : init.descEn}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>{language === "bn" ? "বিস্তারিত প্রকল্প তথ্য" : "Explore Initiative"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE FOUR PILLARS (Clean, Clickable, No AI-Slop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">
              {language === "bn" ? "মৌলিক আদর্শ" : "Core Philosophy"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "জিয়নকাঠির ৪টি মূল স্তম্ভ" : "Our 4 Guiding Pillars"}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("mission")}
            className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all w-fit cursor-pointer"
          >
            <span>{language === "bn" ? "স্তম্ভগুলির বিশদ বিবরণ দেখুন" : "View Pillar Deep Dives"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((p, idx) => {
            const isPillar4 = idx === 3 || p.titleBn?.includes("Food Security") || p.titleEn?.includes("Food Security");
            return (
              <div
                key={p.id || idx}
                onClick={() => setActiveTab("mission")}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/80 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isPillar4
                        ? "bg-emerald-100 text-emerald-800"
                        : idx === 1
                          ? "bg-orange-100 text-orange-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                      {isPillar4 ? <Apple className="w-6 h-6" /> : idx === 1 ? <Users className="w-6 h-6" /> : idx === 2 ? <Sun className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-black text-stone-400 group-hover:text-amber-700 transition-colors">
                      {language === "bn" ? `স্তম্ভ ০${idx + 1}` : `Pillar 0${idx + 1}`}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-stone-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {language === "bn" ? p.titleBn : p.titleEn}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                      {language === "bn" ? p.taglineBn : p.taglineEn}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-extrabold text-amber-700 group-hover:text-amber-800">
                  <span>{language === "bn" ? "পদ্ধতি জানুন" : "Explore Method"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. RESEARCH REPORTS HIGHLIGHT (From Database) */}
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
              onClick={() => setActiveTab("reports")}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {language === "bn" ? r.categoryBn || "কৃষি গবেষণা" : r.categoryEn || "Research"}
                  </span>
                  <span className="text-[11px] font-bold text-stone-400">
                    {r.readTime || "5 min read"}
                  </span>
                </div>

                <h3 className="text-base font-black text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                  {language === "bn" ? r.titleBn : r.titleEn}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                  {language === "bn" ? r.excerptBn : r.excerptEn || r.excerptBn}
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
          <div className="lg:col-span-7 bg-stone-900 relative flex items-center justify-center min-h-[300px]">
            {siteData.homepageVideo?.url ? (
              <video
                src={siteData.homepageVideo.url}
                controls
                className="w-full h-full object-cover"
                poster={siteData.homepageVideo?.poster || "/images/ecology-collage.jpg"}
              />
            ) : (
              <img
                src="/images/community-collage.jpg"
                alt="Jiyonkathi Field Work Moments"
                className="w-full h-full object-cover"
              />
            )}
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
