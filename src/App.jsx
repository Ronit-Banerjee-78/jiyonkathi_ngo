import React, { useState, useEffect } from "react";
import { SiteProvider } from "./context/SiteContext";
import { useLocationTab } from "./hooks/useLocationTab";
import RootLayout from "./app/layout";
import RootPage from "./app/page";
import { getStoredSession, saveSession, clearSession } from "./utils/session";

export default function App() {
  const [activeTab, setActiveTab] = useLocationTab("home");
  const [userSession, setUserSessionState] = useState(() => getStoredSession());

  const handleSetUserSession = (session) => {
    if (session) {
      saveSession(session);
    } else {
      clearSession();
    }
    setUserSessionState(session);
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
      >
        <RootPage
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userSession={userSession}
          setUserSession={handleSetUserSession}
        />
      </RootLayout>
    </SiteProvider>
  );
}

