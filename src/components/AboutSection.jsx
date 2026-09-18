"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Leaf,
  Users,
  Sun,
  BookOpen,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  FileText,
  ChevronRight,
  Compass,
  Sprout
} from "lucide-react";
import { BENGALI_CONTENT } from "../data";

export default function AboutSection({ setActiveTab = () => {}, initialPillarId = null }) {
  const { siteData, language } = useContext(SiteContext);
  const [selectedPillarId, setSelectedPillarId] = useState(initialPillarId);

  const cardItems = [
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
          ],
          subPointsEn: [
            "Complete avoidance of synthetic fertilizers and chemical pesticides.",
            "Zero extraction of underground water; relying on rain and surface water.",
            "Minimizing fossil fuel consumption."
          ]
        },
        {
          id: "p1-t2",
          number: "২",
          titleBn: "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা।",
          titleEn: "Utilizing renewable energy for daily and farming workflows.",
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p1-t3",
          number: "৩",
          titleBn: "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা",
          titleEn: "Chemical-free horticulture and natural food security.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা",
        "মাটির তলার জল না তোলা",
        "যতটা কম সম্ভব জীবাশ্ম জ্বালানী ব্যবহার করা",
        "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা",
        "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা"
      ],
      methodologyBn: "১. বৃষ্টির জল নির্ভর দেশীয় ধানের বীজতলা তৈরি ও জৈব সার প্রয়োগ।\n২. মাটির জৈব কার্বন বৃদ্ধি ও সৌরশক্তি চালিত মৃদু সেচ।\n৩. বহুমুখী বিষমুক্ত মাচায় সবজি ও দেশীয় ফলের বাগান সম্প্রসারণ।",
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
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p2-t2",
          number: "২",
          titleBn: "সহায়ক শিক্ষাকেন্দ্র",
          titleEn: "Auxiliary Education Center",
          descriptionBn: "পল্লী অঞ্চলের শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয়, নীতিশিক্ষা এবং ব্যবহারিক কারুশিল্প প্রশিক্ষণ",
          descriptionEn: "Training rural children in folk culture, nature study, moral ethics, and practical handicrafts.",
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p2-t3",
          number: "৩",
          titleBn: "স্বাস্থ্য সচেতনতা শিবির, সর্প সচেতনতা শিবির, গ্রামের কৃষিজীবী মানুষজনের সাথে যোগাযোগ বাড়ানো, সাংস্কৃতিক অনুষ্ঠান, ইত্যাদি আয়োজন করা।",
          titleEn: "Organizing free health checkups, snakebite awareness camps, agrarian community dialogues, and cultural events.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "দেশীয় প্রজাতির দানাশস্য ও সব্জীর বীজ সংরক্ষণ",
        "পল্লী শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয় ও কারুশিল্প শিক্ষা",
        "নিয়মিত স্বাস্থ্য ও সর্প সচেতনতা শিবির পরিচালনা",
        "কৃষিজীবী মানুষের সাথে নিবিড় মানবিক যোগ ও সংস্কৃতি চর্চা"
      ],
      methodologyBn: "১. দেশীয় ধানের জিন ব্যাংক ও বীজ বিনিময় কেন্দ্র পরিচালনা।\n২. গ্রামীণ শিশুদের জন্য মুক্ত পাঠশালা ও ব্যবহারিক শিল্পশালা।\n৩. চিকিৎসক ও বিশেষজ্ঞ সহযোগে গ্রামভিত্তিক স্বাস্থ্য ও সর্প সচেতনতা শিবির।",
      linkedReportId: "rep-2"
    }
  ];

  // Strictly enforce ONLY the 2 PDF pillars, rejecting any legacy 4-pillar database array
  const hasValidPillars =
    Array.isArray(siteData?.pillars) &&
    siteData.pillars.length === 2 &&
    siteData.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে") &&
    siteData.pillars[1]?.titleBn?.includes("DDMPBS");
  const pillarsList = (hasValidPillars ? siteData.pillars : cardItems).slice(0, 2);
  const activePillar = pillarsList.find((p) => p.id === selectedPillarId) || null;

  return (
    <div id="about-mission-section" className="bg-[#faf7f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* 1. Header & Vision Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/90 pb-6">
          <div className="space-y-2 max-w-3xl">
            <span className="text-amber-700 font-black text-xs uppercase tracking-wider">
              {language === "bn" ? "আমাদের পরিচিতি ও মূল চালিকাশক্তি" : "Our Story & Core Mission"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {language === "bn"
                ? "জিয়নকাঠি: আমাদের কথা ও মূল লক্ষ্য"
                : "Jiyonkathi: About Us & Our Mission"}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {siteData?.about?.intro || BENGALI_CONTENT.about.intro}
            </p>
          </div>

          <button
            onClick={() => setActiveTab("reports")}
            className="inline-flex items-center space-x-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs px-5 py-3 rounded-2xl shadow-2xs transition-all w-fit cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>{language === "bn" ? "আমাদের কাজ ও গবেষণা দেখুন" : "View Works & Reports"}</span>
          </button>
        </div>

        {/* 2. THE 2 GUIDING PILLARS SECTION */}
        <div id="guiding-pillars" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <span className="text-amber-700 font-black text-xs uppercase tracking-wider">
                {language === "bn" ? "মৌলিক আদর্শ ও কর্মপরিকল্পনা" : "Guiding Philosophy"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === "bn" ? "জিয়নকাঠির ২টি মূল স্তম্ভ ও লক্ষ্য" : "Our 2 Guiding Pillars"}
              </h2>
            </div>

            {activePillar && (
              <button
                onClick={() => setSelectedPillarId(null)}
                className="inline-flex items-center space-x-2 text-xs font-black text-stone-700 hover:text-amber-800 bg-stone-100 hover:bg-amber-50 px-4 py-2 rounded-xl transition-all cursor-pointer w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === "bn" ? "সকল স্তম্ভের সংক্ষিপ্ত তালিকায় ফিরে যান" : "Back to Pillars Overview"}</span>
              </button>
            )}
          </div>

          {/* If No Pillar Selected: Show 2-Column Overview Cards with Topics */}
          {!activePillar ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillarsList.map((pillar, idx) => {
                const isPillar2 = idx === 1 || pillar.id === "pillar-2";
                return (
                  <div
                    key={pillar.id || idx}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-2xs hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                            isPillar2 ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isPillar2 ? <Users className="w-7 h-7" /> : <Leaf className="w-7 h-7" />}
                        </div>

                        <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          {language === "bn" ? `স্তম্ভ ০${idx + 1}` : `Pillar 0${idx + 1}`}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {language === "bn" ? pillar.titleBn : pillar.titleEn}
                        </h3>
                      </div>

                      {/* Topics Snapshot with Sub-points */}
                      {Array.isArray(pillar.topics) && pillar.topics.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-stone-100 text-xs text-stone-700">
                          {pillar.topics.map((t, tIdx) => (
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

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-black text-amber-700 group-hover:text-amber-800">
                      <span className="bg-amber-100/60 px-3 py-1.5 rounded-xl">
                        {language === "bn" ? "স্তম্ভের বিস্তারিত ও পদ্ধতি দেখতে ক্লিক করুন" : "Click to view full pillar details"}
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Dedicated Interactive Full Pillar Detail View */
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                <button
                  onClick={() => setSelectedPillarId(null)}
                  className="inline-flex items-center space-x-2 text-xs font-black text-stone-700 hover:text-amber-800 bg-stone-100 hover:bg-amber-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === "bn" ? "সকল স্তম্ভের তালিকায় ফিরে যান" : "Back to All Pillars"}</span>
                </button>

                <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {language === "bn" ? `স্তম্ভ ০${activePillar.number || (pillarsList.indexOf(activePillar) + 1)}` : "Core Guiding Pillar"}
                </span>
              </div>

              {/* Pillar Header */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  {language === "bn" ? activePillar.titleBn : activePillar.titleEn}
                </h2>
                <p className="text-base text-stone-600 font-medium leading-relaxed max-w-4xl">
                  {language === "bn" ? activePillar.descBn : activePillar.descEn}
                </p>
              </div>

              {/* Core Topics & Field Workstreams */}
              {Array.isArray(activePillar.topics) && activePillar.topics.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-lg font-black text-stone-900">
                    {language === "bn" ? "স্তম্ভের মূল বিষয়সমূহ ও মাঠ পর্যায়ের কার্যক্রম" : "Core Topics & Field Workstreams"}
                  </h3>
                  <div className="space-y-4">
                    {activePillar.topics.map((t, tIdx) => (
                      <div key={t.id || tIdx} className="bg-[#faf8f5] p-5 sm:p-6 rounded-2xl border border-stone-200/90 space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="w-7 h-7 rounded-xl bg-amber-200/80 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                            {t.number || tIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                              {language === "bn" ? t.titleBn : t.titleEn}
                            </h4>
                            {t.descriptionBn && (
                              <p className="mt-1 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                                {language === "bn" ? t.descriptionBn : t.descriptionEn}
                              </p>
                            )}
                          </div>
                        </div>

                        {Array.isArray(t.subPoints) && t.subPoints.length > 0 && (
                          <div className="pl-10 space-y-2 pt-1 border-t border-stone-100/80">
                            {(language === "bn" ? t.subPoints : (t.subPointsEn || t.subPoints)).map((sp, sIdx) => (
                              <div key={sIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{sp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pillar Goals Grid */}
              {activePillar.goals && (
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-lg font-black text-stone-900">
                    {language === "bn" ? "প্রধান লক্ষ্য ও কর্মপরিকল্পনা" : "Key Goals & Objectives"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activePillar.goals.map((g, i) => (
                      <div key={i} className="flex items-start space-x-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-bold text-stone-800 leading-snug">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Methodology */}
              {activePillar.methodologyBn && (
                <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                    {language === "bn" ? "মাঠ পর্যায়ের প্রয়োগ পদ্ধতি" : "Field Implementation Methodology"}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                    {activePillar.methodologyBn}
                  </p>
                </div>
              )}

              {/* Direct Linkage to Research Reports */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-black text-base sm:text-lg">
                    {language === "bn" ? "এই স্তম্ভ সম্পর্কিত গবেষণা প্রতিবেদন পড়ুন" : "Read Research Report on this Pillar"}
                  </div>
                  <div className="text-xs text-amber-100 font-medium">
                    {language === "bn"
                      ? "মাঠ গবেষণা, সার বিশ্লেষণ ও ফলনের বাস্তব তথ্য বিস্তারিত জানুন।"
                      : "Access empirical field data, soil analysis, and yield records."}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="bg-white text-amber-950 hover:bg-amber-50 font-black text-xs px-6 py-3 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  {language === "bn" ? "গবেষণা রিপোর্টে যান" : "Go to Research Report"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Authentic Photographic Field Archive */}
        <div className="space-y-6 pt-4 border-t border-stone-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {language === "bn" ? "মাঠের চিত্রশালা" : "Field Archive"}
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              {language === "bn" ? "জিয়নকাঠির বাস্তব ক্ষেত্র কার্যক্রম" : "Authentic Field Documentation"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/farming-collage.jpg"
                  alt="Indigenous Organic Farming Operations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "দেশীয় ধান ও বীজ সংরক্ষণ প্রক্রিয়া" : "Indigenous Paddy & Seed Processing"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "বীজতলা, নিড়ানো, ধান কাটা, ঢেঁকিতে প্রক্রিয়াজাতকরণ ও প্রজাতি সংরক্ষণ।"
                    : "Traditional seedbed management, zero-chemical weeding, and cultivar preservation."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/community-collage.jpg"
                  alt="Community Education & Cultural Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "সামাজিক শিক্ষা ও সাংস্কৃতিক মেলবন্ধন" : "Community Education & Festival"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "সহায়ক শিক্ষা কেন্দ্র, বসন্ত উৎসব, সর্প সচেতনতা ও স্বাস্থ্য শিবির।"
                    : "Auxiliary village education center, nature study, and local cultural gatherings."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/ecology-collage.jpg"
                  alt="Ecology & Biodiversity Yield"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "বিষমুক্ত ফসল ও প্রাকৃতিক জীববৈচিত্র্য" : "Organic Produce & Biodiversity"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "বিষমুক্ত ফল, বীজ সংরক্ষণের কাঁচের বোতল, স্থানীয় মৎস্য ও বাস্তুতন্ত্র।"
                    : "Pesticide-free fruits, botanical glass preservation banks, and local ecology."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Institutional Partnership Banner (DDBMPBS Society) */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5 text-amber-800">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider">
              {language === "bn" ? "সহযোগিতা ও প্রাতিষ্ঠানিক অংশীদারিত্ব" : "Institutional Partnership"}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {language === "bn" ? (
              <>
                বিগত দুই বছর ধরে এই কাজগুলি এবং দেশীয় বীজ সংরক্ষণের কাজ সম্পন্ন করার লক্ষ্যে জিয়নকাঠির পাশে এসে দাঁড়িয়েছে{" "}
                <strong className="text-amber-900">“দুর্গাপুর দক্ষিণবঙ্গীয় মানবিক প্রাকৃতিক বিকাশ সোসাইটি (DDBMPBS)”</strong>। যৌথ প্রচেষ্টায় জিয়নকাঠি ও DDBMPBS বৃহত্তর গ্রামীণ বিকাশ ও টেকসই পরিবেশ গড়ে তোলার লক্ষ্যে নিয়োজিত।
              </>
            ) : (
              <>
                For the past two years, <strong className="text-amber-900">&quot;Durgapur Dakshinbanga Manabik Prakritik Bikash Society (DDBMPBS)&quot;</strong> has partnered with Jiyonkathi to conserve indigenous seed varieties, promote chemical-free organic farming, and uplift rural youth education.
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
