/**
 * useLocationTab Custom Hook
 * Handles URL hash and pathname detection for hidden admin routes
 * Clean Architecture Layer: Hooks / Router Adapter
 */

import { useState, useEffect } from "react";

export const useLocationTab = (initialTab = "home") => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === "/admin" || path.endsWith("/admin") || hash === "#admin") {
        setActiveTab("portal");
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
