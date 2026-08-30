"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Briefcase,
  Users,
  Sparkles,
  Tag,
  Share2,
  ChevronRight
} from "lucide-react";
import { EVENTS } from "../data";
import { useSite } from "../hooks/useSite";

export default function EventsSection({ setActiveTab }) {
  const { language, setSelectedCampaign, siteData } = useSite();
  const isBn = language === "bn";

  const [eventsList, setEventsList] = useState(EVENTS);
  const [filter, setFilter] = useState("all"); // 'all' | 'upcoming' | 'completed'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch live events from API
  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.events) && json.events.length > 0) {
            if (isMounted) {
              setEventsList(json.events);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live events from /api/events, using defaults:", err);
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, [siteData]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]);

  const filteredEvents = eventsList.filter((evt) => {
    if (filter === "upcoming") return evt.status === "upcoming";
    if (filter === "completed") return evt.status === "past" || evt.status === "completed";
    return true;
  });

  const handleNavigateToWork = (workRef) => {
    if (setSelectedCampaign && workRef) {
      setSelectedCampaign(workRef);
    }
    if (typeof setActiveTab === "function") {
      setActiveTab("work");
    }
    setSelectedEvent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-12 sm:py-16 bg-stone-50/50 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">

          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {isBn ? "আমাদের সামাজিক অনুষ্ঠানসমূহ" : "Community Gatherings & Events"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            {isBn
              ? "জিয়নকাঠির মাঠের আনন্দ, পরিবেশ চেতনা, দেশীয় ধান বীজ বিতরণ ও সহায়ক শিক্ষা শিবিরের সার্বিক সময়সূচী।"
              : "Join our annual festivals, environmental workshops, free health checkups, and organic seed distribution drives."}
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 bg-stone-200/70 rounded-2xl max-w-md mx-auto border border-stone-300/50">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${filter === "all"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                }`}
            >
              {isBn ? "সকল অনুষ্ঠান" : "All Events"} ({eventsList.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${filter === "upcoming"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-600 hover:text-emerald-700 hover:bg-white/50"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {isBn ? "আসন্ন" : "Upcoming"} ({eventsList.filter((e) => e.status === "upcoming").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${filter === "completed"
                ? "bg-stone-800 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
              {isBn ? "সম্পন্ন" : "Completed"} ({eventsList.filter((e) => e.status === "past" || e.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredEvents.map((evt) => {
            const isUpcoming = evt.status === "upcoming";
            const titleText = isBn ? evt.title : (evt.titleEnglish || evt.title_english || evt.title);
            const dateText = isBn ? (evt.date || evt.date_str) : (evt.dateEnglish || evt.date_english || evt.date || evt.date_str);
            const timeText = isBn ? (evt.time || evt.time_str) : (evt.timeEnglish || evt.time_english || evt.time || evt.time_str);
            const locationText = isBn ? evt.location : (evt.locationEnglish || evt.location_english || evt.location);
            const categoryText = isBn ? evt.category : (evt.categoryEnglish || evt.category_english || evt.category);
            const descriptionText = evt.description;
            const spotsCount = evt.spotsLeft ?? evt.spots_left;
            const ourWorkRefVal = evt.ourWorkRef || evt.our_work_ref;

            return (
              <div
                key={evt.id}
                className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${isUpcoming
                  ? "border-emerald-200 hover:border-emerald-400/80"
                  : "border-stone-200 hover:border-stone-300"
                  }`}
              >
                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Left Column: Image or Date Banner */}
                  <div className="w-full md:w-56 shrink-0 h-44 rounded-xl overflow-hidden relative bg-stone-100 border border-stone-200/60 group-hover:scale-[1.01] transition-transform">
                    <img
                      src={evt.image || "/images/community-collage.jpg"}
                      alt={titleText}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent"></div>

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                      {categoryText}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      {isUpcoming ? (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-sm border border-emerald-400/30">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          {isBn ? "আসন্ন অনুষ্ঠান" : "Upcoming"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-stone-900/90 text-stone-200 font-semibold text-[11px] px-3 py-1 rounded-full backdrop-blur-md border border-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {isBn ? "সম্পন্ন" : "Completed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Event Content */}
                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        {categoryText}
                      </span>
                      {isUpcoming && spotsCount > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-600" />
                          {isBn ? `${spotsCount} টি আসন অবশিষ্ট` : `${spotsCount} spots available`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {titleText}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-stone-600">
                      <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{dateText}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{timeText}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
                      {descriptionText}
                    </p>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full md:w-auto bg-stone-900 hover:bg-emerald-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow"
                    >
                      <span>{isBn ? "বিস্তারিত" : "Details"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {!isUpcoming && (
                      <button
                        onClick={() => handleNavigateToWork(ourWorkRefVal)}
                        className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? "আমাদের কাজ" : "Our Work"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner Image */}
            <div className="relative h-56 sm:h-64 w-full bg-stone-900">
              <img
                src={selectedEvent.image || "/images/community-collage.jpg"}
                alt={isBn ? selectedEvent.title : selectedEvent.titleEnglish || selectedEvent.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-105"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Status Badge & Category on Header */}
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
                <span className="bg-emerald-500/90 text-white font-bold text-xs px-3 py-1 rounded-md backdrop-blur-md uppercase tracking-wider">
                  {isBn ? selectedEvent.category : selectedEvent.categoryEnglish || selectedEvent.category}
                </span>

                {selectedEvent.status === "upcoming" ? (
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md border border-emerald-400/40">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    {isBn ? "আসন্ন অনুষ্ঠান" : "Upcoming Event"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-stone-800 text-stone-200 font-bold text-xs px-3.5 py-1.5 rounded-full border border-stone-600 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {isBn ? "সম্পন্ন অনুষ্ঠান" : "Completed Event"}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                  {isBn ? selectedEvent.title : selectedEvent.titleEnglish || selectedEvent.title}
                </h3>
                <p className="mt-2 text-stone-500 text-sm font-medium">
                  {isBn ? "জিয়নকাঠি গ্রাম্য টেকসই উন্নয়ন সংস্থা" : "Jiyonkathi Rural Sustainable Community Initiative"}
                </p>
              </div>

              {/* Event Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="flex items-center space-x-3 text-sm text-stone-700">
                  <div className="p-2 bg-emerald-100/80 text-emerald-700 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-400 uppercase">{isBn ? "তারিখ" : "Date"}</span>
                    <span className="font-bold text-stone-900">
                      {isBn ? selectedEvent.date : selectedEvent.dateEnglish || selectedEvent.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm text-stone-700">
                  <div className="p-2 bg-emerald-100/80 text-emerald-700 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-400 uppercase">{isBn ? "সময়" : "Time"}</span>
                    <span className="font-bold text-stone-900">
                      {isBn ? selectedEvent.time : selectedEvent.timeEnglish || selectedEvent.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm text-stone-700 sm:col-span-2">
                  <div className="p-2 bg-emerald-100/80 text-emerald-700 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-400 uppercase">{isBn ? "স্থান" : "Location"}</span>
                    <span className="font-bold text-stone-900">
                      {isBn ? selectedEvent.location : selectedEvent.locationEnglish || selectedEvent.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Detailed Description */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? "অনুষ্ঠানের বিস্তারিত বিবরণ" : "Event Narrative & Overview"}</span>
                </h4>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {isBn
                    ? selectedEvent.fullDetails || selectedEvent.description
                    : selectedEvent.fullDetailsEnglish || selectedEvent.description}
                </p>
              </div>

              {/* Additional Context Note for Passed Events */}
              {(selectedEvent.status === "past" || selectedEvent.status === "completed") && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs sm:text-sm space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {isBn ? "সম্পন্ন প্রকল্পের কাজ" : "Archived Community Accomplishment"}
                  </span>
                  <p className="text-amber-800">
                    {isBn
                      ? "এই অনুষ্ঠানটির সফল বাস্তবায়ন শেষে সমস্ত ছবি, কার্যপ্রণালী ও প্রভাব সংক্রান্ত তথ্য আমাদের কাজ পাতায় সংরক্ষণে রাখা হয়েছে।"
                      : "This event has been successfully completed. Full records, photos, and harvest impact have been documented under Our Work."}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-end items-center gap-3">
              {/* Button for Passed Events to Visit "Our Work" */}
              {(selectedEvent.status === "past" || selectedEvent.status === "completed" || selectedEvent.ourWorkRef) && (
                <button
                  onClick={() => handleNavigateToWork(selectedEvent.ourWorkRef)}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 border border-emerald-500/30"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{isBn ? "আমাদের কাজ পাতায় বিস্তারিত দেখুন" : "Check More in Our Work"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
