import { useEffect } from "react";
import { getSiteBaseUrl } from "../utils/urlUtils";

/**
 * Updates DOM meta tags, canonical links, document.title, and Schema.org JSON-LD
 * dynamically as users navigate between tabs and dynamic items in the SPA.
 */
export function useSEO({
  activeTab = "home",
  targetItemId = null,
  siteData = null,
  language = "bn",
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const baseUrl = getSiteBaseUrl();
    const isEn = language === "en";

    let title = isEn
      ? "Jiyonkathi - Transitioning to a Post-Petroleum World | NGO"
      : "জিয়নকাঠি (Jiyonkathi) - সুস্থায়ী সমাজ ও পরিবেশ উদ্যোগ | NGO";

    let description = isEn
      ? "Dedicated to pesticide-free organic farming, conserving 56 types of heirloom rice varieties, rural auxiliary education centers, and environmental awareness in Bengal."
      : "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা (NGO)।";

    let canonicalPath = "/";
    let image = `${baseUrl}/images/banner.png`;
    let type = "website";
    let jsonLd = null;

    if (activeTab === "home") {
      canonicalPath = "/";
      image = `${baseUrl}/images/banner.png`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Jiyonkathi",
        "alternateName": "জিয়নকাঠি",
        "url": baseUrl,
        "logo": `${baseUrl}/images/logo.svg`,
        "image": image,
        "description": description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No. 1942, Village & P.O. Pratappur, P.S. Aushgram",
          "addressLocality": "Purba Bardhaman",
          "addressRegion": "West Bengal",
          "postalCode": "713141",
          "addressCountry": "IN"
        },
        "sameAs": ["https://www.facebook.com/jiyonkaathi"]
      };
    } else if (activeTab === "about" || activeTab === "mission") {
      title = isEn
        ? "About Us & Ideology - Jiyonkathi"
        : "আমাদের লক্ষ্য ও আদর্শ - জিয়নকাঠি";
      description = isEn
        ? "Transitioning to a post-petroleum world through chemical-free farming, indigenous seed banking, and auxiliary education."
        : "পরিবেশ সংকটকালে শহর ও গ্রামের একসাথে প্রস্তুত হওয়ার কার্যকরী প্রচেষ্টা, দেশীয় বীজ সংরক্ষণ ও শিশু শিক্ষার সহায়ক কার্যক্রম।";
      canonicalPath = "/about";
      image = `${baseUrl}/images/banner.png`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": title,
        "description": description,
        "url": `${baseUrl}/about`
      };
    } else if (activeTab === "work") {
      title = isEn
        ? "Welfare & Agro-ecology Projects - Jiyonkathi"
        : "আমাদের কাজ ও সমাজকল্যাণমূলক প্রকল্প - জিয়নকাঠি";
      description = isEn
        ? "Indigenous crop conservation, rural child education, health and snakebite camps, and renewable solar agriculture."
        : "দেশীয় ধান ও বীজ সংরক্ষণ প্রকল্প, শিশুদের সহায়ক শিক্ষা কেন্দ্র, সর্প সচেতনতা ও স্বাস্থ্য পরীক্ষা শিবির।";
      canonicalPath = "/work";
      image = `${baseUrl}/images/farming-collage.jpg`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "url": `${baseUrl}/work`
      };
    } else if (activeTab === "reports") {
      if (targetItemId && siteData?.reports) {
        const rep = siteData.reports.find((r) => String(r.id) === String(targetItemId));
        if (rep) {
          title = isEn && rep.titleEnglish
            ? `${rep.titleEnglish} - Research Report | Jiyonkathi`
            : `${rep.title} - অন্বেষণ প্রতিবেদন | জিয়নকাঠি`;
          description = (isEn && rep.summaryEnglish ? rep.summaryEnglish : rep.summary || rep.content || "").slice(0, 200);
          canonicalPath = `/report/${encodeURIComponent(rep.id)}`;
          if (rep.image) {
            image = rep.image.startsWith("http") ? rep.image : `${baseUrl}${rep.image}`;
          }
          type = "article";
          jsonLd = {
            "@context": "https://schema.org",
            "@type": "Report",
            "name": rep.title,
            "headline": rep.title,
            "description": description,
            "image": image,
            "datePublished": rep.publishedDate || "2026-08-15",
            "author": {
              "@type": "Organization",
              "name": rep.author || "Jiyonkathi Research Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Jiyonkathi",
              "logo": { "@type": "ImageObject", "url": `${baseUrl}/images/logo.svg` }
            },
            "mainEntityOfPage": `${baseUrl}${canonicalPath}`
          };
        }
      }
      if (!targetItemId || !jsonLd) {
        title = isEn
          ? "Research & Field Reports - Jiyonkathi"
          : "গবেষণা ও ক্ষেত্র অন্বেষণ প্রতিবেদন - জিয়নকাঠি";
        description = isEn
          ? "Original empirical research on heirloom paddy conservation, zero-chemical natural farming, and groundwater preservation."
          : "দেশীয় ধানের প্রজাতি সংরক্ষণ, রাসায়নিক সার ব্যতিরেকে প্রাকৃতিক পুষ্টি ব্যবস্থাপনা ও ভূগর্ভস্থ জল অপচয় রোধের বিস্তারিত প্রতিবেদন।";
        canonicalPath = "/reports";
        image = `${baseUrl}/images/seedbed.jpg`;
      }
    } else if (activeTab === "blog") {
      if (targetItemId && siteData?.blogs) {
        const blog = siteData.blogs.find((b) => String(b.id) === String(targetItemId));
        if (blog) {
          title = isEn && blog.titleEnglish
            ? `${blog.titleEnglish} - Blog | Jiyonkathi`
            : `${blog.title} - ব্লগ | জিয়নকাঠি`;
          description = (isEn && blog.excerptEnglish ? blog.excerptEnglish : blog.excerpt || blog.content || "").slice(0, 200);
          canonicalPath = `/blog/${encodeURIComponent(blog.id)}`;
          if (blog.image) {
            image = blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image}`;
          }
          type = "article";
          jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": description,
            "image": image,
            "datePublished": blog.date || "2026-08-01",
            "author": {
              "@type": "Person",
              "name": blog.author || "Jiyonkathi Editorial"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Jiyonkathi",
              "logo": { "@type": "ImageObject", "url": `${baseUrl}/images/logo.svg` }
            },
            "mainEntityOfPage": `${baseUrl}${canonicalPath}`
          };
        }
      }
      if (!targetItemId || !jsonLd) {
        title = isEn
          ? "Blogs & Field Stories - Jiyonkathi"
          : "ব্লগ ও সামাজিক বার্তা - জিয়নকাঠি";
        description = isEn
          ? "Field updates, cultural events, ecological perspectives, and rural solidarity articles from Bengal."
          : "লোকসংস্কৃতি, নবান্ন উৎসব, জলবায়ু সংকট ও টেকসই কৃষি বিষয়ে জিয়নকাঠির নিয়মিত বার্তা ও অভিজ্ঞতা বিনিময়।";
        canonicalPath = "/blog";
        image = `${baseUrl}/images/ecology-collage.jpg`;
      }
    } else if (activeTab === "gallery") {
      if (targetItemId && siteData?.gallery) {
        const item = siteData.gallery.find((g) => String(g.id) === String(targetItemId));
        if (item) {
          title = `${item.title || "আলোকচিত্র"} - চিত্রশালা | জিয়নকাঠি`;
          description = (item.description || "জিয়নকাঠি চিত্রশালা থেকে সংগৃহীত মাঠ কার্যক্রমের ছবি।").slice(0, 200);
          canonicalPath = `/image/${encodeURIComponent(item.id)}`;
          if (item.url) {
            image = item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`;
          }
          type = "article";
        }
      }
      if (!targetItemId || !jsonLd) {
        title = isEn
          ? "Photo Gallery & Archives - Jiyonkathi"
          : "চিত্রশালা ও আলোকচিত্র সংগ্রহ - জিয়নকাঠি";
        description = isEn
          ? "Photographic record of biodiversity, organic heirloom seedbeds, village learning centers, and cultural gatherings."
          : "জৈব চাষ, দেশীয় ধানের বীজতলা, গ্রামীণ পাঠশালা, স্বাস্থ্য শিবির ও বসন্ত উৎসবের আলোকচিত্র সংকলন।";
        canonicalPath = "/gallery";
        image = `${baseUrl}/images/community-collage.jpg`;
      }
    } else if (activeTab === "events") {
      title = isEn
        ? "Events & Cultural Gatherings - Jiyonkathi"
        : "কার্যক্রম ও গ্রামীণ মেলা - জিয়নকাঠি";
      description = isEn
        ? "Upcoming and past events: Nabanna harvest festival, Basanta Utsav, seed exchange fairs, and healthcare camps."
        : "নবান্ন উৎসব, বসন্ত উৎসব, বীজ বিনিময় মেলা, বিনামূল্যে স্বাস্থ্য সচেতনতা শিবির ও শিক্ষাসামগ্রী বিতরণ কর্মসূচি।";
      canonicalPath = "/events";
      image = `${baseUrl}/images/community-collage.jpg`;
    } else if (activeTab === "volunteer") {
      title = isEn
        ? "Join as a Volunteer - Jiyonkathi"
        : "স্বেচ্ছাসেবী হিসেবে যোগ দিন - জিয়নকাঠি";
      description = isEn
        ? "Contribute to sustainable living, rural education, organic farming, and ecological conservation as a volunteer."
        : "গ্রামীণ শিক্ষা কেন্দ্র, বীজ সংরক্ষণ ও পরিবেশ আন্দোলনে স্বেচ্ছাসেবী হিসেবে যুক্ত হয়ে সুস্থায়ী সমাজ গঠনে অবদান রাখুন।";
      canonicalPath = "/volunteer";
      image = `${baseUrl}/images/education-center.jpg`;
    } else if (activeTab === "members") {
      title = isEn
        ? "Committee & Field Team - Jiyonkathi"
        : "আমাদের পরিষদ ও কর্মী দল - জিয়নকাঠি";
      description = isEn
        ? "Meet the dedicated team, researchers, educators, and volunteers leading Jiyonkathi's agro-ecological mission."
        : "জিয়নকাঠির প্রধান গবেষক, কৃষি সমন্বয়ক, শিক্ষক এবং নিবেদিতপ্রাণ সমাজকর্মীদের পরিচিতি।";
      canonicalPath = "/members";
      image = `${baseUrl}/images/paddy-planting.jpg`;
    } else if (activeTab === "contact") {
      title = isEn
        ? "Contact Us - Jiyonkathi"
        : "যোগাযোগ করুন - জিয়নকাঠি";
      description = isEn
        ? "Visit or contact Jiyonkathi at Plot 1942, Village Pratappur, Aushgram, Purba Bardhaman, West Bengal."
        : "জিয়নকাঠি ক্ষেত্র প্রাঙ্গণ, প্লট নং ১৯৪২, গ্রাম ও ডাকঘর: প্রতাপপুর, থানা: আউশগ্রাম, জেলা: পূর্ব বর্ধমান, পশ্চিমবঙ্গ।";
      canonicalPath = "/contact";
      image = `${baseUrl}/images/jiyonkathi-map.jpg`;
    } else if (activeTab === "admin" || activeTab === "login") {
      title = "প্রশাসনিক পোর্টাল - জিয়নকাঠি";
      description = "জিয়নকাঠি সুরক্ষিত প্রশাসনিক নিয়ন্ত্রণ প্যানেল।";
      canonicalPath = "/admin";
    }

    // 1. Update document title
    document.title = title;

    // Helper: update or insert a meta tag
    const updateMeta = (selector, attribute, attrValue, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Standard Meta tags
    updateMeta('meta[name="description"]', "name", "description", description);
    updateMeta('meta[property="og:title"]', "property", "og:title", title);
    updateMeta('meta[property="og:description"]', "property", "og:description", description);
    updateMeta('meta[property="og:image"]', "property", "og:image", image);
    updateMeta('meta[property="og:url"]', "property", "og:url", `${baseUrl}${canonicalPath}`);
    updateMeta('meta[property="og:type"]', "property", "og:type", type);
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    updateMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    updateMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    // 3. Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${baseUrl}${canonicalPath}`);

    // 4. Schema.org JSON-LD tag
    let schemaScript = document.getElementById("dynamic-seo-schema");
    if (jsonLd) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "dynamic-seo-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(jsonLd, null, 2);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [activeTab, targetItemId, siteData, language]);
}
