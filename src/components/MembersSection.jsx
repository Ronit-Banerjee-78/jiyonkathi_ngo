"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { motion, AnimatePresence } from "motion/react";
import { Users, HandHelping, MapPin, Award, ChevronLeft, ChevronRight, Sparkles, UserCheck, ShieldCheck } from "lucide-react";

export default function MembersSection() {
  const { siteData, language } = useContext(SiteContext);
  const members = siteData.members || [];
  const baseVolunteers = siteData.volunteersList || [
    { id: "v-1", name: "Volunteer Alpha (Lorem Ipsum)", designation: "Auxiliary Education Volunteer Teacher", location: "Purba Bardhaman, WB", image: "/images/education-center.jpg", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.", isDdbmpbs: true },
    { id: "v-2", name: "Volunteer Beta (Dolor Sit)", designation: "Organic Farming & Soil Testing Volunteer", location: "Purba Bardhaman, WB", image: "/images/seedbed.jpg", bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.", isDdbmpbs: false },
    { id: "v-3", name: "Volunteer Gamma (Amet Consectetur)", designation: "Nature Awareness & Community Organizer", location: "Purba Bardhaman, WB", image: "/images/community-collage.jpg", bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.", isDdbmpbs: true },
    { id: "v-4", name: "Volunteer Delta (Adipiscing Elit)", designation: "Eco-farming & Bio-fertilizer Field Lead", location: "Purba Bardhaman, WB", image: "/images/paddy-harvesting.jpg", bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.", isDdbmpbs: false }
  ];

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
  const volunteersList = Array.from(allVolunteersMap.values());

  const handleNext = () => {
    if (volunteersList.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % volunteersList.length);
  };

  const handlePrev = () => {
    if (volunteersList.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + volunteersList.length) % volunteersList.length);
  };

  return (
    <div id="members-section" className="py-16 sm:py-20 bg-[#faf7f0] w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">

        {/* Top Members Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "bn" ? "আমাদের পরিজন ও কর্মীদল" : "Our Community & Leadership"}</span>
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {language === "bn" ? "আমাদের নির্বাহী সদস্যবৃন্দ" : "Executive Members"}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-medium">
            {language === "bn"
              ? "জিয়নকাঠির দৈনন্দিন সুপরিচালনা, দেশীয় বীজ রক্ষা ও সমাজভিত্তিক উন্নয়নের মূল চালিকাশক্তি।"
              : "Meet the dedicated core leadership driving Jiyonkathi forward every single day."}
          </p>
        </div>

        {/* Core Executive Members Section */}
        <div className="space-y-12 sm:space-y-16">
          {members.map((member, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={member.id || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-14 bg-white p-7 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow ${isEven ? "" : "lg:flex-row-reverse"
                  }`}
              >
                {/* Photo Side */}
                <div className="w-full lg:w-4/12 flex justify-center">
                  <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-md ring-4 ring-amber-100/60 bg-stone-100 flex-shrink-0 flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-20 h-20 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Details Side */}
                <div className={`w-full lg:w-8/12 flex flex-col ${isEven ? "lg:items-start lg:text-left" : "lg:items-start lg:text-left"} space-y-3`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                      #{index + 1}
                    </span>
                    <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{member.role}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {member.name}
                  </h2>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Members & Community Volunteers Carousel Section */}
        <div id="members-carousel-container" className="border-t border-stone-200/80 pt-16 space-y-10">

          {/* Section Heading with Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-7 sm:p-9 rounded-3xl border border-stone-200 shadow-2xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{language === "bn" ? "সাধারণ সদস্য ও স্বেচ্ছাসেবক পরিজন" : "Members & Volunteers Showcase"}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {language === "bn" ? "আমাদের সাধারণ সদস্যবৃন্দ" : "Community Members & Volunteers"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                {language === "bn"
                  ? "গ্রামোন্নয়ন, সহায়ক শিক্ষা কেন্দ্র ও বীজ সংরক্ষণে সরাসরি মাঠে কাজ করা স্বেচ্ছাসেবকগণ। DDBMPBS সহযোগীদের প্রোফাইলে বিশেষ ব্যাজ প্রদর্শন করা রয়েছে।"
                  : "Field volunteers and grassroots conservationists. Look for the DDBMPBS badge for affiliated members."}
              </p>
            </div>

            {/* Carousel Control Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handlePrev}
                id="members-carousel-prev"
                className="bg-stone-50 hover:bg-amber-600 text-stone-700 hover:text-white p-3 rounded-2xl transition-all border border-stone-200 active:scale-95"
                title="Previous Member"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                id="members-carousel-next"
                className="bg-stone-50 hover:bg-amber-600 text-stone-700 hover:text-white p-3 rounded-2xl transition-all border border-stone-200 active:scale-95"
                title="Next Member"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Member Carousel Display Card */}
          {volunteersList.length > 0 && (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl border border-stone-200 shadow-xs p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Photo Column */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-stone-100 shadow-sm bg-stone-100 shrink-0 flex items-center justify-center">
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
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{volunteersList[carouselIndex].designation || "Community Member"}</span>
                      </span>

                      {/* DDBMPBS Special Badge */}
                      {volunteersList[carouselIndex].isDdbmpbs && (
                        <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>DDBMPBS Affiliate</span>
                        </span>
                      )}

                      <span className="bg-stone-50 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full border border-stone-200 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>{volunteersList[carouselIndex].location || "Purba Bardhaman, WB"}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                      {volunteersList[carouselIndex].name}
                    </h3>

                    <p className="text-stone-700 text-sm sm:text-base leading-relaxed bg-[#fdfbf7] p-4 sm:p-5 rounded-2xl border border-stone-200/80">
                      &quot;{volunteersList[carouselIndex].bio || "Active community member dedicated to environmental conservation and village children education."}&quot;
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-800">
                        <HandHelping className="w-4 h-4 text-amber-600" />
                        <span>{language === "bn" ? `সদস্য নং ${carouselIndex + 1}` : `Member #${carouselIndex + 1}`}</span>
                      </div>
                      <div className="text-xs text-stone-500 font-medium">
                        {carouselIndex + 1} / {volunteersList.length}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {volunteersList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === carouselIndex ? "w-8 bg-amber-600" : "w-2.5 bg-stone-300 hover:bg-stone-400"
                      }`}
                    title={`Go to member ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grid View of All Members */}
          <div className="pt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6 text-center">
              {language === "bn" ? "সকল সাধারণ সদস্যদের তালিকা" : "All Community Members"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteersList.map((vol, idx) => (
                <div
                  key={vol.id || idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 ${idx === carouselIndex
                    ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-xs"
                    : "bg-white border-stone-200 hover:border-amber-200 hover:bg-stone-50/50"
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center border border-stone-200">
                    {vol.image ? (
                      <img src={vol.image} alt={vol.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                  <div className="overflow-hidden space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <h5 className="text-sm font-bold text-stone-900 truncate">{vol.name}</h5>
                      {vol.isDdbmpbs && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                          DDBMPBS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-800 font-medium truncate">{vol.designation || "Community Member"}</p>
                    <p className="text-[11px] text-stone-400 truncate">{vol.location || "Purba Bardhaman, WB"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
