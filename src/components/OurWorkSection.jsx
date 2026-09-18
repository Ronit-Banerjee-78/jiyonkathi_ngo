"use client";

import React from "react";
import ResearchReportsSection from "./ResearchReportsSection";

export default function OurWorkSection({ setActiveTab = () => {} }) {
  return <ResearchReportsSection onSelectPillar={() => setActiveTab("about")} />;
}
