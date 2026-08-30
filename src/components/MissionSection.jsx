"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Compass,
  Sprout,
  Users,
  Sun,
  Apple,
  Leaf,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MissionSection({ onNavigateToReport = null }) {
  const { siteData, language, setActiveTab } = useContext(SiteContext);
  const [selectedPillarId, setSelectedPillarId] = useState(null);

  const defaultPillars = [
    {
      id: "pillar-1",
      number: "১",
      titleBn: "দেশীয় প্রজাতির দানাশস্য ও বীজ সংরক্ষণ",
      titleEn: "Indigenous Crop & Seed Conservation",
      taglineBn: "১২০+ দেশীয় ধানের প্রজাতি ও রাসায়নিক মুক্ত বীজ সুরক্ষা",
      taglineEn: "Preserving 120+ heirloom rice cultivars and chemical-free seeds",
      descBn: "দেশীয় প্রজাতির দানাশস্য (মূলত ধান) ও সবজি চাষ করা এবং এদের বীজ সংরক্ষণ করা। এই কাজে রাসায়নিক সার ও কীটনাশক একেবারেই ব্যবহার না করা, ভূগর্ভস্থ জল অপচয় রোধ এবং জীবাশ্ম জ্বালানির ব্যবহার যথাসম্ভব কমিয়ে আনা।",
      descEn: "Cultivating indigenous crops and heirloom seed banks without synthetic agrochemicals or groundwater depletion.",
      icon: "Leaf",
      colorTheme: "amber",
      goals: [
        "১২০+ বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতির সংরক্ষণ ও প্রজনন",
        "শতভাগ রাসায়নিক সার ও কীটনাশকমুক্ত প্রাকৃতিক চাষাবাদ",
        "ভূগর্ভস্থ জলের অপচয় বন্ধ করে বৃষ্টির জল নির্ভর কৃষি",
        "স্থানীয় প্রান্তিক কৃষকদের মাঝে বিনামূল্যে দেশীয় বীজ বিতরণ"
      ],
      methodologyBn: "প্রাকৃতিক বৃষ্টি নির্ভর বীজতলা তৈরি, হাতে ঘাস নিড়ানো, নিম ও জৈব কম্পোস্ট প্রয়োগ এবং সনাতন ঢেঁকিতে প্রক্রিয়াজাতকরণ।",
      linkedReportId: "rep-1"
    },
    {
      id: "pillar-2",
      number: "২",
      titleBn: "কৃষিজীবী মানুষের সাথে নিবিড় যোগাযোগ ও সামাজিক সংহতি",
      titleEn: "Community Engagement & Knowledge Exchange",
      taglineBn: "মাঠ পর্যায়ের কৃষক ও সমাজের যৌথ অভিজ্ঞতা বিনিময়",
      taglineEn: "Collaborative dialogue uniting rural cultivators and urban learners",
      descBn: "গ্রামের কৃষিজীবী মানুষদের সাথে নিবিড় মানবিক ও জ্ঞানভিত্তিক যোগাযোগ গড়ে তোলা, যাতে তারা পরিবেশের ভারসাম্য বজায় রেখে নিজেদের কাজ চালিয়ে নিতে পারেন এবং জিয়নকাঠির সাথে পারস্পরিক অভিজ্ঞতালব্ধ জ্ঞান বিনিময় করেন।",
      descEn: "Fostering regular dialogues with agrarian households, integrating traditional indigenous wisdom with ecological living, and mutual solidarity.",
      icon: "Users",
      colorTheme: "orange",
      goals: [
        "প্রতি মাসে কৃষক সমাবেশ ও অভিজ্ঞতা বিনিময় সভা",
        "দেশীয় বীজের উৎপাদনশীলতা বিষয়ে মাঠ পর্যায়ের কর্মশালা",
        "DDBMPBS সহযোগে প্রান্তিক পরিবারের সচেতনতা ও সহায়তা",
        "কৃষকদের অর্থনৈতিক আত্মমর্যাদা ও বিষমুক্ত ফসলের সমাজ গঠন"
      ],
      methodologyBn: "নিয়মিত গ্রামসভা, মাঠ পরিদর্শন, কৃষক পরিবারগুলোর সাথে সরাসরি মতবিনিময় এবং পারস্পরিক সহযোগিতামূলক সামাজিক উদ্যোগ।",
      linkedReportId: "rep-3"
    },
    {
      id: "pillar-3",
      number: "৩",
      titleBn: "পুনর্ব্যবহারযোগ্য শক্তি ও পরিবেশ সুরক্ষা",
      titleEn: "Renewable Energy Utilization & Ecological Stewardship",
      taglineBn: "জীবাশ্ম জ্বালানিমুক্ত টেকসই জীবনযাপনের পথ",
      taglineEn: "Transitioning to clean decentralized renewable energy and zero-waste ecosystems",
      descBn: "পুনর্ব্যবহারযোগ্য সৌরশক্তিকে নিজেদের দৈনন্দিন কাজে ব্যবহার করা, শক্তির অপচয় রোধ করা এবং পরিবেশবান্ধব শক্তির ভারসাম্য রক্ষা করে একটি টেকসই সমাজ ব্যবস্থা গড়ে তোলা।",
      descEn: "Harnessing clean solar energy across daily agrarian workflows, curtailing petroleum dependence, and exemplifying a decentralized resilient ecosystem.",
      icon: "Sun",
      colorTheme: "amber",
      goals: [
        "সৌর পাম্পিং ও সৌর আলো নির্ভর খামার ব্যবস্থাপনা",
        "কৃষি বর্জ্য থেকে বায়ো-কম্পোস্টিং ও জৈব সার তৈরি",
        "কার্বন নিঃসরণ সর্বনিম্ন পর্যায়ে নামিয়ে আনা",
        "পরিবেশবান্ধব মাটির তৈরি ও প্রাকৃতিক উপাদানের স্থাপনা"
      ],
      methodologyBn: "সৌর প্যানেল ব্যবস্থা, বৃষ্টির জল সংরক্ষণ ট্যাঙ্ক, ড্রিপ ইরিগেশন এবং শূন্য বর্জ্য কৃষি চক্র।",
      linkedReportId: "rep-2"
    },
    {
      id: "pillar-4",
      number: "৪",
      titleBn: "Practicing Food Security for Life", // MANDATORY NAME
      titleEn: "Practicing Food Security for Life",
      taglineBn: "জীবনের জন্য খাদ্য নিরাপত্তা চর্চা: বিষমুক্ত ফল ও সবজি চাষ পদ্ধতি",
      taglineEn: "Sustainable Homestead Vegetable & Fruit Farming Methodologies",
      descBn: "জীবনের জন্য খাদ্য নিরাপত্তা নিশ্চিতকরণে বিষমুক্ত ফল ও বহুমুখী সবজি চাষ। বসতভিটার প্রতি ইঞ্চি অব্যবহৃত জমিতে প্রাকৃতিক উপায়ে পুষ্টিসমৃদ্ধ খাদ্য উৎপাদনের টেকসই মডেল।",
      descEn: "Cultivating organic homestead fruits, vegetables, and perennial permaculture beds to secure household nutrient sovereignty without chemicals.",
      icon: "Apple",
      colorTheme: "emerald",
      goals: [
        "বসতভিটায় মাচায় বিষমুক্ত সবজি চাষ মডেল স্থাপন",
        "বিলুপ্তপ্রায় দেশীয় ফলের বাগান সৃজন ও পালন",
        "কীটনাশকহীন প্রাকৃতিক জৈব বালাইনাশক (দশপর্ণী অর্ক) প্রয়োগ",
        "প্রতিটি পরিবারের জন্য বছরব্যাপী স্বাবলম্বী পুষ্টি নিরাপত্তা"
      ],
      methodologyBn: "মাটির জৈব কার্বন বৃদ্ধি, বহুমুখী মাচা নির্মাণ, মালচিং পদ্ধতিতে আর্দ্রতা রক্ষা এবং দেশীয় চারার কলম প্রতিপালন।",
      farmingMethods: {
        vegetableMethods: [
          {
            nameBn: "মাচা ভিত্তিক লতানো সবজি চাষ",
            descBn: "বাঁশের কঞ্চি ও দড়ি দিয়ে মাচা তৈরি করে লাউ, কুমড়ো, করলা, ঝিঙে, পটল ও চিচিঙ্গা চাষ।"
          },
          {
            nameBn: "মালচিং ও জৈব কম্পোস্ট বেড",
            descBn: "শুকনো পাতা ও খড় দিয়ে মাটির আর্দ্রতা ধরে রেখে শাকসবজি (পালং, লালশাক, পুঁইশাক) এবং বেগুন, লঙ্কা চাষ।"
          },
          {
            nameBn: "প্রাকৃতিক জৈব বালাই দমন (দশপর্ণী অর্ক)",
            descBn: "নিমপাতা, করঞ্জা, নিশিন্দা, ধুতুরা ও গোমূত্র পচিয়ে প্রস্তুত করা প্রাকৃতিক বালাইনাশক ব্যবহার।"
          }
        ],
        fruitMethods: [
          {
            nameBn: "দেশীয় বহুস্তরীয় ফলের বাগান",
            descBn: "আম, জাম, কাঁঠাল, পেয়ারা, আতা, বেল, বেদানা, লেবু, কামরাঙ্গা ও কুল গাছের সমন্বয়ে মিশ্র ফলের বাগান।"
          },
          {
            nameBn: "জলবায়ু সহনশীল ফলের কলম প্রতিপালন",
            descBn: "কম জলে বৃদ্ধি পেতে সক্ষম দেশীয় আমলকী, হরীতকী ও বহেড়ার ভেষজ বাগান।"
          }
        ]
      },
      linkedReportId: "rep-2"
    }
  ];

  const pillarsList = siteData.pillars && siteData.pillars.length > 0 ? siteData.pillars : defaultPillars;
  const activePillar = pillarsList.find((p) => p.id === selectedPillarId) || null;

  return (
    <div id="mission-section" className="bg-[#faf7f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Simple & Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/90 pb-6">
          <div className="space-y-2 max-w-2xl">
            {/* <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === "bn" ? "আমাদের মূল চালিকাশক্তি" : "Our Guiding Pillars"}</span>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "জিয়নকাঠির ৪টি মূল স্তম্ভ ও লক্ষ্য" : "Our Mission & 4 Core Pillars"}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {language === "bn"
                ? "আমাদের কাজের মূল ভিত্তি এই চারটি স্তম্ভ। যে কোনো স্তম্ভে ক্লিক করে তার উদ্দেশ্য, চাষ পদ্ধতি ও সংশ্লিষ্ট গবেষণা রিপোর্ট বিস্তারিত দেখুন।"
                : "Each pillar represents our core commitment to sustainable life, agro-ecology, renewable harmony, and food security."}
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToReport) onNavigateToReport();
              else if (setActiveTab) setActiveTab("reports");
            }}
            className="inline-flex items-center space-x-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs px-5 py-3 rounded-2xl shadow-2xs transition-all w-fit cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>{language === "bn" ? "সকল গবেষণা রিপোর্ট দেখুন" : "View Research Reports"}</span>
          </button>
        </div>

        {/* Pillars Grid / Selection Mode */}
        {!activePillar ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {pillarsList.map((pillar, idx) => {
              const isPillar4 = idx === 3 || pillar.id === "pillar-4" || pillar.titleBn?.includes("Food Security");
              return (
                <div
                  key={pillar.id || idx}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-2xs hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${isPillar4
                          ? "bg-emerald-100 text-emerald-800"
                          : idx === 1
                            ? "bg-orange-100 text-orange-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                        {isPillar4 ? <Apple className="w-7 h-7" /> : idx === 1 ? <Users className="w-7 h-7" /> : idx === 2 ? <Sun className="w-7 h-7" /> : <Leaf className="w-7 h-7" />}
                      </div>

                      <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {language === "bn" ? `স্তম্ভ ০${idx + 1}` : `Pillar 0${idx + 1}`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                        {language === "bn" ? pillar.titleBn : pillar.titleEn}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                        {language === "bn" ? pillar.descBn : pillar.descEn}
                      </p>
                    </div>

                    {/* Quick Goals Snapshot */}
                    {pillar.goals && pillar.goals.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-stone-100">
                        {pillar.goals.slice(0, 2).map((g, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs font-bold text-stone-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{g}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-black text-amber-700 group-hover:text-amber-800">
                    <span className="bg-amber-100/60 px-3 py-1.5 rounded-xl">
                      {language === "bn" ? "সম্পূর্ণ বিস্তারিত ও পদ্ধতি দেখতে ক্লিক করুন" : "Click to view full pillar page"}
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DEDICATED FULL PILLAR VIEW */
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 shadow-sm">
            {/* Back button */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <button
                onClick={() => setSelectedPillarId(null)}
                className="inline-flex items-center space-x-2 text-xs font-black text-stone-700 hover:text-amber-800 bg-stone-100 hover:bg-amber-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === "bn" ? "সকল স্তম্ভের তালিকায় ফিরে যান" : "Back to All Pillars"}</span>
              </button>

              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {activePillar.id === "pillar-4" ? "৪র্থ মূল স্তম্ভ" : "নির্বাচিত মূল স্তম্ভ"}
              </span>
            </div>

            {/* Pillar Header */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {language === "bn" ? activePillar.titleBn : activePillar.titleEn}
              </h1>
              <p className="text-base text-stone-600 font-medium leading-relaxed max-w-4xl">
                {language === "bn" ? activePillar.descBn : activePillar.descEn}
              </p>
            </div>

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

            {/* SPECIAL SECTION FOR 4TH PILLAR: "Practicing Food Security for Life" Farming Methods */}
            {(activePillar.id === "pillar-4" || activePillar.farmingMethods) && (
              <div className="space-y-6 pt-6 border-t border-stone-200">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                    {language === "bn" ? "খাদ্য নিরাপত্তা কৃষি মডেল" : "Farming Methodologies"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                    {language === "bn"
                      ? "বিষমুক্ত ফল ও সবজি চাষ পদ্ধতি (Food Security for Life)"
                      : "Homestead Organic Vegetable & Fruit Methodologies"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vegetable Methods */}
                  <div className="bg-[#fcfbf7] p-6 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-black text-stone-900 text-sm flex items-center space-x-2 text-emerald-800">
                      <Apple className="w-4 h-4" />
                      <span>{language === "bn" ? "সবজি চাষের ব্যবহারিক পদ্ধতি" : "Vegetable Farming Methods"}</span>
                    </h4>
                    <div className="space-y-3">
                      {(activePillar.farmingMethods?.vegetableMethods || defaultPillars[3].farmingMethods.vegetableMethods).map((m, i) => (
                        <div key={i} className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="font-black text-xs text-stone-900">{m.nameBn}</div>
                          <div className="text-xs text-stone-600 font-medium leading-relaxed">{m.descBn}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fruit Methods */}
                  <div className="bg-[#fcfbf7] p-6 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-black text-stone-900 text-sm flex items-center space-x-2 text-amber-800">
                      <Leaf className="w-4 h-4" />
                      <span>{language === "bn" ? "ফল বাগান ও কলম পদ্ধতি" : "Fruit Orchard Methods"}</span>
                    </h4>
                    <div className="space-y-3">
                      {(activePillar.farmingMethods?.fruitMethods || defaultPillars[3].farmingMethods.fruitMethods).map((m, i) => (
                        <div key={i} className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-1">
                          <div className="font-black text-xs text-stone-900">{m.nameBn}</div>
                          <div className="text-xs text-stone-600 font-medium leading-relaxed">{m.descBn}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Research Report Linkage */}
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
                onClick={() => {
                  if (onNavigateToReport) onNavigateToReport(activePillar.linkedReportId);
                  else if (setActiveTab) setActiveTab("reports");
                }}
                className="bg-white text-amber-950 hover:bg-amber-50 font-black text-xs px-6 py-3 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
              >
                {language === "bn" ? "গবেষণা রিপোর্টে যান" : "Go to Research Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
