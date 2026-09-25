import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { projectRoutes } from "./server/controllers/projectController.js";
import { settingsRoutes, getGalleryItemById } from "./server/controllers/settingsController.js";
import { uploadRoutes } from "./server/controllers/uploadController.js";
import { volunteerRoutes } from "./server/controllers/volunteerController.js";
import { eventRoutes } from "./server/controllers/eventController.js";
import { reportRoutes, getReportById } from "./server/controllers/reportController.js";
import { blogCommentRoutes, getBlogByIdOrSlug } from "./server/controllers/blogCommentController.js";
import { authRoutes } from "./server/controllers/authController.js";
import {
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
} from "./server/middlewares/securityMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getInjectedHtml(html, req) {
  try {
    const siteUrl = (process.env.SITE_URL || process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
    let meta = null;

    if (req.path.startsWith("/blog/")) {
      const id = req.path.replace(/^\/blog\//, "").split("/")[0];
      const blog = await getBlogByIdOrSlug(id);
      if (blog) {
        meta = {
          title: `${blog.title} - Jiyonkathi (জিয়নকাঠি) Blog`,
          description: (blog.excerpt || blog.excerptBengali || blog.content || "").slice(0, 200),
          image: blog.image?.startsWith("http") ? blog.image : `${siteUrl}${blog.image || "/images/farming-collage.jpg"}`,
          url: `${siteUrl}/blog/${blog.id}`,
        };
      }
    } else if (req.path.startsWith("/report/")) {
      const id = req.path.replace(/^\/report\//, "").split("/")[0];
      const report = await getReportById(id);
      if (report) {
        meta = {
          title: `${report.title} - Jiyonkathi (জিয়নকাঠি) অন্বেষণ প্রতিবেদন`,
          description: (report.summary || report.summaryEnglish || report.content || "").slice(0, 200),
          image: report.image?.startsWith("http") ? report.image : `${siteUrl}${report.image || "/images/farming-collage.jpg"}`,
          url: `${siteUrl}/report/${report.id}`,
        };
      }
    } else if (req.path.startsWith("/image/") || req.path.startsWith("/gallery/")) {
      const id = req.path.replace(/^\/(image|gallery)\//, "").split("/")[0];
      const item = await getGalleryItemById(id);
      if (item) {
        meta = {
          title: `${item.title || "ফটোগ্রাফিক রেকর্ড"} - Jiyonkathi (জিয়নকাঠি) চিত্রশালা`,
          description: (item.description || "জিয়নকাঠি চিত্রশালা থেকে সংগ্রহ").slice(0, 200),
          image: item.url?.startsWith("http") ? item.url : `${siteUrl}${item.url || "/images/community-collage.jpg"}`,
          url: `${siteUrl}/image/${item.id}`,
        };
      }
    }

    if (!meta) {
      return html;
    }

    const safeTitle = meta.title.replace(/"/g, "&quot;");
    const safeDesc = meta.description.replace(/"/g, "&quot;");
    const safeImage = meta.image.replace(/"/g, "&quot;");
    const safeUrl = meta.url.replace(/"/g, "&quot;");

    let injected = html
      .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
      .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${safeTitle}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${safeDesc}" />`)
      .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${safeDesc}" />`);

    const extraTags = `
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
    `;

    return injected.replace("</head>", `${extraTags}\n  </head>`);
  } catch (e) {
    console.warn("Meta injection error:", e.message);
    return html;
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3000;

  // Security Headers & Payload Size Limits
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

  // Healthcheck & Detailed Status Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/status", async (req, res) => {
    await ensureDbConnected();
    res.json({
      success: true,
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
    app.use(express.static(distPath, { index: false }));
    // Serve index.html with SSR Open Graph injection for all non-API SPA routes
    app.get("/*splat", async (req, res) => {
      try {
        const indexFile = path.join(distPath, "index.html");
        if (fs.existsSync(indexFile)) {
          const rawHtml = fs.readFileSync(indexFile, "utf-8");
          const finalHtml = await getInjectedHtml(rawHtml, req);
          return res.send(finalHtml);
        }
      } catch (err) {
        console.warn("Error serving static index:", err);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Jiyonkathi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
