import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";


export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-5xl font-bold mb-6">AI Therapy Companion</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Your personal AI companion to help process emotions and maintain mental
        wellness between therapy sessions.
      </p>
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <Button size="lg">Get Started</Button>
        </SignInButton>
      </div>
    </div>
  );
}
