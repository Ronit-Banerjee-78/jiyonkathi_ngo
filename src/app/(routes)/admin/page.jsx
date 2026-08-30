"use client";

import React, { useState } from "react";
import PortalSection from "../../../components/PortalSection";

export default function AdminPage() {
  const [userSession, setUserSession] = useState(null);
  return <PortalSection userSession={userSession} setUserSession={setUserSession} />;
}
