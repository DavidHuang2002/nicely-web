import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleComplete = () => {
    router.push("/onboarding");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-xl bg-muted p-8 shadow-lg"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10">
                <Image
                  src="/therapist-avatar.webp"
                  alt="AI Therapist Avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-semibold">
                Welcome, I'm Nic, your therapy companion!
              </h2>

              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.p
                    key="step0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground"
                  >
                    I'm here to help you reflect, process, and stay on track
                    between therapy sessions. Think of me as your guide for
                    revisiting insights and clarity from therapy whenever you
                    need it.
                  </motion.p>
                ) : (
                  <motion.p
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground"
                  >
                    Let's set things up so I can best help you. No rush—just
                    answer as much as you feel comfortable. It should take no
                    more than 5 minutes.
                  </motion.p>
                )}
              </AnimatePresence>

              <Button onClick={step === 0 ? () => setStep(1) : handleComplete}>
                {step === 0 ? "Sounds Great" : "Let's Do It"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
