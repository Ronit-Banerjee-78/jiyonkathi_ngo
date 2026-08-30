"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  FileText,
  Eye,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  Calendar,
  User,
  CheckCircle2,
  Filter,
  Layers,
  Leaf,
  Apple,
  Users,
  Sun
} from "lucide-react";
import { motion } from "motion/react";

export default function OurWorkSection({ setActiveTab = () => { } }) {
  const { siteData, language } = useContext(SiteContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else if (isMounted && siteData.researchReports) {
          setReports(siteData.researchReports);
        }
      })
      .catch(() => {
        if (isMounted && siteData.researchReports) {
          setReports(siteData.researchReports);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [siteData.researchReports]);

  const categories = [
    { id: "all", nameBn: "সকল কর্ম ও গবেষণা", nameEn: "All Reports" },
    { id: "agri", nameBn: "কৃষি ও বীজ সংরক্ষণ", nameEn: "Agro-Ecology" },
    { id: "food_security", nameBn: "খাদ্য নিরাপত্তা (Food Security)", nameEn: "Food Security" },
    { id: "energy", nameBn: "সৌরশক্তি ও পরিবেশ", nameEn: "Renewable Energy" },
    { id: "education", nameBn: "শিক্ষা ও সচেতনতা", nameEn: "Education & Society" },
  ];

  const filteredReports = reports.filter((r) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "agri") return r.categoryBn?.includes("কৃষি") || r.categoryBn?.includes("ধান");
    if (selectedCategory === "food_security") return r.categoryBn?.includes("খাদ্য") || r.titleBn?.includes("সবজি") || r.titleBn?.includes("ফল");
    if (selectedCategory === "energy") return r.categoryBn?.includes("শক্তি") || r.categoryBn?.includes("পরিবেশ");
    if (selectedCategory === "education") return r.categoryBn?.includes("শিক্ষা") || r.categoryBn?.includes("সংহতি");
    return true;
  });

  const handleOpenReport = (report) => {
    // Navigate directly to the dedicated Research Reports page to view full detail
    if (setActiveTab) {
      setActiveTab("reports");
    }
  };

  return (
    <div id="our-work-section" className="bg-[#faf7f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Simple & Clean Header (No Generic AI Vibe Title Banner) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/90 pb-6">
          <div className="space-y-2 max-w-2xl">
            {/* <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === "bn" ? "মাঠ গবেষণা ও কর্মপদ্ধতি" : "Empirical Field Research"}</span>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {language === "bn" ? "আমাদের কাজ ও গবেষণা প্রতিবেদন" : "Our Work & Research Reports"}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {language === "bn"
                ? "জিয়নকাঠির প্রতিটি কর্মযজ্ঞ বৈজ্ঞানিক ও ঐতিহ্যবাহী জ্ঞানের ভিত্তিতে পরিচালিত। মাঠের অভিজ্ঞতা ও গবেষণার পূর্ণাঙ্গ প্রতিবেদন থেকে সরাসরি শিখুন।"
                : "Explore our empirical research reports, organic farming frameworks, seed conservation archives, and community education blueprints."}
            </p>
          </div>

          <button
            onClick={() => setActiveTab("reports")}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xs transition-all w-fit cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === "bn" ? "গবেষণা রিডার খুলুন" : "Open Research Reader"}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === c.id
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-amber-50 hover:text-amber-800"
                }`}
            >
              {language === "bn" ? c.nameBn : c.nameEn}
            </button>
          ))}
        </div>

        {/* Reports Grid (Converted from old volunteer list to clickable Research Reports) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-4">
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-6 bg-stone-200 rounded w-3/4" />
                <div className="h-16 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredReports.map((report, idx) => (
              <div
                key={report.id || idx}
                onClick={() => handleOpenReport(report)}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {language === "bn" ? report.categoryBn || "গবেষণা" : report.categoryEn || "Research"}
                    </span>
                    <span className="text-[11px] font-bold text-stone-400 flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-stone-400" />
                      <span>{report.viewsCount || 120 + idx * 14} {language === "bn" ? "পাঠ" : "views"}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                    {language === "bn" ? report.titleBn : report.titleEn || report.titleBn}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                    {language === "bn" ? report.excerptBn : report.excerptEn || report.excerptBn}
                  </p>

                  {/* Highlights if present */}
                  {report.highlights && report.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {report.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center space-x-2 text-[11px] font-bold text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action (Strictly NO volunteer link, replaced with Read More) */}
                <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-stone-500 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span className="line-clamp-1">{report.authorBn || "জিয়নকাঠি গবেষক দল"}</span>
                  </div>

                  <span className="inline-flex items-center space-x-1 text-xs font-black text-amber-700 group-hover:text-amber-800">
                    <span>{language === "bn" ? "প্রতিবেদন পড়ুন" : "Read Report"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-3">
            <FileText className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
              {language === "bn" ? "এই বিভাগে কোনো রিপোর্ট পাওয়া যায়নি" : "No reports found in this category"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
