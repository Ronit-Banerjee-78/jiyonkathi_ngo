"use client";

import React, { useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { Leaf, Users, Sun, BookOpen, ShieldCheck, Sparkles, HeartHandshake, MapPin } from "lucide-react";
import { BENGALI_CONTENT } from "../data";

export default function AboutSection() {
  const { siteData, language } = useContext(SiteContext);

  const cardItems = [
    {
      id: "p-1",
      titleBn: "দেশীয় প্রজাতির দানাশস্য ও বীজ সংরক্ষণ",
      titleEn: "Indigenous Seed & Crop Conservation",
      descBn: "দেশীয় প্রজাতির দানাশস্য (মূলত ধান) ও সবজি চাষ করা এবং তাদের বীজ সংরক্ষণ করা। রাসায়নিক সার ও কীটনাশক একেবারেই না ব্যবহার করা, ভূগর্ভস্থ জল না তোলা এবং ন্যূনতম জীবাশ্ম জ্বালানি ব্যবহার করা।",
      descEn: "Cultivating indigenous varieties of paddy and vegetables and conserving their seeds without chemical fertilizers, pesticides, or drawing groundwater.",
      icon: <Leaf className="w-5 h-5 text-amber-700" />,
      bgIcon: "bg-amber-100"
    },
    {
      id: "p-2",
      titleBn: "কৃষিজীবী মানুষের সাথে নিবিড় যোগাযোগ",
      titleEn: "Farmer & Community Engagement",
      descBn: "গ্রামের কৃষিজীবী মানুষদের সাথে নিবিড় যোগাযোগ বাড়ানো ও অভিজ্ঞতার আদান-প্রদান করা, যাতে তারা পরিবেশের ভারসাম্য বজায় রেখে প্রকৃতিবান্ধব উপায়ে ফসল উৎপাদনে উৎসাহী হন।",
      descEn: "Building deep connections with rural farmers to exchange knowledge, encouraging eco-friendly cultivation and sustainable farming practices.",
      icon: <Users className="w-5 h-5 text-orange-700" />,
      bgIcon: "bg-orange-100"
    },
    {
      id: "p-3",
      titleBn: "পুনর্ব্যবহারযোগ্য শক্তির ব্যবহার",
      titleEn: "Renewable Energy Adoption",
      descBn: "পুনর্ব্যবহারযোগ্য শক্তিকে (সৌর শক্তি) নিজেদের কাজ ও কৃষিতে ব্যবহার করা এবং পরিবেশবান্ধব সবুজ শক্তির ভারসাম্য রক্ষা করা।",
      descEn: "Utilizing renewable solar energy in daily activities and agricultural work to minimize reliance on fossil fuels.",
      icon: <Sun className="w-5 h-5 text-amber-700" />,
      bgIcon: "bg-amber-100"
    },
    {
      id: "p-4",
      titleBn: "সহায়ক শিক্ষা কেন্দ্র ও পরিবেশ সচেতনতা",
      titleEn: "Auxiliary Education & Nature Study",
      descBn: "শিশুদের জন্য সহায়ক শিক্ষা কেন্দ্র চালনা করা, যাতে পাঠদানের সাথে সাথে তারা প্রকৃতির অংশ হিসেবে নিজেকে চিনে নেয়, কৃষি পেশাকে শ্রদ্ধা করে এবং গ্রামকে ভালোবাসে।",
      descEn: "A supportive education center for children to learn alongside developing nature awareness, respecting agriculture, and loving rural heritage.",
      icon: <BookOpen className="w-5 h-5 text-emerald-700" />,
      bgIcon: "bg-emerald-100"
    }
  ];

  return (
    <div id="about-section" className="bg-[#faf7f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* Simple & Clean Header */}
        <div className="border-b border-stone-200/90 pb-6 space-y-2 max-w-3xl">
          {/* <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === "bn" ? "আমাদের পরিচিতি ও উদ্দেশ্য" : "About Jiyonkathi"}</span>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {language === "bn"
              ? "জিয়নকাঠি: একটি টেকসই জীবনযাপনের সমাজ"
              : "Jiyonkathi: A Sustainable Living Community"}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
            {siteData?.about?.intro || BENGALI_CONTENT.about.intro}
          </p>
        </div>

        {/* 4 Core Pillars / Mission Focus Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardItems.map((card) => (
            <div
              key={card.id}
              className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs space-y-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-11 h-11 ${card.bgIcon} rounded-2xl flex items-center justify-center`}>
                  {card.icon}
                </div>
                <h3 className="font-black text-stone-900 text-base leading-snug">
                  {language === "bn" ? card.titleBn : card.titleEn}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {language === "bn" ? card.descBn : card.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Authentic Photographic Field Archive */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {language === "bn" ? "মাঠের চিত্রশালা" : "Field Archive"}
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              {language === "bn" ? "জিয়নকাঠির বাস্তব ক্ষেত্র কার্যক্রম" : "Authentic Field Documentation"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/farming-collage.jpg"
                  alt="Indigenous Organic Farming Operations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "দেশীয় ধান ও বীজ সংরক্ষণ প্রক্রিয়া" : "Indigenous Paddy & Seed Processing"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "বীজতলা, নিড়ানো, ধান কাটা, ঢেঁকিতে প্রক্রিয়াজাতকরণ ও প্রজাতি সংরক্ষণ।"
                    : "Traditional seedbed management, zero-chemical weeding, and cultivar preservation."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/community-collage.jpg"
                  alt="Community Education & Cultural Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "সামাজিক শিক্ষা ও সাংস্কৃতিক মেলবন্ধন" : "Community Education & Festival"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "সহায়ক শিক্ষা কেন্দ্র, বসন্ত উৎসব, সর্প সচেতনতা ও স্বাস্থ্য শিবির।"
                    : "Auxiliary village education center, nature study, and local cultural gatherings."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs group">
              <div className="h-52 overflow-hidden bg-stone-100">
                <img
                  src="/images/ecology-collage.jpg"
                  alt="Ecology & Biodiversity Yield"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-black text-stone-900 text-sm">
                  {language === "bn" ? "বিষমুক্ত ফসল ও প্রাকৃতিক জীববৈচিত্র্য" : "Organic Produce & Biodiversity"}
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                  {language === "bn"
                    ? "বিষমুক্ত ফল, বীজ সংরক্ষণের কাঁচের বোতল, স্থানীয় মৎস্য ও বাস্তুতন্ত্র।"
                    : "Pesticide-free fruits, botanical glass preservation banks, and local ecology."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership / Collaboration Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5 text-amber-800">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider">
              {language === "bn" ? "সহযোগিতা ও প্রাতিষ্ঠানিক অংশীদারিত্ব" : "Institutional Partnership"}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {language === "bn" ? (
              <>
                বিগত দুই বছর ধরে এই কাজগুলি এবং দেশীয় বীজ সংরক্ষণের কাজ সম্পন্ন করার লক্ষ্যে জিয়নকাঠির পাশে এসে দাঁড়িয়েছে{" "}
                <strong className="text-amber-900">“দুর্গাপুর দক্ষিণবঙ্গীয় মানবিক প্রাকৃতিক বিকাশ সোসাইটি (DDBMPBS)”</strong>। যৌথ প্রচেষ্টায় জিয়নকাঠি ও DDBMPBS বৃহত্তর গ্রামীণ বিকাশ ও টেকসই পরিবেশ গড়ে তোলার লক্ষ্যে নিয়োজিত।
              </>
            ) : (
              <>
                For the past two years, <strong className="text-amber-900">&quot;Durgapur Dakshinbanga Manabik Prakritik Bikash Society (DDBMPBS)&quot;</strong> has partnered with Jiyonkathi to conserve indigenous seed varieties, promote chemical-free organic farming, and uplift rural youth education.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
