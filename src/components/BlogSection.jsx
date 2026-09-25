"use client";

import React, { useState, useContext, useEffect } from "react";
import { SiteContext } from "../context/SiteContext";
import {
  ArrowRight,
  Calendar,
  User,
  X,
  Play,
  Video,
  Clock,
  MessageSquare,
  Share2,
  Send,
  Sparkles,
  CheckCircle2,
  Globe,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOGS, DEFAULT_VIDEOS } from "../data";
import { getShareUrl, shareContent } from "../utils/urlUtils";

export default function BlogSection({ targetBlogId = null, onSelectBlog = null, onClearTarget = null }) {
  const { siteData, language: globalLanguage } = useContext(SiteContext);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [overrideLang, setOverrideLang] = useState(null);
  const blogViewLang = overrideLang || globalLanguage || "bn";
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Combine siteData blogs or fallback
  const rawBlogs = (siteData && siteData.blogs && siteData.blogs.length > 0)
    ? siteData.blogs
    : [
      ...DEFAULT_VIDEOS.map((v) => ({
        id: `vid-${v.id}`,
        type: "video",
        title: v.title,
        titleBengali: v.title,
        titleEnglish: v.titleEnglish || v.title,
        excerpt: v.description,
        excerptBengali: v.description,
        excerptEnglish: v.descriptionEnglish || v.description,
        videoUrl: v.url,
        author: "জিয়নকাঠি প্রচার দল",
        date: v.date || "আগস্ট ২০২৬",
        category: "ভিডিও ডকুমেন্টারি",
        content: `${v.description}\n\nজিয়নকাঠির তেরো বছরের পথচলায় প্রকৃতিবান্ধব কৃষি, বীজ সংরক্ষণ, শিশুদের শিক্ষা ও গ্রামীণ স্বাবলম্বিতার ভিডিওচিত্র।`,
        contentBengali: `${v.description}\n\nজিয়নকাঠির তেরো বছরের পথচলায় প্রকৃতিবান্ধব কৃষি, বীজ সংরক্ষণ, শিশুদের শিক্ষা ও গ্রামীণ স্বাবলম্বিতার ভিডিওচিত্র।`,
        contentEnglish: `${v.descriptionEnglish || v.description}\n\nDocumenting 13+ years of agro-ecology, seed conservation, and village education centers.`
      })),
      ...BLOGS.map((b) => ({ ...b, type: "article" }))
    ];

  // Sort blogs by rank if available
  const allBlogs = [...rawBlogs].sort((a, b) => (Number(a.rank) || 999) - (Number(b.rank) || 999));

  // Extract unique categories
  const categories = ["all", ...new Set(allBlogs.map((b) => b.category).filter(Boolean))];

  const filteredBlogs = activeCategory === "all"
    ? allBlogs
    : allBlogs.filter((b) => b.category === activeCategory);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBlog]);

  // Handle opening targeted blog (from deep link or direct URL)
  useEffect(() => {
    if (targetBlogId && allBlogs.length > 0) {
      const targetStr = String(targetBlogId).toLowerCase();
      const matched = allBlogs.find(
        (b) => String(b.id).toLowerCase() === targetStr || String(b.slug || "").toLowerCase() === targetStr
      );
      if (matched) {
        setSelectedBlog(matched);
      }
    }
  }, [targetBlogId, allBlogs]);

  const handleOpenBlog = (blog) => {
    setSelectedBlog(blog);
    if (onSelectBlog && blog?.id) {
      onSelectBlog(blog.id);
    }
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
    if (onClearTarget) {
      onClearTarget();
    }
  };

  const handleShareBlog = async (blog) => {
    if (!blog) return;
    const title = blogViewLang === "bn"
      ? (blog.titleBengali || blog.title)
      : (blog.titleEnglish || blog.title);
    const excerpt = blogViewLang === "bn"
      ? (blog.excerptBengali || blog.excerpt)
      : (blog.excerptEnglish || blog.excerpt || blog.description);
    const url = getShareUrl(`/blog/${blog.id}`);

    await shareContent({
      title,
      text: excerpt ? `${title}\n${excerpt}` : title,
      url,
    });
  };

  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Fetch comments when blog modal opens
  useEffect(() => {
    if (!selectedBlog?.id) return;
    const blogId = selectedBlog.id;
    setCommentsLoading(true);
    fetch(`/api/blogs/${encodeURIComponent(blogId)}/comments`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.comments)) {
          setComments((prev) => ({
            ...prev,
            [blogId]: json.comments,
          }));
        }
      })
      .catch((err) => console.warn("Failed to load comments:", err))
      .finally(() => setCommentsLoading(false));
  }, [selectedBlog?.id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedBlog || commentSubmitting) return;

    const blogId = selectedBlog.id;
    const author = authorName.trim() || (blogViewLang === "bn" ? "হিতৈষী পাঠক" : "Anonymous Reader");
    const text = newComment.trim();

    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(blogId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text }),
      });
      const json = await res.json();
      if (json.success && json.comment) {
        setComments((prev) => ({
          ...prev,
          [blogId]: [json.comment, ...(prev[blogId] || [])],
        }));
        setNewComment("");
        setAuthorName("");
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 3000);
      } else {
        alert(json.error || "Failed to post comment");
      }
    } catch (err) {
      alert("Error posting comment: " + err.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-stone-50 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header & Language Switcher for Blog */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {blogViewLang === "bn"
                ? "প্রকৃতি, পরিবেশ ও গ্রামীণ জীবনের অভিজ্ঞতা"
                : "Stories of Sustainable Living & Rural Joy"}
            </h1>

          </div>

          {/* Bilingual Reading Switcher */}
          <div className="flex items-center space-x-1.5 self-start md:self-end bg-white p-1 rounded-lg border border-stone-200">
            <Globe className="w-4 h-4 text-amber-800 ml-1.5" />
            <button
              onClick={() => setOverrideLang("bn")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${blogViewLang === "bn"
                ? "bg-amber-700 text-white"
                : "text-stone-600 hover:text-stone-900"
                }`}
            >
              বাংলায় পড়ুন
            </button>
            <button
              onClick={() => setOverrideLang("en")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${blogViewLang === "en"
                ? "bg-amber-700 text-white"
                : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Read in English
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                  }`}
              >
                {cat === "all" ? (blogViewLang === "bn" ? "সকল বার্তা" : "All Stories") : cat}
              </button>
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, idx) => {
            const isVideo = blog.type === "video" || Boolean(blog.videoUrl);
            const title = blogViewLang === "bn"
              ? (blog.titleBengali || blog.title)
              : (blog.titleEnglish || blog.title);
            const excerpt = blogViewLang === "bn"
              ? (blog.excerptBengali || blog.excerpt)
              : (blog.excerptEnglish || blog.excerpt || blog.description);

            return (
              <motion.div
                key={blog.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                onClick={() => handleOpenBlog(blog)}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-amber-700 transition-colors cursor-pointer flex flex-col h-full group shadow-sm"
              >
                {/* Thumbnail / Video Banner */}
                <div className="relative h-48 bg-stone-900 overflow-hidden shrink-0">
                  {isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-stone-950">
                      <video
                        src={blog.videoUrl}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent" />
                      <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-md z-10">
                        <Play className="w-5 h-5 fill-white translate-x-0.5" />
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 bg-stone-900/90 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-stone-700 flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>{blogViewLang === "bn" ? "ভিডিও ডকুমেন্টারি" : "Video Documentary"}</span>
                      </span>
                    </div>
                  ) : blog.image ? (
                    <div className="w-full h-full relative">
                      <img
                        src={blog.image}
                        alt={title || "Blog image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-stone-900 p-5 flex flex-col justify-between text-white relative">
                      <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{blog.category || "Jiyonkathi Story"}</span>
                      </div>
                      <p className="text-sm font-bold line-clamp-3 text-stone-100 leading-snug">
                        {title}
                      </p>
                    </div>
                  )}

                  <span className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    {blog.category || (blogViewLang === "bn" ? "ব্লগ" : "Article")}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-stone-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-800" />
                        <span>{blog.date}</span>
                      </span>
                      {blog.readTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{blog.readTime}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center space-x-2 text-xs font-medium text-stone-600">
                      <div className="w-6 h-6 bg-stone-100 text-stone-700 rounded-full flex items-center justify-center font-semibold text-xs border border-stone-200">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-[120px]">{blog.author || "জিয়নকাঠি টিম"}</span>
                    </div>

                    <button className="text-amber-800 font-semibold text-xs flex items-center space-x-1">
                      <span>{blogViewLang === "bn" ? "বিস্তারিত পড়ুন" : "Read Full Story"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FULL BLOG MODAL DIALOG */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBlog}
              className="fixed inset-0 bg-stone-900/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden border border-stone-300 z-10 max-h-[90vh] flex flex-col my-auto"
            >
              {/* Sticky Top Header */}
              <div className="sticky top-0 bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center justify-between z-20">
                <div className="flex items-center space-x-2.5">
                  <span className="bg-stone-100 text-stone-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-stone-200">
                    {selectedBlog.category || (blogViewLang === "bn" ? "ব্লগ বিবরণ" : "Blog Details")}
                  </span>
                  <span className="text-xs text-stone-500">
                    {selectedBlog.date}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setOverrideLang(blogViewLang === "bn" ? "en" : "bn")}
                    className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-300 text-stone-700 flex items-center space-x-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-800" />
                    <span>{blogViewLang === "bn" ? "English Version" : "বাংলা সংস্করণ"}</span>
                  </button>

                  <button
                    onClick={handleCloseBlog}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                    title="Close Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-grow text-stone-800">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  {blogViewLang === "bn"
                    ? (selectedBlog.titleBengali || selectedBlog.title)
                    : (selectedBlog.titleEnglish || selectedBlog.title)}
                </h2>

                <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-xs">{selectedBlog.author || "জিয়নকাঠি টিম"}</p>
                      <p className="text-[11px] text-stone-500">{selectedBlog.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-stone-600">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                    <span>
                      {(selectedBlog.commentsCount || 0) + (comments[selectedBlog.id]?.length || 0)}{" "}
                      {blogViewLang === "bn" ? "মন্তব্য" : "comments"}
                    </span>
                  </div>
                </div>

                {/* Media Player / Image Display */}
                {selectedBlog.type === "video" || selectedBlog.videoUrl ? (
                  <div className="bg-black rounded-lg overflow-hidden shadow-sm aspect-video relative">
                    <video
                      src={selectedBlog.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  selectedBlog.image && (
                    <div className="rounded-lg overflow-hidden shadow-sm max-h-80">
                      <img
                        src={selectedBlog.image}
                        alt={selectedBlog.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )
                )}

                {/* Full Article Text */}
                <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {blogViewLang === "bn"
                    ? (selectedBlog.contentBengali || selectedBlog.content || selectedBlog.excerpt)
                    : (selectedBlog.contentEnglish || selectedBlog.content || selectedBlog.excerptEnglish || selectedBlog.excerpt)}
                </div>

                {/* Interactive Comments Section */}
                <div className="pt-6 border-t border-stone-200 space-y-4">
                  <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-amber-800" />
                    <span>{blogViewLang === "bn" ? "পাঠকদের মতামত ও মন্তব্য" : "Comments & Reactions"}</span>
                  </h3>

                  <form onSubmit={handleAddComment} className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder={blogViewLang === "bn" ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 bg-white"
                      />
                    </div>
                    <textarea
                      rows={3}
                      required
                      placeholder={blogViewLang === "bn" ? "আপনার মন্তব্য বা মতামত এখানে লিখুন..." : "Write your thoughts or comment here..."}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-700 bg-white"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {commentSuccess && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{blogViewLang === "bn" ? "মন্তব্য পোস্ট করা হয়েছে!" : "Comment posted successfully!"}</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={commentSubmitting}
                        className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-md ml-auto flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {commentSubmitting
                            ? (blogViewLang === "bn" ? "পোস্ট হচ্ছে..." : "Posting...")
                            : (blogViewLang === "bn" ? "পোস্ট করুন" : "Post Comment")}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Comment List */}
                  <div className="space-y-2">
                    {commentsLoading ? (
                      <p className="text-xs text-stone-500 italic py-2">
                        {blogViewLang === "bn" ? "মন্তব্য লোড হচ্ছে..." : "Loading comments..."}
                      </p>
                    ) : (comments[selectedBlog.id] || []).length === 0 ? (
                      <p className="text-xs text-stone-500 italic">
                        {blogViewLang === "bn" ? "এখনও কোনো নতুন মন্তব্য দেওয়া হয়নি। আপনার মতপ্রকাশ করুন!" : "No new comments yet. Be the first to share your thoughts!"}
                      </p>
                    ) : (
                      (comments[selectedBlog.id] || []).map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-md border border-stone-200 space-y-1">
                          <div className="flex justify-between items-center text-xs font-semibold text-stone-800">
                            <span>{c.author}</span>
                            <span className="text-[10px] text-stone-400 font-normal">
                              {c.created_at ? new Date(c.created_at).toLocaleDateString() : (c.date || (blogViewLang === "bn" ? "সম্প্রতি" : "Recently"))}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
                <button
                  onClick={() => handleShareBlog(selectedBlog)}
                  className="text-stone-700 hover:text-stone-900 font-semibold text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-stone-300 bg-white cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>{blogViewLang === "bn" ? "শেয়ার করুন" : "Share"}</span>
                </button>

                <button
                  onClick={handleCloseBlog}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs px-4 py-2 rounded-md transition-colors cursor-pointer"
                >
                  {blogViewLang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
