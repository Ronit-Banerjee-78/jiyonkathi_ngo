import express from "express";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";
import { initialSiteData } from "../models/seedData.js";
import { adminAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// In-memory fallback map: blogId -> Array of comment objects
const memoryComments = new Map();

/**
 * Fetch all blogs from site_settings (PostgreSQL or seed data)
 */
export async function getAllBlogs() {
  await ensureDbConnected();
  if (isDbConnected) {
    try {
      const result = await pool.query(
        "SELECT data FROM site_settings ORDER BY id DESC LIMIT 1"
      );
      if (result.rows.length > 0 && result.rows[0].data?.news) {
        return result.rows[0].data.news;
      }
    } catch (err) {
      console.warn("DB query blogs error, using fallback seedData:", err.message);
    }
  }
  return initialSiteData.blogs || [];
}

/**
 * Fetch single blog by ID or slug
 */
export async function getBlogByIdOrSlug(idOrSlug) {
  const blogs = await getAllBlogs();
  const search = String(idOrSlug).toLowerCase().trim();
  return blogs.find((b) => {
    if (String(b.id) === search) return true;
    if (b.slug && b.slug.toLowerCase() === search) return true;
    // Also match sanitized slug from title
    const titleSlug = (b.title || "")
      .toLowerCase()
      .replace(/[^\w\u0980-\u09FF\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return titleSlug === search;
  }) || null;
}

// GET /api/blogs - Return all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, error: "Failed to load blogs" });
  }
});

// GET /api/blogs/:id - Return single blog by ID or slug
router.get("/:id", async (req, res, next) => {
  // Pass through if the path is /comments/all
  if (req.params.id === "comments") return next();

  try {
    const { id } = req.params;
    const blog = await getBlogByIdOrSlug(id);
    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
    const comments = await getCommentsForBlog(blog.id);
    res.json({ success: true, blog: { ...blog, comments } });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/blogs/:blogId/comments
router.get("/:blogId/comments", async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await getCommentsForBlog(blogId);
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, error: "Failed to load comments" });
  }
});

// POST /api/blogs/:blogId/comments
router.post("/:blogId/comments", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { author, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "মন্তব্য টেক্সট আবশ্যক (Comment text is required)" });
    }

    const commentId = `cm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const safeAuthor = (author && author.trim()) ? author.trim() : "হিতৈষী পাঠক (Anonymous)";
    const safeText = text.trim();
    const createdAt = new Date().toISOString();

    const newComment = {
      id: commentId,
      blogId: String(blogId),
      author: safeAuthor,
      text: safeText,
      status: "approved",
      createdAt,
      date: new Date(createdAt).toLocaleDateString(),
    };

    // Store in memory
    const existing = memoryComments.get(String(blogId)) || [];
    memoryComments.set(String(blogId), [newComment, ...existing]);

    // Store in DB if available
    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          "INSERT INTO blog_comments (id, blog_id, author, text, status, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
          [commentId, String(blogId), safeAuthor, safeText, "approved", createdAt]
        );
      } catch (dbErr) {
        console.warn("DB insert comment error:", dbErr.message);
      }
    }

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ success: false, error: "Failed to post comment" });
  }
});

// GET /api/blogs/comments/all (Admin view)
router.get("/comments/all", adminAuthMiddleware, async (req, res) => {
  try {
    await ensureDbConnected();
    if (isDbConnected) {
      try {
        const result = await pool.query(
          "SELECT id, blog_id as \"blogId\", author, text, status, created_at as \"createdAt\" FROM blog_comments ORDER BY created_at DESC"
        );
        return res.json({ success: true, comments: result.rows });
      } catch (err) {
        console.warn("DB all comments error:", err.message);
      }
    }

    const all = [];
    for (const list of memoryComments.values()) {
      all.push(...list);
    }
    res.json({ success: true, comments: all });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to load all comments" });
  }
});

// DELETE /api/blogs/comments/:commentId
router.delete("/comments/:commentId", adminAuthMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    // Delete from memory
    for (const [blogId, list] of memoryComments.entries()) {
      memoryComments.set(
        blogId,
        list.filter((c) => c.id !== commentId)
      );
    }

    // Delete from DB
    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query("DELETE FROM blog_comments WHERE id = $1", [commentId]);
      } catch (dbErr) {
        console.warn("DB delete comment error:", dbErr.message);
      }
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete comment" });
  }
});

export { router as blogCommentRoutes };
