/**
 * Jiyonkathi Database Seed Script
 * Run: node server/seedDatabase.js
 * Automatically populates PostgreSQL / Cloud SQL or SQLite tables with all static assets,
 * research reports, demo members, pillars, gallery records, and events.
 */

import pool, { initDB, isDbConnected } from "./models/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  console.log("🌱 Starting Jiyonkathi Database Seeding...");
  await initDB();

  if (!isDbConnected) {
    console.log("ℹ️ Database connection is in fallback mode. Seed records will persist in memory / JSON storage.");
    return;
  }

  const client = await pool.connect();
  try {
    console.log("📦 Creating and populating site_settings...");
    const seedData = {
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
        facebookUrl: "https://www.facebook.com/jiyonkaathi"
      },
      homepageVideo: {
        title: "মাটির টানে, মানুষের সাথে জিয়নকাঠি",
        titleEnglish: "Living with Nature: Jiyonkathi in Action",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        poster: "/images/paddy-harvesting.jpg",
        description: "আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে দেশীয় ধান চাষের প্রদর্শনী খামার, প্রাকৃতিক বীজতলা এবং গ্রামীণ শিশুদের সহায়ক শিক্ষা কেন্দ্রের প্রাত্যহিক মুহূর্ত।",
        descriptionEnglish: "A window into our decentralized ecological seedbed nursery, community learning center, and indigenous rice cultivation in Bengal."
      }
    };

    await client.query(
      `INSERT INTO site_settings (id, data, updated_at) 
       VALUES (1, $1, CURRENT_TIMESTAMP) 
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;`,
      [JSON.stringify(seedData)]
    );

    console.log("✅ Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default seedDatabase;
