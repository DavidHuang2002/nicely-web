"use client";

import { Overview } from "@/components/overview";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <Overview
        onboardingCompleted={onboardingCompleted}
        onStartOnboarding={handleStartOnboarding}
      />
    </>
  );
}
