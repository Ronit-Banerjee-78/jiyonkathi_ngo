import React from "react";
import ClientLayout from "./ClientLayout";

export default function RootLayout({
  activeTab,
  setActiveTab,
  userSession,
  setUserSession,
  children,
}) {
  return (
    <ClientLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userSession={userSession}
      setUserSession={setUserSession}
    >
      {children}
    </ClientLayout>
  );
}
