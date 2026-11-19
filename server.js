import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { projectRoutes } from "./server/controllers/projectController.js";
import {
  settingsRoutes,
  getGalleryItemById,
<<<<<<< HEAD
  getAllGalleryItems,
=======
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
} from "./server/controllers/settingsController.js";
import { uploadRoutes } from "./server/controllers/uploadController.js";
import { volunteerRoutes } from "./server/controllers/volunteerController.js";
import { eventRoutes } from "./server/controllers/eventController.js";
<<<<<<< HEAD
=======
import {
  reportRoutes,
  getReportById,
} from "./server/controllers/reportController.js";
import {
  blogCommentRoutes,
  getBlogByIdOrSlug,
} from "./server/controllers/blogCommentController.js";
import { authRoutes } from "./server/controllers/authController.js";
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
import {
  reportRoutes,
  getReportById,
  getAllReports,
} from "./server/controllers/reportController.js";
import {
  blogCommentRoutes,
  getBlogByIdOrSlug,
  getAllBlogs,
} from "./server/controllers/blogCommentController.js";
import {
  authRoutes,
  verifyToken,
} from "./server/controllers/authController.js";
import pool, {
  initDB,
  isDbConnected,
  ensureDbConnected,
} from "./server/models/db.js";
import { isCloudinaryConfigured } from "./server/services/cloudinaryService.js";
import { logger } from "./server/middlewares/loggerMiddleware.js";
import { apiLimiter } from "./server/middlewares/rateLimiterMiddleware.js";
import {
  securityHeaders,
  inputSanitizer,
  enforceHttps,
} from "./server/middlewares/securityMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

