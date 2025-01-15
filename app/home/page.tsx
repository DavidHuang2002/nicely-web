"use client";

import { Overview } from "@/components/overview";
import { OnboardingModal } from "@/components/onboarding-modal";
import { useState, useEffect } from "react";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("onboardingComplete");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <>
      <Overview />
      {showOnboarding && <OnboardingModal />}
    </>
  );
}
