"use client";

import React, { useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { Mail, Phone, MapPin, CheckCircle2, Send, Facebook, Sparkles } from "lucide-react";

export default function ContactSection() {
  const { language } = useContext(SiteContext);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "general", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div id="contact-section" className="bg-stone-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Clean Header */}
        <div className="border-b border-stone-200 pb-6 text-center max-w-3xl mx-auto space-y-3">

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {language === "bn" ? "আমাদের সাথে সরাসরি যোগাযোগ করুন" : "Connect with Jiyonkathi"}
          </h1>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Map Preview */}
            <div className="rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-900 group relative">
              <img
                src="/images/jiyonkathi-map.jpg"
                alt="Jiyonkathi Satellite Location Map - Pratappur, Aushgram"
                className="w-full h-auto object-cover"
              />
              <div className="p-3 bg-stone-900 text-white flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-300">
                  {language === "bn" ? "মাঠের অবস্থান (প্রতাপপুর, আউশগ্রাম)" : "Location Map (Plot 1942, Pratappur)"}
                </span>
                <a
                  href="https://maps.app.goo.gl/7eJagTKxeWjGfzHf8"
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-300 hover:text-white underline text-xs font-medium"
                >
                  Google Maps &rarr;
                </a>
              </div>
            </div>

            {/* Farm Address Card */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {language === "bn" ? "মাঠ খামারের ঠিকানা" : "Farm Address"}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    <strong>Jiyonkathi (জিয়নকাঠি)</strong> <br />
                    Plot no. 1942, Village: Pratappur, P.O.- Pratappur <br />
                    PS: Aushgram, Dist: Purba Bardhaman, PIN: 713141
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 pt-3 border-t border-stone-100">
                <div className="p-2.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-md shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-orange-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {language === "bn" ? "মোবাইল ও যোগাযোগ" : "Phone & Helpline"}
                  </h3>
                  <p className="text-xs text-stone-700 font-semibold leading-relaxed mt-1">
                    +91 94340 12345 / +91 98000 54321
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 pt-3 border-t border-stone-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md shrink-0 mt-0.5">
                  <Facebook className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {language === "bn" ? "ফেসবুক পৃষ্ঠা" : "Social Media"}
                  </h3>
                  <a
                    href="https://www.facebook.com/jiyonkaathi"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 text-xs font-semibold hover:underline mt-0.5 inline-block"
                  >
                    facebook.com/jiyonkaathi &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {language === "bn" ? "বার্তা সফলভাবে পাঠানো হয়েছে!" : "Message Sent Successfully!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    {language === "bn"
                      ? "জিয়নকাঠিতে যোগাযোগ করার জন্য ধন্যবাদ। আমরা দ্রুত আপনার বার্তার উত্তর দেব।"
                      : "Thank you for reaching out to Jiyonkathi. We will get back to you shortly."}
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "general", message: "" });
                    }}
                    className="mt-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-5 py-2.5 rounded-md transition-colors"
                  >
                    {language === "bn" ? "নতুন বার্তা পাঠান" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-stone-900">
                      {language === "bn" ? "বার্তা পাঠান" : "Send Us a Message"}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === "bn" ? "ফর্মটি পূরণ করে আপনার প্রশ্ন বা মতামত জানান।" : "Fill out the fields below."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        {language === "bn" ? "আপনার নাম *" : "Your Name *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={language === "bn" ? "পূর্ণ নাম" : "Full Name"}
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        {language === "bn" ? "ইমেইল ঠিকানা *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      {language === "bn" ? "বিষয় *" : "Subject *"}
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                    >
                      <option value="general">{language === "bn" ? "সাধারণ জিজ্ঞাসা" : "General Inquiry"}</option>
                      <option value="seeds">{language === "bn" ? "দেশীয় ধান ও বীজ সংগ্রহ" : "Indigenous Seed Bank"}</option>
                      <option value="education">{language === "bn" ? "সহায়ক শিক্ষা কেন্দ্র" : "Auxiliary Education"}</option>
                      <option value="farm_visit">{language === "bn" ? "মাঠ খামার পরিদর্শন" : "Farm Field Visit"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      {language === "bn" ? "আপনার বার্তা *" : "Your Message *"}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={language === "bn" ? "আপনার বার্তা বিস্তারিত লিখুন..." : "Type your message here..."}
                      className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs sm:text-sm py-2.5 rounded-md shadow-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === "bn" ? "বার্তা প্রেরণ করুন" : "Send Message"}</span>
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
