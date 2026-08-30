import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for docs
});

// Seed data for Research Reports (translated and expanded from Our Work items)
let memoryReports = [
  {
    id: "rep-1",
    title: "দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ গবেষণা প্রতিবেদন",
    titleEnglish:
      "Research Report on Indigenous Paddy Seed Preservation & Chemical-Free Farming",
    topic: "বীজ সংরক্ষণ ও দেশীয় ধান",
    topicEnglish: "Seed Conservation & Indigenous Crops",
    author: "জিয়নকাঠি কৃষি গবেষণা ও বীজ ব্যাংক দল",
    publishedDate: "২০২৬-০৮-১৫",
    summary:
      "রাসায়নিক সার ও কীটনাশক মুক্ত উপায়ে ১২০+ দেশীয় ধানের প্রজাতি সংরক্ষণ, ভূগর্ভস্থ জল অপচয় রোধ এবং স্থানীয় চাষিদের মাঝে বিনামূল্যে দেশীয় বীজ বিতরণের বিস্তারিত ফলাফল।",
    summaryEnglish:
      "A detailed analysis of preserving 120+ indigenous paddy varieties without synthetic fertilizers or pesticides, preventing groundwater depletion, and field seed-exchange dynamics.",
    content: `## ভূমিকা ও প্রেক্ষাপট
জলবায়ু সংকট ও আধুনিক রাসায়নিক কৃষির মারাত্মক ক্ষতিকর প্রভাব থেকে মাটির উর্বরতা ও ঐতিহ্যবাহী বীজসম্পদ রক্ষা করতে জিয়নকাঠি গত তেরো বছর ধরে নিরবচ্ছিন্নভাবে কাজ করে চলেছে। রাসায়নিক সার ও বিষমুক্ত উপায়ে দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ আমাদের সবচেয়ে গুরুত্বপূর্ণ গবেষণাক্ষেত্র।

### মূল গবেষণার বিষয় ও কার্যপ্রণালী:
১. **১২০+ দেশীয় ধান প্রজাতি সংরক্ষণ**: বহুরূপী, কালাভাত, দুধেশ্বর, কেরালাসুন্দরী, রাধাতিলক, যামিনী, অগ্নিকুমার ইত্যাদি বিলুপ্তপ্রায় প্রজাতির জৈব চাষ ও বীজব্যাংক স্থাপন।
২. **ভূগর্ভস্থ জল সংরক্ষণ**: মাটির গভীর থেকে পাম্পের মাধ্যমে জল না তুলে কেবল বৃষ্টির জল ও পুকুরের জল ব্যবহার করে বীজতলা তৈরি।
৩. **বিষমুক্ত মাটির পুনরুজ্জীবন**: গোবর, কম্পোস্ট সার, নিম নির্যাস এবং প্রাকৃতিক অণুজীব ব্যবহারের মাধ্যমে মাটির জৈব কার্বন বৃদ্ধি।

### ফলাফল ও প্রাপ্তি:
- গত বছরে ১৫০+ প্রান্তিক কৃষক পরিবারকে বিনামূল্যে দেশীয় বীজ ও জৈব সার প্রস্তুত প্রণালীর পুস্তিকা প্রদান করা হয়েছে।
- রাসায়নিকের ব্যবহার শূন্যে নামিয়ে আনলেও হেক্টর প্রতি ফলন প্রায় ৮৫-৯০% বজায় রাখা সম্ভব হয়েছে, অথচ চাষের খরচ কমেছে ৭০%।
- মাটির উপকারী কেঁচো ও অনুজীবের ঘনত্ব প্রায় চার গুণ বৃদ্ধি পেয়েছে।`,
    contentEnglish: `## Introduction & Background
To combat the climate crisis and soil degradation caused by heavy petrochemical agriculture, Jiyonkathi has dedicated over thirteen years to preserving indigenous paddy seeds and organic farming methodologies.

### Core Research Focus:
1. **Preservation of 120+ Indigenous Varieties**: Sowing and cultivating rare heirloom rice varieties including Bahurupi, Kalabhat, Dudheswar, and Radhatilak without artificial inputs.
2. **Groundwater Conservation**: Avoiding subterranean water pumps, relying solely on natural monsoons and catchment ponds for seedbeds.
3. **Zero-Pesticide Soil Regeneration**: Utilizing compost, neem extracts, and bio-fertilizers to boost microbial soil health.

### Key Outcomes:
- Free seed distribution to 150+ smallholder farming households across Barddhaman and Birbhum.
- Achieved 85-90% comparable crop yield while slashing farm input expenses by 70%.`,
    image: "/images/farming-collage.jpg",
    methodology: [
      "প্রাকৃতিক বৃষ্টি নির্ভর বীজতলা প্রস্তুতি",
      "হাতে নিড়ানো ও জৈব মালচিং পদ্ধতি",
      "পুকুরের জল ও সৌর পাম্পিং ব্যবস্থা",
      "ঐতিহ্যবাহী ঢেঁকিতে প্রক্রিয়াকরণ",
    ],
    findings: [
      "মাটির উর্বরতা বৃদ্ধি ও কেঁচোর সংখ্যা বৃদ্ধি",
      "খরচ ৭০% কমে যাওয়া",
      "বীজের অঙ্কুরোদগম ক্ষমতা ৯২% এর বেশি বজায় রাখা",
    ],
    views: 148,
    createdAt: "2026-08-15T09:00:00Z",
  },
  {
    id: "rep-2",
    title: "সহায়ক শিক্ষা কেন্দ্র ও গ্রামীণ শিশু প্রকৃতি পাঠ পর্যালোচনা",
    titleEnglish:
      "Study on Rural Auxiliary Education & Environmental Nature Literacy",
    topic: "সহায়ক শিক্ষা ও প্রকৃতি পাঠ",
    topicEnglish: "Auxiliary Education & Nature Literacy",
    author: "শিক্ষা ও সমাজ কল্যাণ শাখা, জিয়নকাঠি",
    publishedDate: "২০২৬-০৮-০১",
    summary:
      "গ্রামীণ শিশুদের জন্য বিনামূল্যে সহায়ক পাঠদান, প্রকৃতি পরিচয়, লোকসংস্কৃতি চর্চা ও সর্প সচেতনতার শিক্ষামূলক প্রভাব ও সামাজিক অগ্রগতি।",
    summaryEnglish:
      "Evaluating the community impact of free remedial schooling, nature excursions, snakebite awareness, and folk traditions for village children.",
    content: `## গ্রামীণ শিক্ষার বাস্তব রূপরেখা
আউশগ্রাম অঞ্চলের পিছিয়ে পড়া পরিবারের শিশুদের জন্য নিয়মিত সহায়ক শিক্ষা কেন্দ্র পরিচালনা করছে জিয়নকাঠি। এখানে পাঠ্যবইয়ের পাশাপাশি শিশুদের প্রকৃতির সাথে সরাসরি পরিচয় করিয়ে দেওয়া হয়।

### শিক্ষাদান পদ্ধতি:
- **প্রকৃতি পাঠ**: গাছপালা, পাখি, কীটপতঙ্গ এবং স্থানীয় উদ্ভিদের সাথে পরিচয়।
- **সর্প সচেতনতা ও কুসংস্কার দূরীকরণ**: বিষাক্ত ও নির্বিষ সাপের পরিচয় এবং সাপে কাটলে প্রাথমিক চিকিৎসার বৈজ্ঞানিক প্রশিক্ষণ।
- **লোকসংস্কৃতি ও সৃজনশীলতা**: বাউল গান, ছড়া, নাটক ও চিত্রাঙ্কন।

### অগ্রগতি:
- প্রতি সপ্তাহে ৬০ জনের বেশি শিক্ষার্থী নিয়মিত পুষ্টিকর টিফিন ও পাঠসহায়তা পাচ্ছে।
- বিদ্যালয়ে অনুপস্থিতির হার ৪০% হ্রাস পেয়েছে।`,
    contentEnglish: `## Rural Education Blueprint
Jiyonkathi runs an open-air auxiliary learning center for rural children in Aushgram, coupling standard curricula with immersive nature literacy.

### Methodology:
- Direct nature walks to identify native flora and fauna.
- Scientific snake awareness sessions to demystify rural superstitions.
- Creative arts, local folklore, and music workshops.`,
    image: "/images/education-center.jpg",
    methodology: [
      "মুক্তাঙ্গন আনন্দময় পাঠদান",
      "বিজ্ঞানভিত্তিক সচেতনতামূলক নাটিকা",
      "নিয়মিত স্বাস্থ্য পরীক্ষা ও পুষ্টি বিতরণ",
    ],
    findings: [
      "শিশুদের পরিবেশ চেতনা ও বিজ্ঞানে আগ্রহ বৃদ্ধি",
      "গ্রামে সর্পদংশনে মৃত্যুর হার শূন্যে নামিয়ে আনা",
      "অভিভাবকদের সম্পৃক্ততা বৃদ্ধি",
    ],
    views: 96,
    createdAt: "2026-08-01T10:30:00Z",
  },
  {
    id: "rep-3",
    title: "সর্প সচেতনতা ও গ্রামীণ স্বাস্থ্য শিবির প্রতিবেদন",
    titleEnglish:
      "Field Report: Snakebite Awareness, First Aid & Preventive Rural Healthcare",
    topic: "গ্রামীণ স্বাস্থ্য ও সর্প সচেতনতা",
    topicEnglish: "Rural Health & Snakebite Mitigation",
    author: "চিকিৎসা বিশেষজ্ঞ ও স্বেচ্ছাসেবক দল (DDBMPBS সহযোগে)",
    publishedDate: "২০২৬-০৭-২০",
    summary:
      "সর্পদংশন প্রতিরোধে বিজ্ঞানসম্মত প্রাথমিক চিকিৎসা প্রশিক্ষণ, ওঝা-তান্ত্রিক নির্ভরতা দূরীকরণ এবং প্রান্তিক মানুষের মাঝে বিনামূল্যে চিকিৎসা পরিষেবা।",
    summaryEnglish:
      "A comprehensive report on empirical snakebite first aid training, countering unscientific quackery, and delivering free medical checkups in rural Bengal.",
    content: `## সর্প সচেতনতার আবশ্যকতা
বর্ষাকালে গ্রামাঞ্চলে সর্পদংশন একটি গুরুতর জনস্বাস্থ্য সংকট। সঠিক সচেতনতার অভাবে বহু মানুষ হাসপাতালে না গিয়ে ওঝার কাছে গিয়ে মূল্যবান সময় নষ্ট করেন।

### উদ্যোগ ও কৌশল:
১. **সরাসরি প্রদর্শন ও পুস্তিকা বিতরণ**: বাংলার সাধারণ বিষধর ও নির্বিষ সাপের ছবি সহ পরিচয়।
২. **সঠিক প্রাথমিক চিকিৎসা (Do's & Don'ts)**: বাঁধন না দেওয়া, ক্ষতস্থানে কাটাছেঁড়া না করা এবং দ্রুত নিকটস্থ মহকুমা বা জেলা হাসপাতালে পৌঁছে এন্টিভেনাম গ্রহণ করা।
৩. **বিনামূল্যে স্বাস্থ্য ও চক্ষু পরীক্ষা শিবির**: বিশেষজ্ঞ ডাক্তারদের দ্বারা রক্তচাপ, সুগার পরীক্ষা ও প্রয়োজনীয় জরুরি ওষুধ বিতরণ।`,
    contentEnglish: `## Necessity of Snake Awareness
Snakebites remain a prominent hazard during monsoons in rural Bengal. Lack of scientific knowledge frequently drives victims to faith healers instead of hospitals.

### Interventions:
1. Educational charts categorizing venomous vs non-venomous species.
2. Standardized First Aid protocol: immobilization, avoiding tourniquets, and immediate transport to hospitals for Anti-Snake Venom (ASV).
3. Free clinical screenings for chronic ailments.`,
    image: "/images/health-camp.jpg",
    methodology: [
      "বিশেষজ্ঞ চিকিৎসকদের সরাসরি পরামর্শ",
      "গ্রাম পঞ্চায়েত ও যুবকদের সমন্বয়ে সচেতনতা দল",
      "জরুরি অ্যাম্বুলেন্স নেটওয়ার্ক সংযোগ",
    ],
    findings: [
      "হাসপাতালে দ্রুত পৌঁছানোর হার ৮৫% বৃদ্ধি",
      "ওঝার কাছে যাওয়ার প্রবণতা উল্লেখযোগ্যভাবে হ্রাস",
      "৫০০+ গ্রামবাসীকে জরুরি স্বাস্থ্য পরামর্শ প্রদান",
    ],
    views: 112,
    createdAt: "2026-07-20T14:15:00Z",
  },
  {
    id: "rep-4",
    title: "জীবনের জন্য খাদ্য নিরাপত্তা ও বিষমুক্ত ফল-সবজি চাষ পদ্ধতি",
    titleEnglish:
      "Practicing Food Security for Life: Sustainable Fruit & Vegetable Farming Methods",
    topic: "সবজি ও ফল চাষ (খাদ্য নিরাপত্তা)",
    topicEnglish: "Food Security & Fruit/Vegetable Farming",
    author: "জিয়নকাঠি জৈব চাষ ও বাগান বিশেষজ্ঞ দল",
    publishedDate: "২০২৬-০৭-০৫",
    summary:
      "বহুবর্ষজীবী ফল চাষ, মাচা ভিত্তিক বিষমুক্ত সবজি উৎপাদন, প্রাকৃতিক জৈব বালাইনাশক প্রয়োগ এবং পরিবারের পুষ্টি নিরাপত্তা নিশ্চিতকরণের বাস্তবায়ন。",
    summaryEnglish:
      "A dedicated research methodology detailing multi-tier fruit orchards, trellis organic vegetable cultivation, bio-pest repellents, and family nutrition security.",
    content: `## জীবনের জন্য খাদ্য নিরাপত্তা
খাদ্য নিরাপত্তা মানে কেবল পেট ভরানো নয়, বিষমুক্ত পুষ্টিকর খাবারের সুনিশ্চিত যোগান। জিয়নকাঠি বিশ্বাস করে যে প্রতিটি পরিবার নিজেদের বসতভিটার আশেপাশের অব্যবহৃত জমিতে পুষ্টিকর ফল ও সবজি চাষ করতে পারে।

### অনুসৃত কৃষি পদ্ধতিসমূহ:
১. **মাচায় বিষমুক্ত লতানো সবজি চাষ**: লাউ, কুমড়ো, করলা, ঝিঙে, পটল ইত্যাদি প্রাকৃতিক মাচা তৈরি করে চাষ করা।
২. **দেশীয় ফলের বাগান সৃজন**: আম, জাম, পেয়ারা, আতা, লেবু, বাতাবি, বেদানা, কুল ও বেল গাছের মিশ্র রোপণ।
৩. **প্রাকৃতিক জৈব বালাইনাশক**: নিমপাতা, রসুন, কাঁচা লঙ্কা ও গোমূত্রের মিশ্রণে তৈরি 'দশপর্ণী অর্ক' ও 'জীবাশ্ম বালাইনাশক'।
৪. **বহুস্তরীয় খাদ্য বন (Food Forest)**: উঁচু গাছ (নারকেল/ফল), মাঝারি ঝোপ (লেবু/পেঁপে) ও মাটির স্তরে আদা/হলুদ চাষ।`,
    contentEnglish: `## Practicing Food Security for Life
True food security entails chemical-free, nutrient-dense sustained yields. Jiyonkathi champions homestead permaculture and bio-dynamic orchard integration.

### Core Farming Methodologies:
1. **Vertical Trellis Vegetable Cultivation**: Gourds, squash, and climbers using bamboo frames and compost beds.
2. **Indigenous Multi-Fruit Orchards**: Mango, Guava, Custard Apple, Citrus, Jamun, and Pomegranate.
3. **Bio-pest Deterrents**: Herbal extracts utilizing neem leaves, garlic, green chilies, and fermented botanicals.
4. **Multi-layer Agroforestry Food Forests**: Tall fruit trees paired with understory ginger, turmeric, and tubers.`,
    image: "/images/ecology-collage.jpg",
    methodology: [
      "মাটি পরীক্ষা ও জৈব সার সংমিশ্রণ",
      "ড্রিপ ও মালচিং নির্ভর জল ব্যবস্থাপনা",
      "দেশি বীজ ও চারার কলম প্রস্তুতি",
      "দশপর্ণী অর্ক বালাই দমন",
    ],
    findings: [
      "প্রতিটি পরিবার সারা বছর টাটকা বিষমুক্ত সবজির চাহিদা পূরণ করতে সক্ষম",
      "বাজারে কীটনাশকযুক্ত সবজি কেনার খরচ শূন্যে নামানো",
      "স্থানীয় জীববৈচিত্র্য ও মৌমাছির পরাগায়ন বৃদ্ধি",
    ],
    views: 204,
    createdAt: "2026-07-05T08:00:00Z",
  },
];

