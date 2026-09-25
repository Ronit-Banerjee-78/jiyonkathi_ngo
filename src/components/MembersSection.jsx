"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { motion, AnimatePresence } from "motion/react";
import { Users, HandHelping, MapPin, Award, ChevronLeft, ChevronRight, Sparkles, UserCheck, ShieldCheck } from "lucide-react";

export default function MembersSection({ setActiveTab }) {
  const { siteData, language } = useContext(SiteContext);
  const members = siteData.members || [];
  const baseVolunteers = siteData.volunteersList || [];

  const [dbVolunteers, setDbVolunteers] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/volunteers')
      .then(res => res.json())
      .then(json => {
        if (active && json.success && Array.isArray(json.volunteers)) {
          const approved = json.volunteers.filter(v => v.status === 'approved');
          setDbVolunteers(approved);
        }
      })
      .catch(err => console.error("Error fetching approved volunteers:", err));
    return () => { active = false; };
  }, []);

  // Merge baseVolunteers from SiteContext with dbVolunteers from database
  const allVolunteersMap = new Map();
  baseVolunteers.forEach(v => allVolunteersMap.set(String(v.id), v));
  dbVolunteers.forEach(v => {
    allVolunteersMap.set(String(v.id), {
      id: v.id,
      name: v.name,
      designation: v.program || "Community Volunteer",
      location: v.location || "Purba Bardhaman, WB",
      image: v.image || null,
      bio: v.motivation || v.skills || "Active community volunteer.",
      isDdbmpbs: v.isDdbmpbs || v.is_ddbmpbs || false
    });
  });

  // Ensure executive members are strictly excluded from normal members/volunteers list
  const execNames = new Set(members.map(m => (m.name || '').trim().toLowerCase()));
  const volunteersList = Array.from(allVolunteersMap.values()).filter(
    v => !execNames.has((v.name || '').trim().toLowerCase())
  );

  const handleNext = () => {
    if (volunteersList.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % volunteersList.length);
  };

  const handlePrev = () => {
    if (volunteersList.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + volunteersList.length) % volunteersList.length);
  };

  return (
    <div id="members-section" className="py-10 sm:py-16 bg-stone-50 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Top Members Header */}
        <div className="border-b border-stone-200 pb-6 text-center max-w-3xl mx-auto space-y-3">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            {language === "bn" ? "আমাদের নির্বাহী সদস্যবৃন্দ" : "Executive Members"}
          </h1>

        </div>

        {/* Core Executive Members Section */}
        <div className="space-y-8 sm:space-y-10">
          {members.map((member, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={member.id || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-10 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm hover:border-amber-700 transition-colors ${isEven ? "" : "lg:flex-row-reverse"
                  }`}
              >
                {/* Photo Side */}
                <div className="w-full lg:w-4/12 flex justify-center">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-16 h-16 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Details Side */}
                <div className={`w-full lg:w-8/12 flex flex-col ${isEven ? "lg:items-start lg:text-left" : "lg:items-start lg:text-left"} space-y-3`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded bg-amber-50 text-amber-800 font-semibold text-xs flex items-center justify-center border border-amber-200">
                      #{index + 1}
                    </span>
                    <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{member.role}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    {member.name}
                  </h2>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Members & Community Volunteers Carousel Section */}
        <div id="members-carousel-container" className="border-t border-stone-200 pt-12 space-y-8">

          {/* Section Heading with Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === "bn" ? "সাধারণ সদস্য ও স্বেচ্ছাসেবক পরিজন" : "Members & Volunteers Showcase"}</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {language === "bn" ? "আমাদের সাধারণ সদস্যবৃন্দ" : "Community Members & Volunteers"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                {language === "bn"
                  ? "গ্রামোন্নয়ন, সহায়ক শিক্ষা কেন্দ্র ও বীজ সংরক্ষণে সরাসরি মাঠে কাজ করা স্বেচ্ছাসেবকগণ। DDBMPBS সহযোগীদের প্রোফাইলে বিশেষ ব্যাজ প্রদর্শন করা রয়েছে।"
                  : "Field volunteers and grassroots conservationists. Look for the DDBMPBS badge for affiliated members."}
              </p>
            </div>

            {/* Carousel Control Buttons */}
            {volunteersList.length > 0 && (
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handlePrev}
                  id="members-carousel-prev"
                  className="bg-white hover:bg-stone-100 text-stone-700 p-2 rounded-md transition-colors border border-stone-200 active:scale-95"
                  title="Previous Member"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  id="members-carousel-next"
                  className="bg-white hover:bg-stone-100 text-stone-700 p-2 rounded-md transition-colors border border-stone-200 active:scale-95"
                  title="Next Member"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Member Carousel Display Card or Empty State */}
          {volunteersList.length > 0 ? (
            <>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
                  >
                    {/* Photo Column */}
                    <div className="lg:col-span-4 flex justify-center">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
                        {volunteersList[carouselIndex].image ? (
                          <img
                            src={volunteersList[carouselIndex].image}
                            alt={volunteersList[carouselIndex].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-16 h-16 text-stone-400" />
                        )}
                      </div>
                    </div>

                    {/* Info Column */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{volunteersList[carouselIndex].designation || "Community Member"}</span>
                        </span>

                        {/* DDBMPBS Special Badge */}
                        {volunteersList[carouselIndex].isDdbmpbs && (
                          <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-300 flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                            <span>DDBMPBS Affiliate</span>
                          </span>
                        )}

                        <span className="bg-stone-50 text-stone-600 text-xs font-medium px-2.5 py-0.5 rounded border border-stone-200 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          <span>{volunteersList[carouselIndex].location || "Purba Bardhaman, WB"}</span>
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                        {volunteersList[carouselIndex].name}
                      </h3>

                      <p className="text-stone-700 text-sm leading-relaxed bg-stone-50 p-4 rounded-md border border-stone-200">
                        &quot;{volunteersList[carouselIndex].bio || "Active community member dedicated to environmental conservation and village children education."}&quot;
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800">
                          <HandHelping className="w-4 h-4 text-amber-700" />
                          <span>{language === "bn" ? `সদস্য নং ${carouselIndex + 1}` : `Member #${carouselIndex + 1}`}</span>
                        </div>
                        <div className="text-xs text-stone-500">
                          {carouselIndex + 1} / {volunteersList.length}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="flex justify-center space-x-1.5 mt-4">
                  {volunteersList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full transition-colors ${idx === carouselIndex ? "w-6 bg-amber-700" : "w-2 bg-stone-300 hover:bg-stone-400"
                        }`}
                      title={`Go to member ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Grid View of All Members */}
              <div className="pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4 text-center">
                  {language === "bn" ? "সকল সাধারণ সদস্যদের তালিকা" : "All Community Members"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {volunteersList.map((vol, idx) => (
                    <div
                      key={vol.id || idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center space-x-3 ${idx === carouselIndex
                        ? "bg-amber-50 border-amber-300 ring-1 ring-amber-400"
                        : "bg-white border-stone-200 hover:border-amber-700 hover:bg-stone-50"
                        }`}
                    >
                      <div className="w-11 h-11 rounded-md overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center border border-stone-200">
                        {vol.image ? (
                          <img src={vol.image} alt={vol.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <h5 className="text-xs font-bold text-stone-900 truncate">{vol.name}</h5>
                          {vol.isDdbmpbs && (
                            <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-1 py-0.5 rounded border border-amber-200 shrink-0">
                              DDBMPBS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-800 font-medium truncate">{vol.designation || "Community Member"}</p>
                        <p className="text-xs text-stone-500 truncate">{vol.location || "Purba Bardhaman, WB"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg border border-stone-200 p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                {language === "bn" ? "সাধারণ সদস্য ও স্বেচ্ছাসেবী হিসেবে যুক্ত হোন" : "Join as a Volunteer or Community Member"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                {language === "bn"
                  ? "বর্তমানে সাধারণ সদস্যের তালিকা প্রস্তুত করা হচ্ছে। আপনি জিয়নকাঠির প্রাকৃতিক কৃষি, বীজ সংরক্ষণ ও শিশুদের পাঠদানে অংশ নিতে এখনই আবেদন করতে পারেন।"
                  : "We are currently compiling our community volunteers registry. You can submit an application to join our agricultural conservation and village learning initiatives."}
              </p>
              {typeof setActiveTab === "function" && (
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("volunteer")}
                    className="inline-flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-md transition-colors"
                  >
                    <HandHelping className="w-4 h-4" />
                    <span>{language === "bn" ? "স্বেচ্ছাসেবী আবেদন ফর্ম খুলুন" : "Open Volunteer Application Form"}</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
