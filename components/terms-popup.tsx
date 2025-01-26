"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useClerk } from "@clerk/nextjs";

const TERMS_AND_CONDITION_URL =
  "https://docs.google.com/document/d/1colalL7SY3DOxoG1L4YbE8uyuUtAJJ0u1SploP_sLr0/edit?usp=sharing";

export function TermsPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const checkUserAgreement = async () => {
      const response = await fetch("/api/user/terms");
      const data = await response.json();
      if (!data.hasAgreed) {
        setIsVisible(true);
      }
    };

    checkUserAgreement();
  }, []);

  const handleAgree = async () => {
    try {
      await fetch("/api/user/terms", { method: "POST" });
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating terms agreement:", error);
    }
  };

  const handleQuit = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (open === false) {
          return;
        }
        setIsVisible(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-card/50 backdrop-blur-sm border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Welcome to Nicely! 👋
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Before we begin your journey together, please review our{" "}
            <a
              href={TERMS_AND_CONDITION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary underline decoration-primary/30 hover:decoration-primary transition-colors"
            >
              Privacy Policy and Terms
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            By continuing, you acknowledge that you have read and agree to our
            privacy policy and terms of use. Your privacy and comfort are
            important to us. 💝
          </p>
        </div>
        <DialogFooter className="flex gap-3 sm:gap-0">
          <div className="flex w-full gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={handleQuit}
              className="flex-1 sm:flex-none hover:bg-background/80"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleAgree}
              className="flex-1 sm:flex-none bg-primary/80 hover:bg-primary"
            >
              I Agree
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