// GET /api/reports - Fetch all reports with optional topic filtering & sort
router.get("/", async (req, res) => {
  try {
    const { topic, sort } = req.query;
    await ensureDbConnected();

    let reports = memoryReports;

    if (isDbConnected) {
      try {
        const result = await pool.query(
          "SELECT * FROM research_reports ORDER BY published_date DESC, id DESC",
        );
        if (result.rows && result.rows.length > 0) {
          reports = result.rows.map((r) => ({
            id: r.id,
            title: r.title,
            titleEnglish: r.title_english,
            topic: r.topic,
            topicEnglish: r.topic_english,
            author: r.author,
            publishedDate: r.published_date,
            summary: r.summary,
            summaryEnglish: r.summary_english,
            content: r.content,
            contentEnglish: r.content_english,
            image: r.image,
            methodology: Array.isArray(r.methodology)
              ? r.methodology
              : typeof r.methodology === "string"
                ? JSON.parse(r.methodology || "[]")
                : [],
            findings: Array.isArray(r.findings)
              ? r.findings
              : typeof r.findings === "string"
                ? JSON.parse(r.findings || "[]")
                : [],
            views: Number(r.views) || 0,
            downloadUrl: r.download_url,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        console.warn(
          "DB query for reports failed, using memory fallback:",
          err.message,
        );
      }
    }

    // Apply filtering
    if (topic && topic !== "all") {
      reports = reports.filter(
        (r) =>
          (r.topic && r.topic.toLowerCase().includes(topic.toLowerCase())) ||
          (r.topicEnglish &&
            r.topicEnglish.toLowerCase().includes(topic.toLowerCase())),
      );
    }

    // Apply sorting
    if (sort === "views") {
      reports.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === "oldest") {
      reports.sort(
        (a, b) => new Date(a.publishedDate) - new Date(b.publishedDate),
      );
    } else {
      // Default: newest first
      reports.sort(
        (a, b) =>
          new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0),
      );
    }

    res.json({ success: true, reports });
  } catch (error) {
    console.error("Error in reportController GET:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reports" });
  }
});

// GET /api/reports/:id - Fetch single report
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = memoryReports.find((r) => String(r.id) === String(id));
    if (!report) {
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });
    }
    res.json({ success: true, report });
  } catch (error) {
    console.error("Error fetching single report:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/reports/:id/view - Increment views for analytics
router.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    const report = memoryReports.find((r) => String(r.id) === String(id));
    if (report) {
      report.views = (report.views || 0) + 1;
    }

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          "UPDATE research_reports SET views = COALESCE(views, 0) + 1 WHERE id = $1",
          [id],
        );
      } catch (e) {
        console.warn("DB update views error:", e.message);
      }
    }

    res.json({ success: true, views: report ? report.views : 1 });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to record view" });
  }
});

