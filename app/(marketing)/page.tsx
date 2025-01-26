import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPageContent } from "./landing-page-content";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return <LandingPageContent />;
}
