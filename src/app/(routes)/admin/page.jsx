"use client";

import React, { useState } from "react";
import PortalSection from "../../../components/PortalSection";
import { getStoredSession } from "../../../utils/session";

export default function AdminPage() {
  const [userSession, setUserSession] = useState(() => getStoredSession());
  return <PortalSection userSession={userSession} setUserSession={setUserSession} />;
}
