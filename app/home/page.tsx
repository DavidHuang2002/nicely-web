"use client";

import { Overview } from "@/components/overview";
import { OnboardingModal } from "@/components/onboarding-modal";
import { useState, useEffect } from "react";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // get onboarding status from server to check if user has completed onboarding
    fetch("/api/chat/onboarding")
      .then((res) => res.json())
      .then((data) => {
        if (!data.onboardingCompleted) {
          setShowOnboarding(true);
        }
      });
  }, []);

  return (
    <>
      <Overview />
      {showOnboarding && <OnboardingModal />}
    </>
  );
}
