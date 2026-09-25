"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  Image as ImageIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  Calendar,
  Layers,
  Share2,
  CheckCircle2
} from "lucide-react";
import { getShareUrl, shareContent } from "../utils/urlUtils";

const GALLERY_CATEGORIES = [
  { id: "all", labelBn: "সকল", labelEn: "All", heading: "সকল ছবি ও ভিডিও (All Media)" },
  { id: "pkhira", labelBn: "জিয়নকাঠির পখিরা", labelEn: "Jiyonkathir Pkhira", heading: "জিয়নকাঠির পখিরা (Jiyonkathir Pkhira)" },
  { id: "ragi", labelBn: "জিয়নকাঠির রাগি চাষ", labelEn: "Jiyonkathir Ragi Chas", heading: "জিয়নকাঠির রাগি চাষ (Jiyonkathir Ragi Chas)" },
  { id: "dhan", labelBn: "জিয়নকাঠির ধান চাষ ও সংরক্ষণ", labelEn: "Jiyonkathir Dhan chass o Sonrokkhon", heading: "জিয়নকাঠির ধান চাষ ও সংরক্ষণ (Jiyonkathir Dhan chass o Sonrokkhon)" },
  { id: "joll", labelBn: "জল সংরক্ষণ", labelEn: "Joll Sonrokkhon", heading: "জল সংরক্ষণ (Joll Sonrokkhon)" },
];

const normalizeCategory = (cat) => {
  if (!cat) return "dhan";
  if (cat === "pkhira" || cat === "events" || cat === "education") return "pkhira";
  if (cat === "ragi") return "ragi";
  if (cat === "dhan" || cat === "farming" || cat === "seeds" || cat === "impact") return "dhan";
  if (cat === "joll" || cat === "campaigns" || cat === "water") return "joll";
  return cat;
};

export default function GallerySection({ targetImageId = null, onSelectImage = null, onClearTarget = null }) {
  const { siteData, language } = useContext(SiteContext);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const rawGallery = siteData.gallery || [];

  // Filter out scheduled items if scheduledFor is in the future
  const now = new Date().toISOString();
  const visibleItems = rawGallery.filter((item) => {
    if (item.isPublished === false) return false;
    if (item.scheduledFor && item.scheduledFor > now) return false;
    return true;
  });

  const filteredItems = visibleItems.filter((item) => {
    const itemCat = normalizeCategory(item.category);
    return activeCategory === "all" || itemCat === activeCategory;
  });

  // Handle opening targeted image from deep link or direct URL
  useEffect(() => {
    if (targetImageId && filteredItems.length > 0) {
      const targetStr = String(targetImageId).toLowerCase();
      const foundIdx = filteredItems.findIndex(
        (item) => String(item.id || "").toLowerCase() === targetStr
      );
      if (foundIdx !== -1) {
        setSelectedImageIdx(foundIdx);
      }
    }
  }, [targetImageId, filteredItems]);

  const handleSelectImage = (idx) => {
    setSelectedImageIdx(idx);
    const item = filteredItems[idx];
    if (item?.id && onSelectImage) {
      onSelectImage(item.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedImageIdx(null);
    if (onClearTarget) {
      onClearTarget();
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (selectedImageIdx !== null && filteredItems.length > 0) {
      const nextIdx = selectedImageIdx > 0 ? selectedImageIdx - 1 : filteredItems.length - 1;
      setSelectedImageIdx(nextIdx);
      const item = filteredItems[nextIdx];
      if (item?.id && onSelectImage) {
        onSelectImage(item.id);
      }
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (selectedImageIdx !== null && filteredItems.length > 0) {
      const nextIdx = selectedImageIdx < filteredItems.length - 1 ? selectedImageIdx + 1 : 0;
      setSelectedImageIdx(nextIdx);
      const item = filteredItems[nextIdx];
      if (item?.id && onSelectImage) {
        onSelectImage(item.id);
      }
    }
  };

  const handleShareImage = async (item) => {
    if (!item) return;
    const shareUrl = getShareUrl(`/image/${item.id}`);
    const shareTitle = item.title || "জিয়নকাঠি চিত্রশালা";
    const shareText = item.description || shareTitle;
    const res = await shareContent({
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    });
    if (res.copied) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div id="gallery-section" className="py-10 sm:py-16 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 text-center max-w-3xl mx-auto space-y-3">


          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            {language === "bn" ? "জিয়নকাঠি চিত্রশালা" : "Our Media Gallery"}
          </h1>


        </div>

        {/* Categories Filter Tabs with Both English & Bengali Headings */}
        <div className="flex flex-wrap justify-center items-center gap-2 w-full mx-auto bg-white p-2 border-b border-stone-200">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeCategory === cat.id
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-amber-700"
                }`}
            >
              {language === "bn" ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => handleSelectImage(idx)}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:border-amber-700 cursor-pointer transition-colors border border-stone-200 flex flex-col justify-between"
              >
                <div className="aspect-4/3 overflow-hidden relative bg-stone-100">
                  {item.type === "Video" || item.url?.endsWith(".mp4") ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    {(() => {
                      const matchedCat = GALLERY_CATEGORIES.find((c) => c.id === normalizeCategory(item.category));
                      return (
                        <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-stone-700/50">
                          {matchedCat ? `${matchedCat.labelBn} • ${matchedCat.labelEn}` : item.category}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === "bn" ? "পূর্ণাঙ্গ ভিউ দেখুন" : "View Full Size"}</span>
                    </span>
                    <span className="text-xs text-stone-400 font-normal">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-200 space-y-3 max-w-lg mx-auto shadow-sm">
            <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">
              {language === "bn" ? "কোনো ছবি বা ভিডিও পাওয়া যায়নি।" : "No media found in this category."}
            </h3>
            <p className="text-xs text-stone-500">
              {language === "bn" ? "নতুন ছবি নিয়মিত আপলোড করা হচ্ছে।" : "New photos and field recordings are added regularly."}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox / Modal Viewer */}
      {selectedImageIdx !== null && filteredItems[selectedImageIdx] && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border border-stone-200"
          >
            {/* Modal Top Bar */}
            <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  {filteredItems[selectedImageIdx].category || "events"}
                </span>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-1">
                  {filteredItems[selectedImageIdx].title}
                </h4>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleShareImage(filteredItems[selectedImageIdx])}
                  className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                  title="Share image"
                >
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">{copiedLink ? (language === "bn" ? "কপি হয়েছে!" : "Copied!") : (language === "bn" ? "শেয়ার" : "Share")}</span>
                </button>
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors ml-2 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Body */}
            <div className="flex-1 bg-stone-900 flex items-center justify-center min-h-[300px] sm:min-h-[420px] relative overflow-hidden">
              {filteredItems[selectedImageIdx].type === "Video" || filteredItems[selectedImageIdx].url?.endsWith(".mp4") ? (
                <video
                  src={filteredItems[selectedImageIdx].url}
                  className="max-h-[60vh] max-w-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={filteredItems[selectedImageIdx].url}
                  alt={filteredItems[selectedImageIdx].title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              )}
            </div>

            {/* Modal Caption */}
            <div className="p-4 bg-white border-t border-stone-100 space-y-1">
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {filteredItems[selectedImageIdx].description}
              </p>
              <div className="text-xs text-stone-500 font-medium">
                {selectedImageIdx + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
