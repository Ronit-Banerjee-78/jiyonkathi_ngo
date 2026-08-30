"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Search,
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  Filter,
  Eye,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function ResearchReportsSection({ initialReportId = null, onSelectPillar = null }) {
  const { siteData, language, setActiveTab } = useContext(SiteContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeReport, setActiveReport] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Open report & increment view count for analytics
  const handleOpenReport = (report) => {
    setActiveReport(report);
    // Increment views on server
    try {
      fetch(`/api/reports/${report.id}/view`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReports((prev) =>
              prev.map((r) => (r.id === report.id ? { ...r, views: (r.views || 0) + 1 } : r))
            );
          }
        })
        .catch((e) => console.warn("View tracking err", e));
    } catch (e) {
      // ignore
    }
  };

  // Fetch reports from backend API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/reports")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.reports)) {
          setReports(json.reports);
          if (initialReportId) {
            const matched = json.reports.find((r) => String(r.id) === String(initialReportId));
            if (matched) {
              handleOpenReport(matched);
            }
          }
        }
      })
      .catch((err) => console.error("Error fetching research reports:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialReportId]);

  // Close report detail
  const handleCloseReport = () => {
    setActiveReport(null);
  };

  // Download / Print handler
  const handlePrintOrDownload = (report) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print this research report.");
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="utf-8">
        <title>${report.title} - জিয়নকাঠি গবেষণা প্রতিবেদন</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; padding: 40px; color: #1c1917; max-width: 800px; mx-auto; }
          h1 { color: #047857; font-size: 26px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
          .meta { font-size: 14px; color: #78716c; margin-bottom: 24px; }
          .badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; }
          .summary { background: #fefce8; border-left: 4px solid #eab308; padding: 16px; font-style: italic; margin-bottom: 24px; border-radius: 4px; }
          .content { font-size: 16px; white-space: pre-wrap; }
          .methodology { background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 24px; }
          .footer { margin-top: 50px; font-size: 12px; color: #a8a29e; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="badge">${report.topic || "গবেষণা প্রতিবেদন"}</div>
        <h1>${report.title}</h1>
        ${report.titleEnglish ? `<h3 style="color: #4b5563; font-weight: normal; margin-top: -10px;">${report.titleEnglish}</h3>` : ""}
        <div class="meta">
          <strong>গবেষক / লেখক:</strong> ${report.author} &nbsp;|&nbsp;
          <strong>প্রকাশের তারিখ:</strong> ${report.publishedDate}
        </div>
        <div class="summary">
          <strong>সারসংক্ষেপ:</strong> ${report.summary}
        </div>
        <div class="content">${report.content}</div>
        ${report.methodology && report.methodology.length > 0 ? `
          <div class="methodology">
            <h3>অনুসৃত পদ্ধতি ও মাঠ পর্যায় (Methodology):</h3>
            <ul>
              ${report.methodology.map(m => `<li>${m}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        <div class="footer">
          জিয়নকাঠি (Jiyonkathi) - পরিবেশ, কৃষি ও সমাজ কল্যাণমূলক সংস্থা | www.jiyonkathi.org
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Copy shareable text / link
  const handleShare = (report) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${report.title}\nজিয়নকাঠি গবেষণা প্রতিবেদন:\n${report.summary}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Derive unique topics
  const topics = ["all", ...Array.from(new Set(reports.map((r) => r.topic).filter(Boolean)))];

  // Filter & Sort
  const filteredReports = reports.filter((r) => {
    const matchesTopic = selectedTopic === "all" || r.topic === selectedTopic;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.titleEnglish?.toLowerCase().includes(q) ||
      r.summary?.toLowerCase().includes(q) ||
      r.author?.toLowerCase().includes(q) ||
      r.topic?.toLowerCase().includes(q);
    return matchesTopic && matchesSearch;
  });

  if (sortBy === "views") {
    filteredReports.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy === "oldest") {
    filteredReports.sort((a, b) => new Date(a.publishedDate || 0) - new Date(b.publishedDate || 0));
  } else {
    filteredReports.sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0));
  }

  return (
    <div id="research-reports-section" className="bg-[#faf7f0] min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-200/80 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === "bn" ? "জ্ঞানচর্চা ও মাঠ পর্যায়ের শিক্ষা" : "Knowledge & Field Learning"}</span>
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {language === "bn" ? "গবেষণা ও মাঠ প্রতিবেদন" : "Research & Field Reports"}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {language === "bn"
              ? "দেশীয় বীজ সংরক্ষণ, বিষমুক্ত বহুমুখী কৃষি, ফল-সবজি বাগান ও শিশুদের বিকল্প শিক্ষার পরীক্ষিত পদ্ধতি ও গবেষণামূলক দলিল।"
              : "Explore empirical methodologies on indigenous seeds, organic fruit/vegetable cultivation, and rural nature education."}
          </p>
        </div>

        {/* Search & Topic Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "bn" ? "প্রতিবেদন বা বিষয় খুঁজুন..." : "Search reports by title or topic..."}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2 self-end sm:self-auto text-xs font-semibold text-stone-600">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>{language === "bn" ? "সাজান:" : "Sort:"}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="newest">{language === "bn" ? "সর্বশেষ প্রকাশিত" : "Newest First"}</option>
                <option value="views">{language === "bn" ? "সর্বাধিক পঠিত (জনপ্রিয়)" : "Most Read"}</option>
                <option value="oldest">{language === "bn" ? "পুরাতন থেকে নতুন" : "Oldest First"}</option>
              </select>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${selectedTopic === t
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
              >
                {t === "all" ? (language === "bn" ? "সকল বিষয়" : "All Topics") : t}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 font-medium">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>{language === "bn" ? "গবেষণা প্রতিবেদন লোড হচ্ছে..." : "Loading research reports..."}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">
              {language === "bn" ? "কোন প্রতিবেদন পাওয়া যায়নি" : "No reports found"}
            </h3>
            <p className="text-sm text-stone-500">
              {language === "bn"
                ? "অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।"
                : "Try adjusting your search keywords or topic filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredReports.map((report, idx) => (
              <motion.article
                key={report.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Topic Overlay */}
                  <div className="relative h-56 bg-stone-100 overflow-hidden">
                    <img
                      src={report.image || "/images/farming-collage.jpg"}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs border border-emerald-100">
                        {report.topic || "গবেষণা প্রতিবেদন"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>{report.publishedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs font-semibold">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>{report.views || 0} পঠিত</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                        {language === "bn" ? report.title : report.titleEnglish || report.title}
                      </h2>
                      {report.titleEnglish && language === "bn" && (
                        <p className="text-xs text-stone-500 font-medium italic">
                          {report.titleEnglish}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {language === "bn" ? report.summary : report.summaryEnglish || report.summary}
                    </p>

                    {/* Key Method Tags */}
                    {report.methodology && report.methodology.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {report.methodology.slice(0, 3).map((m, i) => (
                          <span
                            key={i}
                            className="bg-stone-50 text-stone-600 text-[11px] px-2.5 py-0.5 rounded-md border border-stone-200"
                          >
                            ✓ {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer: Clean Read More Button ONLY (NO join as volunteer!) */}
                <div className="px-6 py-4 bg-[#fcfaf6] border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-stone-500">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate max-w-[150px] font-medium">{report.author}</span>
                  </div>

                  <button
                    onClick={() => handleOpenReport(report)}
                    className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow group/btn"
                  >
                    <span>{language === "bn" ? "বিস্তারিত পড়ুন" : "Read Full Report"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal / Dedicated Reader View */}
      <AnimatePresence>
        {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 bg-[#fbf9f4] border-b border-stone-200 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
                    {activeReport.topic}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {activeReport.publishedDate}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Print / Download Button */}
                  <button
                    onClick={() => handlePrintOrDownload(activeReport)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center space-x-1 text-xs font-semibold border border-stone-200"
                    title="Print / Save as PDF"
                  >
                    <Printer className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">{language === "bn" ? "প্রিন্ট / PDF" : "Print/PDF"}</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(activeReport)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center space-x-1 text-xs font-semibold border border-stone-200"
                    title="Share summary"
                  >
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">{copiedLink ? "কপি হয়েছে!" : "শেয়ার"}</span>
                  </button>

                  {/* Close button */}
                  <button
                    onClick={handleCloseReport}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 leading-relaxed">
                {/* Titles */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                    {activeReport.title}
                  </h1>
                  {activeReport.titleEnglish && (
                    <p className="text-sm font-semibold text-stone-500">
                      {activeReport.titleEnglish}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 pt-2 text-xs text-stone-600">
                    <span className="font-semibold text-amber-700">লেখক: {activeReport.author}</span>
                    <span>•</span>
                    <span>মোট পাঠ: {activeReport.views || 1} বার</span>
                  </div>
                </div>

                {/* Banner image if available */}
                {activeReport.image && (
                  <div className="rounded-2xl overflow-hidden max-h-80 w-full border border-stone-200">
                    <img
                      src={activeReport.image}
                      alt={activeReport.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Executive Summary */}
                <div className="bg-[#fffbeb] p-5 rounded-2xl border border-amber-200 text-stone-800 text-sm leading-relaxed">
                  <h4 className="font-extrabold text-amber-900 mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>সারসংক্ষেপ (Executive Abstract):</span>
                  </h4>
                  <p>{activeReport.summary}</p>
                </div>

                {/* Main Article Content */}
                <div className="prose prose-stone max-w-none text-base text-stone-700 leading-relaxed whitespace-pre-line">
                  {activeReport.content}
                </div>

                {/* Methodologies & Findings */}
                {activeReport.methodology && activeReport.methodology.length > 0 && (
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>মাঠ পর্যায় ও গবেষণা পদ্ধতি (Methodology):</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeReport.methodology.map((item, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeReport.findings && activeReport.findings.length > 0 && (
                  <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-3">
                    <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>প্রধান অর্জন ও ফলাফল (Key Outcomes):</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-emerald-900">
                      {activeReport.findings.map((f, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#fbf9f4] border-t border-stone-200 flex justify-between items-center shrink-0">
                <button
                  onClick={() => handlePrintOrDownload(activeReport)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-700 hover:text-stone-900"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === "bn" ? "ডকুমেন্ট হিসেবে সংরক্ষণ করুন" : "Save / Download Document"}</span>
                </button>

                <button
                  onClick={handleCloseReport}
                  className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  {language === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
