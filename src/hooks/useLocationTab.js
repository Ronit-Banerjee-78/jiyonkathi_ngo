import { useState, useEffect, useCallback } from "react";
import { getStoredSession } from "../utils/session";

/**
 * Parses pathname into activeTab and targetItemId
 */
export function parseRoute(pathname = "/") {
  const clean = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const stored = getStoredSession();
  const isAdmin = stored && stored.role === "admin";

  // Single blog route: /blog/:id or /blogs/:id
  const blogMatch = clean.match(/^\/blogs?\/([^/]+)$/);
  if (blogMatch) {
    return { tab: "blog", itemId: decodeURIComponent(blogMatch[1]) };
  }
  if (clean === "/blog" || clean === "/blogs") {
    return { tab: "blog", itemId: null };
  }

  // Single report route: /report/:id or /reports/:id
  const reportMatch = clean.match(/^\/reports?\/([^/]+)$/);
  if (reportMatch) {
    return { tab: "reports", itemId: decodeURIComponent(reportMatch[1]) };
  }
  if (clean === "/report" || clean === "/reports") {
    return { tab: "reports", itemId: null };
  }

  // Single image/gallery route: /image/:id or /gallery/:id
  const imageMatch = clean.match(/^\/(?:image|gallery)\/([^/]+)$/);
  if (imageMatch) {
    return { tab: "gallery", itemId: decodeURIComponent(imageMatch[1]) };
  }
  if (clean === "/gallery" || clean === "/image") {
    return { tab: "gallery", itemId: null };
  }

  // Static section routes
  if (clean === "/about" || clean === "/mission") {
    return { tab: "about", itemId: null };
  }
  if (clean === "/work" || clean === "/projects") {
    return { tab: "work", itemId: null };
  }
  if (clean === "/volunteer") {
    return { tab: "volunteer", itemId: null };
  }
  if (clean === "/events") {
    return { tab: "events", itemId: null };
  }
  if (clean === "/members") {
    return { tab: "members", itemId: null };
  }
  if (clean === "/contact") {
    return { tab: "contact", itemId: null };
  }

  // Admin and Login routes
  if (clean === "/login") {
    return { tab: "login", itemId: null };
  }
  if (clean === "/admin" || clean === "/portal") {
    if (isAdmin) {
      return { tab: "admin", itemId: null };
    }
    // Route guard: Non-admin visitors navigating to /admin are redirected to /login
    return { tab: "login", itemId: null, shouldRedirect: "/login" };
  }

  return { tab: "home", itemId: null };
}

/**
 * Returns URL pathname for a given tab and optional itemId
 */
export function getRoutePath(tab, itemId = null) {
  if (tab === "blog") {
    return itemId ? `/blog/${encodeURIComponent(itemId)}` : "/blog";
  }
  if (tab === "reports") {
    return itemId ? `/report/${encodeURIComponent(itemId)}` : "/reports";
  }
  if (tab === "gallery") {
    return itemId ? `/image/${encodeURIComponent(itemId)}` : "/gallery";
  }
  if (tab === "about") return "/about";
  if (tab === "work") return "/work";
  if (tab === "volunteer") return "/volunteer";
  if (tab === "events") return "/events";
  if (tab === "members") return "/members";
  if (tab === "contact") return "/contact";
  if (tab === "login") return "/login";
  if (tab === "admin") return "/admin";
  return "/";
}

export const useLocationTab = (defaultTab = "home") => {
  const initial = typeof window !== "undefined"
    ? parseRoute(window.location.pathname)
    : { tab: defaultTab, itemId: null };

  const [activeTab, setActiveTabState] = useState(initial.tab);
  const [targetItemId, setTargetItemIdState] = useState(initial.itemId);

  const navigate = useCallback((path, { replace = false } = {}) => {
    if (typeof window === "undefined") return;
    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
    const parsed = parseRoute(path);
    setActiveTabState(parsed.tab);
    setTargetItemIdState(parsed.itemId);
  }, []);

  const setActiveTab = useCallback((newTab, itemId = null) => {
    const targetPath = getRoutePath(newTab, itemId);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", targetPath);
    }
    setActiveTabState(newTab);
    setTargetItemIdState(itemId);
  }, []);

  const setTargetItemId = useCallback((newItemId) => {
    setTargetItemIdState(newItemId);
    if (typeof window !== "undefined") {
      const targetPath = getRoutePath(activeTab, newItemId);
      window.history.pushState(null, "", targetPath);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window === "undefined") return;
      const parsed = parseRoute(window.location.pathname);

      if (parsed.shouldRedirect && window.location.pathname !== parsed.shouldRedirect) {
        window.history.replaceState(null, "", parsed.shouldRedirect);
      }

      setActiveTabState(parsed.tab);
      setTargetItemIdState(parsed.itemId);
    };

    // Run on initial mount
    handleLocationChange();

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    targetItemId,
    setTargetItemId,
    navigate,
  };
};
