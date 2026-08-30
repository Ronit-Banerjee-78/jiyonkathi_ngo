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

export default function BlogSection() {
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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedBlog) return;

    const blogId = selectedBlog.id;
    const currentList = comments[blogId] || [];
    const newEntry = {
      id: Date.now(),
      author: authorName.trim() || (blogViewLang === "bn" ? "হিতৈষী পাঠক" : "Anonymous Reader"),
      text: newComment.trim(),
      date: blogViewLang === "bn" ? "এখনই" : "Just now"
    };

    setComments({
      ...comments,
      [blogId]: [newEntry, ...currentList]
    });

    setNewComment("");
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <div className="py-14 sm:py-20 bg-[#faf7f0] w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header & Language Switcher for Blog */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-stone-200/90 pb-8">
          <div className="space-y-3 max-w-2xl">
            {/* <span className="text-amber-800 bg-amber-100/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300/70 inline-block">
              {blogViewLang === "bn" ? "জিয়নকাঠি বার্তা ও ব্লগ" : "Jiyonkathi Blog & Stories"}
            </span> */}
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
              {blogViewLang === "bn"
                ? "প্রকৃতি, পরিবেশ ও গ্রামীণ জীবনের অভিজ্ঞতা"
                : "Stories of Sustainable Living & Rural Joy"}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
              {blogViewLang === "bn"
                ? "দেশীয় ধান ও বীজ সংরক্ষণ, বিষমুক্ত কৃষি, সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতিবান্ধব জীবনযাপনের সচিত্র প্রতিবেদন।"
                : "Documented stories of indigenous heirloom seed conservation, organic farming, and village learning centers."}
            </p>
          </div>

          {/* Bilingual Reading Switcher */}
          <div className="flex items-center space-x-2 self-start md:self-end bg-white p-1.5 rounded-2xl border border-stone-200 shadow-2xs">
            <Globe className="w-4 h-4 text-amber-700 ml-2" />
            <button
              onClick={() => setOverrideLang("bn")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${blogViewLang === "bn"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
            >
              বাংলায় পড়ুন
            </button>
            <button
              onClick={() => setOverrideLang("en")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${blogViewLang === "en"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
            >
              Read in English
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-amber-300"
                  }`}
              >
                {cat === "all" ? (blogViewLang === "bn" ? "সকল বার্তা" : "All Stories") : cat}
              </button>
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                onClick={() => setSelectedBlog(blog)}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer flex flex-col h-full group"
              >
                {/* Thumbnail / Video Banner */}
                <div className="relative h-52 bg-stone-900 overflow-hidden shrink-0">
                  {isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-stone-950">
                      <video
                        src={blog.videoUrl}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent" />
                      <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </div>
                      <span className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-stone-700 flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>{blogViewLang === "bn" ? "ভিডিও ডকুমেন্টারি" : "Video Documentary"}</span>
                      </span>
                    </div>
                  ) : blog.image ? (
                    <div className="w-full h-full relative">
                      <img
                        src={blog.image}
                        alt={title || "Blog image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950 p-6 flex flex-col justify-between text-white relative">
                      <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{blog.category || "Jiyonkathi Story"}</span>
                      </div>
                      <p className="text-sm font-bold line-clamp-3 text-stone-100 leading-snug">
                        {title}
                      </p>
                    </div>
                  )}

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-stone-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                    {blog.category || (blogViewLang === "bn" ? "ব্লগ" : "Article")}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-stone-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
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

                    <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 font-medium">
                      {excerpt}
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-stone-600">
                      <div className="w-7 h-7 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-xs border border-amber-200">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate max-w-[120px]">{blog.author || "জিয়নকাঠি টিম"}</span>
                    </div>

                    <button className="text-amber-700 font-black text-xs flex items-center space-x-1 group-hover:space-x-2 transition-all">
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
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10 max-h-[90vh] flex flex-col my-auto"
            >
              {/* Sticky Top Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between z-20">
                <div className="flex items-center space-x-3">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200">
                    {selectedBlog.category || (blogViewLang === "bn" ? "ব্লগ বিবরণ" : "Blog Details")}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    {selectedBlog.date}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setOverrideLang(blogViewLang === "bn" ? "en" : "bn")}
                    className="text-xs font-bold px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 flex items-center space-x-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-700" />
                    <span>{blogViewLang === "bn" ? "English Version" : "বাংলা সংস্করণ"}</span>
                  </button>

                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                    title="Close Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                  {blogViewLang === "bn"
                    ? (selectedBlog.titleBengali || selectedBlog.title)
                    : (selectedBlog.titleEnglish || selectedBlog.title)}
                </h2>

                <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{selectedBlog.author || "জিয়নকাঠি টিম"}</p>
                      <p className="text-[11px] text-stone-400">{selectedBlog.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {(selectedBlog.commentsCount || 0) + (comments[selectedBlog.id]?.length || 0)}{" "}
                        {blogViewLang === "bn" ? "মন্তব্য" : "comments"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Media Player / Image Display */}
                {selectedBlog.type === "video" || selectedBlog.videoUrl ? (
                  <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video relative">
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
                    <div className="rounded-2xl overflow-hidden shadow-md max-h-96">
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
                <div className="prose prose-stone max-w-none space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line">
                  {blogViewLang === "bn"
                    ? (selectedBlog.contentBengali || selectedBlog.content || selectedBlog.excerpt)
                    : (selectedBlog.contentEnglish || selectedBlog.content || selectedBlog.excerptEnglish || selectedBlog.excerpt)}
                </div>

                {/* Interactive Comments Section */}
                <div className="pt-8 border-t border-stone-200 space-y-6">
                  <h3 className="text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    <span>{blogViewLang === "bn" ? "পাঠকদের মতামত ও মন্তব্য" : "Comments & Reactions"}</span>
                  </h3>

                  <form onSubmit={handleAddComment} className="bg-[#faf7f0] p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={blogViewLang === "bn" ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <textarea
                      rows={3}
                      required
                      placeholder={blogViewLang === "bn" ? "আপনার মন্তব্য বা মতামত এখানে লিখুন..." : "Write your thoughts or comment here..."}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {commentSuccess && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{blogViewLang === "bn" ? "মন্তব্য পোস্ট করা হয়েছে!" : "Comment posted successfully!"}</span>
                        </span>
                      )}
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs ml-auto flex items-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{blogViewLang === "bn" ? "পোস্ট করুন" : "Post Comment"}</span>
                      </button>
                    </div>
                  </form>

                  {/* Comment List */}
                  <div className="space-y-3">
                    {(comments[selectedBlog.id] || []).length === 0 ? (
                      <p className="text-xs text-stone-400 italic">
                        {blogViewLang === "bn" ? "এখনও কোনো নতুন মন্তব্য দেওয়া হয়নি। আপনার মতপ্রকাশ করুন!" : "No new comments yet. Be the first to share your thoughts!"}
                      </p>
                    ) : (
                      (comments[selectedBlog.id] || []).map((c) => (
                        <div key={c.id} className="bg-white p-4 rounded-xl border border-stone-150 space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                            <span>{c.author}</span>
                            <span className="text-[10px] text-stone-400 font-normal">{c.date}</span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedBlog.title,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(blogViewLang === "bn" ? "লিঙ্ক কপি করা হয়েছে!" : "Link copied to clipboard!");
                    }
                  }}
                  className="text-stone-600 hover:text-stone-900 font-bold text-xs flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{blogViewLang === "bn" ? "শেয়ার করুন" : "Share"}</span>
                </button>

                <button
                  onClick={() => setSelectedBlog(null)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
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
