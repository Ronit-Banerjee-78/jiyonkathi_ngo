/**
 * Jiyonkathi Database Static Assets & Initial Seeding Map
 * This file contains all static site assets, reports, gallery images, pillars,
 * and demo datasets configured to be uploaded automatically to Postgres/Cloud SQL/Firebase
 * whenever a database connection is established.
 */

export const STATIC_IMAGES_MANIFEST = [
  {
    filename: "banner.png",
    path: "/images/banner.png",
    category: "branding",
    description: "Jiyonkathi Primary Banner (Transitioning to a Post-Petroleum World)"
  },
  {
    filename: "logo.svg",
    path: "/images/logo.svg",
    category: "branding",
    description: "Jiyonkathi Official Emblem Vector"
  },
  {
    filename: "globe-logo.png",
    path: "/images/globe-logo.png",
    category: "branding",
    description: "Jiyonkathi Globe Ecological Logo"
  },
  {
    filename: "farming-collage.jpg",
    path: "/images/farming-collage.jpg",
    category: "farming",
    description: "Indigenous Paddy Cultivation & Heirloom Seedbed Nursery"
  },
  {
    filename: "community-collage.jpg",
    path: "/images/community-collage.jpg",
    category: "community",
    description: "Basanta Utsav, Cultural Gatherings & Village Community"
  },
  {
    filename: "ecology-collage.jpg",
    path: "/images/ecology-collage.jpg",
    category: "ecology",
    description: "Zero-Chemical Organic Crop Yield & Biodiversity"
  },
  {
    filename: "education-center.jpg",
    path: "/images/education-center.jpg",
    category: "education",
    description: "Rural Auxiliary Education Center & Nature Learning"
  },
  {
    filename: "health-camp.jpg",
    path: "/images/health-camp.jpg",
    category: "health",
    description: "Free Health Checkup, Snakebite & Medical Awareness Camps"
  },
  {
    filename: "jiyonkathi-map.jpg",
    path: "/images/jiyonkathi-map.jpg",
    category: "location",
    description: "Field Station Map: Plot 1942, Pratappur, Aushgram, Purba Bardhaman"
  },
  {
    filename: "seedbed.jpg",
    path: "/images/seedbed.jpg",
    category: "farming",
    description: "Decentralized Rainfed Paddy Seedbeds"
  },
  {
    filename: "paddy-planting.jpg",
    path: "/images/paddy-planting.jpg",
    category: "farming",
    description: "Indigenous Rice Transplanting without Chemical Fertilizers"
  },
  {
    filename: "paddy-harvesting.jpg",
    path: "/images/paddy-harvesting.jpg",
    category: "farming",
    description: "Heirloom Rice Harvesting & Sustainable Threshing"
  },
  {
    filename: "ripening-paddy.jpg",
    path: "/images/ripening-paddy.jpg",
    category: "farming",
    description: "Golden Ripening Heirloom Paddy Varieties"
  },
  {
    filename: "78.jpg",
    path: "/images/78.jpg",
    category: "archive",
    description: "Field Research & Agro-ecology Documentation"
  },
  {
    filename: "img30.jpg",
    path: "/images/img30.jpg",
    category: "archive",
    description: "Village Community Workshop Documentation"
  },
  {
    filename: "img33.jpg",
    path: "/images/img33.jpg",
    category: "archive",
    description: "Biodiversity & Soil Health Field Inspection"
  }
];

