"use client";

import React from "react";
import HomeSection from "../components/HomeSection";
import AboutSection from "../components/AboutSection";
import MissionSection from "../components/MissionSection";
import OurWorkSection from "../components/OurWorkSection";
import VolunteerSection from "../components/VolunteerSection";
import GallerySection from "../components/GallerySection";
import EventsSection from "../components/EventsSection";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import MembersSection from "../components/MembersSection";
import PortalSection from "../components/PortalSection";
import ResearchReportsSection from "../components/ResearchReportsSection";
import { motion, AnimatePresence } from "motion/react";

/**
 * Root Page Component for Jiyonkathi App
 */
export default function Page({ activeTab = "home", setActiveTab = () => { }, userSession = null, setUserSession = () => { } }) {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "home":
        return <HomeSection setActiveTab={setActiveTab} />;
      case "about":
        return <AboutSection />;
      case "mission":
        return <MissionSection onNavigateToReport={() => setActiveTab("reports")} />;
      case "reports":
        return <ResearchReportsSection onSelectPillar={() => setActiveTab("mission")} />;
      case "work":
        return <OurWorkSection setActiveTab={setActiveTab} />;
      case "volunteer":
        return <VolunteerSection setActiveTab={setActiveTab} />;
      case "gallery":
        return <GallerySection />;
      case "events":
        return <EventsSection setActiveTab={setActiveTab} />;
      case "blog":
        return <BlogSection />;
      case "contact":
        return <ContactSection />;
      case "donation":
        return <HomeSection setActiveTab={setActiveTab} />;
      case "members":
        return <MembersSection />;
      case "portal":
      case "admin":
        return (
          <PortalSection
            userSession={userSession}
            setUserSession={setUserSession}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return <HomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full flex-grow flex flex-col"
      >
        {renderActiveSection()}
      </motion.div>
    </AnimatePresence>
  );
}
