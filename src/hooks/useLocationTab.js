/**
 * useLocationTab Custom Hook
 * Handles URL hash and pathname detection for hidden admin routes
 * Clean Architecture Layer: Hooks / Router Adapter
 */

import { useState, useEffect } from "react";
import { getStoredSession } from "../utils/session";

export const useLocationTab = (defaultTab = "home") => {
  const [activeTab, setActiveTab] = useState(() => {
    // If admin session is already active, open directly into the admin dashboard
    const stored = getStoredSession();
    if (stored) {
      return "admin";
    }
    return defaultTab;
  });

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const stored = getStoredSession();

      if (path === "/admin" || path.endsWith("/admin") || hash === "#admin") {
        setActiveTab(stored ? "admin" : "portal");
      }
    };

    handleLocation();
    window.addEventListener("popstate", handleLocation);
    window.addEventListener("hashchange", handleLocation);
    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("hashchange", handleLocation);
    };
  }, []);

  return [activeTab, setActiveTab];
};