export const DB_SEED_PACK = {
  general: {
    title: "জিয়নকাঠি (Jiyonkathi)",
    subTitle: "A Sustainable Living Community • Transitioning to a Post-Petroleum World",
    logoText: "Jiyonkathi",
    bannerHeading: "Transitioning to a Post-Petroleum World",
    bannerHeadingBengali: "মাটি, মানুষ ও প্রকৃতির টানে জিয়নকাঠির টেকসই পথচলা",
    bannerSubtitle: "Dedicated to pesticide-free organic farming, conserving 120+ indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.",
    bannerSubtitleBengali: "বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ১২০+ বিলুপ্তপ্রায় দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সমাজ।",
    quoteBengali: "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।",
    quoteEnglish: "In this era of extreme environmental crisis, facing global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi.",
    quoteAuthorBengali: "জিয়নকাঠির লক্ষ্য ও আদর্শ",
    quoteAuthorEnglish: "Goal & Ideology of Jiyonkathi",
    statSeeds: "১২০+",
    statYears: "১৩+",
    statFamilies: "৩৫০+",
    address: "প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান, পিন: ৭১৩১৪",
    addressEnglish: "Plot No. 1942, Village & P.O. Pratappur, P.S. Aushgram, Dist. Purba Bardhaman, PIN: 713141, West Bengal, India",
    phone: "+91 94000 00000",
    email: "contact@jiyonkathi.org",
    googleMapsUrl: "https://maps.app.goo.gl/7eJagTKxeWjGfzHf8",
    facebookUrl: "https://www.facebook.com/jiyonkaathi",
  },
  homepageVideo: {
    title: "মাটির টানে, মানুষের সাথে জিয়নকাঠি",
    titleEnglish: "Living with Nature: Jiyonkathi in Action",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "/images/paddy-harvesting.jpg",
    description: "আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে দেশীয় ধান চাষের প্রদর্শনী খামার, প্রাকৃতিক বীজতলা এবং গ্রামীণ শিশুদের সহায়ক শিক্ষা কেন্দ্রের প্রাত্যহিক মুহূর্ত।",
    descriptionEnglish: "A window into our decentralized ecological seedbed nursery, community learning center, and indigenous rice cultivation in Bengal."
  },
  members: [
    { id: 1, name: "Lorem Ipsum (Lead Conservator)", role: "Lead Farmer & Seed Conservator", bio: "Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image: "/images/paddy-planting.jpg", rank: 1 },
    { id: 2, name: "Amet Consectetur (Education Lead)", role: "Auxiliary Education Coordinator", bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", image: "/images/education-center.jpg", rank: 2 },
    { id: 3, name: "Adipiscing Elit (Ecology Lead)", role: "Sustainability & Ecological Energy Lead", bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", image: "/images/farming-collage.jpg", rank: 3 }
  ],
  volunteersList: [
    { id: "v-1", name: "Volunteer Alpha (Lorem Ipsum)", designation: "Auxiliary Education Volunteer Teacher", location: "Purba Bardhaman, WB", image: "/images/education-center.jpg", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.", isDdbmpbs: true, rank: 1 },
    { id: "v-2", name: "Volunteer Beta (Dolor Sit)", designation: "Organic Farming & Soil Testing Volunteer", location: "Purba Bardhaman, WB", image: "/images/seedbed.jpg", bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.", isDdbmpbs: false, rank: 2 },
    { id: "v-3", name: "Volunteer Gamma (Amet Consectetur)", designation: "Nature Awareness & Community Organizer", location: "Purba Bardhaman, WB", image: "/images/community-collage.jpg", bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.", isDdbmpbs: true, rank: 3 },
    { id: "v-4", name: "Volunteer Delta (Adipiscing Elit)", designation: "Eco-farming & Bio-fertilizer Field Lead", location: "Purba Bardhaman, WB", image: "/images/paddy-harvesting.jpg", bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.", isDdbmpbs: false, rank: 4 }
  ],
  pillars: [
    {
      id: "pillar-1",
      number: "০১",
      letter: "ক",
      titleBn: "দেশীয় প্রজাতির দানাশস্য ও বীজ সংরক্ষণ",
      titleEn: "Indigenous Seed & Crop Conservation",
      taglineBn: "রাসায়নিক সার ও কীটনাশক মুক্ত উপায়ে ১২০+ দেশীয় ধানের প্রজাতি সংরক্ষণ।",
      taglineEn: "Heirloom paddy conservation with zero chemical pesticides and groundwater safety.",
      methodology: "১. রাসায়নিক সার ও কীটনাশক একেবারেই ব্যবহার না করা।\n২. মাটির নিচের জল না তোলা, বৃষ্টির জল সংরক্ষণ।\n৩. জীবাশ্ম জ্বালানির ব্যবহার ন্যূনতম পর্যায়ে রাখা।",
      impact: "১২০+ দেশীয় ধান জাত ও বীজ সংরক্ষিত",
      icon: "Leaf",
      image: "/images/farming-collage.jpg"
    },
    {
      id: "pillar-2",
      number: "০২",
      letter: "খ",
      titleBn: "কৃষিজীবী মানুষের সাথে নিবিড় যোগ ও জ্ঞান বিনিময়",
      titleEn: "Community Farmer Engagement & Dialogue",
      taglineBn: "অভিজ্ঞ কৃষকদের ঐতিহ্যবাহী লোকায়ত জ্ঞান ও আধুনিক জীবপ্রযুক্তির মিলনমেলা।",
      taglineEn: "Fostering mutual exchange of traditional agro-ecological wisdom.",
      methodology: "গ্রামের কৃষিজীবী মানুষদের সাথে যোগাযোগ ও মতামতের আদান-প্রদান, যাতে তারা পরিবেশের ভারসাম্য বজায় রেখে নিজেদের কাজ চালিয়ে যেতে পারেন।",
      impact: "৩৫০+ গ্রামীণ কৃষক পরিবার সম্পৃক্ত",
      icon: "Users",
      image: "/images/community-collage.jpg"
    },
    {
      id: "pillar-3",
      number: "০৩",
      letter: "গ",
      titleBn: "পুনর্ব্যবহারযোগ্য শক্তির প্রয়োগ ও খাদ্য নিরাপত্তা",
      titleEn: "Renewable Energy & Homestead Nutrition",
      taglineBn: "সৌরশক্তি ব্যবহার, প্রাকৃতিক আলো-বাতাস ও পোস্ট-পেট্রোলিয়াম রূপান্তর।",
      taglineEn: "Solar technologies and integrated food security.",
      methodology: "পুনর্ব্যবহারযোগ্য শক্তিকে নিজেদের কাজে ব্যবহার করা এবং পরিবেশবান্ধব শক্তির ভারসাম্য রক্ষা করা। বসতভিটায় বিষমুক্ত ফল চাষ।",
      impact: "১০০% সৌরশক্তি নির্ভর ফিল্ড স্টেশন",
      icon: "Zap",
      image: "/images/ecology-collage.jpg"
    },
    {
      id: "pillar-4",
      number: "০৪",
      letter: "ঘ",
      titleBn: "সহায়ক শিক্ষা কেন্দ্র, স্বাস্থ্য ও সর্প সচেতনতা",
      titleEn: "Auxiliary Education, Health & Snake Safety",
      taglineBn: "গ্রামীণ শিশুদের প্রকৃতি পাঠ ও DDBMPBS সহযোগে বিশেষজ্ঞ স্বাস্থ্য শিবির।",
      taglineEn: "Nature-grounded rural education and community health.",
      methodology: "একটি সহায়ক শিক্ষা কেন্দ্র চালু রাখা। বিশেষজ্ঞ পরিচালিত স্বাস্থ্য শিবির ও সর্প সচেতনতা শিবির নিয়মিত পরিচালনা।",
      impact: "১২০০+ শিশু ও গ্রামবাসী উপকৃত",
      icon: "Heart",
      image: "/images/education-center.jpg"
    }
  ]
};

/**
 * Programmatic helper to upload the seed pack to an active DB endpoint
 */
export async function uploadSeedsToDatabase(apiBaseUrl = "/api") {
  try {
    const res = await fetch(`${apiBaseUrl}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: DB_SEED_PACK })
    });
    return await res.json();
  } catch (err) {
    console.error("DB Seed upload failed:", err);
    throw err;
  }
}
