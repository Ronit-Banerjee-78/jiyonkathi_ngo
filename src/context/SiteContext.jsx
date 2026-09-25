"use client";

import React, { createContext, useState, useEffect } from 'react';
import { GALLERY_ITEMS, WELFARE_PROJECTS, BENGALI_CONTENT, DEFAULT_VIDEOS, BLOGS } from '../data';
import { settingsService } from '../services/settingsService';

export const SiteContext = createContext();

const defaultSiteData = {
  general: {
    logoText: "Jiyonkathi",
    bannerHeading: "Transitioning to a Post-Petroleum World",
    bannerTitleBengali: "প্রাণ-প্রকৃতি-পরিবেশের আহ্বানে",
    bannerHighlightBengali: "জিয়নকাঠির সুস্থায়ী পথচলা",
    bannerHeadingBengali: "প্রাণ-প্রকৃতি-পরিবেশের আহ্বানে জিয়নকাঠির সুস্থায়ী পথচলা",
    bannerSubtitle: "Dedicated to pesticide-free organic farming, conserving 56 types of indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.",
    bannerSubtitleBengali: "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা।",
    quoteBengali: "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।",
    quoteEnglish: "In this era of extreme environmental crisis, facing global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi.",
    quoteAuthorBengali: "জিয়নকাঠির লক্ষ্য ও আদর্শ",
    quoteAuthorEnglish: "Goal & Ideology of Jiyonkathi",
    heroImage: "/images/paddy-harvesting.jpg",
    statSeeds: "৫৬ রকম",
    statYears: "১৩+",
    statFamilies: "৫০+",
    address: "প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান, পশ্চিমবঙ্গ",
    addressEnglish: "Pratappur, Aushgram, Purba Bardhaman, West Bengal, India",
    phone: "+91 94340 12345 / 98000 54321",
    email: "contact@jiyonkathi.org",
    googleMapsUrl: "https://maps.google.com",
    facebookUrl: "https://facebook.com",
  },
  pillars: [
    {
      id: "pillar-1",
      number: "০১",
      titleBn: "পরিবেশ সংকটকালে, একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করা",
      titleEn: "Building a Sustainable Rural Platform in Environmental Crisis",
      taglineBn: "রাসায়নিক সার-কীটনাশকহীন চাষাবাদ, ভূগর্ভস্থ জল সুরক্ষা এবং পুনর্ব্যবহারযোগ্য শক্তির প্রয়োগ।",
      taglineEn: "Chemical-free agro-ecology, groundwater preservation, and renewable energy adoption.",
      descBn: "পরিবেশ সংকটকালে একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করার মাধ্যমে প্রকৃতিবান্ধব কৃষি, ফল-সব্জির বিষমুক্ত চাষ ও খাদ্য নিরাপত্তা নিশ্চিত করা।",
      descEn: "Creating an ecologically sustainable rural platform to foster regenerative farming and chemical-free food security.",
      icon: "Leaf",
      colorTheme: "amber",
      topics: [
        {
          id: "p1-t1",
          number: "১",
          titleBn: "দেশীয় প্রজাতির দানাশস্য (মূলত ধান), সব্জী (যতটা সম্ভব) চাষ করা, এবং সেই কাজে-",
          titleEn: "Cultivating indigenous crops (chiefly paddy) and vegetables to the utmost extent:",
          subPoints: [
            "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা।",
            "মাটির তলার জল না তোলা।",
            "যতটা সম্ভব কম জীবাশ্ম জ্বালানী ব্যবহার করা।"
          ],
          subPointsEn: [
            "Complete avoidance of synthetic fertilizers and chemical pesticides.",
            "Zero extraction of underground water; relying on rain and surface water.",
            "Minimizing fossil fuel consumption."
          ]
        },
        {
          id: "p1-t2",
          number: "২",
          titleBn: "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা।",
          titleEn: "Utilizing renewable energy for daily and farming workflows.",
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p1-t3",
          number: "৩",
          titleBn: "ফল-সব্জির বিষমুক্ত চাষ",
          titleEn: "Chemical-free horticulture and natural food security.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা",
        "মাটির তলার জল না তোলা",
        "যতটা সম্ভব কম জীবাশ্ম জ্বালানী ব্যবহার করা",
        "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা",
        "ফল-সব্জির বিষমুক্ত চাষ"
      ],
      methodologyBn: "১. বৃষ্টির জল নির্ভর দেশীয় ধানের বীজতলা তৈরি ও জৈব সার প্রয়োগ।\n২. মাটির জৈব কার্বন বৃদ্ধি ও সৌরশক্তি চালিত মৃদু সেচ।\n৩. বহুমুখী বিষমুক্ত মাচায় সবজি ও দেশীয় ফলের বাগান সম্প্রসারণ।",
      linkedReportId: "rep-1"
    },
    {
      id: "pillar-2",
      number: "০২",
      titleBn: "DDMPBS সোসাইটির সহায়তায়, শহর এবং গ্রামের একসাথে প্রস্তুত হওয়ার কার্যকরী প্রচেষ্টা",
      titleEn: "Collaborative Rural-Urban Action Supported by DDMPBS Society",
      taglineBn: "বিলুপ্তপ্রায় দেশীয় বীজ সংরক্ষণ, পল্লী শিশুদের সহায়ক শিক্ষা এবং গ্রামীণ স্বাস্থ্য সচেতনতা।",
      taglineEn: "Preserving heirloom seed varieties, rural children's auxiliary education, and health camps.",
      descBn: "DDMPBS সোসাইটির সহযোগিতায় শহর ও গ্রামীণ সমাজের যৌথ সংহতি, দেশীয় প্রজাতির বীজ সংরক্ষণ ও শিশু শিক্ষার সহায়ক কার্যক্রম।",
      descEn: "Fostering solidarity between urban and agrarian communities, indigenous seed banking, and child education.",
      icon: "Users",
      colorTheme: "orange",
      topics: [
        {
          id: "p2-t1",
          number: "১",
          titleBn: "দেশীয় প্রজাতির দানাশস্য (ধান, রাগী, শ্যামা ধান, দেশী মুগ ডাল, ইত্যাদি) এবং সব্জীর (যতটা সম্ভব) বীজ সংরক্ষণ করা।",
          titleEn: "Preserving seeds of indigenous food grains (rice, ragi, shyama rice, desi moong dal, etc.) and vegetables.",
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p2-t2",
          number: "২",
          titleBn: "সহায়ক শিক্ষাকেন্দ্র",
          titleEn: "Auxiliary Education Center",
          descriptionBn: "পল্লী অঞ্চলের শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয়, নীতিশিক্ষা এবং ব্যবহারিক কারুশিল্প প্রশিক্ষণ",
          descriptionEn: "Training rural children in folk culture, nature study, moral ethics, and practical handicrafts.",
          subPoints: [],
          subPointsEn: []
        },
        {
          id: "p2-t3",
          number: "৩",
          titleBn: "স্বাস্থ্য সচেতনতা শিবির, সর্প সচেতনতা শিবির, গ্রামের কৃষিজীবী মানুষজনের সাথে যোগাযোগ বাড়ানো, সাংস্কৃতিক অনুষ্ঠান, ইত্যাদি আয়োজন করা।",
          titleEn: "Organizing free health checkups, snakebite awareness camps, agrarian community dialogues, and cultural events.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "দেশীয় প্রজাতির দানাশস্য ও সব্জীর বীজ সংরক্ষণ",
        "পল্লী শিশুদের লোকসংস্কৃতি, প্রকৃতি পরিচয় ও কারুশিল্প শিক্ষা",
        "নিয়মিত স্বাস্থ্য ও সর্প সচেতনতা শিবির পরিচালনা",
        "কৃষিজীবী মানুষের সাথে নিবিড় মানবিক যোগ ও সংস্কৃতি চর্চা"
      ],
      methodologyBn: "১. দেশীয় ধানের জিন ব্যাংক ও বীজ বিনিময় কেন্দ্র পরিচালনা।\n২. গ্রামীণ শিশুদের জন্য মুক্ত পাঠশালা ও ব্যবহারিক শিল্পশালা।\n৩. চিকিৎসক ও বিশেষজ্ঞ সহযোগে গ্রামভিত্তিক স্বাস্থ্য ও সর্প সচেতনতা শিবির।",
      linkedReportId: "rep-2"
    }
  ],
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

export const DEFAULT_RESEARCH_REPORTS = [
  {
    id: "rep-1",
    title: "দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ অন্বেষণ প্রতিবেদন (২০১৩-২০২৬)",
    titleEnglish: "Indigenous Rice Cultivars & Seed Conservation Field Report (2013-2026)",
    topic: "বীজ সংরক্ষণ ও দেশীয় ধান",
    topicEnglish: "Seed Conservation & Indigenous Crops",
    author: "জিয়নকাঠি কৃষি অন্বেষণ দল",
    publishedDate: "২০২৬-০৮-১৫",
    summary: "১২০টিরও বেশি বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতির ফলন বিশ্লেষণ, রাসায়নিক সার ও কীটনাশক ব্যতিরেকে প্রাকৃতিক পুষ্টি ব্যবস্থাপনা এবং ভূগর্ভস্থ জল অপচয় রোধের বিস্তারিত ফলাফল।",
    summaryEnglish: "A comprehensive analysis of preserving 56+ heirloom paddy varieties without synthetic chemicals, preventing groundwater depletion, and field seed-exchange dynamics.",
    image: "/images/farming-collage.jpg",
    embeddedImages: [
      "/images/seedbed.jpg",
      "/images/paddy-planting.jpg",
      "/images/ripening-paddy.jpg",
      "/images/paddy-harvesting.jpg",
    ],
    views: 148,
  },
  {
    id: "rep-2",
    title: "বসতভিটায় সারাবছর বিষমুক্ত ফল ও সবজি চাষ পদ্ধতি এবং খাদ্য নিরাপত্তা",
    titleEnglish: "Homestead Organic Fruit & Vegetable Food Security Framework",
    topic: "সবজি ও ফল চাষ (খাদ্য নিরাপত্তা)",
    topicEnglish: "Food Security & Fruit/Vegetable Farming",
    author: "জিয়নকাঠি উদ্যানপালন ইউনিট",
    publishedDate: "২০২৬-০৮-১০",
    summary: "মাচা ভিত্তিক লতানো সবজি, দেশীয় বহুস্তরীয় ফলের বাগান এবং দশপর্ণী অর্ক বালাইনাশক ব্যবহারের ব্যবহারিক ক্ষেত্র পর্যালোচনা।",
    summaryEnglish: "A dedicated research methodology detailing multi-tier fruit orchards, trellis organic vegetable cultivation, bio-pest repellents, and family nutrition security.",
    image: "/images/ecology-collage.jpg",
    embeddedImages: [
      "/images/farming-collage.jpg",
      "/images/community-collage.jpg",
      "/images/img30.jpg",
    ],
    views: 204,
  },
  {
    id: "rep-3",
    title: "বীরভূম ও বর্ধমানের প্রান্তিক কৃষকদের সাথে সহযোগিতামূলক টেকসই কৃষি রূপরেখা",
    titleEnglish: "Smallholder Sustainable Agriculture in Birbhum & Burdwan (with DDBMPBS)",
    topic: "টেকসই কৃষি ও সম্প্রদায় সংহতি",
    topicEnglish: "Sustainable Agriculture & Community Solidarity",
    author: "গ্রামীণ সমন্বয় পরিষদ (DDBMPBS সহযোগে)",
    publishedDate: "২০২৬-০৮-০৫",
    summary: "স্থানীয় কৃষক পরিবারের সাথে সমন্বিতভাবে কীটনাশকমুক্ত ফসল উৎপাদন, দেশীয় বীজ বিনিময় ও কৃষকদের অর্থনৈতিক স্বাবলম্বিতা অর্জনের বাস্তব তথ্য।",
    summaryEnglish: "Empirical field collaboration with smallholder agrarian households in Purba Bardhaman and Birbhum, advancing non-chemical techniques and seed autonomy.",
    image: "/images/paddy-planting.jpg",
    embeddedImages: [
      "/images/paddy-harvesting.jpg",
      "/images/seedbed.jpg",
      "/images/78.jpg",
    ],
    views: 165,
  },
  {
    id: "rep-4",
    title: "সহায়ক শিক্ষা কেন্দ্র ও গ্রামীণ শিশু প্রকৃতি পাঠ পর্যালোচনা",
    titleEnglish: "Study on Rural Auxiliary Education & Environmental Nature Literacy",
    topic: "সহায়ক শিক্ষা ও প্রকৃতি পাঠ",
    topicEnglish: "Auxiliary Education & Nature Literacy",
    author: "শিক্ষা ও সমাজ কল্যাণ শাখা, জিয়নকাঠি",
    publishedDate: "২০২৬-০৮-০১",
    summary: "গ্রামীণ শিশুদের জন্য বিনামূল্যে সহায়ক পাঠদান, প্রকৃতি পরিচয়, লোকসংস্কৃতি চর্চা ও সর্প সচেতনতার শিক্ষামূলক প্রভাব ও সামাজিক অগ্রগতি।",
    summaryEnglish: "Evaluating the community impact of free remedial schooling, nature excursions, snakebite awareness, and folk traditions for village children.",
    image: "/images/education-center.jpg",
    embeddedImages: [
      "/images/community-collage.jpg",
      "/images/img33.jpg",
      "/images/education-center.jpg",
    ],
    views: 96,
  },
  {
    id: "rep-5",
    title: "সর্প সচেতনতা ও গ্রামীণ স্বাস্থ্য শিবির প্রতিবেদন",
    titleEnglish: "Field Report: Snakebite Awareness, First Aid & Preventive Rural Healthcare",
    topic: "গ্রামীণ স্বাস্থ্য ও সর্প সচেতনতা",
    topicEnglish: "Rural Health & Snakebite Mitigation",
    author: "চিকিৎসা বিশেষজ্ঞ ও স্বেচ্ছাসেবক দল (DDBMPBS সহযোগে)",
    publishedDate: "২০২৬-০৭-২০",
    summary: "সর্পদংশন প্রতিরোধে বিজ্ঞানসম্মত প্রাথমিক চিকিৎসা প্রশিক্ষণ, ওঝা-তান্ত্রিক নির্ভরতা দূরীকরণ এবং প্রান্তিক মানুষের মাঝে বিনামূল্যে চিকিৎসা পরিষেবা।",
    summaryEnglish: "A comprehensive report on empirical snakebite first aid training, countering unscientific quackery, and delivering free medical checkups in rural Bengal.",
    image: "/images/health-camp.jpg",
    embeddedImages: [
      "/images/community-collage.jpg",
      "/images/education-center.jpg",
      "/images/health-camp.jpg",
    ],
    views: 112,
  },
  {
    id: "rep-6",
    title: "কৃষিকাজে পুনর্ব্যবহারযোগ্য শক্তি ও সৌর সেচ ব্যবস্থাপনা প্রতিবেদন",
    titleEnglish: "Renewable Energy & Solar Irrigation Management in Rural Agriculture",
    topic: "পুনর্ব্যবহারযোগ্য শক্তি ও পরিবেশ",
    topicEnglish: "Renewable Energy & Ecology",
    author: "পরিবেশ ও প্রযুক্তি দল, জিয়নকাঠি",
    publishedDate: "২০২৬-০৭-১০",
    summary: "মাটির গভীরের জল না তুলে প্রাকৃতিক পুকুর ও বৃষ্টির জল সৌরচালিত মৃদু পাম্পের সাহায্যে সেচে ব্যবহারের মাধ্যমে ভূগর্ভস্থ জলস্তর সুরক্ষা ও জীবাশ্ম জ্বালানি বর্জনের ক্ষেত্র সমীক্ষা।",
    summaryEnglish: "Field research on deploying solar micro-pumps with rainwater catchment ponds, preventing groundwater depletion, and eliminating diesel fuel dependence in agriculture.",
    image: "/images/community-collage.jpg",
    embeddedImages: [
      "/images/farming-collage.jpg",
      "/images/ripening-paddy.jpg",
      "/images/community-collage.jpg",
    ],
    views: 88,
  }
];

export const SiteProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('bn'); // 'bn' for Bengali, 'en' for English
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [reports, setReports] = useState(DEFAULT_RESEARCH_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedPillarId, setSelectedPillarId] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(true);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const refreshReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success && Array.isArray(json.reports) && json.reports.length > 0) {
        setReports(json.reports);
      }
    } catch (e) {
      console.warn("Could not fetch reports from /api/reports, using defaults:", e.message);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    refreshReports();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.fetchSettings();
        if (data && data.success && data.data && typeof data.data === 'object') {
          setSiteData((prev) => {
            const loadedGeneral = { ...prev.general, ...(data.data.general || {}) };
            if (loadedGeneral.bannerTitleBengali?.includes("টানে")) {
              loadedGeneral.bannerTitleBengali = loadedGeneral.bannerTitleBengali.replace(/টানে/g, "আহ্বানে");
            }
            if (loadedGeneral.bannerHeadingBengali?.includes("টানে")) {
              loadedGeneral.bannerHeadingBengali = loadedGeneral.bannerHeadingBengali.replace(/টানে/g, "আহ্বানে");
            }
            if (
              loadedGeneral.bannerSubtitleBengali?.includes("বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে") ||
              loadedGeneral.bannerSubtitleBengali?.includes("সমাজ")
            ) {
              loadedGeneral.bannerSubtitleBengali = "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা।";
            }
            if (loadedGeneral.statFamilies === "৩৫০+") {
              loadedGeneral.statFamilies = "৫০+";
            }

            let loadedPillars = Array.isArray(data.data.pillars) &&
              data.data.pillars.length === 2 &&
              data.data.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে")
                ? data.data.pillars.slice(0, 2)
                : defaultSiteData.pillars.slice(0, 2);

            loadedPillars = JSON.parse(
              JSON.stringify(loadedPillars)
                .replace(/যতটা কম সম্ভব/g, "যতটা সম্ভব কম")
                .replace(/বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা/g, "ফল-সব্জির বিষমুক্ত চাষ")
            );

            return {
              ...prev,
              ...data.data,
              general: loadedGeneral,
              about: { ...prev.about, ...(data.data.about || {}) },
              pillars: loadedPillars,
              homepageVideo: data.data.homepageVideo ? { ...prev.homepageVideo, ...data.data.homepageVideo } : prev.homepageVideo,
              members: Array.isArray(data.data.members) ? data.data.members : prev.members,
              volunteersList: Array.isArray(data.data.volunteersList) ? data.data.volunteersList : prev.volunteersList,
              gallery: Array.isArray(data.data.gallery) ? data.data.gallery : prev.gallery,
              blogs: Array.isArray(data.data.blogs) ? data.data.blogs : prev.blogs,
              work: Array.isArray(data.data.work) ? data.data.work : prev.work,
            };
          });
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
      const sanitized = {
        ...newData,
        pillars: (Array.isArray(newData?.pillars) && newData.pillars.length === 2 && newData.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে"))
          ? newData.pillars.slice(0, 2)
          : defaultSiteData.pillars.slice(0, 2),
      };
      setSiteData(sanitized);
      await settingsService.saveSettings({ data: sanitized });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
        setSiteData: saveSiteData,
        loading,
        language,
        setLanguage,
        toggleLanguage,
        selectedCampaign,
        setSelectedCampaign,
        reports,
        setReports,
        refreshReports,
        reportsLoading,
        selectedReportId,
        setSelectedReportId,
        selectedPillarId,
        setSelectedPillarId
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
