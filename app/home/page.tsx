"use client";

import { Overview } from "@/components/overview";
import { TermsPopup } from "@/components/terms-popup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotesPageContent } from "@/components/notes/notes-page-content";
export default function Page() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/chat/onboarding")
      .then((res) => res.json())
      .then((data) => {
        setOnboardingCompleted(data.onboardingCompleted);
      });
  }, []);

  const handleStartOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <>
      {/* <Overview
        onboardingCompleted={onboardingCompleted}
        onStartOnboarding={handleStartOnboarding}
      /> */}
      <NotesPageContent sessionSummaries={[]} />
      <TermsPopup />
    </>
  );
}
