// @ts-nocheck
"use client";

// using @ts-nocheck because the clerk components' type has some issues

import { Button } from "./ui/button";
import { GitIcon, VercelIcon } from "./icons";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/untangle": "Untangle Emotions",
  "/chat/self-care": "Daily Self-Care",
  "/notes": "Session Notes",
};

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const showBackButton = Object.keys(ROUTE_TITLES).some((route) =>
    pathname.startsWith(route)
  );
  const title = ROUTE_TITLES[pathname] || "";

  return (
    <div className="h-[52px] py-2 px-4 flex flex-row gap-2 items-center">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/home")}
          className="mr-2"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}

      {showBackButton && (
        <h1 className="text-lg font-semibold flex-1">{title}</h1>
      )}

      <div className="ml-auto">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
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
