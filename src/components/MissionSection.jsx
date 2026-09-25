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
      number: "০১",
      titleBn: "পরিবেশ সংকটকালে, একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করা",
      titleEn: "Building a Sustainable Rural Platform in Environmental Crisis",
      taglineBn: "রাসায়নিক সার-কীটনাশকহীন চাষাবাদ, ভূগর্ভস্থ জল সুরক্ষা এবং পুনর্ব্যবহারযোগ্য শক্তির প্রয়োগ।",
      taglineEn: "Chemical-free agro-ecology, groundwater preservation, and renewable energy adoption.",
      descBn: "পরিবেশ সংকটকালে একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করার মাধ্যমে প্রকৃতিবান্ধব কৃষি, ফল-সব্জির বিষমুক্ত চাষ ও খাদ্য নিরাপত্তা নিশ্চিত করা।",
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
            "যতটা সম্ভব কম জীবাশ্ম জ্বালানী ব্যবহার করা।"
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
          titleBn: "ফল-সব্জির বিষমুক্ত চাষ",
          titleEn: "Chemical-free horticulture and natural food security.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা",
        "মাটির তলার জল না তোলা",
        "যতটা সম্ভব কম জীবাশ্ম জ্বালানী ব্যবহার করা",
        "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা",
        "ফল-সব্জির বিষমুক্ত চাষ"
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
          subPoints: [
            "পল্লী অঞ্চলের শিশুদের লোকসংস্কৃতি ও প্রকৃতি পরিচয়",
            "নৈতিক শিক্ষা এবং ব্যবহারিক কারুশিল্প প্রশিক্ষণ"
          ],
          subPointsEn: [
            "Folk culture appreciation and nature exploration for rural kids",
            "Values-based education and practical craft training"
          ]
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

  const rawPillars = siteData.pillars && siteData.pillars.length > 0 ? siteData.pillars.slice(0, 2) : defaultPillars;
  const pillarsList = JSON.parse(
    JSON.stringify(rawPillars)
      .replace(/যতটা কম সম্ভব/g, "যতটা সম্ভব কম")
      .replace(/বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা/g, "ফল-সব্জির বিষমুক্ত চাষ")
  );
  const activePillar = pillarsList.find((p) => p.id === selectedPillarId) || null;

  return (
    <div id="mission-section" className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Simple & Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {language === "bn" ? "জিয়নকাঠির ২টি মূল স্তম্ভ ও লক্ষ্য" : "Our Mission & 2 Core Pillars"}
            </h1>
            {/* <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {language === "bn"
                ? "আমাদের কাজের মূল ভিত্তি এই দুটি মূল স্তম্ভ। যে কোনো স্তম্ভে ক্লিক করে তার কর্মপরিকল্পনা, পদ্ধতি ও সংশ্লিষ্ট অন্বেষণ রিপোর্ট বিস্তারিত দেখুন।"
                : "Each pillar represents our core commitment to sustainable life, agro-ecology, renewable harmony, and community action."}
            </p> */}
          </div>

          <button
            onClick={() => {
              if (onNavigateToReport) onNavigateToReport();
              else if (setActiveTab) setActiveTab("reports");
            }}
            className="inline-flex items-center space-x-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>{language === "bn" ? "সকল অন্বেষণ রিপোর্ট দেখুন" : "View Research Reports"}</span>
          </button>
        </div>

        {/* Pillars Grid / Selection Mode */}
        {!activePillar ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillarsList.map((pillar, idx) => {
              const isPillar2 = idx === 1 || pillar.id === "pillar-2";
              return (
                <div
                  key={pillar.id || idx}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className="bg-white rounded-lg p-6 sm:p-7 border border-stone-200 hover:border-amber-700 transition-colors cursor-pointer group flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-base ${isPillar2 ? "bg-orange-50 text-orange-800 border border-orange-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                        {isPillar2 ? <Users className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                      </div>

                      <span className="bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {language === "bn" ? `স্তম্ভ ০${idx + 1}` : `Pillar 0${idx + 1}`}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {language === "bn" ? pillar.titleBn : pillar.titleEn}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {language === "bn" ? pillar.taglineBn || pillar.descBn : pillar.taglineEn || pillar.descEn}
                      </p>
                    </div>

                    {/* Topics Snapshot with subpoints */}
                    {Array.isArray(pillar.topics) && pillar.topics.length > 0 ? (
                      <div className="space-y-3 pt-3 border-t border-stone-100 text-xs text-stone-700">
                        {pillar.topics.map((t, tIdx) => (
                          <div key={t.id || tIdx} className="space-y-1">
                            <div className="font-semibold text-stone-900 flex items-start space-x-1.5">
                              <span className="text-amber-800 font-bold shrink-0">{t.number || tIdx + 1})</span>
                              <span className="leading-snug">{language === "bn" ? t.titleBn : t.titleEn}</span>
                            </div>
                            {t.descriptionBn && (
                              <p className="pl-4 text-xs text-stone-600 font-normal">
                                {language === "bn" ? t.descriptionBn : t.descriptionEn}
                              </p>
                            )}
                            {Array.isArray(t.subPoints) && t.subPoints.length > 0 && (
                              <ul className="pl-5 space-y-0.5 list-disc text-xs text-stone-600 font-normal">
                                {(language === "bn" ? t.subPoints : (t.subPointsEn || t.subPoints)).map((sp, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed">{sp}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      pillar.goals && pillar.goals.length > 0 && (
                        <div className="space-y-1.5 pt-3 border-t border-stone-100">
                          {pillar.goals.slice(0, 2).map((g, i) => (
                            <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-stone-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="line-clamp-1">{g}</span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>


                </div>
              );
            })}
          </div>
        ) : (
          /* DEDICATED FULL PILLAR VIEW */
          <div className="bg-white rounded-lg border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Back button */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <button
                onClick={() => setSelectedPillarId(null)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-3 py-1.5 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === "bn" ? "ফিরে যান" : "Previous"}</span>
              </button>

              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded uppercase tracking-wider">
                {language === "bn" ? `স্তম্ভ ০${activePillar.number || (pillarsList.indexOf(activePillar) + 1)}` : "Core Guiding Pillar"}
              </span>
            </div>

            {/* Pillar Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {language === "bn" ? activePillar.titleBn : activePillar.titleEn}
              </h1>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-4xl">
                {language === "bn" ? activePillar.descBn : activePillar.descEn}
              </p>
            </div>

            {/* Core Topics & Field Workstreams */}
            {Array.isArray(activePillar.topics) && activePillar.topics.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="text-base font-bold text-stone-900">
                  {language === "bn" ? "স্তম্ভের মূল বিষয়সমূহ ও মাঠ পর্যায়ের কার্যক্রম" : "Core Topics & Field Workstreams"}
                </h3>
                <div className="space-y-3">
                  {activePillar.topics.map((t, tIdx) => (
                    <div key={t.id || tIdx} className="bg-stone-50 p-4 sm:p-5 rounded-lg border border-stone-200 space-y-2.5">
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {t.number || tIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-stone-900 leading-snug">
                            {language === "bn" ? t.titleBn : t.titleEn}
                          </h4>
                          {t.descriptionBn && (
                            <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">
                              {language === "bn" ? t.descriptionBn : t.descriptionEn}
                            </p>
                          )}
                        </div>
                      </div>

                      {Array.isArray(t.subPoints) && t.subPoints.length > 0 && (
                        <div className="pl-9 space-y-1.5 pt-2 border-t border-stone-200">
                          {(language === "bn" ? t.subPoints : (t.subPointsEn || t.subPoints)).map((sp, sIdx) => (
                            <div key={sIdx} className="flex items-start space-x-2 text-xs sm:text-sm text-stone-700">
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
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <h3 className="text-base font-bold text-stone-900">
                  {language === "bn" ? "প্রধান লক্ষ্য ও কর্মপরিকল্পনা" : "Key Goals & Objectives"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePillar.goals.map((g, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-stone-50 p-3 rounded-lg border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-stone-800 leading-snug">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology */}
            {activePillar.methodologyBn && (
              <div className="bg-amber-50/70 p-5 rounded-lg border-l-4 border-amber-700 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {language === "bn" ? "মাঠ পর্যায়ের প্রয়োগ পদ্ধতি" : "Field Implementation Methodology"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {activePillar.methodologyBn}
                </p>
              </div>
            )}

            {/* Direct Research Report Linkage */}
            <div className="bg-stone-900 rounded-lg p-6 text-white border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-bold text-base sm:text-lg">
                  {language === "bn" ? "এই স্তম্ভ সম্পর্কিত অন্বেষণ প্রতিবেদন পড়ুন" : "Read Research Report on this Pillar"}
                </div>
                <div className="text-xs text-stone-300">
                  {language === "bn"
                    ? "মাঠ অন্বেষণ, সার বিশ্লেষণ ও ফলনের বাস্তব তথ্য বিস্তারিত জানুন।"
                    : "Access empirical field data, soil analysis, and yield records."}
                </div>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToReport) onNavigateToReport(activePillar.linkedReportId);
                  else if (setActiveTab) setActiveTab("reports");
                }}
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-4 py-2 rounded-md transition-colors shrink-0"
              >
                {language === "bn" ? "অন্বেষণ রিপোর্টে যান" : "Go to Research Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
