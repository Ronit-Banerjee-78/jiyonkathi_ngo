"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { motion } from "motion/react";
import {
  Users,
  Sparkles,
  CheckCircle2,
  Send,
  MapPin,
  Calendar,
  BookOpen,
  Leaf,
  Shield,
  HeartHandshake,
  UserCheck
} from "lucide-react";

export default function VolunteerSection() {
  const { language } = useContext(SiteContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "Indigenous Farming & Seed Conservation",
    location: "",
    availability: "Weekends",
    skills: "",
    motivation: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit volunteer form. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting volunteer application:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="volunteer-section" className="bg-[#faf7f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Simple & Clean Header */}
        <div className="border-b border-stone-200/90 pb-6 space-y-2 max-w-3xl">
          {/* <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === "bn" ? "সামাজিক সংহতি ও অংশগ্রহণ" : "Community & Volunteering"}</span>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {language === "bn" ? "স্বেচ্ছাসেবী হিসেবে যুক্ত হোন" : "Join as a Volunteer"}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
            {language === "bn"
              ? "জিয়নকাঠির সাথে যুক্ত হয়ে গ্রামজীবনের ছন্দ, দেশীয় বীজ সংরক্ষণ, সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতিবান্ধব কৃষিতে ভূমিকা রাখুন।"
              : "Work alongside local cultivators, researchers, and village children in Ausgram and Birbhum."}
          </p>
        </div>

        {/* Main Content Form + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {language === "bn" ? "কেন জিয়নকাঠিতে যুক্ত হবেন?" : "Why Volunteer With Us?"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-stone-900">
                      {language === "bn" ? "দেশীয় বীজ ও কৃষি রক্ষা" : "Preserve Heirloom Seeds"}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                      {language === "bn" ? "১২০+ প্রজাতির ধান ও সবজির জৈব চাষাবাদে প্রত্যক্ষ অবদান।" : "Hands-on participation in chemical-free heirloom rice seedbeds."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-stone-900">
                      {language === "bn" ? "সহায়ক শিক্ষা কেন্দ্র" : "Village Education Center"}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                      {language === "bn" ? "গ্রামীণ শিশুদের প্রকৃতি পাঠ ও বিকল্প শিক্ষাদানে সহযোগিতা।" : "Nurturing rural children through nature-grounded creative lessons."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-orange-100 text-orange-800 rounded-xl shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-stone-900">
                      {language === "bn" ? "সামাজিক সম্মান ও সার্টিফিকেট" : "Recognition & Community"}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                      {language === "bn" ? "সদস্য তালিকায় নাম অন্তর্ভুক্তি ও জিয়নকাঠি স্বীকৃতি সনদপত্র।" : "Official community listing and certified participation credentials."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Station Location snapshot */}
            <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 text-xs font-black">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>{language === "bn" ? "মাঠের অবস্থান ও যোগাযোগ" : "Field Location"}</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {language === "bn"
                  ? "আউশগ্রাম ও বীরভূম জেলা, পশ্চিমবঙ্গ। প্রতি শনি ও রবিবার উন্মুক্ত মাঠ কর্মশালা।"
                  : "Ausgram & Birbhum District, West Bengal. Open field workshops every weekend."}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-10 rounded-3xl border border-stone-200 shadow-2xs">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {language === "bn" ? "আবেদন সফলভাবে গৃহীত হয়েছে!" : "Application Submitted Successfully!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto leading-relaxed">
                    {language === "bn"
                      ? "জিয়নকাঠির সাথে যুক্ত হতে আগ্রহ প্রকাশের জন্য ধন্যবাদ। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।"
                      : "Thank you for your dedication to agro-ecology and nature education. Our team will review your application shortly."}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        program: "Indigenous Farming & Seed Conservation",
                        location: "",
                        availability: "Weekends",
                        skills: "",
                        motivation: ""
                      });
                    }}
                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                  >
                    {language === "bn" ? "আরেকটি আবেদন করুন" : "Submit Another Application"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-stone-900">
                      {language === "bn" ? "স্বেচ্ছাসেবী আবেদন পত্র" : "Volunteer Application Form"}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {language === "bn" ? "সকল তথ্য সঠিকভাবে পূরণ করুন।" : "Please fill out the form below."}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "পূর্ণ নাম *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={language === "bn" ? "আপনার নাম" : "Your name"}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "ফোন নম্বর *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "ইমেইল ঠিকানা *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "আপনার অবস্থান / জেলা *" : "Location / District *"}
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder={language === "bn" ? "বর্ধমান / বীরভূম / কলকাতা" : "Burdwan / Birbhum"}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "আগ্রহের ক্ষেত্র *" : "Interested Program *"}
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      >
                        <option value="Indigenous Farming & Seed Conservation">
                          {language === "bn" ? "দেশীয় বীজ ও জৈব কৃষি" : "Indigenous Farming & Seed Conservation"}
                        </option>
                        <option value="Auxiliary Education for Rural Children">
                          {language === "bn" ? "সহায়ক শিক্ষা কেন্দ্র" : "Auxiliary Education for Rural Children"}
                        </option>
                        <option value="Homestead Food Security & Fruit Orchard">
                          {language === "bn" ? "বসতভিটায় খাদ্য নিরাপত্তা ও ফল বাগান" : "Homestead Food Security"}
                        </option>
                        <option value="Renewable Energy & Solar Awareness">
                          {language === "bn" ? "সৌরশক্তি ও পরিবেশ সচেতনতা" : "Renewable Energy Awareness"}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {language === "bn" ? "সময় প্রাপ্যতা *" : "Availability *"}
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                      >
                        <option value="Weekends">{language === "bn" ? "সপ্তাহান্তে (শনি ও রবি)" : "Weekends"}</option>
                        <option value="Flexible">{language === "bn" ? "প্রয়োজনমতো সময়" : "Flexible Days"}</option>
                        <option value="Full Time Field Work">{language === "bn" ? "পূর্ণকালীন মাঠ কার্যক্রম" : "Full Time Field Work"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {language === "bn" ? "আপনার দক্ষতা বা আগ্রহ" : "Skills or Experience"}
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder={language === "bn" ? "যেমন: শিক্ষকতা, আলোকচিত্র, কৃষি বা সমাজকর্ম" : "e.g., teaching, photography, agriculture"}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {language === "bn" ? "কেন জিয়নকাঠির সাথে কাজ করতে চান? *" : "Motivation / Message *"}
                    </label>
                    <textarea
                      name="motivation"
                      required
                      rows={3}
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder={language === "bn" ? "সংক্ষেপে আপনার উদ্দেশ্য লিখুন..." : "Briefly tell us why you want to volunteer..."}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>{language === "bn" ? "জমা দেওয়া হচ্ছে..." : "Submitting..."}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{language === "bn" ? "আবেদন পত্র জমা দিন" : "Submit Volunteer Application"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
