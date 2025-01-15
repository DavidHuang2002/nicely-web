// @ts-nocheck
"use client";

// using @ts-nocheck because the clerk components' type has some issues

import { Button } from "./ui/button";
import { GitIcon, VercelIcon } from "./icons";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="h-[52px] py-2 px-4 flex flex-row gap-2 justify-between">
      <SignedIn>
        <UserButton />
      </SignedIn>
      {/* <Link href="https://github.com/vercel-labs/ai-sdk-preview-python-streaming">
        <Button variant="outline">
          <GitIcon /> View Source Code
        </Button>
      </Link>

      <Link href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-python-streaming&env=OPENAI_API_KEY%2CVERCEL_FORCE_PYTHON_STREAMING&envDescription=API+keys+needed+for+application&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-python-streaming%2Fblob%2Fmain%2F.env.example&teamSlug=vercel-labs">
        <Button>
          <VercelIcon />
          Deploy with Vercel
        </Button>
      </Link> */}
    </div>
  );
};
