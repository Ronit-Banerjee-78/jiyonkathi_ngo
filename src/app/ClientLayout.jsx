import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientLayout({
  activeTab = "home",
  setActiveTab = () => { },
  userSession = null,
  setUserSession = () => { },
  children,
}) {
  const isAdminDashboard = activeTab === "admin" || (activeTab === "portal" && userSession);

  if (isAdminDashboard) {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col selection:bg-amber-200 selection:text-amber-900">
        <main className="flex-grow flex flex-col w-full min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSession={userSession}
        setUserSession={setUserSession}
      />
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

