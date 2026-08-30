"use client";

import React, { useState, useContext } from "react";
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
  Layers
} from "lucide-react";

export default function GallerySection() {
  const { siteData, language } = useContext(SiteContext);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);

  const rawGallery = siteData.gallery || [];

  // Filter out scheduled items if scheduledFor is in the future
  const now = new Date().toISOString();
  const visibleItems = rawGallery.filter((item) => {
    if (item.isPublished === false) return false;
    if (item.scheduledFor && item.scheduledFor > now) return false;
    return true;
  });

  const filteredItems = visibleItems.filter((item) => {
    const itemCat = item.category || "events";
    return activeCategory === "all" || itemCat === activeCategory;
  });

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((prev) =>
        prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((prev) =>
        prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    }
  };

  return (
    <div id="gallery-section" className="py-16 sm:py-20 bg-[#faf7f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === "bn" ? "ফটোগ্রাফি ও ভিডিও স্মৃতি" : "Visual Archive & Moments"}</span>
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
            {language === "bn" ? "জিয়নকাঠি চিত্রশালা" : "Our Media Gallery"}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {language === "bn"
              ? "দেশীয় ধান বীজতলা, রোপণ, ফসল কাটা, সহায়ক শিক্ষা কেন্দ্র ও গ্রামীণ উৎসবের সচিত্র মুহূর্ত।"
              : "A photographic and cinematic archive of our agro-ecological milestones, seed nursery, and community gatherings."}
          </p>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-lg mx-auto bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs">
          {[
            { id: "all", labelBn: "সকল ছবি ও ভিডিও", labelEn: "All Media" },
            { id: "campaigns", labelBn: "কৃষি ও পরিবেশ", labelEn: "Ecology & Farming" },
            { id: "events", labelBn: "সামাজিক উৎসব", labelEn: "Events" },
            { id: "impact", labelBn: "শিক্ষা ও মাঠ পর্যায়", labelEn: "Impact & Education" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeCategory === cat.id
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-stone-600 hover:bg-stone-50 hover:text-amber-700"
                }`}
            >
              {language === "bn" ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setSelectedImageIdx(idx)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-lg cursor-pointer transition-all border border-stone-200/90 flex flex-col justify-between"
              >
                <div className="aspect-4/3 overflow-hidden relative bg-stone-100">
                  {item.type === "Video" || item.url?.endsWith(".mp4") ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category || "events"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === "bn" ? "পূর্ণাঙ্গ ভিউ দেখুন" : "View Full Size"}</span>
                    </span>
                    <span className="text-[11px] text-stone-400 font-normal">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 space-y-3 max-w-xl mx-auto shadow-2xs">
            <ImageIcon className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
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
          onClick={() => setSelectedImageIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
          >
            {/* Modal Top Bar */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {filteredItems[selectedImageIdx].category || "events"}
                </span>
                <h4 className="font-extrabold text-stone-900 text-sm sm:text-base line-clamp-1">
                  {filteredItems[selectedImageIdx].title}
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIdx(null)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors ml-2"
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
            <div className="p-5 bg-white border-t border-stone-100 space-y-1">
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {filteredItems[selectedImageIdx].description}
              </p>
              <div className="text-[11px] text-stone-400 font-medium">
                {selectedImageIdx + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
