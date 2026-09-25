import React, { useState, useEffect } from "react";
import { SiteProvider } from "./context/SiteContext";
import { useLocationTab } from "./hooks/useLocationTab";
import RootLayout from "./app/layout";
import RootPage from "./app/page";
import { getStoredSession, saveSession, clearSession } from "./utils/session";

export default function App() {
  const {
    activeTab,
    setActiveTab,
    targetItemId,
    setTargetItemId,
    navigate,
  } = useLocationTab("home");

  const [userSession, setUserSessionState] = useState(() => getStoredSession());

  const handleSetUserSession = (session) => {
    if (session) {
      saveSession(session);
      setUserSessionState(session);
      navigate("/admin");
    } else {
      clearSession();
      setUserSessionState(null);
      navigate("/");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <SiteProvider>
      <RootLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSession={userSession}
        setUserSession={handleSetUserSession}
        navigate={navigate}
      >
        <RootPage
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          targetItemId={targetItemId}
          setTargetItemId={setTargetItemId}
          userSession={userSession}
          setUserSession={handleSetUserSession}
          navigate={navigate}
        />
      </RootLayout>
    </SiteProvider>
  );
}
