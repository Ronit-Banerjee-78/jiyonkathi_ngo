"use client";

import React, { useState, useEffect, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import ImageSelectorField from "./common/ImageSelectorField";
import {
  BarChart3,
  BookOpen,
  Compass,
  Users,
  Image as ImageIcon,
  HeartHandshake,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  Calendar,
  Eye,
  FileText,
  Upload,
  ArrowLeft,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Sparkles,
  AlertCircle,
  Video,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  RefreshCw,
  FolderUp,
  Tag,
  AlignLeft,
  Play,
  Phone,
  Mail,
  MapPin,
  Globe,
  Quote,
  Menu,
  ChevronRight,
  ChevronDown,
  Home,
  UserMinus,
  LogOut
} from "lucide-react";

export default function AdminDashboard({ userSession, setUserSession, onLogout, setActiveTab: setMainTabFromProps }) {
  const {
    siteData,
    setSiteData: saveSiteData,
    language,
    setActiveTab: setMainActiveTab,
    refreshReports,
  } = useContext(SiteContext);

  const [activeTab, setActiveTab] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(() => siteData || {});
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Modals state for creation of anything
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [isPdfExtracting, setIsPdfExtracting] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfSuccessMsg, setPdfSuccessMsg] = useState("");
  const [galleryFilter, setGalleryFilter] = useState("all");

  const [reportImagesUploading, setReportImagesUploading] = useState(false);
  const [reportImageUploadMsg, setReportImageUploadMsg] = useState("");
  const [showReportGalleryPicker, setShowReportGalleryPicker] = useState(false);
  const [customReportImageUrl, setCustomReportImageUrl] = useState("");

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadMsg, setVideoUploadMsg] = useState("");

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogLangMode, setBlogLangMode] = useState("both"); // "both" | "bn" | "en"

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);

  const [showPillarModal, setShowPillarModal] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);

  // Reports & Volunteers
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [volFilter, setVolFilter] = useState("all");
  const [volLoading, setVolLoading] = useState(false);

  const [prevSiteData, setPrevSiteData] = useState(siteData);
  if (siteData !== prevSiteData) {
    setPrevSiteData(siteData);
    setData(siteData || {});
  }

  // Always scroll to top when accessing admin menu or changing tabs
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeTab]);

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const json = await res.json();
      if (json.success && Array.isArray(json.reports)) {
        setReports(json.reports);
      }
    } catch (err) {
      console.error("Error fetching reports in admin:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  // Fetch Volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteers");
      const json = await res.json();
      if (json.success && Array.isArray(json.volunteers)) {
        setVolunteers(json.volunteers);
      }
    } catch (err) {
      console.error("Error fetching volunteers in admin:", err);
    } finally {
      setVolLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/reports")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.reports)) {
          setReports(json.reports);
        }
      })
      .catch((err) => console.error("Error fetching reports:", err));

    fetch("/api/volunteers")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.volunteers)) {
          setVolunteers(json.volunteers);
        }
      })
      .catch((err) => console.error("Error fetching volunteers:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Universal Global Save for SiteContext Managed Data
  const handleSaveGlobal = async (updatedData = null) => {
    setSaveLoading(true);
    const toSave = updatedData || data;
    try {
      await saveSiteData(toSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Error saving data: " + e.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // File Upload Helper
  const handleFileUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        return json.url;
      }
      alert(json.error || "File upload failed");
      return null;
    } catch (e) {
      alert("Upload failed: " + e.message);
      return null;
    }
  };

  // Video embed helper
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/embed/")) return url;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  };

  // Video Upload Handler with Auto-Save
  const handleVideoUploadWithSave = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    setVideoUploadMsg("ভিডিও ক্লাউডিনারিতে আপলোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।");

    try {
      const url = await handleFileUpload(file);
      if (url) {
        const updated = {
          ...data,
          homepageVideo: { ...(data.homepageVideo || {}), url },
        };
        setData(updated);
        await handleSaveGlobal(updated);
        setVideoUploadMsg("✓ ভিডিও সফলভাবে ক্লাউডিনারিতে আপলোড ও হোমপেজের জন্য সেভ হয়েছে!");
        setTimeout(() => setVideoUploadMsg(""), 5000);
      }
    } catch (err) {
      alert("ভিডিও আপলোড ত্রুটি: " + err.message);
      setVideoUploadMsg("");
    } finally {
      setVideoUploading(false);
      e.target.value = "";
    }
  };
  const autoAddImageToGallery = (url, file, customTitle = "", customCategory = "events") => {
    if (!url) return;
    const fileNameClean = file?.name
      ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      : "আলোকচিত্র";
    const itemTitle = customTitle || fileNameClean || "জিয়নকাঠি আলোকচিত্র";

    setData((prev) => {
      const currentGallery = prev?.gallery || [];
      if (currentGallery.some((g) => g.url === url)) return prev;

      const newGalleryItem = {
        id: `gal-${Date.now()}`,
        title: itemTitle,
        url: url,
        category: customCategory || "events",
        description: `আপলোড থেকে যুক্ত: ${itemTitle}`,
        publishedAt: new Date().toISOString(),
        rank: currentGallery.length + 1,
      };

      const updated = {
        ...prev,
        gallery: [newGalleryItem, ...currentGallery],
      };
      // Persist without clobbering other fields
      saveSiteData(updated);
      return updated;
    });
  };

  // PDF File Upload & Auto-Extraction for Research Reports
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("অনুগ্রহ করে শুধুমাত্র .pdf ফাইল নির্বাচন করুন (Please select a .pdf file only).");
      return;
    }

    setIsPdfExtracting(true);
    setPdfProgress(15);
    setPdfSuccessMsg("");

    const progressInterval = setInterval(() => {
      setPdfProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/reports/extract-pdf", {
        method: "POST",
        body: formData,
      });
      clearInterval(progressInterval);
      setPdfProgress(100);

      const json = await res.json();
      if (json.success) {
        const extractedImages = Array.isArray(json.embeddedImages) && json.embeddedImages.length > 0
          ? json.embeddedImages
          : [];
        setEditingReport((prev) => ({
          ...prev,
          title: json.title || prev?.title || "",
          content: json.text || prev?.content || "",
          summary: json.summary || prev?.summary || (json.rawText ? json.rawText.slice(0, 200) : ""),
          downloadUrl: json.downloadUrl || prev?.downloadUrl || "",
          embeddedImages: extractedImages.length > 0 ? extractedImages : (prev?.embeddedImages || []),
          image: extractedImages[0] || prev?.image || "/images/farming-collage.jpg",
        }));
        setPdfSuccessMsg(
          `✓ পিডিএফ ফাইল সফলভাবে প্রক্রিয়া করা হয়েছে! ${extractedImages.length > 0 ? `(${extractedImages.length} টি সংযুক্ত চিত্র সহ)` : ""}`
        );
      } else {
        alert("Extraction error: " + (json.error || "Failed to parse PDF"));
      }
    } catch (err) {
      clearInterval(progressInterval);
      alert("Error reading PDF file: " + err.message);
    } finally {
      setTimeout(() => {
        setIsPdfExtracting(false);
        setPdfProgress(0);
      }, 500);
      e.target.value = "";
    }
  };

  // Upload multiple images for research report (Cloudinary/DB/Memory storage + Auto-gallery sync)
  const handleMultipleReportImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setReportImagesUploading(true);
    setReportImageUploadMsg(`${files.length} টি ছবি আপলোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setReportImageUploadMsg(`ছবি ${i + 1}/${files.length} ক্লাউডে আপলোড হচ্ছে...`);
        const url = await handleFileUpload(file);
        if (url) {
          uploadedUrls.push(url);
          // Auto add to gallery for site references
          autoAddImageToGallery(
            url,
            file,
            editingReport?.title
              ? `${editingReport.title} - চিত্র #${(editingReport.embeddedImages?.length || 0) + uploadedUrls.length}`
              : "প্রতিবেদন রেফারেন্স ছবি",
            "archive"
          );
        }
      }

      if (uploadedUrls.length > 0) {
        setEditingReport((prev) => {
          const currentImgs = Array.isArray(prev?.embeddedImages) ? prev.embeddedImages : [];
          const updatedImgs = [...currentImgs, ...uploadedUrls];
          return {
            ...prev,
            embeddedImages: updatedImgs,
            // If report didn't have a cover image or had placeholder, set first uploaded as main cover
            image: prev?.image && prev.image !== "/images/farming-collage.jpg" ? prev.image : uploadedUrls[0],
          };
        });
        setReportImageUploadMsg(`✓ ${uploadedUrls.length} টি নতুন রেফারেন্স চিত্র সফলভাবে যুক্ত হয়েছে!`);
        setTimeout(() => setReportImageUploadMsg(""), 4500);
      }
    } catch (err) {
      alert("ছবি আপলোডে ত্রুটি: " + err.message);
      setReportImageUploadMsg("");
    } finally {
      setReportImagesUploading(false);
      e.target.value = "";
    }
  };

  const handleAddReportImageFromUrl = (urlToAdd) => {
    const cleanUrl = (urlToAdd || customReportImageUrl).trim();
    if (!cleanUrl) return;

    setEditingReport((prev) => {
      const currentImgs = Array.isArray(prev?.embeddedImages) ? prev.embeddedImages : [];
      if (currentImgs.includes(cleanUrl)) return prev;
      return {
        ...prev,
        embeddedImages: [...currentImgs, cleanUrl],
        image: prev?.image && prev.image !== "/images/farming-collage.jpg" ? prev.image : cleanUrl,
      };
    });
    setCustomReportImageUrl("");
  };

  const handleToggleReportGalleryImage = (url) => {
    if (!url) return;
    setEditingReport((prev) => {
      const currentImgs = Array.isArray(prev?.embeddedImages) ? prev.embeddedImages : [];
      const exists = currentImgs.includes(url);
      const updatedImgs = exists ? currentImgs.filter((u) => u !== url) : [...currentImgs, url];
      return {
        ...prev,
        embeddedImages: updatedImgs,
        image: prev?.image === url && exists
          ? (updatedImgs[0] || "/images/farming-collage.jpg")
          : (prev?.image || url),
      };
    });
  };

  const handleRemoveReportImage = (indexToRemove) => {
    setEditingReport((prev) => {
      const currentImgs = Array.isArray(prev?.embeddedImages) ? [...prev.embeddedImages] : [];
      const removed = currentImgs.splice(indexToRemove, 1)[0];
      return {
        ...prev,
        embeddedImages: currentImgs,
        image: prev?.image === removed ? (currentImgs[0] || "/images/farming-collage.jpg") : prev.image,
      };
    });
  };

  const handleMoveReportImage = (index, direction) => {
    setEditingReport((prev) => {
      const currentImgs = Array.isArray(prev?.embeddedImages) ? [...prev.embeddedImages] : [];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentImgs.length) return prev;
      const temp = currentImgs[index];
      currentImgs[index] = currentImgs[targetIndex];
      currentImgs[targetIndex] = temp;
      return {
        ...prev,
        embeddedImages: currentImgs,
      };
    });
  };

  // Save Research Report via API & Local SiteData
  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!editingReport) return;

    try {
      const method = editingReport.id === "new" ? "POST" : "PUT";
      const url = editingReport.id === "new" ? "/api/reports" : `/api/reports/${editingReport.id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReport),
      });

      const json = await res.json();
      if (json.success) {
        if (editingReport.id === "new") {
          setReports([json.report, ...reports]);
        } else {
          setReports(reports.map((r) => (r.id === editingReport.id ? json.report : r)));
        }
        if (refreshReports) refreshReports();
        setEditingReport(null);
        setShowReportModal(false);
        setPdfSuccessMsg("");
      } else {
        alert(json.error || "Failed to save report");
      }
    } catch (err) {
      alert("Error saving report: " + err.message);
    }
  };

  // Delete Research Report
  const handleDeleteReport = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this research report?")) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReports(reports.filter((r) => r.id !== id));
        if (refreshReports) refreshReports();
      } else {
        alert(json.error || "Failed to delete report");
      }
    } catch (err) {
      alert("Error deleting report: " + err.message);
    }
  };

  // Save / Add Blog via Modal
  const handleSaveBlogModal = (e) => {
    e.preventDefault();
    if (!editingBlog) return;

    let updatedBlogs;
    if (editingBlog.isNew) {
      const newBlog = {
        ...editingBlog,
        id: `blog-${Date.now()}`,
        isNew: undefined,
        rank: Number(editingBlog.rank) || 1,
      };
      updatedBlogs = [newBlog, ...(data.blogs || [])];
    } else {
      updatedBlogs = (data.blogs || []).map((b) => (b.id === editingBlog.id ? editingBlog : b));
    }

    // Sort by rank
    updatedBlogs.sort((a, b) => (Number(a.rank) || 999) - (Number(b.rank) || 999));

    // Auto-sync blog image to gallery if present and not already existing
    let updatedGallery = [...(data.gallery || [])];
    if (editingBlog.image && !updatedGallery.some((g) => g.url === editingBlog.image)) {
      const blogTitle = editingBlog.titleBengali || editingBlog.title || editingBlog.titleEnglish || "ব্লগ আলোকচিত্র";
      const newGalItem = {
        id: `gal-${Date.now()}`,
        title: blogTitle,
        url: editingBlog.image,
        category: editingBlog.category || "events",
        description: `ব্লগ পোস্ট: ${blogTitle}`,
        publishedAt: new Date().toISOString(),
        rank: updatedGallery.length + 1,
      };
      updatedGallery = [newGalItem, ...updatedGallery];
    }

    const updated = { ...data, blogs: updatedBlogs, gallery: updatedGallery };
    setData(updated);
    handleSaveGlobal(updated);
    setEditingBlog(null);
    setShowBlogModal(false);
  };

  // Save / Add Executive Member via Modal
  const handleSaveMemberModal = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    const targetVolId = editingMember.sourceVolunteerId;
    const memberName = editingMember.name?.trim();

    let updatedMembers;
    if (editingMember.isNew) {
      const newMember = {
        ...editingMember,
        id: `mem-${Date.now()}`,
        isNew: undefined,
        sourceVolunteerId: undefined,
        rank: Number(editingMember.rank) || (data.members?.length || 0) + 1,
      };
      updatedMembers = [...(data.members || []), newMember];
    } else {
      const clean = { ...editingMember, sourceVolunteerId: undefined };
      updatedMembers = (data.members || []).map((m) => (m.id === editingMember.id ? clean : m));
    }

    updatedMembers.sort((a, b) => (Number(a.rank) || 999) - (Number(b.rank) || 999));

    // Remove from volunteer applicants / normal members if promoted
    if (targetVolId) {
      try {
        await fetch(`/api/volunteers/${targetVolId}`, { method: "DELETE" });
        setVolunteers((prev) => prev.filter((v) => v.id !== targetVolId));
      } catch (err) {
        console.error("Error deleting promoted volunteer from DB:", err);
      }
    }

    // Also remove from volunteers if matching name
    const matchingVol = volunteers.find(
      (v) => (v.id && v.id === targetVolId) || (v.name && v.name.trim().toLowerCase() === memberName?.toLowerCase())
    );
    if (matchingVol && matchingVol.id) {
      try {
        await fetch(`/api/volunteers/${matchingVol.id}`, { method: "DELETE" });
        setVolunteers((prev) => prev.filter((v) => v.id !== matchingVol.id));
      } catch (err) { }
    }

    // Remove from data.volunteersList in site data
    const updatedVolList = (data.volunteersList || []).filter(
      (v) => (targetVolId ? v.id !== targetVolId : true) && v.name?.trim().toLowerCase() !== memberName?.toLowerCase()
    );

    const updated = { ...data, members: updatedMembers, volunteersList: updatedVolList };
    setData(updated);
    handleSaveGlobal(updated);
    setEditingMember(null);
    setShowMemberModal(false);
  };

  // Convert / Move Executive Member to Normal Members / Volunteers
  const handleChangeMemberToNormal = async (member, mIdx) => {
    if (!confirm(`"${member.name}"-কে কি নির্বাহী পরিষদ থেকে সাধারণ সদস্য / স্বেচ্ছাসেবী তালিকায় স্থানান্তর করতে চান?`)) {
      return;
    }

    setSaveLoading(true);
    try {
      // 1. Remove from executive members list
      const updatedMembers = (data.members || []).filter((_, i) => i !== mIdx);

      // 2. Add as approved volunteer / normal member in DB
      let createdVol = null;
      try {
        const res = await fetch("/api/volunteers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: member.name,
            email: member.email || `${member.name.replace(/\s+/g, "").toLowerCase()}@jiyonkathi.org`,
            phone: member.phone || "",
            location: member.location || "Purba Bardhaman, WB",
            program: member.role || "সাধারণ সদস্য",
            skills: member.bio || "সাবেক নির্বাহী পরিষদ সদস্য",
            motivation: member.bio || "জিয়নকাঠির সাধারণ সদস্য ও স্বেচ্ছাসেবী হিসেবে যুক্ত।",
            status: "approved",
            image: member.image || "",
            isDdbmpbs: true,
          }),
        });
        const json = await res.json();
        if (json.success && json.volunteer) {
          createdVol = json.volunteer;
          setVolunteers((prev) => [json.volunteer, ...prev]);
        }
      } catch (err) {
        console.error("Error creating volunteer record:", err);
      }

      // 3. Add to context volunteersList
      const volId = createdVol?.id || (member.id ? `v-${member.id}` : `v-demoted-${mIdx}`);
      const newVolItem = {
        id: volId,
        name: member.name,
        designation: member.role || "সাধারণ সদস্য",
        location: "Purba Bardhaman, WB",
        image: member.image || "/images/community-collage.jpg",
        bio: member.bio || "জিয়নকাঠির সক্রিয় কর্মী ও সাধারণ সদস্য।",
        isDdbmpbs: true,
      };
      const updatedVolList = [
        newVolItem,
        ...(data.volunteersList || []).filter((v) => v.name !== member.name),
      ];

      const updatedData = { ...data, members: updatedMembers, volunteersList: updatedVolList };
      setData(updatedData);
      await handleSaveGlobal(updatedData);
      alert(`✓ "${member.name}" সফলভাবে সাধারণ সদস্য ও স্বেচ্ছাসেবী তালিকায় স্থানান্তরিত হয়েছেন!`);
    } catch (err) {
      alert("Error moving member: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Save / Add Gallery Item via Modal
  const handleSaveGalleryModal = (e) => {
    e.preventDefault();
    if (!editingGallery) return;

    let updatedGallery;
    if (editingGallery.isNew) {
      const newItem = {
        ...editingGallery,
        id: `gal-${Date.now()}`,
        isNew: undefined,
        rank: Number(editingGallery.rank) || 1,
      };
      updatedGallery = [newItem, ...(data.gallery || [])];
    } else {
      updatedGallery = (data.gallery || []).map((g) => (g.id === editingGallery.id ? editingGallery : g));
    }

    const updated = { ...data, gallery: updatedGallery };
    setData(updated);
    handleSaveGlobal(updated);
    setEditingGallery(null);
    setShowGalleryModal(false);
  };

  // Save / Edit Pillar via Modal (Fixed 2 Pillars)
  const handleSavePillarModal = (e) => {
    e.preventDefault();
    if (!editingPillar) return;

    const currentPillars = (data.pillars || []).slice(0, 2);
    const updatedPillars = currentPillars.map((p, idx) => {
      if (p.id === editingPillar.id || idx === editingPillar.index) {
        return {
          ...p,
          ...editingPillar,
          id: p.id,
          number: p.number || (idx === 0 ? "০১" : "০২"),
        };
      }
      return p;
    }).slice(0, 2);

    const updated = { ...data, pillars: updatedPillars };
    setData(updated);
    handleSaveGlobal(updated);
    setEditingPillar(null);
    setShowPillarModal(false);
  };

  // Generic Move Helper for Array Items
  const handleMoveItem = (collectionKey, index, direction) => {
    const items = [...(data[collectionKey] || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    // Update ranks if rank property exists
    items.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    const updated = { ...data, [collectionKey]: items };
    setData(updated);
    handleSaveGlobal(updated);
  };

  // Update Volunteer Application (Approve / Reject / DDBMPBS)
  const handleUpdateVolunteer = async (id, status, isDdbmpbs = undefined) => {
    try {
      const payload = { status };
      if (isDdbmpbs !== undefined) payload.isDdbmpbs = isDdbmpbs;

      const res = await fetch(`/api/volunteers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, ...json.volunteer } : v))
        );
      }
    } catch (err) {
      alert("Error updating volunteer: " + err.message);
    }
  };

  // Delete Volunteer
  const handleDeleteVolunteer = async (id) => {
    if (!confirm("Delete this volunteer application permanently?")) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      alert("Error deleting volunteer: " + err.message);
    }
  };

  // Analytics Metrics
  const totalReportViews = reports.reduce((acc, r) => acc + (Number(r.views) || 0), 0);
  const topReports = [...reports].sort((a, b) => (b.views || 0) - (a.views || 0));
  const pendingVolunteersCount = volunteers.filter((v) => v.status === "pending").length;
  const approvedVolunteersCount = volunteers.filter((v) => v.status === "approved").length;

  const navSections = [
    {
      group: "পর্যবেক্ষণ ও মূল মিডিয়া",
      items: [
        { id: "analytics", label: "অ্যানালিটিক্স ওভারভিউ", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "homepage_media", label: "হোমপেজ ছবি ও ভিডিও", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "general", label: "সংস্থার তথ্য ও বাণী", icon: <Settings className="w-4 h-4" /> },
      ],
    },
    {
      group: "কার্যক্রম ও প্রকাশনা",
      items: [
        { id: "reports", label: "অন্বেষণ ও রিপোর্ট (.pdf)", icon: <BookOpen className="w-4 h-4" /> },
        { id: "pillars", label: "২টি মূল স্তম্ভ ও লক্ষ্য", icon: <Compass className="w-4 h-4" /> },
        { id: "blogs", label: "ব্লগ ও দ্বিভাষিক বার্তা", icon: <FileText className="w-4 h-4" /> },
        { id: "gallery", label: "ফটো ও ভিডিও গ্যালারি", icon: <FolderUp className="w-4 h-4" /> },
      ],
    },
    {
      group: "দল ও সমাজ",
      items: [
        { id: "members", label: "নির্বাহী সদস্যবৃন্দ", icon: <Users className="w-4 h-4" /> },
        {
          id: "volunteers",
          label: "স্বেচ্ছাসেবী আবেদন",
          icon: <HeartHandshake className="w-4 h-4" />,
          badge: pendingVolunteersCount > 0 ? pendingVolunteersCount : null,
        },
      ],
    },
  ];

  const activeTabMeta = navSections.flatMap((s) => s.items).find((i) => i.id === activeTab);
  const activeGroup = navSections.find((s) => s.items.some((i) => i.id === activeTab));

  return (
    <div className="bg-[#faf8f5] min-h-screen text-stone-800 flex flex-col font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Fixed Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#f4f7f4] text-stone-800 border-r border-emerald-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xs ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-emerald-200/70 bg-white/80 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-xs font-black text-lg">
                জ
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-stone-900 tracking-tight">জিয়নকাঠি কন্ট্রোল</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="সক্রিয় সেশন" />
                </div>
                <p className="text-[11px] text-emerald-800/80 font-semibold">কেন্দ্রীয় অ্যাডমিন প্যানেল</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu (Grouped & Scrollable) */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-emerald-900/70">
                {section.group}
              </div>
              <div className="space-y-1 mt-1">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${isActive
                        ? "bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-xs font-black"
                        : "text-stone-700 hover:text-emerald-950 hover:bg-emerald-100/70 font-semibold"
                        }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={isActive ? "text-white" : "text-emerald-700"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive
                            ? "bg-white text-emerald-900 shadow-2xs"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Dock */}
        <div className="p-4 border-t border-emerald-200/80 bg-white/90 space-y-2.5">
          {/* Quick Global Save Button */}
          <button
            onClick={() => handleSaveGlobal()}
            disabled={saveLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saveLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? "সংরক্ষিত হয়েছে!" : "সকল পরিবর্তন সংরক্ষণ করুন"}</span>
          </button>

          {/* User & Logout */}
          <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-stone-900 truncate">
                  {userSession?.username || "admin@jiyonkathi.org"}
                </div>
                <div className="text-[10px] text-stone-500">অ্যাডমিন একাউন্ট</div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else if (setUserSession) {
                  setUserSession(null);
                }
              }}
              title="লগআউট"
              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Clean Dashboard Top Bar */}
        <header className="bg-white/95 backdrop-blur-xs border-b border-stone-200/90 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-stone-400">
                <span>অ্যাডমিন ড্যাশবোর্ড</span>
                <ChevronRight className="w-3 h-3 text-stone-400" />
                <span className="text-emerald-800 font-bold">{activeTabMeta?.label || "ড্যাশবোর্ড"}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 leading-none mt-0.5">
                {activeTabMeta?.label || "ড্যাশবোর্ড"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {saved ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>সকল তথ্য সংরক্ষিত</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
                <span>লাইভ ডাটাবেজ সিঙ্ক সক্রিয়</span>
              </span>
            )}

            <button
              onClick={() => handleSaveGlobal()}
              disabled={saveLoading}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saveLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>সংরক্ষণ (Save)</span>
            </button>
          </div>
        </header>

        {/* BREADCRUMB NAVIGATION BAR */}
        <div className="bg-stone-50/95 border-b border-stone-200 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center space-x-1.5 font-bold transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-stone-200/60 ${activeTab === "analytics"
                ? "text-emerald-900 font-extrabold bg-emerald-50 border border-emerald-200"
                : "text-stone-600 hover:text-emerald-800"
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ড্যাশবোর্ড</span>
            </button>

            {activeGroup && activeTab !== "analytics" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-600 font-semibold px-1.5 py-0.5">
                  {activeGroup.group}
                </span>
              </>
            )}

            {activeTabMeta && activeTab !== "analytics" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 px-2.5 py-1 rounded-lg font-black flex items-center space-x-1.5 shadow-2xs">
                  <span className="text-emerald-700">{activeTabMeta.icon}</span>
                  <span>{activeTabMeta.label}</span>
                </span>
              </>
            )}
          </nav>

          {/* Quick Breadcrumb Tab Switcher Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-stone-500 hidden md:inline">দ্রুত নেভিগেশন:</span>
            <div className="relative inline-block">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-white border border-stone-300 text-stone-800 rounded-xl pl-3 pr-8 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer shadow-2xs appearance-none"
              >
                {navSections.map((sec) => (
                  <optgroup key={sec.group} label={sec.group}>
                    {sec.items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">

          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-bold uppercase tracking-wider">মোট প্রতিবেদন পাঠ</span>
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-stone-900">{totalReportViews} বার</div>
                  <p className="text-[11px] text-stone-500 font-medium">ওয়েবসাইটে ভিজিটরদের বাস্তব পাঠ সংখ্যা</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-bold uppercase tracking-wider">অন্বেষণ ও রিপোর্ট</span>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-stone-900">{reports.length} টি</div>
                  <p className="text-[11px] text-stone-500 font-medium">ডাটাবেজে সংরক্ষিত মোট ফিল্ড রিপোর্ট</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-orange-700">
                    <span className="text-xs font-bold uppercase tracking-wider">অপেক্ষমান স্বেচ্ছাসেবী</span>
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-stone-900">{pendingVolunteersCount} জন</div>
                  <p className="text-[11px] text-stone-500 font-medium">রিভিউ এবং অনুমোদনের অপেক্ষায়</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-bold uppercase tracking-wider">অনুমোদিত স্বেচ্ছাসেবী</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-stone-900">{approvedVolunteersCount} জন</div>
                  <p className="text-[11px] text-stone-500 font-medium">সক্রিয় সামাজিক সংহতি দল</p>
                </div>
              </div>

              {/* Most Read Reports Table */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg">সর্বাধিক পঠিত অন্বেষণ রিপোর্ট তালিকা</h3>
                    <p className="text-xs text-stone-500">ভিজিটরদের আগ্রহ ও পাঠ সংখ্যা অনুযায়ী র্যাংক</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    সকল রিপোর্ট দেখুন →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">ক্রম</th>
                        <th className="p-3">শিরোনাম (Title)</th>
                        <th className="p-3">বিষয়</th>
                        <th className="p-3">লেখক/টিম</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3 text-right">ভিউ সংখ্যা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {topReports.slice(0, 5).map((rep, idx) => (
                        <tr key={rep.id} className="hover:bg-amber-50/40">
                          <td className="p-3 font-bold text-stone-500">#{idx + 1}</td>
                          <td className="p-3">
                            <div className="font-bold text-stone-900 max-w-sm">{rep.title}</div>
                            {rep.titleEnglish && (
                              <div className="text-[11px] text-stone-500 italic truncate max-w-xs">{rep.titleEnglish}</div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                              {rep.topic}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600">{rep.author}</td>
                          <td className="p-3 text-stone-500">{rep.publishedDate}</td>
                          <td className="p-3 text-right">
                            <span className="font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 inline-block">
                              {rep.views || 0} বার
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE HERO PICTURE & VIDEO CONTROL */}
          {activeTab === "homepage_media" && (
            <div className="space-y-8">
              {/* Header description */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Homepage Visuals & Media Control
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-2">
                  হোমপেজের মূল ছবি (Hero Photo) ও ভিডিও নিয়ন্ত্রণ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  হোমপেজের উপরের প্রধান ব্যানার ছবি, অবস্থান ট্যাগ এবং হোমপেজ ভিডিও প্লেয়ার এখানে পরিবর্তন করুন।
                </p>
              </div>

              {/* SECTION 1: HOMEPAGE HERO BANNER PICTURE */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-stone-900 flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5 text-amber-600" />
                      <span>১. হোমপেজ প্রধান ব্যানার ছবি (Hero Banner Picture)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      হোমপেজের ডানদিকের মূল ব্যানার ছবি ও টেক্সট পরিবর্তন করুন
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveGlobal()}
                    disabled={saveLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saved ? "সংরক্ষিত হয়েছে!" : "ছবি সংরক্ষণ করুন"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form controls */}
                  <div className="lg:col-span-7 space-y-4">
                    <ImageSelectorField
                      label="হোমপেজ প্রধান ছবি (Hero Picture URL) *"
                      value={data.general?.heroImage || "/images/paddy-harvesting.jpg"}
                      onChange={(url) => {
                        const updated = {
                          ...data,
                          general: { ...(data.general || {}), heroImage: url },
                        };
                        setData(updated);
                        handleSaveGlobal(updated);
                      }}
                      galleryItems={data.gallery || []}
                      category="farming"
                      onUploadAutoAddToGallery={(url, file) => {
                        autoAddImageToGallery(url, file, "হোমপেজ ব্যানার ছবি", "farming");
                      }}
                      helperText="গ্যালারি থেকে পছন্দ করুন অথবা সরাসরি আপনার কম্পিউটার থেকে নতুন ছবি আপলোড করুন।"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">ছবির ব্যাজ ট্যাগ (বাংলা)</label>
                        <input
                          type="text"
                          value={data.general?.heroBadgeBengali || "প্রাকৃতিক উপায়ে বীজতলা"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroBadgeBengali: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-amber-900"
                          placeholder="যেমন: প্রাকৃতিক উপায়ে বীজতলা"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Badge Tag (English)</label>
                        <input
                          type="text"
                          value={data.general?.heroBadgeEnglish || "Natural Seed Bank"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroBadgeEnglish: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                          placeholder="e.g. Natural Seed Bank"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">অবস্থান / লোকেশন (বাংলা)</label>
                        <input
                          type="text"
                          value={data.general?.heroLocationBengali || "স্থান: আউশগ্রাম, বর্ধমান"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroLocationBengali: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          placeholder="যেমন: স্থান: আউশগ্রাম, বর্ধমান"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Location (English)</label>
                        <input
                          type="text"
                          value={data.general?.heroLocationEnglish || "Location: Aushgram, Burdwan"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroLocationEnglish: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          placeholder="e.g. Location: Aushgram, Burdwan"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">কেন্দ্রের নাম (বাংলা)</label>
                        <input
                          type="text"
                          value={data.general?.heroStationBengali || "মাঠ অন্বেষণ কেন্দ্র"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroStationBengali: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          placeholder="যেমন: মাঠ অন্বেষণ কেন্দ্র"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Station / Tag (English)</label>
                        <input
                          type="text"
                          value={data.general?.heroStationEnglish || "Field Station"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              general: { ...(data.general || {}), heroStationEnglish: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          placeholder="e.g. Field Station"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">ছবির শিরোনাম ও বিবরণ (বাংলা)</label>
                      <input
                        type="text"
                        value={data.general?.heroTitleBengali || "রাসায়নিক সার ও কীটনাশকমুক্ত দেশীয় ধান ও ফল-সবজি উৎপাদনের মডেল"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            general: { ...(data.general || {}), heroTitleBengali: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                        placeholder="যেমন: রাসায়নিক সার ও কীটনাশকমুক্ত দেশীয় ধান..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Title & Caption (English)</label>
                      <input
                        type="text"
                        value={data.general?.heroTitleEnglish || "Heirloom Agro-Ecology & Sustainable Food Sovereignty"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            general: { ...(data.general || {}), heroTitleEnglish: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        placeholder="e.g. Heirloom Agro-Ecology..."
                      />
                    </div>
                  </div>

                  {/* Live Preview of Hero Card */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-xs font-black text-stone-600 uppercase tracking-wider block">
                      হোমপেজ ব্যানার প্রিভিউ (Live Card Preview)
                    </span>
                    <div className="bg-white p-3 sm:p-4 rounded-3xl border border-amber-300 shadow-md relative">
                      <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 relative">
                        <img
                          key={data.general?.heroImage || "hero-img-preview"}
                          src={data.general?.heroImage || "/images/paddy-harvesting.jpg"}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (!e.target.src.includes("/images/paddy-harvesting.jpg")) {
                              e.target.src = "/images/paddy-harvesting.jpg";
                            }
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-black px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{data.general?.heroBadgeBengali || "প্রাকৃতিক উপায়ে বীজতলা"}</span>
                        </div>
                      </div>

                      <div className="p-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                          <span>{data.general?.heroLocationBengali || "স্থান: আউশগ্রাম, বর্ধমান"}</span>
                          <span className="text-amber-700 font-bold">{data.general?.heroStationBengali || "মাঠ অন্বেষণ কেন্দ্র"}</span>
                        </div>
                        <h3 className="text-sm font-black text-stone-900 leading-snug">
                          {data.general?.heroTitleBengali || "রাসায়নিক সার ও কীটনাশকমুক্ত দেশীয় ধান ও ফল-সবজি উৎপাদনের মডেল"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: HOMEPAGE VIDEO SHOWCASE */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-stone-900 flex items-center space-x-2">
                      <Video className="w-5 h-5 text-amber-600" />
                      <span>২. হোমপেজ ভিডিও ও ফিল্ড ভিজ্যুয়াল (Homepage Video Player)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      ক্লাউডিনারিতে ভিডিও ফাইল আপলোড করুন অথবা ইউটিউব / ডিরেক্ট ভিডিও লিঙ্ক দিন
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveGlobal()}
                    disabled={saveLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>ভিডিও সংরক্ষণ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Video Form */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        ভিডিও লিঙ্ক (Direct Video / Cloudinary / YouTube URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={data.homepageVideo?.url || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              homepageVideo: { ...(data.homepageVideo || {}), url: e.target.value },
                            })
                          }
                          placeholder="https://res.cloudinary.com/... বা https://www.youtube.com/watch?v=..."
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                        />
                        <label
                          className={`cursor-pointer font-bold text-xs px-4 py-2.5 rounded-xl border shrink-0 flex items-center justify-center space-x-1.5 transition-all ${videoUploading
                            ? "bg-amber-100 border-amber-300 text-amber-900 cursor-not-allowed opacity-80"
                            : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs"
                            }`}
                        >
                          <Upload className={`w-4 h-4 ${videoUploading ? "animate-spin text-amber-600" : "text-amber-700"}`} />
                          <span>{videoUploading ? "আপলোড হচ্ছে..." : "ভিডিও আপলোড"}</span>
                          <input
                            type="file"
                            accept="video/*"
                            disabled={videoUploading}
                            onChange={handleVideoUploadWithSave}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {videoUploadMsg && (
                        <p
                          className={`text-xs font-bold p-2 rounded-lg border ${videoUploadMsg.startsWith("✓")
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                        >
                          {videoUploadMsg}
                        </p>
                      )}
                    </div>

                    <ImageSelectorField
                      label="ভিডিও পোস্টার ইমেজ (Video Cover Image)"
                      value={data.homepageVideo?.poster || ""}
                      onChange={(url) =>
                        setData({
                          ...data,
                          homepageVideo: { ...(data.homepageVideo || {}), poster: url },
                        })
                      }
                      galleryItems={data.gallery || []}
                      category="farming"
                      onUploadAutoAddToGallery={(url, file) => {
                        autoAddImageToGallery(url, file, data.homepageVideo?.title || "ভিডিও পোস্টার", "farming");
                      }}
                      helperText="ভিডিও প্লে হওয়ার আগে যে কভার ছবিটি দেখা যাবে।"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">ভিডিও শিরোনাম (বাংলা)</label>
                        <input
                          type="text"
                          value={data.homepageVideo?.title || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              homepageVideo: { ...(data.homepageVideo || {}), title: e.target.value },
                            })
                          }
                          placeholder="মাটির টানে, মানুষের সাথে জিয়নকাঠি"
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Video Title (English)</label>
                        <input
                          type="text"
                          value={data.homepageVideo?.titleEnglish || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              homepageVideo: { ...(data.homepageVideo || {}), titleEnglish: e.target.value },
                            })
                          }
                          placeholder="Living with Nature: Jiyonkathi in Action"
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">ভিডিওর বিবরণ (বাংলা)</label>
                      <textarea
                        rows={3}
                        value={data.homepageVideo?.description || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            homepageVideo: { ...(data.homepageVideo || {}), description: e.target.value },
                          })
                        }
                        placeholder="আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে দেশীয় ধান চাষের প্রদর্শনী খামার..."
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Description (English)</label>
                      <textarea
                        rows={3}
                        value={data.homepageVideo?.descriptionEnglish || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            homepageVideo: { ...(data.homepageVideo || {}), descriptionEnglish: e.target.value },
                          })
                        }
                        placeholder="A window into our decentralized ecological seedbed nursery..."
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Right Video Live Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="text-xs font-black text-stone-600 uppercase tracking-wider">
                      হোমপেজ ভিডিও প্রিভিউ (Live Video Preview)
                    </div>
                    <div className="bg-stone-900 rounded-2xl overflow-hidden aspect-video border border-stone-300 relative flex items-center justify-center shadow-md">
                      {(() => {
                        const videoUrl = data.homepageVideo?.url?.trim();
                        if (!videoUrl) {
                          return (
                            <div className="text-center p-6 text-stone-400 space-y-2">
                              <Video className="w-8 h-8 mx-auto text-amber-500" />
                              <p className="text-xs font-bold">ভিডিও ফাইল আপলোড করুন বা লিঙ্ক দিন</p>
                            </div>
                          );
                        }

                        const embedUrl = getYouTubeEmbedUrl(videoUrl);
                        if (embedUrl) {
                          return (
                            <iframe
                              src={embedUrl}
                              title="Preview Video"
                              className="w-full h-full border-0 aspect-video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          );
                        }

                        return (
                          <video
                            key={videoUrl}
                            src={videoUrl}
                            poster={data.homepageVideo?.poster}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          >
                            <source src={videoUrl} />
                            Your browser does not support the video tag.
                          </video>
                        );
                      })()}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                      <div className="text-xs font-black text-amber-900">
                        {data.homepageVideo?.title || "মাটির টানে, মানুষের সাথে জিয়নকাঠি"}
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        {data.homepageVideo?.description || "আউশগ্রাম ও বীরভূমের প্রত্যন্ত পল্লীতে মাঠ কার্যক্রম..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ABOUT US 3 FIELD ARCHIVE PICTURES */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-stone-900 flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                      <span>৩. &quot;আমাদের কথা&quot; (About Us) পেজের ৩টি ফিল্ড চিত্র ও বিবরণ</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      আমাদের কথা পেজে প্রদর্শিত তিনটি মূল ক্ষেত্রভিত্তিক আলোকচিত্র (কৃষি ও বীজ, সামাজিক শিক্ষা, ও জীববৈচিত্র্য) পরিবর্তন করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveGlobal()}
                    disabled={saveLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>তথ্য ও ছবি সংরক্ষণ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 3.1: Indigenous Farming & Seed Bank */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                        ১. দেশীয় ধান ও বীজ সংরক্ষণ
                      </div>
                      <ImageSelectorField
                        label="ছবির লিঙ্ক (Image URL)"
                        value={data.about?.farmingImage || "/images/farming-collage.jpg"}
                        onChange={(url) =>
                          setData({
                            ...data,
                            about: { ...(data.about || {}), farmingImage: url },
                          })
                        }
                        galleryItems={data.gallery || []}
                        category="farming"
                        onUploadAutoAddToGallery={(url, file) => {
                          autoAddImageToGallery(url, file, "বীজ সংরক্ষণ চিত্রমালা", "farming");
                        }}
                        helperText="গ্যালারি থেকে নিন বা ডিভাইস থেকে সরাসরি আপলোড করুন।"
                      />
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">শিরোনাম (বাংলা)</label>
                        <input
                          type="text"
                          value={data.about?.farmingTitleBn || "দেশীয় ধান ও বীজ সংরক্ষণ প্রক্রিয়া"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), farmingTitleBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">Title (English)</label>
                        <input
                          type="text"
                          value={data.about?.farmingTitleEn || "Indigenous Paddy & Seed Processing"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), farmingTitleEn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                        <textarea
                          rows={2}
                          value={data.about?.farmingDescBn || "বীজতলা, নিড়ানো, ধান কাটা, ঢেঁকিতে প্রক্রিয়াজাতকরণ ও প্রজাতি সংরক্ষণ।"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), farmingDescBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3.2: Community Education & Culture */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg inline-block">
                        ২. সামাজিক শিক্ষা ও সংস্কৃতি
                      </div>
                      <ImageSelectorField
                        label="ছবির লিঙ্ক (Image URL)"
                        value={data.about?.communityImage || "/images/community-collage.jpg"}
                        onChange={(url) =>
                          setData({
                            ...data,
                            about: { ...(data.about || {}), communityImage: url },
                          })
                        }
                        galleryItems={data.gallery || []}
                        category="events"
                        onUploadAutoAddToGallery={(url, file) => {
                          autoAddImageToGallery(url, file, "সামাজিক শিক্ষা ও সাংস্কৃতিক সমাবেশ", "events");
                        }}
                        helperText="গ্যালারি থেকে নিন বা ডিভাইস থেকে সরাসরি আপলোড করুন।"
                      />
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">শিরোনাম (বাংলা)</label>
                        <input
                          type="text"
                          value={data.about?.communityTitleBn || "সামাজিক শিক্ষা ও সাংস্কৃতিক মেলবন্ধন"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), communityTitleBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">Title (English)</label>
                        <input
                          type="text"
                          value={data.about?.communityTitleEn || "Community Education & Festival"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), communityTitleEn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                        <textarea
                          rows={2}
                          value={data.about?.communityDescBn || "সহায়ক শিক্ষা কেন্দ্র, বসন্ত উৎসব, সর্প সচেতনতা ও স্বাস্থ্য শিবির।"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), communityDescBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3.3: Ecology & Biodiversity */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                        ৩. বিষমুক্ত ফসল ও জীববৈচিত্র্য
                      </div>
                      <ImageSelectorField
                        label="ছবির লিঙ্ক (Image URL)"
                        value={data.about?.ecologyImage || "/images/ecology-collage.jpg"}
                        onChange={(url) =>
                          setData({
                            ...data,
                            about: { ...(data.about || {}), ecologyImage: url },
                          })
                        }
                        galleryItems={data.gallery || []}
                        category="farming"
                        onUploadAutoAddToGallery={(url, file) => {
                          autoAddImageToGallery(url, file, "বিষমুক্ত জীববৈচিত্র্য ফসল", "farming");
                        }}
                        helperText="গ্যালারি থেকে নিন বা ডিভাইস থেকে সরাসরি আপলোড করুন।"
                      />
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">শিরোনাম (বাংলা)</label>
                        <input
                          type="text"
                          value={data.about?.ecologyTitleBn || "বিষমুক্ত ফসল ও প্রাকৃতিক জীববৈচিত্র্য"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), ecologyTitleBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">Title (English)</label>
                        <input
                          type="text"
                          value={data.about?.ecologyTitleEn || "Organic Produce & Biodiversity"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), ecologyTitleEn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                        <textarea
                          rows={2}
                          value={data.about?.ecologyDescBn || "বিষমুক্ত ফল, বীজ সংরক্ষণের কাঁচের বোতল, স্থানীয় মৎস্য ও বাস্তুতন্ত্র।"}
                          onChange={(e) =>
                            setData({
                              ...data,
                              about: { ...(data.about || {}), ecologyDescBn: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: WEBSITE LOGO & BRAND IMAGE */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-stone-900 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>৪. সংস্থার প্রধান লোগো চিত্র (Website Logo)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      হেডার এবং ওয়েবসাইটের মূল লোগো পরিবর্তন বা নতুন আপলোড করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveGlobal()}
                    disabled={saveLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>লোগো সংরক্ষণ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <ImageSelectorField
                      label="লোগো ছবির লিঙ্ক (Logo Image URL)"
                      value={data.general?.logoImage || "/images/logo.svg"}
                      onChange={(url) =>
                        setData({
                          ...data,
                          general: { ...(data.general || {}), logoImage: url },
                        })
                      }
                      galleryItems={data.gallery || []}
                      category="branding"
                      onUploadAutoAddToGallery={(url, file) => {
                        autoAddImageToGallery(url, file, "অফিসিয়াল লোগো", "branding");
                      }}
                      helperText="SVG, PNG বা JPG ফরম্যাটের পরিচ্ছন্ন ব্যাকগ্রাউন্ডের লোগো ব্যবহার করুন।"
                    />
                  </div>
                  <div className="p-6 bg-stone-100 rounded-2xl border border-stone-200 flex flex-col items-center justify-center space-y-2">
                    <span className="text-[11px] font-bold text-stone-500">লোগো প্রিভিউ (Live Preview)</span>
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-3">
                      <img
                        src={data.general?.logoImage || "/images/logo.svg"}
                        alt="Logo Preview"
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/images/logo.svg";
                        }}
                      />
                      <div>
                        <div className="text-sm font-black text-stone-900">{data.general?.title || "Jiyonkathi (জিয়নকাঠি)"}</div>
                        <div className="text-[10px] text-amber-700 font-bold">{data.general?.subTitle || "A Sustainable Living Community"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL SITE INFO, QUOTES & METRICS */}
          {activeTab === "general" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Global Information
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-2">সাধারণ তথ্য, স্লোগান ও পরিসংখ্যান</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  সংস্থার নাম, ব্যানার লেখা, হোমপেজ বাণী, যোগাযোগ ও পরিসংখ্যান আপডেট করুন।
                </p>
              </div>

              {/* Section A: Organization Brand & Slogan */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-stone-900 text-sm flex items-center space-x-2 border-b border-stone-100 pb-2">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>সংস্থার নাম ও শিরোনাম</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">সংস্থার নাম (Title / Logo Text)</label>
                    <input
                      type="text"
                      value={data.general?.title || "জিয়নকাঠি (Jiyonkathi)"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), title: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">স্লোগান / ট্যাগলাইন</label>
                    <input
                      type="text"
                      value={data.general?.subTitle || "A Sustainable Living Community"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), subTitle: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Logo control in General Tab */}
                <div className="pt-2">
                  <ImageSelectorField
                    label="সংস্থার লোগো ছবি (Website Logo Image)"
                    value={data.general?.logoImage || "/images/logo.svg"}
                    onChange={(url) =>
                      setData({
                        ...data,
                        general: { ...(data.general || {}), logoImage: url },
                      })
                    }
                    galleryItems={data.gallery || []}
                    category="branding"
                    onUploadAutoAddToGallery={(url, file) => {
                      autoAddImageToGallery(url, file, "লোগো", "branding");
                    }}
                    helperText="হেডারের লোগো প্রতিস্থাপন করতে পছন্দের ছবি দিন বা সরাসরি আপলোড করুন।"
                  />
                </div>
              </div>

              {/* Section B: Hero Banner Texts */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-stone-900 text-sm flex items-center space-x-2 border-b border-stone-100 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>হোমপেজ ব্যানার প্রধান শিরোনাম ও সাব-টাইটেল</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ব্যানার প্রধান শিরোনাম (বাংলা - প্রথম অংশ)</label>
                    <input
                      type="text"
                      value={(data.general?.bannerTitleBengali || "প্রাণ-প্রকৃতি-পরিবেশের আহ্বানে").replace(/টানে/g, "আহ্বানে")}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerTitleBengali: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ব্যানার হাইলাইট শিরোনাম (বাংলা - দ্বিতীয় অংশ)</label>
                    <input
                      type="text"
                      value={data.general?.bannerHighlightBengali || "জিয়নকাঠির সুস্থায়ী পথচলা"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerHighlightBengali: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Banner Heading (English - Part 1)</label>
                    <input
                      type="text"
                      value={data.general?.bannerTitleEnglish || "Cultivating Life, Ecology &"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerTitleEnglish: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Banner Highlight (English - Part 2)</label>
                    <input
                      type="text"
                      value={data.general?.bannerHighlightEnglish || "Sustainable Heritage"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerHighlightEnglish: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ব্যানার বিবরণ (বাংলা)</label>
                    <textarea
                      rows={3}
                      value={(data.general?.bannerSubtitleBengali || "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা।")
                        .replace(/বীরভূম,\s*বর্ধমান\s*ও\s*আউশগ্রামের\s*গ্রামাঞ্চলে/g, "বাংলার গ্রামাঞ্চলে")
                        .replace(/সমাজ।?$/, "সংস্থা।")
                        .replace(/সমাজ/g, "সংস্থা")}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerSubtitleBengali: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Banner Description (English)</label>
                    <textarea
                      rows={3}
                      value={data.general?.bannerSubtitle || "Dedicated to pesticide-free organic farming, conserving 56 types of indigenous heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal."}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), bannerSubtitle: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Section C: Required Homepage Quote & Ideology */}
              <div className="space-y-4 pt-2 bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
                <h4 className="font-extrabold text-amber-900 text-sm flex items-center space-x-2">
                  <Quote className="w-4 h-4 text-amber-700" />
                  <span>হোমপেজ আদর্শ ও উদ্ধৃতি (Ideology Quote Box)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">মূল বাণী (বাংলা)</label>
                    <textarea
                      rows={3}
                      value={data.general?.quoteBengali || "পরিবেশের এই চরম সংকটকালে বিশ্বব্যাপী হুমকির সামনে আমরা স্থানীয় স্তরে একজোট হয়ে প্রকৃতি, মানুষ ও জীবজগতকে রক্ষা করার যে প্রচেষ্টা চালাচ্ছি... তার নামই জিয়নকাঠি।"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), quoteBengali: e.target.value } })
                      }
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed font-serif"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Quote (English)</label>
                    <textarea
                      rows={3}
                      value={data.general?.quoteEnglish || "In this era of extreme environmental crisis and global threats, our collective effort at the local level to protect nature, humanity, and all living beings... is Jiyonkathi."}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), quoteEnglish: e.target.value } })
                      }
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">বাণীর উৎস / লেখক (বাংলা)</label>
                    <input
                      type="text"
                      value={data.general?.quoteAuthorBengali || "জিয়নকাঠির লক্ষ্য ও আদর্শ"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), quoteAuthorBengali: e.target.value } })
                      }
                      className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Quote Attribution (English)</label>
                    <input
                      type="text"
                      value={data.general?.quoteAuthorEnglish || "Goal & Ideology of Jiyonkathi"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), quoteAuthorEnglish: e.target.value } })
                      }
                      className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section D: Impact Numbers */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-stone-900 text-sm flex items-center space-x-2 border-b border-stone-100 pb-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>মাঠের মূল পরিসংখ্যান (Hero Impact Metrics)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">বীজ সংরক্ষণ সংখ্যা</label>
                    <input
                      type="text"
                      value={data.general?.statSeeds || "৫৬ রকম"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), statSeeds: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-amber-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">অভিজ্ঞতার বছর</label>
                    <input
                      type="text"
                      value={data.general?.statYears || "১৩+"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), statYears: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-emerald-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">কৃষক পরিবার সংখ্যা</label>
                    <input
                      type="text"
                      value={data.general?.statFamilies === "৩৫০+" ? "৫০+" : (data.general?.statFamilies || "৫০+")}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), statFamilies: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-orange-700"
                    />
                  </div>
                </div>
              </div>

              {/* Section E: Contact Information */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-stone-900 text-sm flex items-center space-x-2 border-b border-stone-100 pb-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>যোগাযোগ ও ঠিকানা</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ফোন নম্বর</label>
                    <input
                      type="text"
                      value={data.general?.phone || "+91 94340 12345 / 98000 54321"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), phone: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ইমেইল</label>
                    <input
                      type="email"
                      value={data.general?.email || "contact@jiyonkathi.org"}
                      onChange={(e) =>
                        setData({ ...data, general: { ...(data.general || {}), email: e.target.value } })
                      }
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">মাঠ ও কার্যালয়ের ঠিকানা (বাংলা)</label>
                  <input
                    type="text"
                    value={data.general?.address || "প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান"}
                    onChange={(e) =>
                      setData({ ...data, general: { ...(data.general || {}), address: e.target.value } })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSaveGlobal()}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সকল তথ্য সংরক্ষণ করুন</span>
              </button>
            </div>
          )}

          {/* TAB 4: ONNESHON & REPORTS MANAGER (.PDF UPLOAD, CRUD & RANK) */}
          {activeTab === "reports" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 gap-4 shadow-2xs">
                <div>
                  <h3 className="text-xl font-black text-stone-900">অন্বেষণ ও প্রতিবেদন ব্যবস্থাপনা</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    নতুন প্রতিবেদন লিখুন অথবা মূল .pdf ফাইল আপলোড করে এক ক্লিকে টেক্সট ও ছবি এক্সট্রাক্ট করুন
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setEditingReport({
                        id: "new",
                        title: "",
                        titleEnglish: "",
                        topic: "বীজ সংরক্ষণ ও দেশীয় ধান",
                        topicEnglish: "Seed Conservation",
                        author: "জিয়নকাঠি অন্বেষণ দল",
                        publishedDate: new Date().toISOString().split("T")[0],
                        summary: "",
                        summaryEnglish: "",
                        content: "",
                        contentEnglish: "",
                        image: "/images/farming-collage.jpg",
                        downloadUrl: "",
                        embeddedImages: [],
                        rank: (reports.length || 0) + 1,
                      });
                      setShowReportModal(true);
                    }}
                    className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন প্রতিবেদন যোগ করুন (Modal)</span>
                  </button>
                </div>
              </div>

              {/* List of Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, rIdx) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {report.topic || "কৃষি অন্বেষণ"}
                        </span>
                        <span className="text-[11px] font-bold text-stone-400">
                          {report.publishedDate}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                        {report.title}
                      </h4>

                      {report.titleEnglish && (
                        <p className="text-xs text-stone-500 italic leading-normal">
                          {report.titleEnglish}
                        </p>
                      )}

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-medium">
                        {report.summary || report.content?.slice(0, 140)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-stone-500 font-semibold">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>{report.views || 0} ভিউ</span>
                        </div>
                        {Array.isArray(report.embeddedImages) && report.embeddedImages.length > 0 && (
                          <div className="flex items-center space-x-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                            <span>📷 {report.embeddedImages.length} ছবি</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingReport({
                              ...report,
                              embeddedImages: Array.isArray(report.embeddedImages)
                                ? report.embeddedImages
                                : (Array.isArray(report.images) ? report.images : []),
                            });
                            setShowReportModal(true);
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-bold flex items-center space-x-1 border border-amber-200 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>সম্পাদনা</span>
                        </button>

                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 2 CORE PILLARS & INITIATIVES */}
          {activeTab === "pillars" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-stone-900">২টি মূল স্তম্ভ ও টেকসই কর্মসূচি</h3>
                    <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                      নির্দিষ্ট ২টি স্তম্ভ
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    পিডিএফ নির্দেশিকা অনুযায়ী জিয়নকাঠির অপরিবর্তনীয় ২টি মূল স্তম্ভ এবং এর অন্তর্গত ক্ষেত্রপর্যায়ের কর্মসূচি
                  </p>
                </div>

                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>স্থায়ীভাবে ২টি স্তম্ভ নির্ধারিত</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data.pillars || []).slice(0, 2).map((pillar, pIdx) => (
                  <div
                    key={pillar.id || pIdx}
                    className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
                          স্তম্ভ ০{pIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-stone-400">
                          {pIdx === 0 ? "পরিবেশ ও কৃষি প্ল্যাটফর্ম" : "DDMPBS ও গ্রামীণ সহমর্মিতা"}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-stone-900 text-base leading-snug">{pillar.titleBn}</h4>
                      {pillar.titleEn && <p className="text-xs text-stone-500 italic">{pillar.titleEn}</p>}

                      {/* Display Topics from PDF */}
                      {Array.isArray(pillar.topics) && pillar.topics.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                          {pillar.topics.map((t, tIdx) => (
                            <div key={t.id || tIdx} className="space-y-0.5">
                              <div className="font-bold text-stone-900 flex items-start space-x-1.5">
                                <span className="text-amber-700 font-black shrink-0">{t.number || tIdx + 1})</span>
                                <span className="leading-snug">{t.titleBn}</span>
                              </div>
                              {t.descriptionBn && (
                                <p className="pl-4 text-[11px] text-stone-600">{t.descriptionBn}</p>
                              )}
                              {Array.isArray(t.subPoints) && t.subPoints.length > 0 && (
                                <ul className="pl-5 list-disc text-[11px] text-stone-600 space-y-0.5">
                                  {t.subPoints.map((sp, sIdx) => (
                                    <li key={sIdx}>{sp}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setEditingPillar({ ...pillar, index: pIdx });
                          setShowPillarModal(true);
                        }}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs border border-amber-200 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>স্তম্ভ সম্পাদনা করুন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BLOGS & BILINGUAL CONTENT */}
          {activeTab === "blogs" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs gap-4">
                <div>
                  <h3 className="text-xl font-black text-stone-900">ব্লগ ও দ্বিভাষিক বার্তা ব্যবস্থাপনা</h3>
                  <p className="text-xs text-stone-500">বাংলা, ইংরেজি বা উভয় ভাষায় সহজ ব্লগ প্রকাশনা ও র্যাংক</p>
                </div>

                <button
                  onClick={() => {
                    setEditingBlog({
                      isNew: true,
                      title: "",
                      titleBengali: "",
                      titleEnglish: "",
                      category: "লোকসংস্কৃতি ও উৎসব",
                      excerpt: "",
                      excerptBengali: "",
                      excerptEnglish: "",
                      content: "",
                      contentBengali: "",
                      contentEnglish: "",
                      image: "/images/community-collage.jpg",
                      author: "জিয়নকাঠি প্রচার দল",
                      date: new Date().toLocaleDateString("bn-IN", { month: "long", year: "numeric" }),
                      readTime: "৫ মিনিট পাঠ",
                      rank: (data.blogs?.length || 0) + 1,
                    });
                    setBlogLangMode("both");
                    setShowBlogModal(true);
                  }}
                  className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ব্লগ যোগ করুন (Bilingual Modal)</span>
                </button>
              </div>

              <div className="space-y-4">
                {(data.blogs || []).map((blog, bIdx) => (
                  <div
                    key={blog.id || bIdx}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                      <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                        #{bIdx + 1}
                      </span>

                      <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        {blog.image ? (
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-full h-full p-4 text-stone-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {blog.category || "ব্লগ"}
                          </span>
                          <span className="text-[11px] text-stone-400">{blog.date}</span>
                        </div>
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          {blog.titleBengali || blog.title}
                        </h4>
                        {blog.titleEnglish && (
                          <p className="text-xs text-stone-500 italic truncate max-w-md">
                            {blog.titleEnglish}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                      <button
                        onClick={() => handleMoveItem("blogs", bIdx, -1)}
                        disabled={bIdx === 0}
                        className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-lg text-stone-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveItem("blogs", bIdx, 1)}
                        disabled={bIdx === (data.blogs?.length || 0) - 1}
                        className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-lg text-stone-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingBlog({ ...blog });
                          setBlogLangMode(blog.titleEnglish ? "both" : "bn");
                          setShowBlogModal(true);
                        }}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs border border-amber-200 flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>সম্পাদনা</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!confirm("Are you sure you want to delete this blog?")) return;
                          const filtered = (data.blogs || []).filter((_, i) => i !== bIdx);
                          const updated = { ...data, blogs: filtered };
                          setData(updated);
                          handleSaveGlobal(updated);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EXECUTIVE MEMBERS & VOLUNTEER APPLICANTS MANAGEMENT */}
          {activeTab === "members" && (
            <div className="space-y-10">
              {/* SECTION 1: EXECUTIVE MEMBERS LIST */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-stone-900">নির্বাহী পরিষদ ও কোর সদস্যবৃন্দ</h3>
                      <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                        {(data.members || []).length} জন
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      তালিকায় ওপরে বা নিচে স্থানান্তর (Move Up / Down) বা মোডাল দিয়ে ক্রম ও তথ্য পরিবর্তন করুন
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingMember({
                        isNew: true,
                        name: "",
                        role: "কার্যনির্বাহী সদস্য",
                        bio: "সদস্যের ভূমিকা ও অবদান...",
                        image: "/images/community-collage.jpg",
                        rank: (data.members?.length || 0) + 1,
                      });
                      setShowMemberModal(true);
                    }}
                    className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন সদস্য যোগ করুন (Modal)</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.members || []).map((member, mIdx) => (
                    <div
                      key={member.id || mIdx}
                      className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-4 w-full md:w-auto">
                        <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200">
                          {mIdx + 1}
                        </span>

                        <div className="w-14 h-14 rounded-full bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-full h-full p-3 text-stone-400" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-stone-900 text-base">{member.name}</span>
                            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed max-w-xl">{member.bio}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                        <button
                          onClick={() => handleMoveItem("members", mIdx, -1)}
                          disabled={mIdx === 0}
                          className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-lg text-stone-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveItem("members", mIdx, 1)}
                          disabled={mIdx === (data.members?.length || 0) - 1}
                          className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-lg text-stone-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleChangeMemberToNormal(member, mIdx)}
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs border border-emerald-200 flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          title="নির্বাহী পরিষদ থেকে সাধারণ সদস্য / স্বেচ্ছাসেবী তালিকায় স্থানান্তর করুন"
                        >
                          <UserMinus className="w-3.5 h-3.5 text-emerald-700" />
                          <span>সাধারণ সদস্যে রূপান্তর</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingMember({ ...member });
                            setShowMemberModal(true);
                          }}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs border border-amber-200 flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>সম্পাদনা</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!confirm("Remove this member?")) return;
                            const filtered = (data.members || []).filter((_, i) => i !== mIdx);
                            const updated = { ...data, members: filtered };
                            setData(updated);
                            handleSaveGlobal(updated);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: VOLUNTEER & JOINING APPLICANTS MANAGEMENT */}
              <div className="space-y-6 pt-4 border-t-2 border-dashed border-stone-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-6 rounded-3xl border border-emerald-200/90 shadow-2xs gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <HeartHandshake className="w-5 h-5 text-emerald-700" />
                      <h3 className="text-xl font-black text-stone-900">
                        যোগদানের আবেদনকারী স্বেচ্ছাসেবী ও সাধারণ সদস্যবৃন্দ
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600">
                      ওয়েবসাইট থেকে অনলাইনে যোগ দিতে আগ্রহীদের আবেদন পর্যালোচনা, অনুমোদন ও পরিচালনা করুন
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setVolFilter("all")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "all"
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                    >
                      সব ({volunteers.length})
                    </button>
                    <button
                      onClick={() => setVolFilter("pending")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "pending"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                    >
                      অপেক্ষমান ({pendingVolunteersCount})
                    </button>
                    <button
                      onClick={() => setVolFilter("approved")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "approved"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                    >
                      অনুমোদিত ({approvedVolunteersCount})
                    </button>
                    <button
                      onClick={() => setVolFilter("rejected")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "rejected"
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                    >
                      বাতিল ({volunteers.filter((v) => v.status === "rejected").length})
                    </button>
                  </div>
                </div>

                {volunteers.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-2xs space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-stone-800 text-sm">কোনো নতুন স্বেচ্ছাসেবী আবেদন পাওয়া যায়নি</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      ওয়েবসাইটের &quot;স্বেচ্ছাসেবী ফরম&quot; থেকে কেউ আবেদন করলে তা সরাসরি এখানে তালিকাভুক্ত হবে।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {volunteers
                      .filter((v) => (volFilter === "all" ? true : v.status === volFilter))
                      .map((vol) => (
                        <div
                          key={vol.id}
                          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-black text-stone-900 text-base">{vol.name}</h4>

                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${vol.status === "approved"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                    : vol.status === "rejected"
                                      ? "bg-red-100 text-red-900 border border-red-200"
                                      : "bg-amber-100 text-amber-900 border border-amber-200"
                                    }`}
                                >
                                  {vol.status === "approved" ? "✓ অনুমোদিত (Approved)" : vol.status === "rejected" ? "✕ বাতিল (Rejected)" : "⏳ অপেক্ষমান (Pending)"}
                                </span>

                                {vol.isDdbmpbs && (
                                  <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-200">
                                    ★ DDBMPBS সদস্য
                                  </span>
                                )}

                                {vol.createdAt && (
                                  <span className="text-[11px] text-stone-400 font-medium">
                                    তারিখ: {new Date(vol.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                                <div className="flex items-center space-x-1.5">
                                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                                  <span><strong>ইমেইল:</strong> {vol.email || "N/A"}</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                                  <span><strong>ফোন:</strong> {vol.phone || "N/A"}</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                  <span><strong>ঠিকানা:</strong> {vol.location || "N/A"}</span>
                                </div>
                              </div>

                              {(vol.motivation || vol.skills) && (
                                <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
                                  <strong>আবেদনের অনুপ্রেরণা ও দক্ষতা:</strong> {vol.motivation || vol.skills}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto shrink-0">
                              {/* Toggle DDBMPBS */}
                              <button
                                onClick={() => handleUpdateVolunteer(vol.id, vol.status, !vol.isDdbmpbs)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${vol.isDdbmpbs
                                  ? "bg-indigo-600 text-white border-indigo-700"
                                  : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                                  }`}
                              >
                                {vol.isDdbmpbs ? "✓ DDBMPBS যুক্ত" : "+ DDBMPBS ট্যাগ"}
                              </button>

                              {/* Promote to Executive Member */}
                              <button
                                onClick={() => {
                                  setEditingMember({
                                    isNew: true,
                                    sourceVolunteerId: vol.id,
                                    name: vol.name || "",
                                    role: vol.isDdbmpbs ? "DDBMPBS প্রতিনিধি" : "কার্যনির্বাহী সদস্য",
                                    bio: vol.motivation || vol.skills || `${vol.location ? `ঠিকানা: ${vol.location}। ` : ""}যোগদানের আবেদনকারী হিসেবে যুক্ত।`,
                                    image: vol.image || "",
                                    rank: (data.members?.length || 0) + 1,
                                  });
                                  setShowMemberModal(true);
                                }}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer"
                                title="নির্বাহী পরিষদ সদস্য হিসেবে যুক্ত করুন (সাধারণ তালিকা থেকে স্বয়ংক্রিয়ভাবে অপসারিত হবে)"
                              >
                                <Plus className="w-3.5 h-3.5 text-amber-700" />
                                <span>নির্বাহী কমিটিতে যুক্ত করুন</span>
                              </button>

                              {/* Approve */}
                              {vol.status !== "approved" && (
                                <button
                                  onClick={() => handleUpdateVolunteer(vol.id, "approved")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
                                >
                                  অনুমোদন (Approve)
                                </button>
                              )}

                              {/* Reject */}
                              {vol.status !== "rejected" && (
                                <button
                                  onClick={() => handleUpdateVolunteer(vol.id, "rejected")}
                                  className="bg-stone-100 hover:bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer"
                                >
                                  বাতিল (Reject)
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteVolunteer(vol.id)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                                title="Delete Permanent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: GALLERY (PHOTOS & VIDEOS) */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs gap-4">
                <div>
                  <h3 className="text-xl font-black text-stone-900">ফটো ও ভিডিও গ্যালারি ব্যবস্থাপনা</h3>
                  <p className="text-xs text-stone-500">
                    নির্দিষ্ট ৪টি ক্যাটাগরিতে আলোকচিত্র ও ভিডিও প্রকাশ ও ব্যবস্থাপনা করুন
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-300 shadow-2xs cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>একসাথে একাধিক ছবি আপলোড (Bulk)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        setSaveLoading(true);
                        try {
                          const newGalleryItems = [];
                          for (let i = 0; i < files.length; i++) {
                            const file = files[i];
                            const url = await handleFileUpload(file);
                            if (url) {
                              const nameClean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                              newGalleryItems.push({
                                id: `img-${Date.now()}-${i}`,
                                title: nameClean,
                                url: url,
                                category: galleryFilter !== "all" ? galleryFilter : "pkhira",
                                description: `${nameClean} - ফিল্ড স্টেশন কার্যক্রম ও আলোকচিত্র`,
                                publishedAt: new Date().toISOString(),
                                rank: (data.gallery?.length || 0) + i + 1,
                              });
                            }
                          }

                          if (newGalleryItems.length > 0) {
                            const updated = {
                              ...data,
                              gallery: [...(data.gallery || []), ...newGalleryItems]
                            };
                            setData(updated);
                            await handleSaveGlobal(updated);
                            alert(`সফলভাবে ${newGalleryItems.length} টি ছবি আপলোড ও সেভ করা হয়েছে!`);
                          }
                        } catch (err) {
                          alert("Bulk upload error: " + err.message);
                        } finally {
                          setSaveLoading(false);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      setEditingGallery({
                        isNew: true,
                        title: "",
                        url: "/images/community-collage.jpg",
                        category: galleryFilter !== "all" ? galleryFilter : "pkhira",
                        description: "",
                        publishedAt: new Date().toISOString(),
                        rank: (data.gallery?.length || 0) + 1,
                      });
                      setShowGalleryModal(true);
                    }}
                    className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ফটো / ভিডিও যোগ করুন (Modal)</span>
                  </button>
                </div>
              </div>

              {/* 4 Category Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", nameBn: "সব ছবি", nameEn: "All Media" },
                  { id: "pkhira", nameBn: "জিয়নকাঠির পখিরা", nameEn: "Jiyonkathir Pkhira" },
                  { id: "ragi", nameBn: "জিয়নকাঠির রাগি চাষ", nameEn: "Jiyonkathir Ragi Chas" },
                  { id: "dhan", nameBn: "জিয়নকাঠির ধান চাষ ও সংরক্ষণ", nameEn: "Jiyonkathir Dhan chass o Sonrokkhon" },
                  { id: "joll", nameBn: "জল সংরক্ষণ", nameEn: "Joll Sonrokkhon" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setGalleryFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${galleryFilter === cat.id
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-800"
                      }`}
                  >
                    {cat.nameBn} <span className="opacity-70 text-[10px]">({cat.nameEn})</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.gallery || [])
                  .filter((item) => {
                    if (galleryFilter === "all") return true;
                    const c = (item.category || "").toLowerCase();
                    if (galleryFilter === "pkhira") return c === "pkhira" || c.includes("pkhira") || c === "birds";
                    if (galleryFilter === "ragi") return c === "ragi" || c.includes("ragi") || c === "millet";
                    if (galleryFilter === "dhan") return c === "dhan" || c.includes("dhan") || c === "seeds" || c === "farming";
                    if (galleryFilter === "joll") return c === "joll" || c.includes("joll") || c.includes("water");
                    return c === galleryFilter;
                  })
                  .map((item, gIdx) => {
                    const c = (item.category || "").toLowerCase();
                    let catLabel = "জিয়নকাঠির পখিরা";
                    if (c === "ragi" || c.includes("ragi") || c === "millet") catLabel = "জিয়নকাঠির রাগি চাষ";
                    else if (c === "dhan" || c.includes("dhan") || c === "seeds" || c === "farming") catLabel = "জিয়নকাঠির ধান চাষ ও সংরক্ষণ";
                    else if (c === "joll" || c.includes("joll") || c.includes("water")) catLabel = "জল সংরক্ষণ";
                    else if (c === "pkhira" || c.includes("pkhira") || c === "birds") catLabel = "জিয়নকাঠির পখিরা";

                    return (
                      <div
                        key={item.id || gIdx}
                        className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="aspect-video bg-stone-900 relative">
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {catLabel}
                          </span>
                        </div>

                        <div className="p-5 space-y-2">
                          <h4 className="font-extrabold text-stone-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>
                          <span className="text-[11px] text-stone-400 block font-medium">
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setEditingGallery({ ...item });
                              setShowGalleryModal(true);
                            }}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-bold text-xs border border-amber-200 flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>সম্পাদনা</span>
                          </button>

                          <button
                            onClick={() => {
                              if (!confirm("Delete this gallery item?")) return;
                              const filtered = (data.gallery || []).filter((g) => g.id !== item.id);
                              const updated = { ...data, gallery: filtered };
                              setData(updated);
                              handleSaveGlobal(updated);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 9: VOLUNTEER SUBMISSIONS REVIEW */}
          {activeTab === "volunteers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs gap-4">
                <div>
                  <h3 className="text-xl font-black text-stone-900">স্বেচ্ছাসেবী আবেদন পর্যালোচনা</h3>
                  <p className="text-xs text-stone-500">
                    অনলাইন ফরম থেকে জমা পড়া আবেদন অনুমোদন, বাতিল বা DDBMPBS সংযুক্তি
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setVolFilter("all")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "all"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-stone-600 border-stone-200"
                      }`}
                  >
                    সব ({volunteers.length})
                  </button>
                  <button
                    onClick={() => setVolFilter("pending")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "pending"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-stone-600 border-stone-200"
                      }`}
                  >
                    অপেক্ষমান ({pendingVolunteersCount})
                  </button>
                  <button
                    onClick={() => setVolFilter("approved")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${volFilter === "approved"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-stone-600 border-stone-200"
                      }`}
                  >
                    অনুমোদিত ({approvedVolunteersCount})
                  </button>
                </div>
              </div>

              {volunteers.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-base">কোনো স্বেচ্ছাসেবী আবেদন জমা নেই</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    ওয়েবসাইটের &quot;স্বেচ্ছাসেবী হিসেবে যুক্ত হোন&quot; ফর্মের মাধ্যমে আবেদন এলে তা সরাসরি এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {volunteers
                    .filter((v) => (volFilter === "all" ? true : v.status === volFilter))
                    .map((vol) => (
                      <div
                        key={vol.id}
                        className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-extrabold text-stone-900 text-base">{vol.name}</h4>
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${vol.status === "approved"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                  : vol.status === "rejected"
                                    ? "bg-red-100 text-red-900 border border-red-200"
                                    : "bg-amber-100 text-amber-900 border border-amber-200"
                                  }`}
                              >
                                {vol.status}
                              </span>

                              {vol.isDdbmpbs && (
                                <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-200">
                                  DDBMPBS
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                              <div>📧 <strong>ইমেইল:</strong> {vol.email}</div>
                              <div>📞 <strong>ফোন:</strong> {vol.phone || "N/A"}</div>
                              <div>📍 <strong>ঠিকানা:</strong> {vol.location || "N/A"}</div>
                            </div>

                            <div className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                              <strong>আবেদনের অনুপ্রেরণা ও দক্ষতা:</strong> {vol.motivation || vol.skills || "N/A"}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                            <button
                              onClick={() => handleUpdateVolunteer(vol.id, vol.status, !vol.isDdbmpbs)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${vol.isDdbmpbs
                                ? "bg-indigo-600 text-white border-indigo-700"
                                : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                                }`}
                            >
                              {vol.isDdbmpbs ? "✓ DDBMPBS যুক্ত" : "+ DDBMPBS যুক্ত করুন"}
                            </button>

                            {vol.status !== "approved" && (
                              <button
                                onClick={() => handleUpdateVolunteer(vol.id, "approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
                              >
                                অনুমোদন (Approve)
                              </button>
                            )}

                            {vol.status !== "rejected" && (
                              <button
                                onClick={() => handleUpdateVolunteer(vol.id, "rejected")}
                                className="bg-stone-100 hover:bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer"
                              >
                                বাতিল (Reject)
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteVolunteer(vol.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                              title="Delete Permanent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* CREATION & EDITING MODALS FOR EVERYTHING */}
      {/* ========================================================================= */}

      {/* 1. REPORT MODAL */}
      {showReportModal && editingReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                  {editingReport.id === "new" ? "নতুন অন্বেষণ ও প্রতিবেদন সৃষ্টি" : "প্রতিবেদন সম্পাদনা"}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  (বাংলা ও ইংরেজি উভয়ের জন্য)
                </span>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setEditingReport(null);
                  setPdfSuccessMsg("");
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Extraction Upload Box */}
            <div className="bg-[#fefce8] p-5 rounded-2xl border border-amber-300 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                <FolderUp className="w-5 h-5 text-amber-600" />
                <span>পিডিএফ ডকুমেন্ট (.pdf) আপলোড ও স্বয়ংক্রিয় টেক্সট-চিত্র আমদানি</span>
              </div>
              <p className="text-xs text-stone-600">
                কম্পিউটার থেকে মূল .pdf রিপোর্ট ফাইল নির্বাচন করুন। সিস্টেম স্বয়ংক্রিয়ভাবে বাংলা টেক্সট ও এতে থাকা সমস্ত চিত্র এক্সট্রাক্ট করে নিচের ফর্মে যুক্ত করবে এবং মূল ফাইলটি ডাউনলোডের জন্য সংরক্ষিত রাখবে।
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <label
                  className={`inline-flex items-center space-x-2 border font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all ${isPdfExtracting
                    ? "bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed opacity-75"
                    : "bg-white hover:bg-amber-50 text-amber-900 border-amber-300 cursor-pointer"
                    }`}
                >
                  <Upload className={`w-4 h-4 ${isPdfExtracting ? "text-stone-400 animate-spin" : "text-amber-600"}`} />
                  <span>{isPdfExtracting ? "এক্সট্রাক্ট হচ্ছে..." : ".pdf ফাইল আপলোড করুন"}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    disabled={isPdfExtracting}
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>

                {pdfSuccessMsg && !isPdfExtracting && (
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{pdfSuccessMsg}</span>
                  </span>
                )}

                {editingReport.downloadUrl && (
                  <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span className="truncate max-w-[200px]" title={editingReport.downloadUrl}>
                      মূল পিডিএফ সংরক্ষিত
                    </span>
                  </span>
                )}
              </div>

              {/* Extraction Progress Bar */}
              {isPdfExtracting && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center space-x-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>পিডিএফ প্রক্রিয়া ও চিত্র এক্সট্রাক্ট করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন</span>
                    </span>
                    <span>{pdfProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out shadow-xs"
                      style={{ width: `${pdfProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Display Extracted Embedded Images Preview */}
              {Array.isArray(editingReport.embeddedImages) && editingReport.embeddedImages.length > 0 && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                    <span>পিডিএফ থেকে প্রাপ্ত সংযুক্ত চিত্রসমূহ ({editingReport.embeddedImages.length} টি):</span>
                    <span className="text-[11px] text-stone-500">ছবিতে ক্লিক করে কভার ফটো নির্বাচন করতে পারেন</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                    {editingReport.embeddedImages.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => setEditingReport({ ...editingReport, image: imgSrc })}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${editingReport.image === imgSrc ? "border-amber-600 ring-2 ring-amber-300" : "border-stone-200 hover:border-amber-400"
                          }`}
                        title="কভার ফটো হিসেবে ব্যবহার করতে ক্লিক করুন"
                      >
                        <img
                          src={imgSrc}
                          alt={`PDF Image ${imgIdx + 1}`}
                          className="w-16 h-16 object-cover bg-stone-100"
                        />
                        {editingReport.image === imgSrc && (
                          <div className="absolute top-0.5 right-0.5 bg-amber-600 text-white rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Report Form */}
            <form onSubmit={handleSaveReport} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">প্রতিবেদনের শিরোনাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingReport.title || ""}
                    onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                    placeholder="যেমন: দেশীয় ধানের প্রজাতি ও বীজ সংরক্ষণ অন্বেষণ"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Title (English)</label>
                  <input
                    type="text"
                    value={editingReport.titleEnglish || ""}
                    onChange={(e) => setEditingReport({ ...editingReport, titleEnglish: e.target.value })}
                    placeholder="e.g. Indigenous Rice Cultivars Field Report"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">টপিক / বিষয়</label>
                  <input
                    type="text"
                    value={editingReport.topic || ""}
                    onChange={(e) => setEditingReport({ ...editingReport, topic: e.target.value })}
                    placeholder="বীজ সংরক্ষণ / খাদ্য নিরাপত্তা"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">লেখক / টিম</label>
                  <input
                    type="text"
                    value={editingReport.author || ""}
                    onChange={(e) => setEditingReport({ ...editingReport, author: e.target.value })}
                    placeholder="জিয়নকাঠি অন্বেষণ দল"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">প্রকাশের তারিখ</label>
                  <input
                    type="text"
                    value={editingReport.publishedDate || ""}
                    onChange={(e) => setEditingReport({ ...editingReport, publishedDate: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">সারসংক্ষেপ (Executive Summary / Abstract)</label>
                <textarea
                  rows={3}
                  value={editingReport.summary || ""}
                  onChange={(e) => setEditingReport({ ...editingReport, summary: e.target.value })}
                  placeholder="প্রতিবেদনের সংক্ষিপ্ত মূল কথা..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <ImageSelectorField
                label="প্রতিবেদনের কভার ফটো (Report Cover Image)"
                value={editingReport.image || ""}
                onChange={(url) => setEditingReport({ ...editingReport, image: url })}
                galleryItems={data.gallery || []}
                category="archive"
                onUploadAutoAddToGallery={(url, file) => {
                  autoAddImageToGallery(url, file, editingReport.title || "অন্বেষণ প্রতিবেদন ছবি", "archive");
                }}
                helperText="গ্যালারি থেকে পছন্দ করুন অথবা নতুন ফাইল আপলোড করুন।"
              />

              {/* ------------------------------------------------------------- */}
              {/* MULTIPLE REFERENCE IMAGES SECTION FOR BETTER REFERENCES */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-amber-700" />
                      <h4 className="text-xs sm:text-sm font-black text-stone-900">
                        প্রতিবেদনের রেফারেন্স চিত্রসমূহ (Multiple Reference Images)
                      </h4>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {editingReport.embeddedImages?.length || 0} টি ছবি
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      প্রতিবেদনের তথ্য ও মাঠ বাস্তবতার প্রমাণ হিসেবে একাধিক ছবি যোগ করুন। সাইটের প্রতিবেদনে এগুলো সরাসরি প্রদর্শিত হবে।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Multi-file Upload */}
                    <label
                      className={`inline-flex items-center space-x-1.5 border font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer ${reportImagesUploading
                          ? "bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed opacity-75"
                          : "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                        }`}
                    >
                      <Upload className={`w-3.5 h-3.5 ${reportImagesUploading ? "animate-spin" : ""}`} />
                      <span>{reportImagesUploading ? "আপলোড হচ্ছে..." : "একাধিক ছবি যোগ করুন"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={reportImagesUploading}
                        onChange={handleMultipleReportImagesUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Gallery Picker Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowReportGalleryPicker(!showReportGalleryPicker)}
                      className="inline-flex items-center space-x-1.5 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs px-3 py-2 rounded-xl border border-stone-300 cursor-pointer transition-all"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                      <span>{showReportGalleryPicker ? "গ্যালারি লুকান" : "গ্যালারি থেকে নিন"}</span>
                    </button>
                  </div>
                </div>

                {/* Direct URL Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="অথবা সরাসরি ছবির ওয়েব লিঙ্ক (Image URL) পেস্ট করুন..."
                    value={customReportImageUrl}
                    onChange={(e) => setCustomReportImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddReportImageFromUrl();
                      }
                    }}
                    className="flex-1 p-2 bg-white border border-stone-200 rounded-xl text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddReportImageFromUrl()}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0 transition-colors"
                  >
                    যুক্ত করুন
                  </button>
                </div>

                {/* Progress / Status Message */}
                {reportImageUploadMsg && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center space-x-2">
                    {reportImagesUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{reportImageUploadMsg}</span>
                  </div>
                )}

                {/* Expandable Site Gallery Picker Panel */}
                {showReportGalleryPicker && (
                  <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b border-stone-100 pb-2">
                      <span>সাইট গ্যালারি থেকে ছবিতে ক্লিক করে রেফারেন্সে যোগ / বাদ দিন:</span>
                      <span className="text-[11px] text-stone-500">মোট {data.gallery?.length || 0} টি ছবি উপলব্ধ</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                      {(data.gallery || []).map((gItem, gIdx) => {
                        const isSelected = (editingReport.embeddedImages || []).includes(gItem.url);
                        return (
                          <div
                            key={gItem.id || gIdx}
                            onClick={() => handleToggleReportGalleryImage(gItem.url)}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 aspect-square transition-all ${isSelected ? "border-amber-600 ring-2 ring-amber-300" : "border-stone-200 hover:border-amber-400"
                              }`}
                            title={gItem.title || "গ্যালারি ছবি"}
                          >
                            <img src={gItem.url} alt={gItem.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-amber-600 text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interactive Grid of Attached Images */}
                {Array.isArray(editingReport.embeddedImages) && editingReport.embeddedImages.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                      <span>সংযুক্ত রেফারেন্স চিত্র তালিকা ({editingReport.embeddedImages.length} টি):</span>
                      <span className="text-[11px] text-stone-500">কভার ফটো পরিবর্তন করতে 'কভার করুন' চাপুন</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {editingReport.embeddedImages.map((imgSrc, imgIdx) => {
                        const isCover = editingReport.image === imgSrc;
                        return (
                          <div
                            key={imgIdx}
                            className={`relative rounded-xl overflow-hidden border-2 bg-white shadow-2xs group flex flex-col justify-between transition-all ${isCover ? "border-amber-600 ring-2 ring-amber-200" : "border-stone-200"
                              }`}
                          >
                            <div className="relative h-28 bg-stone-100 overflow-hidden flex items-center justify-center">
                              <img
                                src={imgSrc}
                                alt={`রেফারেন্স চিত্র ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {isCover && (
                                <div className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>মূল কভার</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveReportImage(imgIdx)}
                                className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                title="চিত্রটি মুছে ফেলুন"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="p-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                              <span className="font-bold text-stone-700">চিত্র #{imgIdx + 1}</span>
                              <div className="flex items-center space-x-1">
                                {imgIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveReportImage(imgIdx, -1)}
                                    className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded cursor-pointer"
                                    title="বামে সরান"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {imgIdx < editingReport.embeddedImages.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveReportImage(imgIdx, 1)}
                                    className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded cursor-pointer"
                                    title="ডানে সরান"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingReport({ ...editingReport, image: imgSrc })}
                                    className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 cursor-pointer ml-1"
                                    title="কভার হিসেবে নির্ধারণ করুন"
                                  >
                                    কভার করুন
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const tag = `\n\n![রেফারেন্স চিত্র #${imgIdx + 1}](${imgSrc})\n\n`;
                                    setEditingReport((prev) => ({
                                      ...prev,
                                      content: (prev?.content || "") + tag,
                                    }));
                                  }}
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer ml-1"
                                  title="প্রতিবেদনের লেখার মধ্যে এই ছবিটি অন্তর্ভুক্ত করুন"
                                >
                                  + লেখায় যোগ
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-2 bg-white/60">
                    <ImageIcon className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-500 font-medium">
                      এখনও কোনো অতিরিক্ত রেফারেন্স চিত্র যুক্ত করা হয়নি। প্রতিবেদন লেখার সময় উপরের 'একাধিক ছবি যোগ করুন' বোতাম চেপে মাঠ পরীক্ষার ছবি, চার্ট ও প্রামাণ্য চিত্র যুক্ত করতে পারেন।
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">সম্পূর্ণ প্রতিবেদন টেক্সট *</label>
                <textarea
                  rows={8}
                  required
                  value={editingReport.content || ""}
                  onChange={(e) => setEditingReport({ ...editingReport, content: e.target.value })}
                  placeholder="সম্পূর্ণ বিস্তারিত প্রতিবেদন লিখুন..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setEditingReport(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>প্রতিবেদন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BILINGUAL BLOG MODAL */}
      {showBlogModal && editingBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                  {editingBlog.isNew ? "নতুন ব্লগ লিখুন" : "ব্লগ সম্পাদনা"}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  (User Language Choice Support)
                </span>
              </div>
              <button
                onClick={() => {
                  setShowBlogModal(false);
                  setEditingBlog(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selection Bar */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-amber-900">ব্লগ লেখার ভাষা নির্বাচন করুন (Select Writing Language):</div>
                <div className="text-[11px] text-amber-700">ব্যবহারকারী যে ভাষা নির্বাচন করবেন ব্লগটি সেই ভাষায় দেখাবে</div>
              </div>

              <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-amber-200">
                <button
                  type="button"
                  onClick={() => setBlogLangMode("both")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${blogLangMode === "both" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  উভয় ভাষা (Both)
                </button>
                <button
                  type="button"
                  onClick={() => setBlogLangMode("bn")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${blogLangMode === "bn" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  বাংলা (Bengali)
                </button>
                <button
                  type="button"
                  onClick={() => setBlogLangMode("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${blogLangMode === "en" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Blog Form */}
            <form onSubmit={handleSaveBlogModal} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">ক্যাটাগরি *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.category || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    placeholder="যেমন: লোকসংস্কৃতি ও উৎসব / বীজ"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">লেখক</label>
                  <input
                    type="text"
                    value={editingBlog.author || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    placeholder="জিয়নকাঠি প্রচার দল"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">অগ্রাধিকার র্যাংক (Rank #)</label>
                  <input
                    type="number"
                    value={editingBlog.rank || 1}
                    onChange={(e) => setEditingBlog({ ...editingBlog, rank: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Bengali Inputs */}
              {(blogLangMode === "both" || blogLangMode === "bn") && (
                <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-4">
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                    বাংলা সংস্করণ (Bengali Content)
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">ব্লগ শিরোনাম (বাংলা) *</label>
                    <input
                      type="text"
                      required={blogLangMode === "bn" || blogLangMode === "both"}
                      value={editingBlog.titleBengali || editingBlog.title || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          titleBengali: e.target.value,
                          title: e.target.value,
                        })
                      }
                      placeholder="যেমন: মাটির গানে জীবন বাঁধি..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">সারসংক্ষেপ (বাংলা)</label>
                    <textarea
                      rows={2}
                      value={editingBlog.excerptBengali || editingBlog.excerpt || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          excerptBengali: e.target.value,
                          excerpt: e.target.value,
                        })
                      }
                      placeholder="সংক্ষিপ্ত সারসংক্ষেপ..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">সম্পূর্ণ ব্লগ লেখা (বাংলা) *</label>
                    <textarea
                      rows={5}
                      required={blogLangMode === "bn" || blogLangMode === "both"}
                      value={editingBlog.contentBengali || editingBlog.content || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          contentBengali: e.target.value,
                          content: e.target.value,
                        })
                      }
                      placeholder="সম্পূর্ণ বিস্তারিত প্রতিবেদন লিখুন..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* English Inputs */}
              {(blogLangMode === "both" || blogLangMode === "en") && (
                <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-4">
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                    English Version
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Blog Title (English) *</label>
                    <input
                      type="text"
                      required={blogLangMode === "en"}
                      value={editingBlog.titleEnglish || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, titleEnglish: e.target.value })}
                      placeholder="e.g. Village Melodies and Agricultural Heritage"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Excerpt (English)</label>
                    <textarea
                      rows={2}
                      value={editingBlog.excerptEnglish || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerptEnglish: e.target.value })}
                      placeholder="Short summary in English..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Full Article Content (English) *</label>
                    <textarea
                      rows={5}
                      required={blogLangMode === "en"}
                      value={editingBlog.contentEnglish || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, contentEnglish: e.target.value })}
                      placeholder="Write the full English article..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Media URL / Upload with Gallery & Device Option */}
              <ImageSelectorField
                label="কভার ফটো / ফিচার্ড ইমেজ (Cover Image)"
                value={editingBlog.image || editingBlog.videoUrl || ""}
                onChange={(url) => setEditingBlog({ ...editingBlog, image: url })}
                galleryItems={data.gallery || []}
                category={editingBlog.category || "events"}
                onUploadAutoAddToGallery={(url, file) => {
                  const title = editingBlog.titleBengali || editingBlog.title || editingBlog.titleEnglish;
                  autoAddImageToGallery(url, file, title, editingBlog.category || "events");
                }}
                helperText="ডিভাইস থেকে ছবি আপলোড করলে এটি স্বয়ংক্রিয়ভাবে গ্যালারি সেকশনেও অন্তর্ভুক্ত হয়ে যাবে।"
              />

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlog(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ব্লগ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EXECUTIVE MEMBER MODAL */}
      {showMemberModal && editingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                {editingMember.isNew ? "নতুন নির্বাহী সদস্য যোগ করুন" : "সদস্য তথ্য সম্পাদনা"}
              </span>
              <button
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMember(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">সদস্যের নাম *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="যেমন: ড. শুভ্রাংশু মুখোপাধ্যায়"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">পদবী / ভূমিকা *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="যেমন: সভাপতি / প্রধান গবেষক"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">ভূমিকা ও পরিচিতি (Bio)</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="জিয়নকাঠিতে তাঁর অবদান ও দায়িত্ব..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <ImageSelectorField
                label="সদস্যের ছবি (Member Photo - Device Only)"
                value={editingMember.image || ""}
                onChange={(url) => setEditingMember({ ...editingMember, image: url })}
                allowGallery={false}
                deviceOnly={true}
                helperText="সদস্যের ছবি শুধুমাত্র ডিভাইস থেকে নির্বাচন ও আপলোড করুন (এটি গ্যালারিতে যাবে না এবং গ্যালারি থেকে নেওয়া হবে না)।"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">অগ্রাধিকার র্যাংক (Order Number)</label>
                <input
                  type="number"
                  value={editingMember.rank || 1}
                  onChange={(e) => setEditingMember({ ...editingMember, rank: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberModal(false);
                    setEditingMember(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. GALLERY MODAL */}
      {showGalleryModal && editingGallery && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                {editingGallery.isNew ? "নতুন ফটো / ভিডিও যোগ করুন" : "গ্যালারি আইটেম সম্পাদনা"}
              </span>
              <button
                onClick={() => {
                  setShowGalleryModal(false);
                  setEditingGallery(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">ছবির শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ""}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="যেমন: আউশগ্রামে বীজতলা পরিচর্যা"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">ক্যাটাগরি</label>
                <select
                  value={editingGallery.category || "pkhira"}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="pkhira">জিয়নকাঠির পখিরা (Jiyonkathir Pkhira)</option>
                  <option value="ragi">জিয়নকাঠির রাগি চাষ (Jiyonkathir Ragi Chas)</option>
                  <option value="dhan">জিয়নকাঠির ধান চাষ ও সংরক্ষণ (Jiyonkathir Dhan chass o Sonrokkhon)</option>
                  <option value="joll">জল সংরক্ষণ (Joll Sonrokkhon)</option>
                </select>
              </div>

              <ImageSelectorField
                label="ফটো / ভিডিও URL (Media Asset) *"
                value={editingGallery.url || ""}
                onChange={(url) => setEditingGallery({ ...editingGallery, url })}
                galleryItems={data.gallery || []}
                category={editingGallery.category || "pkhira"}
                required
                helperText="গ্যালারির ছবির লিঙ্ক দিন বা ডিভাইস থেকে আপলোড করুন।"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">সংক্ষিপ্ত বর্ণনা</label>
                <textarea
                  rows={2}
                  value={editingGallery.description || ""}
                  onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                  placeholder="ছবির পেছনের গল্প..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowGalleryModal(false);
                    setEditingGallery(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PILLAR MODAL */}
      {showPillarModal && editingPillar && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                {editingPillar.isNew ? "নতুন স্তম্ভ সৃষ্টি" : "স্তম্ভ সম্পাদনা"}
              </span>
              <button
                onClick={() => {
                  setShowPillarModal(false);
                  setEditingPillar(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePillarModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">স্তম্ভ শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingPillar.titleBn || ""}
                  onChange={(e) => setEditingPillar({ ...editingPillar, titleBn: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Pillar Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingPillar.titleEn || ""}
                  onChange={(e) => setEditingPillar({ ...editingPillar, titleEn: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">সারসংক্ষেপ ট্যাগলাইন (বাংলা)</label>
                <textarea
                  rows={2}
                  value={editingPillar.taglineBn || ""}
                  onChange={(e) => setEditingPillar({ ...editingPillar, taglineBn: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <ImageSelectorField
                label="স্তম্ভের ছবি (Pillar Visual)"
                value={editingPillar.image || ""}
                onChange={(url) => setEditingPillar({ ...editingPillar, image: url })}
                galleryItems={data.gallery || []}
                category="farming"
                onUploadAutoAddToGallery={(url, file) => {
                  autoAddImageToGallery(url, file, editingPillar.titleBn || "স্তম্ভ আলোকচিত্র", "farming");
                }}
              />

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPillarModal(false);
                    setEditingPillar(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>স্তম্ভ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
