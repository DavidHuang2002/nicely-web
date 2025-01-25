"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Track conversion
    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }

    // Redirect to home after tracking
    router.push("/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
}
