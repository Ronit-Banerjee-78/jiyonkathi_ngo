export function getSiteBaseUrl() {
  // 1. Explicit environment variable configured in production
  const envUrl =
    import.meta.env.VITE_SITE_URL || import.meta.env.NEXT_PUBLIC_SITE_URL;
  if (
    envUrl &&
    typeof envUrl === "string" &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1")
  ) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 2. Browser window origin if running on real domain (e.g. jiyonkathi.org, vercel.app, etc.)
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.origin
  ) {
    const origin = window.location.origin;
    if (
      !origin.includes("localhost") &&
      !origin.includes("127.0.0.1") &&
      !origin.includes("0.0.0.0") &&
      !origin.startsWith("http://192.168.") &&
      !origin.startsWith("http://10.")
    ) {
      return origin.replace(/\/+$/, "");
    }
  }

  // 3. Fallback: Always use canonical production domain so links copied during local testing never show localhost
  return "http://localhost:3000";
}

export function getShareUrl(path = "") {
  const base = getSiteBaseUrl();
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${base}${cleanPath}`;
}

export async function shareContent({ title, text, url }) {
  const shareData = {
    title: title || "Jiyonkathi (জিয়নকাঠি) NGO",
    text: text || "জিয়নকাঠি - পরিবেশ, কৃষি ও সমাজ কল্যাণমূলক সংস্থা",
    url: url || getShareUrl(),
  };

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      await navigator.share(shareData);
      return { success: true, method: "native" };
    } catch (err) {
      if (err.name === "AbortError") {
        return { success: false, method: "aborted" };
      }
      // Continue to clipboard fallback
    }
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: "clipboard" };
    } catch (clipErr) {
      console.warn("Clipboard copy error:", clipErr);
    }
  }

  return { success: false, method: "none" };
}
