/**
 * Navigation Configuration & Menu Structure
 * Clean Architecture Layer: Configuration
 */

export const getNavItems = (language) => [
  { id: "home", label: language === "bn" ? "প্রচ্ছদ" : "Home" },
  { id: "about", label: language === "bn" ? "আমাদের কথা" : "About Us" },
  { id: "mission", label: language === "bn" ? "আমাদের লক্ষ্য" : "Our Mission" },
  { id: "reports", label: language === "bn" ? "গবেষণা ও প্রতিবেদন" : "Research Reports" },
  { id: "volunteer", label: language === "bn" ? "স্বেচ্ছাসেবী" : "Volunteer" },
  { id: "gallery", label: language === "bn" ? "গ্যালারি" : "Gallery" },
  { id: "events", label: language === "bn" ? "অনুষ্ঠানসূচী" : "Events" },
  { id: "blog", label: language === "bn" ? "ব্লগ" : "Blog" },
];

export const getMoreNavItems = (language) => [
  { id: "contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  { id: "donation", label: language === "bn" ? "দান করুন" : "Donation" },
  { id: "members", label: language === "bn" ? "সদস্যবৃন্দ" : "Members" },
];
