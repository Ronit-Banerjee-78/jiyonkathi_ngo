"use client";

import React, { createContext, useState, useEffect } from 'react';
import { GALLERY_ITEMS, WELFARE_PROJECTS, BENGALI_CONTENT, DEFAULT_VIDEOS, BLOGS } from '../data';
import { settingsService } from '../services/settingsService';

export const SiteContext = createContext();

const defaultSiteData = {
  general: {
    logoText: "Jiyonkathi",
    bannerHeading: "Transitioning to a Post-Petroleum World",
    bannerHeadingBengali: "মাটি, মানুষ ও প্রকৃতির টানে জিয়নকাঠির টেকসই পথচলা",
    bannerSubtitle: "Dedicated to pesticide-free organic farming, conserving 120+ indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.",
    bannerSubtitleBengali: "বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ১২০+ বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সমাজ।",
    quoteBengali: "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।",
    quoteEnglish: "In this era of extreme environmental crisis, facing global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi.",
    quoteAuthorBengali: "জিয়নকাঠির লক্ষ্য ও আদর্শ",
    quoteAuthorEnglish: "Goal & Ideology of Jiyonkathi",
    heroImage: "/images/paddy-harvesting.jpg",
    statSeeds: "১২০+",
    statYears: "১৩+",
    statFamilies: "৩৫০+",
    address: "প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান, পশ্চিমবঙ্গ",
    addressEnglish: "Pratappur, Aushgram, Purba Bardhaman, West Bengal, India",
    phone: "+91 94340 12345 / 98000 54321",
    email: "contact@jiyonkathi.org",
    googleMapsUrl: "https://maps.google.com",
    facebookUrl: "https://facebook.com",
  },
  homepageVideo: {
    title: DEFAULT_VIDEOS[0]?.title || "মাটির টানে, মানুষের সাথে জিয়নকাঠি",
    titleEnglish: DEFAULT_VIDEOS[0]?.titleEnglish || "Living with Nature: Jiyonkathi in Action",
    url: DEFAULT_VIDEOS[0]?.url || "/videos/sample.mp4",
    poster: "/images/paddy-harvesting.jpg",
    description: DEFAULT_VIDEOS[0]?.description || "আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে দেশীয় ধান চাষের প্রদর্শনী খামার, প্রাকৃতিক বীজতলা এবং গ্রামীণ শিশুদের সহায়ক শিক্ষা কেন্দ্রের প্রাত্যহিক মুহূর্ত।",
    descriptionEnglish: "A window into our decentralized ecological seedbed nursery, community learning center, and indigenous rice cultivation."
  },
  videos: DEFAULT_VIDEOS,
  about: {
    intro: BENGALI_CONTENT.about.intro,
    text: BENGALI_CONTENT.about.intro,
    principles: BENGALI_CONTENT.about.principles,
    educationCenter: BENGALI_CONTENT.about.educationCenter
  },
  mission: BENGALI_CONTENT.mission,
  members: [
    { id: 1, name: "Lorem Ipsum (Lead Conservator)", role: "Lead Farmer & Seed Conservator", bio: "Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image: "/images/paddy-planting.jpg" },
    { id: 2, name: "Amet Consectetur (Education Lead)", role: "Auxiliary Education Coordinator", bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", image: "/images/education-center.jpg" },
    { id: 3, name: "Adipiscing Elit (Ecology Lead)", role: "Sustainability & Ecological Energy Lead", bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", image: "/images/farming-collage.jpg" }
  ],
  volunteersList: [
    { id: "v-1", name: "Volunteer Alpha (Lorem Ipsum)", designation: "Auxiliary Education Volunteer Teacher", location: "Purba Bardhaman, WB", image: "/images/education-center.jpg", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.", isDdbmpbs: true },
    { id: "v-2", name: "Volunteer Beta (Dolor Sit)", designation: "Organic Farming & Soil Testing Volunteer", location: "Purba Bardhaman, WB", image: "/images/seedbed.jpg", bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.", isDdbmpbs: false },
    { id: "v-3", name: "Volunteer Gamma (Amet Consectetur)", designation: "Nature Awareness & Community Organizer", location: "Purba Bardhaman, WB", image: "/images/community-collage.jpg", bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.", isDdbmpbs: true },
    { id: "v-4", name: "Volunteer Delta (Adipiscing Elit)", designation: "Eco-farming & Bio-fertilizer Field Lead", location: "Purba Bardhaman, WB", image: "/images/paddy-harvesting.jpg", bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.", isDdbmpbs: false }
  ],
  gallery: [
    ...DEFAULT_VIDEOS.filter(v => v.showInGallery).map((v, i) => ({
      id: `vid-gal-${v.id}`,
      type: "Video",
      url: v.url,
      title: v.title,
      category: v.category || "campaigns",
      description: v.description
    })),
    ...GALLERY_ITEMS.map((item, idx) => ({ ...item, id: idx + 10 }))
  ],
  blogs: [
    ...DEFAULT_VIDEOS.filter(v => v.showInBlog).map((v, i) => ({
      id: `vid-blog-${v.id}`,
      type: "video",
      title: v.title,
      titleBengali: v.title,
      titleEnglish: v.titleEnglish || v.title,
      excerpt: v.description,
      excerptBengali: v.description,
      excerptEnglish: v.description,
      videoUrl: v.url,
      author: "Admin (Jiyonkathi Team)",
      date: v.date || "August 2026",
      category: "Video Documentary"
    })),
    ...BLOGS.map((b, i) => ({ ...b, id: i + 10, type: "article" }))
  ],
  work: WELFARE_PROJECTS.map((project, idx) => ({ ...project, id: project.id || idx + 1 }))
};

export const SiteProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('bn'); // 'bn' for Bengali, 'en' for English
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.fetchSettings();
        if (data && data.success && data.data && typeof data.data === 'object') {
          setSiteData((prev) => ({
            ...prev,
            ...data.data,
            general: { ...prev.general, ...(data.data.general || {}) },
            about: { ...prev.about, ...(data.data.about || {}) },
            members: Array.isArray(data.data.members) ? data.data.members : prev.members,
            volunteersList: Array.isArray(data.data.volunteersList) ? data.data.volunteersList : prev.volunteersList,
            gallery: Array.isArray(data.data.gallery) ? data.data.gallery : prev.gallery,
            blogs: Array.isArray(data.data.blogs) ? data.data.blogs : prev.blogs,
            work: Array.isArray(data.data.work) ? data.data.work : prev.work,
          }));
        }
      } catch (error) {
        console.warn("Using default site data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSiteData = async (newData) => {
    try {
      setSiteData(newData);
      await settingsService.saveSettings({ data: newData });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SiteContext.Provider value={{ siteData, setSiteData: saveSiteData, loading, language, setLanguage, toggleLanguage, selectedCampaign, setSelectedCampaign }}>
      {children}
    </SiteContext.Provider>
  );
};
