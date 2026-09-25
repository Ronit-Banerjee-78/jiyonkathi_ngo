"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
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
import { getShareUrl, shareContent } from "../utils/urlUtils";

/**
 * Parses markdown text to extract interleaved text chunks and inline images
 * Preserves Bengali Unicode text and original PDF document order.
 */
function parseContentWithInlineImages(content) {
  if (!content) return [];
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = content.slice(lastIndex, match.index).trim();
      if (textChunk) {
        blocks.push({ type: "text", value: textChunk });
      }
    }
    blocks.push({
      type: "image",
      alt: match[1] || "প্রতিবেদনের চিত্র",
      src: match[2],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    const textChunk = content.slice(lastIndex).trim();
    if (textChunk) {
      blocks.push({ type: "text", value: textChunk });
    }
  }

  return blocks;
}

export default function ResearchReportsSection({
  initialReportId = null,
  onSelectReport = null,
  onClearTarget = null,
  onSelectPillar = null
}) {
  const {
    siteData,
    language,
    setActiveTab,
    reports: contextReports,
    selectedReportId,
    setSelectedReportId,
    refreshReports,
  } = useContext(SiteContext);
  const [reports, setReports] = useState(contextReports || []);
  const [loading, setLoading] = useState(!contextReports || contextReports.length === 0);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeReport, setActiveReport] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const viewedReportsRef = useRef(new Set());
  const openedTargetIdRef = useRef(null);

  // Sync with context reports if available
  useEffect(() => {
    if (Array.isArray(contextReports) && contextReports.length > 0) {
      setReports(contextReports);
      setLoading(false);
    }
  }, [contextReports]);

  // Handle opening targeted report (from Home or direct link)
  useEffect(() => {
    const targetId = initialReportId || selectedReportId;
    if (!targetId || reports.length === 0) return;
    if (openedTargetIdRef.current === targetId && activeReport && String(activeReport.id) === String(targetId)) {
      return;
    }
    const matched = reports.find((r) => String(r.id) === String(targetId));
    if (matched) {
      openedTargetIdRef.current = targetId;
      handleOpenReport(matched);
    }
  }, [initialReportId, selectedReportId, reports.length]);

  // Open report & increment view count for analytics
  const handleOpenReport = (report) => {
    if (!report) return;
    setActiveReport(report);
    if (onSelectReport && report?.id) {
      onSelectReport(report.id);
    }
    if (setSelectedReportId && report?.id) {
      setSelectedReportId(report.id);
    }

    // Increment views on server ONLY ONCE per report per session to avoid runaway loops
    if (report.id && !viewedReportsRef.current.has(report.id)) {
      viewedReportsRef.current.add(report.id);
      try {
        fetch(`/api/reports/${report.id}/view`, { method: "POST" })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && typeof data.views === "number") {
              // Update only local activeReport view count without replacing the entire reports array
              setActiveReport((curr) =>
                curr && curr.id === report.id ? { ...curr, views: data.views } : curr
              );
            }
          })
          .catch((e) => console.warn("View tracking err", e));
      } catch (e) {
        // ignore
      }
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
          const targetId = initialReportId || selectedReportId;
          if (targetId) {
            const matched = json.reports.find((r) => String(r.id) === String(targetId));
            if (matched && openedTargetIdRef.current !== targetId) {
              openedTargetIdRef.current = targetId;
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
  }, [initialReportId, selectedReportId]);

  // Close report detail
  const handleCloseReport = () => {
    setActiveReport(null);
    openedTargetIdRef.current = null;
    if (onClearTarget) {
      onClearTarget();
    }
    if (setSelectedReportId) {
      setSelectedReportId(null);
    }
  };

  // Direct file download - forces direct browser download without Cloudinary preview
  const handleDirectDownload = async (report, e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (!report) return;

    const cleanTitle = (report.title || "jiyonkathi-report")
      .replace(/[^\w\u0980-\u09FF\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_") || "report";
    const filename = `${cleanTitle}.pdf`;

    setDownloadingId(report.id);

    try {
      // 1. Direct download via backend streaming endpoint
      // Fetching blob and creating object URL completely bypasses any browser PDF preview
      if (report.id) {
        try {
          const response = await fetch(`/api/reports/${report.id}/download`);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000);
            return;
          }
        } catch (fetchErr) {
          console.warn("Backend stream fetch error, falling back to direct location trigger:", fetchErr);
        }

        // Direct window fallback (backend sends Content-Disposition: attachment)
        window.location.href = `/api/reports/${report.id}/download`;
        return;
      }

      // 2. Direct downloadUrl (e.g. Cloudinary or external)
      if (report.downloadUrl) {
        let downloadUrl = report.downloadUrl;
        if (downloadUrl.includes("cloudinary.com") && downloadUrl.includes("/upload/")) {
          downloadUrl = downloadUrl.replace(
            /\/upload\/(?:fl_attachment(?::[^/]+)?\/)?/,
            `/upload/fl_attachment:${encodeURIComponent(cleanTitle)}/`
          );
        }

        try {
          const response = await fetch(downloadUrl);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000);
            return;
          }
        } catch (err) {
          console.warn("Direct blob fetch failed, falling back to direct link with fl_attachment:", err);
        }

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 3. Fallback: if no uploaded PDF, generate print/download
      handlePrintReport(report);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  // Download / Print handler with full text and all images
  const handlePrintReport = (report) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print this research report.");
      return;
    }

    const blocks = parseContentWithInlineImages(report.content || "");
    const inlineImageSrcs = new Set(
      blocks.filter((b) => b.type === "image").map((b) => b.src)
    );

    const refImages = (Array.isArray(report.embeddedImages) && report.embeddedImages.length > 0
      ? report.embeddedImages
      : (Array.isArray(report.images) ? report.images : [])).filter(img => !inlineImageSrcs.has(img));

    const contentHtml = blocks.length > 0
      ? blocks.map((b) => {
        if (b.type === "image") {
          return `<div style="text-align:center; margin: 24px 0;"><img src="${b.src}" style="max-width:100%; max-height:450px; border-radius:6px; border:1px solid #e5e7eb;" alt="${b.alt}"/><div style="font-size:12px; color:#57534e; margin-top:6px; font-weight:bold;">${b.alt}</div></div>`;
        }
        return `<div style="white-space: pre-wrap; line-height: 1.8; margin-bottom: 16px;">${b.value}</div>`;
      }).join("")
      : `<div style="white-space: pre-wrap; line-height: 1.8;">${report.content || ""}</div>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="utf-8">
        <title>${report.title} - জিয়নকাঠি অন্বেষণ প্রতিবেদন</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; padding: 40px; color: #1c1917; max-width: 820px; margin: 0 auto; }
          h1 { color: #047857; font-size: 26px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-top: 10px; }
          .meta { font-size: 14px; color: #78716c; margin-bottom: 20px; }
          .badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 12px; }
          .cover-img { width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; margin: 16px 0 24px; border: 1px solid #e5e7eb; }
          .summary { background: #fefce8; border-left: 4px solid #eab308; padding: 16px; font-style: italic; margin-bottom: 24px; border-radius: 4px; }
          .content { font-size: 16px; line-height: 1.8; }
          .methodology { background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 24px; border: 1px solid #e2e8f0; }
          .ref-images { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .ref-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 14px; }
          .ref-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fafaf9; text-align: center; }
          .ref-card img { width: 100%; height: 200px; object-fit: contain; background: #fff; }
          .ref-caption { padding: 8px; font-size: 12px; font-weight: bold; color: #44403c; border-top: 1px solid #e5e7eb; }
          .footer { margin-top: 50px; font-size: 12px; color: #a8a29e; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="badge">${report.topic || "অন্বেষণ প্রতিবেদন"}</div>
        <h1>${report.title}</h1>
        ${report.titleEnglish ? `<h3 style="color: #4b5563; font-weight: normal; margin-top: -6px; font-size: 18px;">${report.titleEnglish}</h3>` : ""}
        <div class="meta">
          <strong>অন্বেষক / লেখক:</strong> ${report.author} &nbsp;|&nbsp;
          <strong>প্রকাশের তারিখ:</strong> ${report.publishedDate}
        </div>
        ${report.image ? `<img src="${report.image}" class="cover-img" alt="${report.title}" />` : ""}
        <div class="summary">
          <strong>সারসংক্ষেপ:</strong> ${report.summary}
        </div>
        <div class="content">${contentHtml}</div>
        ${report.methodology && report.methodology.length > 0 ? `
          <div class="methodology">
            <h3 style="margin-top:0;">অনুসৃত পদ্ধতি ও মাঠ পর্যায় (Methodology):</h3>
            <ul>
              ${report.methodology.map((m) => `<li>${m}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        ${refImages.length > 0 ? `
          <div class="ref-images">
            <h3>প্রতিবেদনে সংযুক্ত রেফারেন্স চিত্রসমূহ (${refImages.length} টি):</h3>
            <div class="ref-grid">
              ${refImages.map((img, idx) => `
                <div class="ref-card">
                  <img src="${img}" alt="চিত্র #${idx + 1}" />
                  <div class="ref-caption">রেফারেন্স চিত্র #${idx + 1}</div>
                </div>
              `).join("")}
            </div>
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

  // Share report link using absolute production URL
  const handleShare = async (report) => {
    if (!report) return;
    const shareTitle = (language === "bn" ? report.title : report.titleEnglish || report.title) || "জিয়নকাঠি অন্বেষণ প্রতিবেদন";
    const shareSummary = (language === "bn" ? report.summary : report.summaryEnglish || report.summary) || "";
    const shareUrl = getShareUrl(`/report/${report.id}`);
    const res = await shareContent({
      title: shareTitle,
      text: shareSummary ? `${shareTitle}\n${shareSummary}` : shareTitle,
      url: shareUrl,
    });
    if (res.copied) {
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
    <div id="research-reports-section" className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
            {language === "bn" ? "অন্বেষণ ও মাঠ প্রতিবেদন" : "Research & Field Reports"}
          </h1>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-2xl mx-auto">
            {language === "bn"
              ? "দেশীয় বীজ সংরক্ষণ, বিষমুক্ত বহুমুখী কৃষি, ফল-সবজি বাগান ও শিশুদের বিকল্প শিক্ষার পরীক্ষিত পদ্ধতি ও অন্বেষণমূলক দলিল।"
              : "Explore empirical methodologies on indigenous seeds, organic fruit/vegetable cultivation, and rural nature education."}
          </p>
        </div>

        {/* 2. VERIFIED FIELD IMPACT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-amber-800">৫৬+ রকম</div>
            <div className="text-xs font-semibold text-stone-800">
              {language === "bn" ? "সংরক্ষিত দেশীয় ধান" : "Indigenous Rice Varieties"}
            </div>
            <div className="text-xs text-stone-500">
              {language === "bn" ? "বীজ ব্যাংকে নথিভুক্ত" : "Documented in Seed Bank"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-stone-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800">১৩+ বছর</div>
            <div className="text-xs font-semibold text-stone-800">
              {language === "bn" ? "মাঠের নিরবচ্ছিন্ন চর্চা" : "Continuous Field Action"}
            </div>
            <div className="text-xs text-stone-500">
              {language === "bn" ? "আউশগ্রাম, বর্ধমান" : "Aushgram, Bardhaman"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-stone-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-amber-800">৫০+ পরিবার</div>
            <div className="text-xs font-semibold text-stone-800">
              {language === "bn" ? "উপকৃত ও সহযোগী চাষী" : "Partner Farmer Families"}
            </div>
            <div className="text-xs text-stone-500">
              {language === "bn" ? "বিনামূল্যে বীজ ও পরামর্শ" : "Free Seeds & Advisory"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-stone-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800">১০০%</div>
            <div className="text-xs font-semibold text-stone-800">
              {language === "bn" ? "রাসায়নিক ও কৃত্রিম বিষহীন" : "Chemical-Free Agro-Ecology"}
            </div>
            <div className="text-xs text-stone-500">
              {language === "bn" ? "বৃষ্টির জল ও জৈব সার" : "Rainfed & Organic Composts"}
            </div>
          </div>
        </div>

        {/* 3. RESEARCH REPORTS SECTION HEADER */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider">
              {language === "bn" ? "পদ্ধতিগত দলিল ও প্রকাশনা" : "Scientific & Field Documentation"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {language === "bn" ? "অন্বেষণ ও পদ্ধতিগত প্রতিবেদন সংগ্রহশালা" : "Empirical Research Reports Archive"}
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            {language === "bn" ? "মাঠ পরীক্ষার উপাত্ত, মাটির পুষ্টি বিশ্লেষণ ও প্রকাশনা পড়তে যে কোনো প্রতিবেদনে ক্লিক করুন।" : "Click on any report below to open the complete document, print or download as PDF."}
          </p>
        </div>

        {/* Search & Topic Filters Bar */}
        <div className="bg-white rounded-lg p-4 border border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "bn" ? "প্রতিবেদন বা বিষয় খুঁজুন..." : "Search reports by title or topic..."}
                className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
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
                className="bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                <option value="newest">{language === "bn" ? "সর্বশেষ প্রকাশিত" : "Newest First"}</option>
                <option value="views">{language === "bn" ? "সর্বাধিক পঠিত (জনপ্রিয়)" : "Most Read"}</option>
                <option value="oldest">{language === "bn" ? "পুরাতন থেকে নতুন" : "Oldest First"}</option>
              </select>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${selectedTopic === t
                  ? "bg-amber-700 text-white"
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
            <p>{language === "bn" ? "অন্বেষণ প্রতিবেদন লোড হচ্ছে..." : "Loading research reports..."}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">
              {language === "bn" ? "কোন প্রতিবেদন পাওয়া যায়নি" : "No reports found"}
            </h3>
            <p className="text-xs text-stone-500">
              {language === "bn"
                ? "অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।"
                : "Try adjusting your search keywords or topic filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report, idx) => (
              <motion.article
                key={report.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:border-amber-700 transition-colors flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Topic Overlay */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={report.image || "/images/farming-collage.jpg"}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-stone-800 text-xs font-semibold px-2 py-0.5 rounded shadow-sm border border-stone-200">
                        {report.topic || "অন্বেষণ প্রতিবেদন"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-1.5 bg-stone-900/70 px-2 py-0.5 rounded">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>{report.publishedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-stone-900/70 px-2 py-0.5 rounded font-medium">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>{report.views || 0} পঠিত</span>
                      </div>
                      {Array.isArray(report.embeddedImages) && report.embeddedImages.length > 0 && (
                        <div className="flex items-center space-x-1 bg-amber-900/80 px-2 py-0.5 rounded font-medium text-amber-200">
                          <span>📷 {report.embeddedImages.length} চিত্র</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {language === "bn" ? report.title : report.titleEnglish || report.title}
                      </h2>
                      {report.titleEnglish && language === "bn" && (
                        <p className="text-xs text-stone-500 italic">
                          {report.titleEnglish}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {language === "bn" ? report.summary : report.summaryEnglish || report.summary}
                    </p>

                    {/* Key Method Tags */}
                    {report.methodology && report.methodology.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {report.methodology.slice(0, 3).map((m, i) => (
                          <span
                            key={i}
                            className="bg-stone-50 text-stone-600 text-xs px-2 py-0.5 rounded border border-stone-200"
                          >
                            ✓ {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-stone-500">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span className="truncate max-w-[130px] font-medium">{report.author}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDirectDownload(report, e)}
                      className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors border border-stone-200 bg-white cursor-pointer"
                      title={language === "bn" ? "সরাসরি ডাউনলোড (PDF)" : "Direct Download PDF"}
                    >
                      <Download className={`w-3.5 h-3.5 ${downloadingId === report.id ? "text-emerald-600 animate-bounce" : "text-stone-600"}`} />
                    </button>
                    <button
                      onClick={() => handleOpenReport(report)}
                      className="inline-flex items-center space-x-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      <span>{language === "bn" ? "বিস্তারিত পড়ুন" : "Read Full Report"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal / Dedicated Reader View */}
      <AnimatePresence>
        {activeReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-900/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-lg border border-stone-300 overflow-hidden my-auto"
            >
              {/* Modal Top Bar */}
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="bg-stone-100 text-stone-800 font-semibold text-xs px-2.5 py-0.5 rounded border border-stone-200">
                    {activeReport.topic}
                  </span>
                  <span className="text-xs text-stone-500">
                    {activeReport.publishedDate}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Direct PDF Download Button */}
                  <button
                    onClick={(e) => handleDirectDownload(activeReport, e)}
                    className="p-1.5 text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors flex items-center space-x-1.5 text-xs font-semibold border border-emerald-300 bg-emerald-50/50 cursor-pointer shadow-2xs"
                    title={language === "bn" ? "সরাসরি ডাউনলোড (PDF)" : "Direct Download PDF"}
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span className="hidden sm:inline">{language === "bn" ? "সরাসরি ডাউনলোড" : "Direct Download"}</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={() => handlePrintReport(activeReport)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors flex items-center space-x-1 text-xs font-semibold border border-stone-200 cursor-pointer"
                    title="Print / Save as PDF"
                  >
                    <Printer className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">{language === "bn" ? "প্রিন্ট" : "Print"}</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(activeReport)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors flex items-center space-x-1 text-xs font-semibold border border-stone-200 cursor-pointer"
                    title="Share summary"
                  >
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">{copiedLink ? "কপি হয়েছে!" : "শেয়ার"}</span>
                  </button>

                  {/* Close button */}
                  <button
                    onClick={handleCloseReport}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-stone-800 leading-relaxed">
                {/* Titles */}
                <div className="space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                    {activeReport.title}
                  </h1>
                  {activeReport.titleEnglish && (
                    <p className="text-xs font-medium text-stone-500">
                      {activeReport.titleEnglish}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 pt-1 text-xs text-stone-500">
                    <span className="font-semibold text-amber-800">লেখক: {activeReport.author}</span>
                    <span>•</span>
                    <span>মোট পাঠ: {activeReport.views || 1} বার</span>
                  </div>
                </div>

                {/* Banner image if available */}
                {activeReport.image && (
                  <div
                    onClick={() => setLightboxImage(activeReport.image)}
                    className="rounded-lg overflow-hidden max-h-72 w-full border border-stone-200 cursor-pointer relative group"
                    title="ছবিটি বড় আকারে দেখতে ক্লিক করুন"
                  >
                    <img
                      src={activeReport.image}
                      alt={activeReport.title}
                      className="w-full h-full object-cover group-hover:scale-101 transition-transform"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-stone-900/80 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-1.5 shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>বড় করে দেখুন</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Executive Summary */}
                <div className="bg-amber-50/70 p-4 rounded-lg border-l-4 border-amber-700 text-stone-800 text-xs leading-relaxed space-y-1">
                  <h4 className="font-bold text-amber-800 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>সারসংক্ষেপ (Executive Abstract):</span>
                  </h4>
                  <p>{activeReport.summary}</p>
                </div>

                {/* Main Article Content with Inline Images in PDF Original Order */}
                {(() => {
                  const blocks = parseContentWithInlineImages(activeReport.content || "");
                  return (
                    <div className="space-y-4">
                      {blocks.map((block, idx) => {
                        if (block.type === "image") {
                          return (
                            <div
                              key={idx}
                              className="my-5 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xs"
                            >
                              <div
                                onClick={() => setLightboxImage(block.src)}
                                className="relative max-h-96 w-full bg-white flex items-center justify-center cursor-pointer group p-2"
                                title="বড় করে দেখতে ক্লিক করুন"
                              >
                                <img
                                  src={block.src}
                                  alt={block.alt}
                                  className="max-h-96 w-auto max-w-full object-contain rounded group-hover:scale-[1.01] transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="bg-stone-900/80 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center space-x-1.5 shadow-sm">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>বড় করে দেখুন</span>
                                  </span>
                                </div>
                              </div>
                              {block.alt && (
                                <div className="px-4 py-2 bg-stone-100/90 border-t border-stone-200 text-xs text-stone-600 font-medium flex items-center justify-between">
                                  <span className="font-semibold text-stone-800">{block.alt}</span>
                                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                                    {/* {language === "bn" ? "PDF মূল চিত্র" : "Original PDF Visual"} */}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={idx}
                            className="text-sm text-stone-700 leading-relaxed whitespace-pre-line"
                          >
                            {block.value}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Additional Reference Images Display (Only images NOT already embedded inline in content) */}
                {(() => {
                  const blocks = parseContentWithInlineImages(activeReport.content || "");
                  const inlineImageSrcs = new Set(
                    blocks.filter((b) => b.type === "image").map((b) => b.src)
                  );
                  const allImages = Array.isArray(activeReport.embeddedImages) && activeReport.embeddedImages.length > 0
                    ? activeReport.embeddedImages
                    : (Array.isArray(activeReport.images) ? activeReport.images : []);
                  const extraImages = allImages.filter((img) => !inlineImageSrcs.has(img));

                  if (extraImages.length === 0) return null;

                  return (
                    <div className="space-y-3 pt-3 border-t border-stone-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center space-x-1.5">
                          <FileText className="w-4 h-4 text-amber-700" />
                          <span>{language === "bn" ? "অতিরিক্ত রেফারেন্স চিত্রসমূহ" : "Additional Reference Visuals"} ({extraImages.length} টি):</span>
                        </h3>
                        <span className="text-[11px] text-stone-500 font-medium">বড় করে দেখতে ছবিতে ক্লিক করুন</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {extraImages.map((imgSrc, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => setLightboxImage(imgSrc)}
                            className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-2xs group cursor-pointer hover:border-amber-500 transition-all"
                            title="সম্পূর্ণ আকারে দেখতে ক্লিক করুন"
                          >
                            <div className="relative h-52 bg-white flex items-center justify-center overflow-hidden">
                              <img
                                src={imgSrc}
                                alt={`চিত্র ${imgIdx + 1} - ${activeReport.title}`}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>জুম করুন</span>
                                </span>
                              </div>
                            </div>
                            <div className="p-2.5 text-[11px] text-stone-600 bg-stone-50 border-t border-stone-100 flex items-center justify-between font-medium">
                              <span className="font-bold text-stone-800">রেফারেন্স চিত্র #{imgIdx + 1}</span>
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                                {language === "bn" ? "সংযুক্ত চিত্র" : "Attached Visual"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Methodologies & Findings */}
                {activeReport.methodology && activeReport.methodology.length > 0 && (
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>মাঠ পর্যায় ও অন্বেষণ পদ্ধতি (Methodology):</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeReport.methodology.map((item, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-stone-700 bg-white p-2 rounded border border-stone-200">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeReport.findings && activeReport.findings.length > 0 && (
                  <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-200 space-y-2">
                    <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>প্রধান অর্জন ও ফলাফল (Key Outcomes):</span>
                    </h3>
                    <ul className="space-y-1 text-xs text-emerald-900">
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
              <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDirectDownload(activeReport, e)}
                    className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === "bn" ? "সরাসরি ডাউনলোড (PDF)" : "Direct Download (PDF)"}</span>
                  </button>
                  <button
                    onClick={() => handlePrintReport(activeReport)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 px-3 py-2 rounded-md transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden sm:inline">{language === "bn" ? "প্রিন্ট করুন" : "Print"}</span>
                  </button>
                </div>

                <button
                  onClick={handleCloseReport}
                  className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
                >
                  {language === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs cursor-zoom-out"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col items-center"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-stone-800/80 hover:bg-stone-700 text-white rounded-full transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightboxImage}
                alt="প্রতিবেদন চিত্র জুম"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="pt-2 pb-1 text-center text-xs text-stone-300 font-medium">
                জিয়নকাঠি অন্বেষণ প্রতিবেদন রেফারেন্স চিত্র
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
