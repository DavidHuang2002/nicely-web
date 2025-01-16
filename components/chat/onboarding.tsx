import { Chat } from "./basic";
import type { Message } from "ai";

const onboardingOpenner: string = `**Welcome to Nicely!** 🌟 I’m Nic, your therapy companion here to support and guide you between sessions. To best help you, I’d love to get to know you a bit better. 😊  

Here’s how it works:  
- We’ll start with some basic info, like your therapy goals and current challenges.  
- Then, we’ll reflect on insights from your last session to keep you on track.  

No pressure—just share what feels comfortable. Let me know when you’re ready, and we’ll take it one step at a time. You’ve got this! 💛`;

const onboardingMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: onboardingOpenner,
  },
]; 


export default function OnboardingChat() {
  return <Chat 
    initialMessages={onboardingMessages}
    // apiRoute="/api/onboarding"
    // isOnboarding={true}
    />;
}