// Process-level unhandled exception and rejection protection
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getInjectedHtml(html, req) {
  try {
    const siteUrl = (
      process.env.SITE_URL ||
      process.env.APP_URL ||
      `${req.protocol}://${req.get("host")}`
    ).replace(/\/+$/, "");
<<<<<<< HEAD

    const pathname = req.path.toLowerCase().replace(/\/+$/, "") || "/";
=======
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
    let meta = null;

    // 1. Private administrative routes -> block indexing
    if (
      pathname === "/admin" ||
      pathname === "/portal" ||
      pathname === "/login"
    ) {
      meta = {
        title: "প্রশাসনিক লগইন ও নিয়ন্ত্রণ প্যানেল - জিয়নকাঠি",
        description: "জিয়নকাঠি ওয়েবসাইটের সুরক্ষিত প্রশাসনিক পোর্টাল।",
        url: `${siteUrl}${pathname}`,
        noindex: true,
      };
    }
    // 2. Dynamic Blog article route: /blog/:id or /blogs/:id
    else if (pathname.startsWith("/blog/") || pathname.startsWith("/blogs/")) {
      const id = req.path.replace(/^\/blogs?\//, "").split("/")[0];
      const blog = await getBlogByIdOrSlug(id);
      if (blog) {
        const desc = (
          blog.excerpt ||
          blog.excerptBengali ||
          blog.content ||
          "জিয়নকাঠির নিয়মিত প্রতিবেদন ও সামাজিক বার্তা।"
        ).slice(0, 220);
        const img = blog.image?.startsWith("http")
          ? blog.image
          : `${siteUrl}${blog.image || "/images/community-collage.jpg"}`;
        const pageUrl = `${siteUrl}/blog/${encodeURIComponent(blog.id)}`;
        meta = {
<<<<<<< HEAD
          title: `${blog.title} - জিয়নকাঠি (Jiyonkathi) Blog`,
          description: desc,
          image: img,
          url: pageUrl,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: desc,
            image: img,
            datePublished: blog.date || "2026-08-01",
            author: {
              "@type": "Person",
              name: blog.author || "জিয়নকাঠি প্রচার দল",
            },
            publisher: {
              "@type": "Organization",
              name: "Jiyonkathi (জিয়নকাঠি)",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/images/logo.svg`,
              },
            },
            mainEntityOfPage: pageUrl,
          },
=======
          title: `${blog.title} - Jiyonkathi (জিয়নকাঠি) Blog`,
          description: (
            blog.excerpt ||
            blog.excerptBengali ||
            blog.content ||
            ""
          ).slice(0, 200),
          image: blog.image?.startsWith("http")
            ? blog.image
            : `${siteUrl}${blog.image || "/images/farming-collage.jpg"}`,
          url: `${siteUrl}/blog/${blog.id}`,
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
        };
      }
    }
    // 3. Dynamic Research Report route: /report/:id or /reports/:id
    else if (
      pathname.startsWith("/report/") ||
      pathname.startsWith("/reports/")
    ) {
      const id = req.path.replace(/^\/reports?\//, "").split("/")[0];
      const report = await getReportById(id);
      if (report) {
        const desc = (
          report.summary ||
          report.summaryEnglish ||
          report.content ||
          "জিয়নকাঠি কৃষি ও পরিবেশ অন্বেষণ প্রতিবেদন।"
        ).slice(0, 220);
        const img = report.image?.startsWith("http")
          ? report.image
          : `${siteUrl}${report.image || "/images/seedbed.jpg"}`;
        const pageUrl = `${siteUrl}/report/${encodeURIComponent(report.id)}`;
        meta = {
<<<<<<< HEAD
          title: `${report.title} - জিয়নকাঠি (Jiyonkathi) অন্বেষণ প্রতিবেদন`,
          description: desc,
          image: img,
          url: pageUrl,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Report",
            name: report.title,
            headline: report.title,
            description: desc,
            image: img,
            datePublished: report.publishedDate || "2026-08-15",
            author: {
              "@type": "Organization",
              name: report.author || "জিয়নকাঠি কৃষি গবেষণা দল",
            },
            publisher: {
              "@type": "Organization",
              name: "Jiyonkathi (জিয়নকাঠি)",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/images/logo.svg`,
              },
            },
            mainEntityOfPage: pageUrl,
          },
        };
      }
    }
    // 4. Dynamic Gallery Image route: /image/:id or /gallery/:id
    else if (
      pathname.startsWith("/image/") ||
      (pathname.startsWith("/gallery/") && pathname !== "/gallery")
    ) {
      const id = req.path.replace(/^\/(?:image|gallery)\//, "").split("/")[0];
=======
          title: `${report.title} - Jiyonkathi (জিয়নকাঠি) অন্বেষণ প্রতিবেদন`,
          description: (
            report.summary ||
            report.summaryEnglish ||
            report.content ||
            ""
          ).slice(0, 200),
          image: report.image?.startsWith("http")
            ? report.image
            : `${siteUrl}${report.image || "/images/farming-collage.jpg"}`,
          url: `${siteUrl}/report/${report.id}`,
        };
      }
    } else if (
      req.path.startsWith("/image/") ||
      req.path.startsWith("/gallery/")
    ) {
      const id = req.path.replace(/^\/(image|gallery)\//, "").split("/")[0];
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
      const item = await getGalleryItemById(id);
      if (item) {
        const desc = (
          item.description ||
          "জিয়নকাঠি চিত্রশালা থেকে সংগৃহীত মাঠ কার্যক্রমের আলোকচিত্র।"
        ).slice(0, 220);
        const img = item.url?.startsWith("http")
          ? item.url
          : `${siteUrl}${item.url || "/images/community-collage.jpg"}`;
        const pageUrl = `${siteUrl}/image/${encodeURIComponent(item.id)}`;
        meta = {
<<<<<<< HEAD
          title: `${item.title || "আলোকচিত্র সংগ্রহ"} - জিয়নকাঠি (Jiyonkathi) চিত্রশালা`,
          description: desc,
          image: img,
          url: pageUrl,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            name: item.title || "জিয়নকাঠি আলোকচিত্র",
            description: desc,
            contentUrl: img,
            author: {
              "@type": "Organization",
              name: "Jiyonkathi (জিয়নকাঠি)",
            },
          },
=======
          title: `${item.title || "ফটোগ্রাফিক রেকর্ড"} - Jiyonkathi (জিয়নকাঠি) চিত্রশালা`,
          description: (
            item.description || "জিয়নকাঠি চিত্রশালা থেকে সংগ্রহ"
          ).slice(0, 200),
          image: item.url?.startsWith("http")
            ? item.url
            : `${siteUrl}${item.url || "/images/community-collage.jpg"}`,
          url: `${siteUrl}/image/${item.id}`,
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
        };
      }
    }
    // 5. Section routes
    else if (pathname === "/about" || pathname === "/mission") {
      meta = {
        title: "আমাদের লক্ষ্য ও আদর্শ - জিয়নকাঠি | About Jiyonkathi NGO",
        description:
          "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও পরিবেশ সংকটকালে শহর-গ্রামের যৌথ প্রস্তুতির প্রচেষ্টা।",
        image: `${siteUrl}/images/banner.png`,
        url: `${siteUrl}/about`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Jiyonkathi",
          description:
            "Information about Jiyonkathi's ideology, seed conservation, and rural education.",
          url: `${siteUrl}/about`,
        },
      };
    } else if (pathname === "/work" || pathname === "/projects") {
      meta = {
        title:
          "আমাদের কাজ ও সমাজকল্যাণমূলক প্রকল্প - জিয়নকাঠি | Welfare Projects",
        description:
          "দেশীয় ধান ও বীজ সংরক্ষণ প্রকল্প, শিশুদের সহায়ক শিক্ষা কেন্দ্র, সর্প সচেতনতা ও স্বাস্থ্য পরীক্ষা শিবির, এবং পুনর্ব্যবহারযোগ্য সৌরশক্তি কৃষি উদ্যোগ।",
        image: `${siteUrl}/images/farming-collage.jpg`,
        url: `${siteUrl}/work`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Welfare & Agricultural Initiatives of Jiyonkathi",
          url: `${siteUrl}/work`,
        },
      };
    } else if (pathname === "/reports") {
      meta = {
        title:
          "গবেষণা ও ক্ষেত্র অন্বেষণ প্রতিবেদন - জিয়নকাঠি | Research Reports",
        description:
          "দেশীয় ধানের প্রজাতি সংরক্ষণ, রাসায়নিকমুক্ত চাষাবাদ, ভূগর্ভস্থ জল অপচয় রোধ এবং গ্রামীণ পরিবেশের বিস্তারিত গবেষণা ও ফিল্ড রিপোর্ট।",
        image: `${siteUrl}/images/seedbed.jpg`,
        url: `${siteUrl}/reports`,
      };
    } else if (pathname === "/blog" || pathname === "/blogs") {
      meta = {
        title: "ব্লগ ও সামাজিক বার্তা - জিয়নকাঠি | Blogs & Field Notes",
        description:
          "লোকসংস্কৃতি, নবান্ন উৎসব, জলবায়ু সংকট ও টেকসই কৃষি বিষয়ে জিয়নকাঠির নিয়মিত ব্লগ ও অভিজ্ঞতা বিনিময়।",
        image: `${siteUrl}/images/ecology-collage.jpg`,
        url: `${siteUrl}/blog`,
      };
    } else if (pathname === "/events") {
      meta = {
        title: "কার্যক্রম ও গ্রামীণ মেলা - জিয়নকাঠি | Events & Initiatives",
        description:
          "নবান্ন উৎসব, বসন্ত উৎসব, বীজ বিনিময় মেলা, বিনামূল্যে স্বাস্থ্য সচেতনতা শিবির ও শিক্ষাসামগ্রী বিতরণ কর্মসূচি।",
        image: `${siteUrl}/images/community-collage.jpg`,
        url: `${siteUrl}/events`,
      };
    } else if (pathname === "/gallery") {
      meta = {
        title: "চিত্রশালা ও আলোকচিত্র সংগ্রহ - জিয়নকাঠি | Photo Gallery",
        description:
          "জৈব চাষ, দেশীয় ধানের বীজতলা, গ্রামীণ পাঠশালা, স্বাস্থ্য শিবির ও বসন্ত উৎসবের আলোকচিত্র সংকলন।",
        image: `${siteUrl}/images/community-collage.jpg`,
        url: `${siteUrl}/gallery`,
      };
    } else if (pathname === "/volunteer") {
      meta = {
        title: "স্বেচ্ছাসেবী হিসেবে যোগ দিন - জিয়নকাঠি | Join as Volunteer",
        description:
          "গ্রামীণ শিক্ষা কেন্দ্র, বীজ সংরক্ষণ ও পরিবেশ আন্দোলনে স্বেচ্ছাসেবী হিসেবে যুক্ত হয়ে সুস্থায়ী সমাজ গঠনে অবদান রাখুন।",
        image: `${siteUrl}/images/education-center.jpg`,
        url: `${siteUrl}/volunteer`,
      };
    } else if (pathname === "/members") {
      meta = {
        title: "আমাদের পরিষদ ও কর্মী দল - জিয়নকাঠি | Team & Members",
        description:
          "জিয়নকাঠির প্রধান গবেষক, কৃষি সমন্বয়ক, শিক্ষক এবং নিবেদিতপ্রাণ সমাজকর্মীদের পরিচিতি।",
        image: `${siteUrl}/images/paddy-planting.jpg`,
        url: `${siteUrl}/members`,
      };
    } else if (pathname === "/contact") {
      meta = {
        title: "যোগাযোগ করুন - জিয়নকাঠি | Contact Jiyonkathi",
        description:
          "জিয়নকাঠি ক্ষেত্র প্রাঙ্গণ, প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান, পশ্চিমবঙ্গ।",
        image: `${siteUrl}/images/jiyonkathi-map.jpg`,
        url: `${siteUrl}/contact`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Jiyonkathi",
          url: `${siteUrl}/contact`,
        },
      };
    } else if (pathname === "/") {
      meta = {
        title: "জিয়নকাঠি (Jiyonkathi) - সুস্থায়ী সমাজ ও পরিবেশ উদ্যোগ | NGO",
        description:
          "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা (NGO)।",
        image: `${siteUrl}/images/banner.png`,
        url: `${siteUrl}/`,
        type: "website",
      };
    }

    if (!meta) {
      return html;
    }

    const safeTitle = meta.title.replace(/"/g, "&quot;");
    const safeDesc = meta.description.replace(/"/g, "&quot;");
    const safeImage = (meta.image || `${siteUrl}/images/banner.png`).replace(
      /"/g,
      "&quot;",
    );
    const safeUrl = (meta.url || `${siteUrl}${pathname}`).replace(
      /"/g,
      "&quot;",
    );

    let injected = html
      .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
      .replace(
<<<<<<< HEAD
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${safeDesc}" />`,
      )
      .replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${safeUrl}" />`,
      )
      .replace(
        /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:title" content="${safeTitle}" />`,
      )
      .replace(
        /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:description" content="${safeDesc}" />`,
      )
      .replace(
        /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:image" content="${safeImage}" />`,
      )
      .replace(
        /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:url" content="${safeUrl}" />`,
      )
      .replace(
        /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:title" content="${safeTitle}" />`,
      )
      .replace(
        /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:description" content="${safeDesc}" />`,
      )
      .replace(
        /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:image" content="${safeImage}" />`,
=======
        /<meta property="og:title" content=".*?" \/>/i,
        `<meta property="og:title" content="${safeTitle}" />`,
      )
      .replace(
        /<meta property="og:description" content=".*?" \/>/i,
        `<meta property="og:description" content="${safeDesc}" />`,
      )
      .replace(
        /<meta name="description" content=".*?" \/>/i,
        `<meta name="description" content="${safeDesc}" />`,
>>>>>>> d889a668428306d8417a35ed24ee4da091cf23e9
      );

    let extraTags = "";

    if (meta.noindex) {
      extraTags += `\n    <meta name="robots" content="noindex, nofollow" />`;
    }

    if (meta.jsonLd) {
      extraTags += `\n    <script type="application/ld+json">\n${JSON.stringify(meta.jsonLd, null, 2)}\n    </script>`;
    }

    if (extraTags) {
      injected = injected.replace("</head>", `${extraTags}\n  </head>`);
    }

    return injected;
  } catch (e) {
    console.warn("Meta injection error:", e.message);
    return html;
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "0.0.0.0";

  // Healthcheck endpoints (/health, /healthz, /livez, /readyz, /ping, /api/health)
  // Mounted early to guarantee fast, unblocked 200 responses for cloud load balancers and container monitors
  const healthPaths = [
    "/health",
    "/healthz",
    "/livez",
    "/readyz",
    "/ping",
    "/api/health",
  ];

  app.all(healthPaths, (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  // Security Middlewares & Payload Limits
  app.use(enforceHttps);
  app.use(securityHeaders);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(inputSanitizer);

  // Apply logger and rate limiting middleware
  app.use(logger);
  app.use("/api", apiLimiter);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/files", uploadRoutes);
  app.use("/api/volunteers", volunteerRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/blogs", blogCommentRoutes);
  app.use("/api/comments", blogCommentRoutes);

  // Detailed Status Endpoint (Admin & Diagnostics)

  app.get("/api/status", async (req, res) => {
    const authHeader =
      req.headers.authorization || req.headers["x-admin-token"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader;
    const payload = token ? verifyToken(token) : null;
    const isAdmin = payload && payload.role === "admin";

    // Public callers receive minimal operational status without storage/database disclosures
    if (!isAdmin) {
      return res.json({
        success: true,
        status: "operational",
        timestamp: new Date().toISOString(),
      });
    }

    await ensureDbConnected();
    res.json({
      success: true,
      status: "operational",
      dbConnected: isDbConnected,
      cloudinaryConfigured: isCloudinaryConfigured(),
      activeMediaStorage: isCloudinaryConfigured()
        ? "Cloudinary CDN"
        : isDbConnected
          ? "PostgreSQL Database"
          : "In-Memory Server Fallback",
      activeSettingsStorage: isDbConnected
        ? "PostgreSQL Database"
        : "In-Memory Server Fallback",
      timestamp: new Date().toISOString(),
    });
  });

  // Dynamic robots.txt
  app.get("/robots.txt", (req, res) => {
    const siteUrl = (
      process.env.SITE_URL ||
      process.env.APP_URL ||
      `${req.protocol}://${req.get("host")}`
    ).replace(/\/+$/, "");

    const content = [
      "# Robots.txt for Jiyonkathi NGO",
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /portal",
      "Disallow: /login",
      "Disallow: /api/",
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain; charset=utf-8");
    res.send(content);
  });

  // Dynamic XML Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const siteUrl = (
        process.env.SITE_URL ||
        process.env.APP_URL ||
        `${req.protocol}://${req.get("host")}`
      ).replace(/\/+$/, "");

      const staticPages = [
        { path: "/", priority: "1.0", changefreq: "weekly" },
        { path: "/about", priority: "0.9", changefreq: "monthly" },
        { path: "/work", priority: "0.9", changefreq: "weekly" },
        { path: "/reports", priority: "0.9", changefreq: "weekly" },
        { path: "/blog", priority: "0.9", changefreq: "weekly" },
        { path: "/events", priority: "0.8", changefreq: "weekly" },
        { path: "/gallery", priority: "0.8", changefreq: "weekly" },
        { path: "/volunteer", priority: "0.8", changefreq: "monthly" },
        { path: "/members", priority: "0.7", changefreq: "monthly" },
        { path: "/contact", priority: "0.7", changefreq: "monthly" },
      ];

      // Fetch dynamic content in parallel
      const [blogsResult, reportsResult, galleryResult] =
        await Promise.allSettled([
          getAllBlogs(),
          getAllReports(),
          getAllGalleryItems(),
        ]);

      const nowIso = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static routes
      for (const page of staticPages) {
        xml += `  <url>\n    <loc>${siteUrl}${page.path}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
      }

      // Dynamic Blogs
      if (
        blogsResult.status === "fulfilled" &&
        Array.isArray(blogsResult.value)
      ) {
        for (const blog of blogsResult.value) {
          if (blog && blog.id) {
            const blogUrl = `${siteUrl}/blog/${encodeURIComponent(blog.id)}`;
            const lastmod = blog.date || nowIso;
            xml += `  <url>\n    <loc>${blogUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
          }
        }
      }

      // Dynamic Reports
      if (
        reportsResult.status === "fulfilled" &&
        Array.isArray(reportsResult.value)
      ) {
        for (const rep of reportsResult.value) {
          if (rep && rep.id) {
            const repUrl = `${siteUrl}/report/${encodeURIComponent(rep.id)}`;
            const lastmod =
              rep.publishedDate ||
              (rep.createdAt
                ? new Date(rep.createdAt).toISOString().split("T")[0]
                : nowIso);
            xml += `  <url>\n    <loc>${repUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
          }
        }
      }

      // Dynamic Gallery Images
      if (
        galleryResult.status === "fulfilled" &&
        Array.isArray(galleryResult.value)
      ) {
        for (const img of galleryResult.value) {
          if (img && img.id) {
            const imgUrl = `${siteUrl}/image/${encodeURIComponent(img.id)}`;
            xml += `  <url>\n    <loc>${imgUrl}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
          }
        }
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
    } catch (err) {
      console.error("Error generating sitemap.xml:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Initialize database tables
  await initDB();

  // Vite middleware for development vs Production Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexFile = path.join(distPath, "index.html");
    app.use(express.static(distPath, { index: false, dotfiles: "ignore" }));

    // Unmatched API routes return 404 JSON instead of HTML
    app.use("/api/*splat", (req, res) => {
      res.status(404).json({ success: false, error: "API endpoint not found" });
    });

    // Serve index.html with SSR Open Graph injection for all non-API SPA routes
    app.get("/{*splat}", async (req, res) => {
      try {
        if (fs.existsSync(indexFile)) {
          const rawHtml = fs.readFileSync(indexFile, "utf-8");
          const finalHtml = await getInjectedHtml(rawHtml, req);
          return res.send(finalHtml);
        }
      } catch (err) {
        console.warn("Error serving static index:", err);
      }

      if (fs.existsSync(indexFile)) {
        return res.sendFile(indexFile);
      }

      res
        .status(503)
        .send(
          "<!DOCTYPE html><html><body><h2>Jiyonkathi Application</h2><p>Frontend production bundle is not built yet. Please run <code>npm run build</code> and refresh.</p></body></html>",
        );
    });
  }

  // Global Express Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error(`[Server Error] ${req.method} ${req.url}:`, err);
    if (res.headersSent) {
      return next(err);
    }
    const status = err.status || err.statusCode || 500;
    const message =
      process.env.NODE_ENV === "production" && status === 500
        ? "An internal server error occurred"
        : err.message || "Internal server error";
    res.status(status).json({ success: false, error: message });
  });

  server.listen(PORT, HOST, () => {
    console.log(`Jiyonkathi Server running on http://${HOST}:${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        if (pool && typeof pool.end === "function") {
          await pool.end();
        }
      } catch (e) {
        console.warn("Error closing DB pool on shutdown:", e.message);
      }
      process.exit(0);
    });

    // Force exit if connections do not close within 10 seconds
    setTimeout(() => {
      console.warn("Forcing shutdown after timeout.");
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer();