// POST /api/reports/extract-docx - Extract text from uploaded .docx file
router.post("/extract-docx", upload.single("docxFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No .docx file uploaded" });
    }

    const { buffer, originalname } = req.file;

    // Use mammoth to extract raw text & formatted HTML
    const [rawResult, htmlResult] = await Promise.all([
      mammoth.extractRawText({ buffer }),
      mammoth.convertToHtml({ buffer }),
    ]);

    const extractedText = rawResult.value || "";
    const extractedHtml = htmlResult.value || "";

    // Clean up lines and attempt smart title / summary detection if available
    const lines = extractedText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const inferredTitle = lines[0] || originalname.replace(/\.[^/.]+$/, "");
    const inferredSummary = lines.slice(1, 4).join(" ") || "";

    res.json({
      success: true,
      filename: originalname,
      title: inferredTitle,
      summary: inferredSummary,
      rawText: extractedText,
      html: extractedHtml,
      linesCount: lines.length,
    });
  } catch (error) {
    console.error("Error extracting .docx:", error);
    res.status(500).json({
      success: false,
      error:
        "Failed to extract text from .docx file. Please verify the document format.",
    });
  }
});

// POST /api/reports - Create new report
router.post("/", async (req, res) => {
  try {
    const {
      title,
      titleEnglish,
      topic,
      topicEnglish,
      author,
      publishedDate,
      summary,
      summaryEnglish,
      content,
      contentEnglish,
      image,
      methodology,
      findings,
      downloadUrl,
    } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Title and Content are required" });
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      title,
      titleEnglish: titleEnglish || title,
      topic: topic || "সাধারণ গবেষণা",
      topicEnglish: topicEnglish || "General Research",
      author: author || "জিয়নকাঠি গবেষণা দল",
      publishedDate: publishedDate || new Date().toISOString().split("T")[0],
      summary: summary || content.slice(0, 160) + "...",
      summaryEnglish:
        summaryEnglish ||
        (contentEnglish ? contentEnglish.slice(0, 160) + "..." : ""),
      content,
      contentEnglish: contentEnglish || "",
      image: image || "/images/farming-collage.jpg",
      methodology: Array.isArray(methodology) ? methodology : [],
      findings: Array.isArray(findings) ? findings : [],
      downloadUrl: downloadUrl || "",
      views: 0,
      createdAt: new Date().toISOString(),
    };

    memoryReports.unshift(newReport);

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `INSERT INTO research_reports (id, title, title_english, topic, topic_english, author, published_date, summary, summary_english, content, content_english, image, methodology, findings, download_url, views)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            newReport.id,
            newReport.title,
            newReport.titleEnglish,
            newReport.topic,
            newReport.topicEnglish,
            newReport.author,
            newReport.publishedDate,
            newReport.summary,
            newReport.summaryEnglish,
            newReport.content,
            newReport.contentEnglish,
            newReport.image,
            JSON.stringify(newReport.methodology),
            JSON.stringify(newReport.findings),
            newReport.downloadUrl,
            0,
          ],
        );
      } catch (dbErr) {
        console.warn("DB insert report error:", dbErr.message);
      }
    }

    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, error: "Failed to create report" });
  }
});

// PUT /api/reports/:id - Update report
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const index = memoryReports.findIndex((r) => String(r.id) === String(id));

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });
    }

    const updated = {
      ...memoryReports[index],
      ...req.body,
      id: memoryReports[index].id,
      updatedAt: new Date().toISOString(),
    };

    memoryReports[index] = updated;

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `UPDATE research_reports
           SET title=$1, title_english=$2, topic=$3, topic_english=$4, author=$5, published_date=$6, summary=$7, summary_english=$8, content=$9, content_english=$10, image=$11, methodology=$12, findings=$13, download_url=$14
           WHERE id=$15`,
          [
            updated.title,
            updated.titleEnglish,
            updated.topic,
            updated.topicEnglish,
            updated.author,
            updated.publishedDate,
            updated.summary,
            updated.summaryEnglish,
            updated.content,
            updated.contentEnglish,
            updated.image,
            JSON.stringify(updated.methodology || []),
            JSON.stringify(updated.findings || []),
            updated.downloadUrl || "",
            id,
          ],
        );
      } catch (dbErr) {
        console.warn("DB update report error:", dbErr.message);
      }
    }

    res.json({ success: true, report: updated });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, error: "Failed to update report" });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    memoryReports = memoryReports.filter((r) => String(r.id) !== String(id));

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query("DELETE FROM research_reports WHERE id = $1", [id]);
      } catch (dbErr) {
        console.warn("DB delete report error:", dbErr.message);
      }
    }

    res.json({ success: true, message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, error: "Failed to delete report" });
  }
});

export const defaultReports = memoryReports;
export { router as reportRoutes };
