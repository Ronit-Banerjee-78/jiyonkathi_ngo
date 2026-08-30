import express from "express";
import multer from "multer";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";
import {
  isFirebaseConfigured,
  uploadToFirebaseStorage,
} from "../services/firebaseService.js";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
} from "../services/cloudinaryService.js";
import { strictUploadLimiter } from "../middlewares/rateLimiterMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
}); // 100MB limit for media

const memoryFiles = new Map();
let nextFileId = 1;

router.post(
  "/",
  strictUploadLimiter,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({
            success: false,
            error:
              err.message === "File too large"
                ? "File exceeds maximum allowed size (100MB)"
                : err.message,
          });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: "No file uploaded" });
      }

      const { originalname, mimetype, buffer } = req.file;

      // 1. Try Cloudinary first (Recommended for Images & Videos)
      if (isCloudinaryConfigured()) {
        try {
          const cldRes = await uploadToCloudinary({
            buffer,
            mimetype,
            originalname,
          });
          return res.json({
            success: true,
            url: cldRes.url,
            public_id: cldRes.public_id,
            storage: "cloudinary",
          });
        } catch (cldErr) {
          console.warn(
            "Cloudinary upload failed, falling back:",
            cldErr.message,
          );
        }
      }

      // 2. Try Firebase Storage if configured
      if (isFirebaseConfigured()) {
        try {
          const firebaseRes = await uploadToFirebaseStorage({
            filename: originalname,
            mimetype,
            buffer,
          });
          return res.json({
            success: true,
            url: firebaseRes.url,
            storage: "firebase",
          });
        } catch (fbErr) {
          console.warn("Firebase upload fallback to DB/Memory:", fbErr.message);
        }
      }

      // 3. Try PostgreSQL storage
      await ensureDbConnected();
      if (isDbConnected) {
        try {
          const result = await pool.query(
            "INSERT INTO site_files (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id",
            [originalname, mimetype, buffer],
          );
          return res.json({
            success: true,
            fileId: result.rows[0].id,
            url: `/api/files/${result.rows[0].id}`,
            storage: "postgres",
          });
        } catch (dbErr) {
          console.warn(
            "Database storage failed, falling back to in-memory:",
            dbErr.message,
          );
        }
      }

      // 4. Fallback to in-memory storage
      const fileId = nextFileId++;
      memoryFiles.set(String(fileId), {
        filename: originalname,
        mimetype,
        data: buffer,
      });
      return res.json({
        success: true,
        fileId,
        url: `/api/files/${fileId}`,
        storage: "memory",
      });
    } catch (error) {
      console.error("Error uploading file:", error.message);
      res
        .status(500)
        .json({ success: false, error: "Server error during upload" });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let file = null;

    if (isDbConnected) {
      try {
        const result = await pool.query(
          "SELECT filename, mimetype, data FROM site_files WHERE id = $1",
          [id],
        );
        if (result.rows.length > 0) {
          file = result.rows[0];
        }
      } catch (err) {
        console.warn("Error fetching file from DB:", err.message);
      }
    }

    if (!file) {
      file = memoryFiles.get(String(id));
    }

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const buffer = file.data;

    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
    res.setHeader("Accept-Ranges", "bytes");

    if (req.headers.range) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, "").split("-");
      const partialstart = parts[0];
      const partialend = parts[1];

      const start = parseInt(partialstart, 10);
      const end = partialend ? parseInt(partialend, 10) : buffer.length - 1;
      const chunksize = end - start + 1;

      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${buffer.length}`);
      res.setHeader("Content-Length", chunksize);
      res.send(buffer.slice(start, end + 1));
    } else {
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);
    }
  } catch (error) {
    console.error("Error fetching file:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export { router as uploadRoutes };
