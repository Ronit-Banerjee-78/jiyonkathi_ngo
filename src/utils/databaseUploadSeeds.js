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
    bannerTitleBengali: "প্রাণ-প্রকৃতি-পরিবেশের টানে",
    bannerHighlightBengali: "জিয়নকাঠির সুস্থায়ী পথচলা",
    bannerHeadingBengali: "প্রাণ-প্রকৃতি-পরিবেশের টানে জিয়নকাঠির সুস্থায়ী পথচলা",
    bannerSubtitle: "Dedicated to pesticide-free organic farming, conserving 56 types of indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal.",
    bannerSubtitleBengali: "বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সমাজ।",
    quoteBengali: "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।",
    quoteEnglish: "In this era of extreme environmental crisis, facing global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi.",
    quoteAuthorBengali: "জিয়নকাঠির লক্ষ্য ও আদর্শ",
    quoteAuthorEnglish: "Goal & Ideology of Jiyonkathi",
    statSeeds: "৫৬ রকম",
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
      titleBn: "পরিবেশ সংকটকালে, একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করা",
      titleEn: "Building a Sustainable Rural Platform in Environmental Crisis",
      taglineBn: "রাসায়নিক সার-কীটনাশকহীন চাষাবাদ, ভূগর্ভস্থ জল সুরক্ষা এবং পুনর্ব্যবহারযোগ্য শক্তির প্রয়োগ।",
      taglineEn: "Chemical-free agro-ecology, groundwater preservation, and renewable energy adoption.",
      descBn: "পরিবেশ সংকটকালে একটি সুস্থায়ী গ্রামীণ প্ল্যাটফর্ম প্রস্তুত করার মাধ্যমে প্রকৃতিবান্ধব কৃষি, বিষমুক্ত ফল-সবজি ও খাদ্য নিরাপত্তা নিশ্চিত করা।",
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
            "যতটা কম সম্ভব জীবাশ্ম জ্বালানী ব্যবহার করা।"
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
          titleBn: "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা",
          titleEn: "Chemical-free horticulture and natural food security.",
          subPoints: [],
          subPointsEn: []
        }
      ],
      goals: [
        "রাসায়নিক সার ও কীটনাশক একবারে ব্যবহার না করা",
        "মাটির তলার জল না তোলা",
        "যতটা কম সম্ভব জীবাশ্ম জ্বালানী ব্যবহার করা",
        "পুনর্ব্যবহারযোগ্য শক্তি কে নিজেদের কাজে ব্যবহার করা",
        "বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা"
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
